CREATE TABLE consultation_education_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  attempt_id uuid NOT NULL REFERENCES consultation_attempts(id) ON DELETE CASCADE,
  due_at timestamptz NOT NULL DEFAULT now() + interval '1 minute',
  next_attempt_at timestamptz NOT NULL DEFAULT now() + interval '1 minute',
  first_attempt_at timestamptz,
  lease_until timestamptz,
  sent_at timestamptz
);
ALTER TABLE consultation_education_emails ENABLE ROW LEVEL SECURITY;
CREATE INDEX consultation_education_emails_due ON consultation_education_emails(next_attempt_at) WHERE sent_at IS NULL;

CREATE FUNCTION queue_education_outcome_email() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status <> 'not-enough-education' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = NEW.status THEN RETURN NEW; END IF;
  END IF;
  IF NEW.email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    INSERT INTO consultation_education_emails (email, attempt_id)
    VALUES (lower(NEW.email), NEW.id) ON CONFLICT (email) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER consultation_education_outcome_email
AFTER INSERT OR UPDATE OF status ON consultation_attempts
FOR EACH ROW EXECUTE FUNCTION queue_education_outcome_email();
