-- Mail received through Resend inbound and mail written in the admin mailbox.
CREATE TABLE mailbox_messages (
  id uuid PRIMARY KEY,
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  resend_id text UNIQUE,
  message_id text,
  reply_to_message uuid REFERENCES mailbox_messages (id) ON DELETE SET NULL,
  from_address text NOT NULL,
  to_addresses text[] NOT NULL,
  cc_addresses text[] NOT NULL DEFAULT '{}',
  reply_to text[] NOT NULL DEFAULT '{}',
  subject text NOT NULL DEFAULT '',
  text_body text,
  html_body text,
  attachments jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  read_at timestamptz,
  forwarded_at timestamptz
);
CREATE INDEX mailbox_messages_list ON mailbox_messages (direction, created_at DESC);

ALTER TABLE mailbox_messages ENABLE ROW LEVEL SECURITY;
