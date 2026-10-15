-- Consultation submission no longer queues team notification emails.
DROP INDEX IF EXISTS consultation_notifications_due;
ALTER TABLE consultation_applications
  DROP COLUMN IF EXISTS notification_sent_at,
  DROP COLUMN IF EXISTS notification_lease_until,
  DROP COLUMN IF EXISTS notification_first_attempt_at,
  DROP COLUMN IF EXISTS notification_next_attempt_at,
  DROP COLUMN IF EXISTS notification_attempts;
