-- Anonymous, first-party page views. No IP, user-agent, query string or form data.
CREATE TABLE site_page_views (
  id uuid PRIMARY KEY,
  session_id uuid NOT NULL,
  path text NOT NULL CHECK (length(path) <= 160),
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX site_page_views_date ON site_page_views (occurred_at DESC);
CREATE INDEX site_page_views_session_date ON site_page_views (session_id, occurred_at DESC);
ALTER TABLE site_page_views ENABLE ROW LEVEL SECURITY;
