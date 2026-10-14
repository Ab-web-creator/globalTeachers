ALTER TABLE browser_calls ADD COLUMN invitation_token text;
CREATE INDEX browser_call_email_lookup ON browser_calls (lower(email), expires_at);
