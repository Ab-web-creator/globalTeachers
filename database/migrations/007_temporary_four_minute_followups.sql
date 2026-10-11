-- TEMPORARY: restore the production delay to four hours after testing.
ALTER TABLE consultation_qualification_followups ALTER COLUMN due_at
SET DEFAULT now() + interval '4 minutes';
ALTER TABLE consultation_qualification_followups ALTER COLUMN next_attempt_at
SET DEFAULT now() + interval '4 minutes';

CREATE OR REPLACE FUNCTION queue_qualification_followup() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.answers IS NOT DISTINCT FROM NEW.answers AND OLD.email = NEW.email THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.email <> NEW.email THEN
    UPDATE consultation_qualification_followups SET cancelled_at = now()
    WHERE email = lower(OLD.email) AND source_id = NEW.id AND sent_at IS NULL;
  END IF;
  IF NEW.answers->>'qualification' = 'Нет' AND NEW.email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    INSERT INTO consultation_qualification_followups(email, source_id)
    VALUES (lower(NEW.email), NEW.id)
    ON CONFLICT(email) DO UPDATE SET
      source_id = EXCLUDED.source_id,
      due_at = CASE WHEN consultation_qualification_followups.cancelled_at IS NOT NULL THEN now() + interval '4 minutes' ELSE consultation_qualification_followups.due_at END,
      next_attempt_at = CASE WHEN consultation_qualification_followups.cancelled_at IS NOT NULL THEN now() + interval '4 minutes' ELSE consultation_qualification_followups.next_attempt_at END,
      cancelled_at = NULL
    WHERE consultation_qualification_followups.sent_at IS NULL;
  ELSE
    UPDATE consultation_qualification_followups SET cancelled_at = now()
    WHERE email = lower(NEW.email) AND sent_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Bring already queued, unattempted emails onto the shorter testing schedule.
-- Preserve jobs that have already been sent, cancelled, or entered retries.
UPDATE consultation_qualification_followups
SET due_at = due_at - interval '3 hours 56 minutes',
    next_attempt_at = next_attempt_at - interval '3 hours 56 minutes'
WHERE sent_at IS NULL AND cancelled_at IS NULL AND first_attempt_at IS NULL;
