ALTER TABLE consultation_pending
  ADD COLUMN reminder_sent_at timestamptz,
  ADD COLUMN reminder_token_hash text;
ALTER TABLE consultation_applications ADD COLUMN reminder_token_hash text;

CREATE INDEX consultation_confirmation_reminders_due ON consultation_pending (created_at)
  WHERE reminder_sent_at IS NULL;
