ALTER TABLE mailbox_messages ADD COLUMN deleted_at timestamptz;
CREATE INDEX mailbox_messages_deleted_at_idx ON mailbox_messages (deleted_at) WHERE deleted_at IS NOT NULL;
