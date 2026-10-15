-- Recover form notifications that were sent before direct mailbox storage existed.
-- The recipient is the configured mailbox address when sent from the application;
-- historical records have no saved recipient, so leave that list empty.
INSERT INTO mailbox_messages (id, direction, from_address, to_addresses, reply_to, subject, text_body, created_at, sent_at)
SELECT request.id, 'inbound', request.email, '{}'::text[], ARRAY[request.email],
  'Другой способ оплаты ' || request.tier || ' — TeacherNavigator',
  'Программа: ' || request.tier || E'\nИмя: ' || request.name || E'\nEmail: ' || request.email || E'\n\n' || request.message,
  request.created_at, request.notified_at
FROM payment_contact_requests request
WHERE request.notified_at IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM mailbox_messages mail
    WHERE mail.direction = 'inbound'
      AND mail.subject = 'Другой способ оплаты ' || request.tier || ' — TeacherNavigator'
      AND request.email = ANY(mail.reply_to)
      AND mail.text_body = 'Программа: ' || request.tier || E'\nИмя: ' || request.name || E'\nEmail: ' || request.email || E'\n\n' || request.message
  )
ON CONFLICT (id) DO NOTHING;
