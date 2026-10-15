-- Received emails are marked as spam when they arrive (see lib/mailbox/spam.ts).
ALTER TABLE mailbox_messages ADD COLUMN spam boolean NOT NULL DEFAULT false;

-- Move bot probes that arrived before the filter existed: a subject that is only
-- a number and a code, a body without words and no attachments.
UPDATE mailbox_messages SET spam = true
WHERE direction = 'inbound' AND resend_id IS NOT NULL
  AND btrim(subject) ~* '^#?[0-9]+-[0-9a-f]{6,}$'
  AND jsonb_array_length(attachments) = 0
  AND COALESCE(text_body, '') || ' ' || regexp_replace(regexp_replace(COALESCE(html_body, ''), '<[^>]*>', ' ', 'g'), '&[a-z]+;', ' ', 'gi')
    ~ ('^[[:space:][:punct:]' || chr(160) || '«»–—]*$');
