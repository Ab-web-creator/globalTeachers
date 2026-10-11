CREATE TABLE consultation_qualification_changes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  attempt_id uuid NOT NULL REFERENCES consultation_attempts(id) ON DELETE CASCADE,
  previous_answer text NOT NULL,
  new_answer text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX consultation_qualification_changes_attempt ON consultation_qualification_changes(attempt_id);
ALTER TABLE consultation_qualification_changes ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION track_qualification_answer_change() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE previous text;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    previous := OLD.answers->>'qualification';
  ELSE
    SELECT answers->>'qualification' INTO previous FROM consultation_attempts
    WHERE lower(email) = lower(NEW.email) AND id <> NEW.id
      AND COALESCE(answers->>'qualification', '') <> ''
    ORDER BY submitted_at DESC, id DESC LIMIT 1;
  END IF;
  IF COALESCE(previous, '') <> '' AND COALESCE(NEW.answers->>'qualification', '') <> ''
    AND previous IS DISTINCT FROM NEW.answers->>'qualification' THEN
    INSERT INTO consultation_qualification_changes(attempt_id, previous_answer, new_answer)
    VALUES (NEW.id, previous, NEW.answers->>'qualification');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER consultation_qualification_change
AFTER INSERT OR UPDATE OF answers ON consultation_attempts
FOR EACH ROW EXECUTE FUNCTION track_qualification_answer_change();

-- Recover changes visible between already saved attempts.
INSERT INTO consultation_qualification_changes(attempt_id, previous_answer, new_answer, changed_at)
SELECT id, previous, answer, submitted_at FROM (
  SELECT id, submitted_at, answers->>'qualification' AS answer,
    lag(answers->>'qualification') OVER (PARTITION BY lower(email) ORDER BY submitted_at, id) AS previous
  FROM consultation_attempts WHERE COALESCE(answers->>'qualification', '') <> ''
) history WHERE previous IS NOT NULL AND previous <> answer;
