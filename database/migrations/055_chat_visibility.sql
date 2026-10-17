ALTER TABLE private_chat_messages
  ADD COLUMN hidden_from_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN hidden_from_client boolean NOT NULL DEFAULT false;
