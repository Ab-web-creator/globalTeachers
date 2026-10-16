-- Private access is granted by an administrator, never by an unverified form.
CREATE TABLE client_package_allowances (
  tier text PRIMARY KEY CHECK (tier IN ('START', 'PRO', 'VIP')),
  hours integer NOT NULL DEFAULT 0 CHECK (hours BETWEEN 0 AND 1000)
);
INSERT INTO client_package_allowances(tier) VALUES ('START'), ('PRO'), ('VIP');

CREATE TABLE private_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  name text NOT NULL,
  tier text NOT NULL REFERENCES client_package_allowances(tier),
  key_hash text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT false,
  allowance_hours integer CHECK (allowance_hours BETWEEN 0 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE client_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL UNIQUE REFERENCES private_clients(id) ON DELETE CASCADE,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'draft', 'sending', 'sent')),
  due_at timestamptz NOT NULL DEFAULT now() + interval '4 seconds',
  lease_until timestamptz,
  first_attempt_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE private_client_sessions (
  token_hash text PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES private_clients(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '30 days'
);
CREATE INDEX private_client_sessions_expiry ON private_client_sessions(expires_at);
CREATE TABLE private_chat_messages (
  id uuid PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES private_clients(id) ON DELETE CASCADE,
  author text NOT NULL CHECK (author IN ('admin', 'client')),
  body text NOT NULL CHECK (length(btrim(body)) BETWEEN 1 AND 5000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX private_chat_messages_client ON private_chat_messages(client_id, created_at, id);

-- Missing slots are unavailable. All sessions last exactly one hour.
CREATE TABLE appointment_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL UNIQUE,
  ends_at timestamptz NOT NULL,
  open boolean NOT NULL DEFAULT false,
  booked_by uuid REFERENCES private_clients(id),
  booked_at timestamptz,
  CHECK (ends_at = starts_at + interval '1 hour'),
  CHECK ((booked_by IS NULL) = (booked_at IS NULL))
);
CREATE INDEX appointment_slots_client ON appointment_slots(booked_by);
CREATE TABLE appointment_email_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid NOT NULL UNIQUE REFERENCES appointment_slots(id),
  client_id uuid NOT NULL REFERENCES private_clients(id),
  lease_until timestamptz,
  first_attempt_at timestamptz,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  client_sent_at timestamptz,
  admin_sent_at timestamptz
);
ALTER TABLE client_package_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_client_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_email_jobs ENABLE ROW LEVEL SECURITY;
