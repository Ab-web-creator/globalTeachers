import { clientConsultationProfile } from "./profile";
import { validTimeZone } from "../admin/timezone";
import { appointmentTimeZone } from "./booking-rules";
import { database } from "../consultation/database";
import type { ClientWorkspace, PrivateClient } from "./types";

const clientSelect = `SELECT client.id, client.email, client.name, client.tier, client.active, client.paid_at, client.last_seen_at, (client.profile_photo IS NOT NULL) AS has_profile_photo,
  (CASE WHEN client.tier = 'VIP' THEN COALESCE(client.allowance_hours, policy.hours) ELSE policy.hours END)::int AS allowance_hours,
  (SELECT count(*)::int FROM appointment_slots WHERE booked_by = client.id) AS booked_hours,
  (SELECT count(*)::int FROM private_chat_messages WHERE client_id = client.id AND author = 'client' AND NOT hidden_from_admin AND admin_read_at IS NULL) AS unread_count,
  (SELECT count(*)::int FROM private_chat_messages WHERE client_id = client.id AND author = 'admin' AND NOT hidden_from_client AND client_read_at IS NULL) AS client_unread_count,
  COALESCE((SELECT author = 'client' FROM private_chat_messages WHERE client_id = client.id AND NOT hidden_from_admin ORDER BY created_at DESC, id DESC LIMIT 1), false) AS awaiting_reply
  FROM private_clients client JOIN client_package_allowances policy ON policy.tier = client.tier`;

export async function listPrivateClients(): Promise<PrivateClient[]> {
  return (
    await database().query(
      `${clientSelect} WHERE client.paid_at IS NOT NULL ORDER BY awaiting_reply DESC, unread_count DESC, client.created_at DESC`,
    )
  ).rows.map((client) => ({
    ...client,
    last_seen_at: client.last_seen_at?.toISOString() ?? null,
  }));
}

export async function getWorkspace(
  clientId: string,
  paidOnly = false,
): Promise<ClientWorkspace | null> {
  const record = await database().query(
    `${clientSelect} WHERE client.id = $1 ${paidOnly ? "AND client.paid_at IS NOT NULL" : ""}`,
    [clientId],
  );
  if (!record.rowCount) return null;
  const [messages, slots, bookings, profile] = await Promise.all([
    database().query(
      `SELECT id, author, body, created_at, hidden_from_client, client_edited_at, ${paidOnly ? "client_edit_history, client_deleted_at" : "NULL AS client_deleted_at"} FROM (
      SELECT id, author, body, created_at, hidden_from_client, client_edited_at, client_edit_history, client_deleted_at FROM private_chat_messages WHERE client_id = $1
      AND NOT ${paidOnly ? "hidden_from_admin" : "hidden_from_client"}
      ORDER BY created_at DESC, id DESC LIMIT 200) recent ORDER BY created_at, id`,
      [clientId],
    ),
    database().query(
      `SELECT slot.id, slot.starts_at, slot.ends_at, slot.open, slot.booked_by FROM appointment_slots slot
      WHERE slot.open AND slot.booked_by IS NULL AND slot.starts_at > now()
        AND (NOT $2::boolean OR NOT EXISTS (
          SELECT 1 FROM appointment_slots booked WHERE booked.booked_by = $1
            AND (booked.starts_at AT TIME ZONE $3)::date = (slot.starts_at AT TIME ZONE $3)::date
        )) ORDER BY slot.starts_at LIMIT 200`,
      [clientId, record.rows[0].tier === "PRO", appointmentTimeZone],
    ),
    database().query(
      `SELECT id, starts_at, ends_at, open, booked_by FROM appointment_slots
      WHERE booked_by = $1 ORDER BY starts_at DESC LIMIT 200`,
      [clientId],
    ),
    clientConsultationProfile(clientId),
  ]);
  return {
    profile,
    booking_time_zone: appointmentTimeZone,
    client: record.rows[0],
    messages: messages.rows,
    slots: slots.rows,
    bookings: bookings.rows,
  };
}

