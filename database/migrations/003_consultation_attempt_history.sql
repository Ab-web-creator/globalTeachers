CREATE TABLE consultation_attempts (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  answers jsonb NOT NULL,
  submitted_at timestamptz NOT NULL,
  confirmed_at timestamptz,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'superseded', 'expired'))
);
CREATE INDEX consultation_attempts_email ON consultation_attempts (lower(email), submitted_at, id);
ALTER TABLE consultation_attempts ENABLE ROW LEVEL SECURITY;

-- Existing records become the first available attempts. Overwritten answers
-- from before this migration cannot be recovered.
INSERT INTO consultation_attempts (id, email, answers, submitted_at, confirmed_at, status)
SELECT id, lower(email), answers, created_at, NULL,
  CASE WHEN expires_at <= now() THEN 'expired' ELSE 'pending' END
FROM consultation_pending
UNION ALL
SELECT id, lower(email), answers, submitted_at, confirmed_at, 'confirmed'
FROM consultation_applications;

CREATE FUNCTION track_consultation_pending_attempt() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE consultation_attempts SET status = 'expired'
    WHERE id = OLD.id AND status = 'pending';
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.id <> NEW.id THEN
    UPDATE consultation_attempts SET status = 'superseded'
    WHERE id = OLD.id AND status = 'pending';
  END IF;
  INSERT INTO consultation_attempts (id, email, answers, submitted_at, status)
  VALUES (NEW.id, lower(NEW.email), NEW.answers, NEW.created_at, 'pending')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;
CREATE TRIGGER consultation_pending_attempt
AFTER INSERT OR UPDATE ON consultation_pending
FOR EACH ROW EXECUTE FUNCTION track_consultation_pending_attempt();
CREATE TRIGGER consultation_pending_attempt_expiry
AFTER DELETE ON consultation_pending
FOR EACH ROW EXECUTE FUNCTION track_consultation_pending_attempt();

CREATE FUNCTION track_consultation_confirmed_attempt() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO consultation_attempts (id, email, answers, submitted_at, confirmed_at, status)
  VALUES (NEW.id, lower(NEW.email), NEW.answers, NEW.submitted_at, NEW.confirmed_at, 'confirmed')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email, confirmed_at = EXCLUDED.confirmed_at, status = 'confirmed';
  RETURN NEW;
END;
$$;
CREATE TRIGGER consultation_confirmed_attempt
AFTER INSERT OR UPDATE ON consultation_applications
FOR EACH ROW EXECUTE FUNCTION track_consultation_confirmed_attempt();

ALTER TABLE consultation_pending ADD CONSTRAINT consultation_pending_attempt_fk
FOREIGN KEY (id) REFERENCES consultation_attempts (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE consultation_applications ADD CONSTRAINT consultation_application_attempt_fk
FOREIGN KEY (id) REFERENCES consultation_attempts (id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;
