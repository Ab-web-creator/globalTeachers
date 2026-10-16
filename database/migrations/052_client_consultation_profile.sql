ALTER TABLE private_clients ADD COLUMN consultation_profile jsonb NOT NULL DEFAULT '{}'::jsonb;
