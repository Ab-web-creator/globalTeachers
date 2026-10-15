CREATE TABLE consultation_package_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL UNIQUE REFERENCES consultation_applications(id) ON DELETE CASCADE,
  email text NOT NULL,
  package_preference text NOT NULL CHECK (package_preference = ''),
  due_at timestamptz NOT NULL DEFAULT now() + interval '1 minute',
  next_attempt_at timestamptz NOT NULL DEFAULT now() + interval '1 minute',
  first_attempt_at timestamptz,
  lease_until timestamptz,
  sent_at timestamptz
);
ALTER TABLE consultation_package_emails ENABLE ROW LEVEL SECURITY;
CREATE INDEX consultation_package_emails_due ON consultation_package_emails(next_attempt_at) WHERE sent_at IS NULL;

CREATE FUNCTION queue_confirmed_package_email() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF COALESCE(NEW.answers->>'packagePreference', '') = '' THEN
    INSERT INTO consultation_package_emails(application_id, email, package_preference)
    VALUES (NEW.id, NEW.email, '') ON CONFLICT (application_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER consultation_confirmed_package_email
AFTER INSERT ON consultation_applications
FOR EACH ROW EXECUTE FUNCTION queue_confirmed_package_email();
