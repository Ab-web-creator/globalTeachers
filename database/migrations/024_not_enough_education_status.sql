ALTER TABLE consultation_attempts DROP CONSTRAINT consultation_attempts_status_check;
UPDATE consultation_attempts SET status = 'not-enough-education'
WHERE status = 'unsupported_education';
ALTER TABLE consultation_attempts ADD CONSTRAINT consultation_attempts_status_check
CHECK (status IN ('draft', 'pending', 'confirmed', 'superseded', 'expired', 'unsupported_subjects', 'not-enough-education'));
