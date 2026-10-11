-- Remove retired answers from existing pending and confirmed applications.
-- Preserve application records, confirmation links, and notification metadata.
UPDATE consultation_pending
SET answers = answers - ARRAY['experience', 'international', 'timing', 'destinations', 'priority']::text[]
WHERE answers ?| ARRAY['experience', 'international', 'timing', 'destinations', 'priority'];

UPDATE consultation_applications
SET answers = answers - ARRAY['experience', 'international', 'timing', 'destinations', 'priority']::text[]
WHERE answers ?| ARRAY['experience', 'international', 'timing', 'destinations', 'priority'];
