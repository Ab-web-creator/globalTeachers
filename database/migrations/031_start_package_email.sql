ALTER TABLE consultation_package_emails DROP CONSTRAINT consultation_package_emails_package_preference_check;
ALTER TABLE consultation_package_emails ADD CONSTRAINT consultation_package_emails_package_preference_check
CHECK (package_preference IN ('', 'Start', 'Pro', 'VIP'));

CREATE OR REPLACE FUNCTION queue_confirmed_package_email() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE preference text := COALESCE(NEW.answers->>'packagePreference', '');
BEGIN
  IF preference IN ('', 'Start', 'Pro', 'VIP') THEN
    INSERT INTO consultation_package_emails(application_id, email, package_preference)
    VALUES (NEW.id, NEW.email, preference) ON CONFLICT (application_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
