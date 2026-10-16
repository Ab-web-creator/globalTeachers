ALTER TABLE private_clients ADD COLUMN frozen_at timestamptz;
-- Existing activated pages without payment already have read-only access.
UPDATE private_clients SET frozen_at = now() WHERE active AND paid_at IS NULL;
