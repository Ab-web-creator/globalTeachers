ALTER TABLE private_chat_messages
  ADD COLUMN client_edit_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN client_edited_at timestamptz,
  ADD COLUMN client_deleted_at timestamptz;
