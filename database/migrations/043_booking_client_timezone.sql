-- Capture the booking browser's zone once so notification retries keep the same time.
ALTER TABLE appointment_email_jobs ADD COLUMN client_time_zone text NOT NULL DEFAULT 'UTC';
