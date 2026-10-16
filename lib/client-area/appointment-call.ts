import { randomBytes, randomUUID } from "node:crypto";
import { database } from "../consultation/database";
import { tokenHash } from "../calls/server";
import { clientFromSession } from "./access";

export async function appointmentCallAllowed(slotId: string, session?: string) {
  const clientId = await clientFromSession(session);
  if (!clientId) return false;
  const result = await database().query(
    `SELECT id FROM appointment_slots WHERE id = $1 AND booked_by = $2
    AND starts_at <= now() AND ends_at > now()`,
    [slotId, clientId],
  );
  return Boolean(result.rowCount);
}

export async function createAppointmentCall(clientId: string) {
  const connection = await database().connect();
  try {
    await connection.query("BEGIN");
    const slot = await connection.query(
      `SELECT slot.id, slot.ends_at, client.name, client.email
      FROM appointment_slots slot JOIN private_clients client ON client.id = slot.booked_by
      WHERE slot.booked_by = $1 AND client.active AND slot.starts_at <= now() AND slot.ends_at > now()
      FOR UPDATE OF slot`,
      [clientId],
    );
    if (!slot.rowCount)
      throw new Error(
        "Звонок доступен только во время вашей забронированной встречи.",
      );
    const token = randomBytes(32).toString("hex");
    const record = slot.rows[0];
    const call = await connection.query(
      `INSERT INTO browser_calls(id, token_hash, invitation_token, email, name, expires_at, appointment_slot_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (appointment_slot_id) DO UPDATE SET appointment_slot_id = EXCLUDED.appointment_slot_id
      WHERE browser_calls.state <> 'revoked' RETURNING id, invitation_token, name, expires_at`,
      [
        randomUUID(),
        tokenHash(token),
        token,
        record.email,
        record.name,
        record.ends_at,
        record.id,
      ],
    );
    if (!call.rowCount)
      throw new Error(
        "Этот звонок закрыт администратором. Напишите нам в чате.",
      );
    await connection.query("COMMIT");
    return {
      id: call.rows[0].id,
      token: call.rows[0].invitation_token,
      name: call.rows[0].name,
      expires: call.rows[0].expires_at.toISOString(),
    };
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
}

export async function startAdminAppointmentCall(clientId: string) {
  const room = await createAppointmentCall(clientId);
  const connection = await database().connect();
  try {
    await connection.query("BEGIN");
    const result = await connection.query(
      `UPDATE browser_calls SET state = 'ringing', initiated_by = 'admin',
      updated_at = now(), admin_seen = now(), client_seen = NULL
      WHERE id = $1 AND expires_at > now() AND state IN ('waiting', 'ended', 'declined')
      AND EXISTS (SELECT 1 FROM private_clients WHERE id = $2 AND active AND last_seen_at > now() - interval '20 seconds')
      RETURNING id`,
      [room.id, clientId],
    );
    if (!result.rowCount)
      throw new Error("Клиент не в сети или звонок уже идёт.");
    await connection.query(
      "DELETE FROM browser_call_signals WHERE call_id = $1",
      [room.id],
    );
    await connection.query("COMMIT");
    return { id: room.id };
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
}

export async function incomingAppointmentCall(clientId: string) {
  await database().query(
    "UPDATE private_clients SET last_seen_at = now() WHERE id = $1 AND active",
    [clientId],
  );
  const result = await database().query(
    `SELECT call.id, call.invitation_token AS token, call.name, call.expires_at
    FROM browser_calls call JOIN appointment_slots slot ON slot.id = call.appointment_slot_id
    WHERE slot.booked_by = $1 AND slot.starts_at <= now() AND slot.ends_at > now()
      AND call.expires_at > now() AND call.state = 'ringing' AND call.initiated_by = 'admin'
      AND call.updated_at > now() - interval '60 seconds'
      AND call.admin_seen > now() - interval '20 seconds' LIMIT 1`,
    [clientId],
  );
  const call = result.rows[0];
  return call
    ? {
        id: call.id,
        token: call.token,
        name: call.name,
        expires: call.expires_at.toISOString(),
      }
    : null;
}
