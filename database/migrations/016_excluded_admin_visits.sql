CREATE TABLE analytics_excluded_sessions (
  session_id uuid PRIMARY KEY,
  excluded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE analytics_excluded_sessions ENABLE ROW LEVEL SECURITY;
