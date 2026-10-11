CREATE TABLE consultation_education_followups (
  email text PRIMARY KEY,
  id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES consultation_attempts(id) ON DELETE CASCADE,
  due_at timestamptz NOT NULL DEFAULT now() + interval '4 minutes',
  sent_at timestamptz,
  cancelled_at timestamptz,
  lease_until timestamptz,
  first_attempt_at timestamptz,
  next_attempt_at timestamptz NOT NULL DEFAULT now() + interval '4 minutes'
);
ALTER TABLE consultation_education_followups ENABLE ROW LEVEL SECURITY;
CREATE INDEX consultation_education_followups_due ON consultation_education_followups(next_attempt_at)
WHERE sent_at IS NULL AND cancelled_at IS NULL;

CREATE FUNCTION queue_education_followup() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.answers IS NOT DISTINCT FROM NEW.answers AND OLD.email = NEW.email THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.email <> NEW.email THEN
    UPDATE consultation_education_followups SET cancelled_at = now()
    WHERE email = lower(OLD.email) AND source_id = NEW.id AND sent_at IS NULL;
  END IF;
  IF NEW.answers->>'education' = 'Среднее специальное' AND NEW.email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    INSERT INTO consultation_education_followups(email, source_id)
    VALUES (lower(NEW.email), NEW.id)
    ON CONFLICT(email) DO UPDATE SET
      source_id = EXCLUDED.source_id,
      due_at = CASE WHEN consultation_education_followups.cancelled_at IS NOT NULL THEN now() + interval '4 minutes' ELSE consultation_education_followups.due_at END,
      next_attempt_at = CASE WHEN consultation_education_followups.cancelled_at IS NOT NULL THEN now() + interval '4 minutes' ELSE consultation_education_followups.next_attempt_at END,
      cancelled_at = NULL
    WHERE consultation_education_followups.sent_at IS NULL;
  ELSE
    UPDATE consultation_education_followups SET cancelled_at = now()
    WHERE email = lower(NEW.email) AND sent_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER consultation_education_followup
AFTER INSERT OR UPDATE OF answers, email ON consultation_attempts
FOR EACH ROW EXECUTE FUNCTION queue_education_followup();
-- New selections schedule emails; existing records are not mailed retroactively.
