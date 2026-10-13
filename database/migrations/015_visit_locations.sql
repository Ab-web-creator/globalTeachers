ALTER TABLE site_page_views
  ADD COLUMN country_code varchar(2) CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$'),
  ADD COLUMN city varchar(120);
