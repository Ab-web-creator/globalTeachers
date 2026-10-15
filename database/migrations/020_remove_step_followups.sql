-- Remove step email automation and its queued messages; retain answer-change audits.
DROP TRIGGER IF EXISTS consultation_qualification_followup ON consultation_attempts;
DROP FUNCTION IF EXISTS queue_qualification_followup();
DROP TABLE IF EXISTS consultation_qualification_followups;

DROP TRIGGER IF EXISTS consultation_subject_followup ON consultation_attempts;
DROP FUNCTION IF EXISTS queue_subject_followup();
DROP TABLE IF EXISTS consultation_subject_followups;

DROP TRIGGER IF EXISTS consultation_education_followup ON consultation_attempts;
DROP FUNCTION IF EXISTS queue_education_followup();
DROP TABLE IF EXISTS consultation_education_followups;

DROP TRIGGER IF EXISTS consultation_english_followup ON consultation_attempts;
DROP FUNCTION IF EXISTS queue_english_followup();
DROP TABLE IF EXISTS consultation_english_followups;

