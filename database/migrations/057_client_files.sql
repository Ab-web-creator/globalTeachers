CREATE TABLE private_file_folders (
  id uuid PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES private_clients(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, name),
  UNIQUE(id, client_id)
);
CREATE TABLE private_client_files (
  id uuid PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES private_clients(id) ON DELETE CASCADE,
  folder_id uuid,
  author text NOT NULL CHECK (author IN ('admin', 'client')),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  content_type text NOT NULL,
  size integer NOT NULL CHECK (size BETWEEN 1 AND 10485760),
  content bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(folder_id, client_id) REFERENCES private_file_folders(id, client_id)
);
CREATE INDEX private_client_files_client ON private_client_files(client_id, created_at DESC);
ALTER TABLE private_file_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_client_files ENABLE ROW LEVEL SECURITY;
