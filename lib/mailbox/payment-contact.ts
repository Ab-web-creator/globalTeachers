import { database } from "../consultation/database";

/** Use the request id so retries cannot create duplicate mailbox entries. */
export async function savePaymentContactMessage(id: string, recipients: string[]) {
  await database().query(
    `INSERT INTO mailbox_messages (id, direction, from_address, to_addresses, reply_to, subject, text_body, created_at, sent_at)
     SELECT id, 'inbound', email, $2::text[], ARRAY[email],
       'Другой способ оплаты ' || tier || ' — TeacherNavigator',
       'Программа: ' || tier || E'\\nИмя: ' || name || E'\\nEmail: ' || email || E'\\n\\n' || message,
       created_at, notified_at
     FROM payment_contact_requests WHERE id = $1 AND notified_at IS NOT NULL
     ON CONFLICT (id) DO NOTHING`,
    [id, recipients],
  );
}
