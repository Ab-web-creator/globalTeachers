-- Delivery metadata only; does not archive other automatic email bodies.
CREATE TABLE mail_delivery_events (
  id text PRIMARY KEY,
  resend_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('email.delivered', 'email.delivery_delayed', 'email.bounced', 'email.failed', 'email.suppressed')),
  occurred_at timestamptz NOT NULL,
  reason text
);
CREATE INDEX mail_delivery_events_lookup ON mail_delivery_events (resend_id, occurred_at DESC);
ALTER TABLE mail_delivery_events ENABLE ROW LEVEL SECURITY;
