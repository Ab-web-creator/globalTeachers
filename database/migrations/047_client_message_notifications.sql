ALTER TABLE private_chat_messages ADD COLUMN client_read_at timestamptz;
CREATE INDEX private_chat_client_unread_idx ON private_chat_messages(client_id) WHERE author = 'admin' AND client_read_at IS NULL;
