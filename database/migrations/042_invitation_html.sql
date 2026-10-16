-- Freeze the rendered email with its text so provider retries keep an identical payload.
ALTER TABLE client_invitations ADD COLUMN html_body text;
