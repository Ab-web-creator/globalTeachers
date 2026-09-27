CREATE TABLE consultation_pending (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  answers jsonb NOT NULL,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours'
);
CREATE INDEX consultation_pending_expiry ON consultation_pending (expires_at);

CREATE TABLE consultation_applications (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  answers jsonb NOT NULL,
  token_hash text NOT NULL UNIQUE,
  submitted_at timestamptz NOT NULL,
  confirmed_at timestamptz NOT NULL DEFAULT now(),
  notification_sent_at timestamptz,
  notification_lease_until timestamptz,
  notification_first_attempt_at timestamptz,
  notification_next_attempt_at timestamptz NOT NULL DEFAULT now(),
  notification_attempts integer NOT NULL DEFAULT 0
);
CREATE INDEX consultation_applications_email ON consultation_applications (email);
CREATE INDEX consultation_notifications_due ON consultation_applications (notification_next_attempt_at)
  WHERE notification_sent_at IS NULL;

-- Keep records private when the database provider exposes public tables via an API.
-- The server uses the table-owning database role; no browser access policies are granted.
ALTER TABLE consultation_pending ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_applications ENABLE ROW LEVEL SECURITY;
