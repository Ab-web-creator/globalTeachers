ALTER TABLE consultation_attempts DROP CONSTRAINT consultation_attempts_status_check;
ALTER TABLE consultation_attempts ADD CONSTRAINT consultation_attempts_status_check
CHECK (status IN ('draft', 'pending', 'confirmed', 'superseded', 'expired'));
ALTER TABLE consultation_attempts ADD COLUMN draft_token_hash text;
ALTER TABLE consultation_attempts ADD COLUMN draft_revision bigint NOT NULL DEFAULT 0;
ALTER TABLE consultation_attempts ADD COLUMN last_step text;
ALTER TABLE consultation_attempts ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION track_consultation_pending_attempt() RETURNS trigger
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
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    answers = CASE WHEN consultation_attempts.status = 'draft' THEN EXCLUDED.answers ELSE consultation_attempts.answers END,
    submitted_at = CASE WHEN consultation_attempts.status = 'draft' THEN EXCLUDED.submitted_at ELSE consultation_attempts.submitted_at END,
    draft_token_hash = NULL,
    status = CASE WHEN consultation_attempts.status = 'draft' THEN 'pending' ELSE consultation_attempts.status END;
  RETURN NEW;
END;
$$;
