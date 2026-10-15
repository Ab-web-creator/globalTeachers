CREATE TABLE payment_profile_verifications (
  email text PRIMARY KEY,
  challenge text NOT NULL UNIQUE,
  code_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '10 minutes',
  consumed_at timestamptz,
  window_start timestamptz NOT NULL DEFAULT now(),
  requests integer NOT NULL DEFAULT 1
);
ALTER TABLE payment_profile_verifications ENABLE ROW LEVEL SECURITY;
