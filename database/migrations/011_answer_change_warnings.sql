CREATE TABLE consultation_answer_changes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  attempt_id uuid NOT NULL REFERENCES consultation_attempts(id) ON DELETE CASCADE,
  field text NOT NULL CHECK (field IN ('subject', 'education', 'english')),
  previous_answer text NOT NULL,
  new_answer text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX consultation_answer_changes_attempt ON consultation_answer_changes(attempt_id);
ALTER TABLE consultation_answer_changes ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION track_consultation_answer_change() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE field_name text; previous text; answer text;
BEGIN
  FOREACH field_name IN ARRAY ARRAY['subject', 'education', 'english'] LOOP
    answer := COALESCE(NEW.answers->>field_name, '');
    IF TG_OP = 'UPDATE' THEN
      previous := OLD.answers->>field_name;
    ELSE
      IF answer = '' THEN CONTINUE; END IF;
      SELECT answers->>field_name INTO previous FROM consultation_attempts
      WHERE lower(email) = lower(NEW.email) AND id <> NEW.id
        AND COALESCE(answers->>field_name, '') <> ''
      ORDER BY submitted_at DESC, id DESC LIMIT 1;
    END IF;
    IF COALESCE(previous, '') <> '' AND previous IS DISTINCT FROM answer THEN
      INSERT INTO consultation_answer_changes(attempt_id, field, previous_answer, new_answer)
      VALUES (NEW.id, field_name, previous, answer);
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;
CREATE TRIGGER consultation_answer_change
AFTER INSERT OR UPDATE OF answers ON consultation_attempts
FOR EACH ROW EXECUTE FUNCTION track_consultation_answer_change();

INSERT INTO consultation_answer_changes(attempt_id, field, previous_answer, new_answer, changed_at)
SELECT id, field, previous, answer, submitted_at FROM (
  SELECT id, submitted_at, field, answers->>field AS answer,
    lag(answers->>field) OVER (PARTITION BY lower(email), field ORDER BY submitted_at, id) AS previous
  FROM consultation_attempts CROSS JOIN unnest(ARRAY['subject', 'education', 'english']) AS field
  WHERE COALESCE(answers->>field, '') <> ''
) history WHERE previous IS NOT NULL AND previous <> answer;
