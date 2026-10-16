-- Payment is an explicit administrator decision, independent of email verification.
ALTER TABLE private_clients ADD COLUMN paid_at timestamptz;

-- Every private client also belongs to the main cases list, including Send Key users.
CREATE FUNCTION ensure_private_client_case() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('payment-case:' || lower(NEW.email), 0));
  IF btrim(NEW.name) <> '' AND NOT EXISTS (
    SELECT 1 FROM consultation_attempts WHERE lower(email) = lower(NEW.email)
  ) THEN
    INSERT INTO consultation_attempts(id,email,answers,submitted_at,status,last_step)
    VALUES(gen_random_uuid(),lower(NEW.email),jsonb_build_object(
      'email',lower(NEW.email),'name',btrim(NEW.name),
      'packagePreference',CASE NEW.tier WHEN 'START' THEN 'Start' WHEN 'PRO' THEN 'Pro' ELSE 'VIP' END
    ),NEW.created_at,'payment','payment:' || NEW.tier);
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER private_client_case AFTER INSERT ON private_clients
FOR EACH ROW EXECUTE FUNCTION ensure_private_client_case();
