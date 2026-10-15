CREATE TABLE payment_contact_requests (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('START', 'PRO', 'VIP')),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  notified_at timestamptz
);
CREATE INDEX payment_contact_requests_email ON payment_contact_requests (lower(email), created_at);
ALTER TABLE payment_contact_requests ENABLE ROW LEVEL SECURITY;
