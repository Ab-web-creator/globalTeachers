import { bookingTimeText } from "./booking-time";
import { database } from "../consultation/database";
import { emailConfig, sendEmail } from "../consultation/email";

export async function deliverBookingEmail(slotId?: string) {
  const result = await database().query(
    `UPDATE appointment_email_jobs SET lease_until = now() + interval '1 minute',
    first_attempt_at = COALESCE(first_attempt_at, now())
    WHERE id = (SELECT id FROM appointment_email_jobs
      WHERE ($1::uuid IS NULL OR slot_id = $1) AND (client_sent_at IS NULL OR admin_sent_at IS NULL)
        AND next_attempt_at <= now() AND (lease_until IS NULL OR lease_until < now())
        AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')
      ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *`,
    [slotId ?? null],
  );
  if (!result.rowCount) return false;
  const job = result.rows[0];
  try {
    const { recipient, origin } = emailConfig();
    const record = (
      await database().query(
        `SELECT client.name, client.email, client.tier, slot.starts_at, slot.ends_at
      FROM private_clients client JOIN appointment_slots slot ON slot.booked_by = client.id
      WHERE client.id = $1 AND slot.id = $2`,
        [job.client_id, job.slot_id],
      )
    ).rows[0];
    const date = new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(record.starts_at);
    const clientTime = bookingTimeText(record.starts_at, job.client_time_zone);
    const bookingDetails =
      job.client_time_zone && job.client_time_zone !== "UTC"
        ? `Ваша консультация забронирована:\n${clientTime}`
        : `Ваша консультация забронирована: ${date} (UTC).`;
    if (!job.client_sent_at) {
      await sendEmail(
        {
          to: record.email,
          subject: "Консультация забронирована — TeacherNavigator",
          text: `Здравствуйте, ${record.name}!\n\n${bookingDetails} Продолжительность — 60 минут.\n\nПодробности доступны на вашей личной странице — откройте её по ключу из письма-приглашения.\n\nДо встречи!\nКоманда TeacherNavigator`,
        },
        `appointment-client-${job.id}`,
      );
      await database().query(
        "UPDATE appointment_email_jobs SET client_sent_at = now() WHERE id = $1",
        [job.id],
      );
    }
    if (!job.admin_sent_at) {
      await sendEmail(
        {
          to: recipient,
          subject: `Новая запись ${record.tier} — TeacherNavigator`,
          text: `${record.name} (${record.email}) забронировал(а) консультацию: ${date} (UTC), 60 минут.\n\n${origin}/admin/clients?client=${job.client_id}`,
        },
        `appointment-admin-${job.id}`,
      );
      await database().query(
        "UPDATE appointment_email_jobs SET admin_sent_at = now() WHERE id = $1",
        [job.id],
      );
    }
    await database().query(
      "UPDATE appointment_email_jobs SET lease_until = NULL WHERE id = $1",
      [job.id],
    );
  } catch {
    await database().query(
      "UPDATE appointment_email_jobs SET lease_until = NULL, next_attempt_at = now() + interval '1 minute' WHERE id = $1",
      [job.id],
    );
  }
  return true;
}
