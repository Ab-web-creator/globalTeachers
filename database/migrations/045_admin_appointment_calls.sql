ALTER TABLE browser_calls ADD COLUMN initiated_by text NOT NULL DEFAULT 'client' CHECK (initiated_by IN ('client', 'admin'));
ALTER TABLE private_clients ADD COLUMN last_seen_at timestamptz;
