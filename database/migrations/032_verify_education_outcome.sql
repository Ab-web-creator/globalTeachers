-- Education recommendations now require ownership confirmation first.
DROP TRIGGER consultation_education_outcome_email ON consultation_attempts;
DROP FUNCTION queue_education_outcome_email();
DELETE FROM consultation_education_emails WHERE sent_at IS NULL;

CREATE TABLE consultation_education_verifications (
  attempt_id uuid PRIMARY KEY REFERENCES consultation_attempts(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  confirmed_at timestamptz
);
ALTER TABLE consultation_education_verifications ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION queue_verified_education_email() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE consultation_attempts SET confirmed_at = NEW.confirmed_at WHERE id = NEW.attempt_id;
  INSERT INTO consultation_education_emails(email, attempt_id)
  SELECT lower(email), id FROM consultation_attempts
  WHERE id = NEW.attempt_id AND status = 'not-enough-education'
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER consultation_verified_education_email
AFTER UPDATE OF confirmed_at ON consultation_education_verifications
FOR EACH ROW WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
EXECUTE FUNCTION queue_verified_education_email();
