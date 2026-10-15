-- Both education and English outcomes require confirmation before follow-up.
DROP TRIGGER consultation_english_outcome_email ON consultation_attempts;
DROP FUNCTION queue_english_outcome_email();
DELETE FROM consultation_english_emails WHERE sent_at IS NULL;

ALTER TABLE consultation_education_verifications RENAME TO consultation_outcome_verifications;
DROP TRIGGER consultation_verified_education_email ON consultation_outcome_verifications;
DROP FUNCTION queue_verified_education_email();

CREATE FUNCTION queue_verified_outcome_email() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE consultation_attempts SET confirmed_at = NEW.confirmed_at WHERE id = NEW.attempt_id;
  INSERT INTO consultation_education_emails(email, attempt_id)
  SELECT lower(email), id FROM consultation_attempts
  WHERE id = NEW.attempt_id AND status = 'not-enough-education'
  ON CONFLICT (email) DO NOTHING;
  INSERT INTO consultation_english_emails(email, attempt_id)
  SELECT lower(email), id FROM consultation_attempts
  WHERE id = NEW.attempt_id AND status = 'not-enough-english'
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER consultation_verified_outcome_email
AFTER UPDATE OF confirmed_at ON consultation_outcome_verifications
FOR EACH ROW WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
EXECUTE FUNCTION queue_verified_outcome_email();
