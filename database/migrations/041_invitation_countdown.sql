ALTER TABLE client_invitations ALTER COLUMN due_at SET DEFAULT now() + interval '10 seconds';
