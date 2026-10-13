CREATE TABLE browser_calls (
 id uuid PRIMARY KEY,
 token_hash text NOT NULL UNIQUE,
 email text NOT NULL,
 name text NOT NULL,
 expires_at timestamptz NOT NULL,
 state text NOT NULL DEFAULT 'waiting' CHECK (state IN ('waiting','ringing','accepted','declined','ended')),
 updated_at timestamptz NOT NULL DEFAULT now(),
 client_seen timestamptz,
 admin_seen timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE browser_call_signals (
 id bigserial PRIMARY KEY,
 call_id uuid NOT NULL REFERENCES browser_calls(id) ON DELETE CASCADE,
 sender text NOT NULL CHECK (sender IN ('admin','client')),
 payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX browser_call_signal_lookup ON browser_call_signals(call_id,id);