export async function addChatMessage(
  clientId: string,
  author: "admin" | "client",
  id: string,
  body: string,
) {
  const result = await database().query(
    `WITH writable_client AS (
      SELECT id FROM private_clients WHERE id = $2 AND active
        AND ($3 = 'admin' OR paid_at IS NOT NULL) FOR SHARE
    )
    INSERT INTO private_chat_messages(id, client_id, author, body)
    SELECT $1, id, $3, $4 FROM writable_client
    ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
    WHERE private_chat_messages.client_id = EXCLUDED.client_id AND private_chat_messages.author = EXCLUDED.author
      AND private_chat_messages.body = EXCLUDED.body RETURNING id`,
    [id, clientId, author, body],
  );
  return Boolean(result.rowCount);
}

export async function adminCalendar() {
  const slots = await database()
    .query(`SELECT slot.id, slot.starts_at, slot.ends_at, slot.open, slot.booked_by, client.name AS client_name
      FROM appointment_slots slot LEFT JOIN private_clients client ON client.id = slot.booked_by
      WHERE slot.ends_at > now() - interval '1 day' ORDER BY slot.starts_at LIMIT 500`);
  return { slots: slots.rows };
}

export async function openAppointmentSlot(startsAt: string) {
  return (await openAppointmentSlots([startsAt]))[0];
}

