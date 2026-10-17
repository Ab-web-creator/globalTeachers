ALTER TABLE browser_calls ADD COLUMN admin_client_id uuid UNIQUE REFERENCES private_clients(id);
