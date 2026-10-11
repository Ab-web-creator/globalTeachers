-- TEMPORARY: restore the production delay to four hours after testing.
DO $$
DECLARE kind text; definition text;
BEGIN
  FOREACH kind IN ARRAY ARRAY['qualification', 'subject', 'education', 'english'] LOOP
    EXECUTE format('ALTER TABLE consultation_%s_followups ALTER COLUMN due_at SET DEFAULT now() + interval ''1 minute''', kind);
    EXECUTE format('ALTER TABLE consultation_%s_followups ALTER COLUMN next_attempt_at SET DEFAULT now() + interval ''1 minute''', kind);

    -- Re-queued (previously cancelled) emails use the same shorter delay.
    definition := pg_get_functiondef(format('queue_%s_followup()', kind)::regprocedure);
    EXECUTE replace(definition, 'interval ''4 minutes''', 'interval ''1 minute''');

    -- Bring already queued, unattempted emails onto the shorter schedule.
    EXECUTE format('UPDATE consultation_%s_followups
      SET due_at = due_at - interval ''3 minutes'', next_attempt_at = next_attempt_at - interval ''3 minutes''
      WHERE sent_at IS NULL AND cancelled_at IS NULL AND first_attempt_at IS NULL', kind);
  END LOOP;
END;
$$;