export async function openAppointmentSlots(startsAts: string[], timeZone: unknown = "UTC") {
  if (!startsAts.length || startsAts.length > 48)
    throw new Error("Выберите от 1 до 48 часов.");
  const starts = [...new Set(startsAts)].sort();
  for (const value of starts) {
    const date = new Date(value);
    if (
      !Number.isFinite(date.getTime()) ||
      date.getTime() <= Date.now() ||
      date.getTime() > Date.now() + 366 * 86400000
    )
      throw new Error("Выберите время в будущем в пределах года.");
    const minute = new Intl.DateTimeFormat("en", { timeZone: validTimeZone(timeZone), minute: "2-digit" }).format(date);
    if (
      Number(minute) !== 0 ||
      date.getUTCSeconds() ||
      date.getUTCMilliseconds()
    )
      throw new Error("Выберите полные часы, без минут.");
  }
  const normalized = [
    ...new Set(starts.map((value) => new Date(value).toISOString())),
  ].sort();
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(7142038)");
    const ids: string[] = [];
    for (const startsAt of normalized) {
      const conflicts = await client.query(
        `SELECT id FROM appointment_slots
        WHERE starts_at < $1::timestamptz + interval '1 hour' AND ends_at > $1::timestamptz
          AND (open OR booked_by IS NOT NULL) AND (starts_at <> $1::timestamptz OR booked_by IS NOT NULL)`,
        [startsAt],
      );
      if (conflicts.rowCount)
        throw new Error(
          "Один из часов уже забронирован или пересекается с другим слотом. Обновите календарь и выберите снова.",
        );
      const result = await client.query(
        `INSERT INTO appointment_slots(starts_at, ends_at, open)
        VALUES ($1, $1::timestamptz + interval '1 hour', true)
        ON CONFLICT (starts_at) DO UPDATE SET open = true WHERE appointment_slots.booked_by IS NULL RETURNING id`,
        [startsAt],
      );
      if (!result.rowCount)
        throw new Error("Один из часов уже забронирован. Обновите календарь.");
      ids.push(result.rows[0].id);
    }
    await client.query("COMMIT");
    return ids;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function closeAppointmentSlot(slotId: string) {
  const result = await database().query(
    "UPDATE appointment_slots SET open = false WHERE id = $1 AND booked_by IS NULL RETURNING id",
    [slotId],
  );
  return Boolean(result.rowCount);
}

export async function bookAppointment(
  clientId: string,
  slotId: string,
  timeZone: unknown = "UTC",
) {
  const transaction = await database().connect();
  try {
    await transaction.query("BEGIN");
    // Serializes each client's allowance check, even when booking different slots concurrently.
    const allowance = await transaction.query(
      `SELECT client.tier, client.paid_at, CASE WHEN client.tier = 'VIP' THEN COALESCE(client.allowance_hours, policy.hours) ELSE policy.hours END AS hours
      FROM private_clients client JOIN client_package_allowances policy ON policy.tier = client.tier
      WHERE client.id = $1 AND client.active FOR UPDATE OF client, policy`,
      [clientId],
    );
    if (!allowance.rowCount) throw new Error("Нет доступа к личной странице.");
    if (!allowance.rows[0].paid_at) throw new Error("Аккаунт заморожен. Новые записи недоступны до подтверждения оплаты.");
    const existing = await transaction.query(
      "SELECT id FROM appointment_slots WHERE id = $1 AND booked_by = $2",
      [slotId, clientId],
    );
    if (existing.rowCount) {
      await transaction.query("COMMIT");
      return;
    }
    const used = await transaction.query(
      "SELECT count(*)::int AS hours FROM appointment_slots WHERE booked_by = $1",
      [clientId],
    );
    if (used.rows[0].hours >= allowance.rows[0].hours)
      throw new Error(
        "Доступные часы уже использованы. Свяжитесь с администратором в чате.",
      );
    if (allowance.rows[0].tier === "PRO") {
      const sameDay = await transaction.query(
        `SELECT booked.id FROM appointment_slots booked
        JOIN appointment_slots requested ON requested.id = $2
        WHERE booked.booked_by = $1
          AND (booked.starts_at AT TIME ZONE $3)::date = (requested.starts_at AT TIME ZONE $3)::date
        LIMIT 1`,
        [clientId, slotId, appointmentTimeZone],
      );
      if (sameDay.rowCount)
        throw new Error(
          `Для PRO можно забронировать только один час в день (${appointmentTimeZone}). Выберите другой день.`,
        );
    }
    const slot = await transaction.query(
      `UPDATE appointment_slots SET booked_by = $2, booked_at = now(), open = false
      WHERE id = $1 AND open AND booked_by IS NULL AND starts_at > now() RETURNING id`,
      [slotId, clientId],
    );
    if (!slot.rowCount)
      throw new Error("Это время уже недоступно. Выберите другой час.");
    await transaction.query(
      "INSERT INTO appointment_email_jobs(slot_id, client_id, client_time_zone) VALUES ($1, $2, $3) ON CONFLICT (slot_id) DO NOTHING",
      [slotId, clientId, validTimeZone(timeZone)],
    );
    await transaction.query("COMMIT");
  } catch (error) {
    await transaction.query("ROLLBACK");
    throw error;
  } finally {
    transaction.release();
  }
}

export async function markChatRead(clientId: string, ids: string[]) {
  await database().query(
    `UPDATE private_chat_messages SET admin_read_at = now()
    WHERE client_id = $1 AND author = 'client' AND NOT hidden_from_admin AND admin_read_at IS NULL
      AND (created_at, id) <= (SELECT created_at, id FROM private_chat_messages
        WHERE client_id = $1 AND id = ANY($2::uuid[]) ORDER BY created_at DESC, id DESC LIMIT 1)`,
    [clientId, ids],
  );
}

export async function clientUnreadMessages(clientId: string) {
  const result = await database().query(
    "SELECT count(*)::int AS count FROM private_chat_messages WHERE client_id = $1 AND author = 'admin' AND NOT hidden_from_client AND client_read_at IS NULL",
    [clientId],
  );
  return result.rows[0].count as number;
}

export async function markClientChatRead(clientId: string, ids: string[]) {
  await database().query(
    `UPDATE private_chat_messages SET client_read_at = now()
    WHERE client_id = $1 AND author = 'admin' AND NOT hidden_from_client AND client_read_at IS NULL
      AND (created_at, id) <= (SELECT created_at, id FROM private_chat_messages
        WHERE client_id = $1 AND id = ANY($2::uuid[]) ORDER BY created_at DESC, id DESC LIMIT 1)`,
    [clientId, ids],
  );
}

/** Cancel only the authenticated client's upcoming booking and restore its credit. */
export async function cancelAppointment(clientId: string, slotId: string) {
  const transaction = await database().connect();
  try {
    await transaction.query("BEGIN");
    const client = await transaction.query("SELECT id FROM private_clients WHERE id=$1 AND active AND paid_at IS NOT NULL FOR UPDATE", [clientId]);
    if (!client.rowCount) throw new Error("Аккаунт заморожен. Свяжитесь с администратором.");
    const slot = await transaction.query("UPDATE appointment_slots SET booked_by=NULL, booked_at=NULL, open=true WHERE id=$1 AND booked_by=$2 AND starts_at>now() RETURNING id", [slotId, clientId]);
    if (!slot.rowCount) throw new Error("Можно отменить только свою предстоящую встречу.");
    await transaction.query("DELETE FROM appointment_email_jobs WHERE slot_id=$1", [slotId]);
    await transaction.query("COMMIT");
  } catch (error) {
    await transaction.query("ROLLBACK");
    throw error;
  } finally {
    transaction.release();
  }
}
