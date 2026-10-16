ALTER TABLE private_chat_messages ADD COLUMN admin_read_at timestamptz;
CREATE INDEX private_chat_unread_idx ON private_chat_messages(client_id) WHERE author = 'client' AND admin_read_at IS NULL;
