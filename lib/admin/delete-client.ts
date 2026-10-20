import { database } from "../consultation/database";

/** Remove a private client page. Applications stay on the «Заявки» page. */
export async function deletePrivateClient(id: string) {
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    // These references have no ON DELETE CASCADE. Booked hours are released for others.
    await client.query("DELETE FROM appointment_email_jobs WHERE client_id = $1", [id]);
    await client.query(
      "DELETE FROM browser_calls WHERE admin_client_id = $1 OR appointment_slot_id IN (SELECT id FROM appointment_slots WHERE booked_by = $1)",
      [id],
    );
    await client.query("UPDATE appointment_slots SET booked_by = NULL, booked_at = NULL WHERE booked_by = $1", [id]);
    // Chat, files, sessions and invitations cascade.
    const result = await client.query("DELETE FROM private_clients WHERE id = $1", [id]);
    await client.query("COMMIT");
    return Boolean(result.rowCount);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
