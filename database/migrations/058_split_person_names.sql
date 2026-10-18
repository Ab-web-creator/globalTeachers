-- First name and surname are stored separately. `name` remains the combined
-- display name: generated in tables, written alongside the parts in answers.
CREATE FUNCTION pg_temp.first_name(value text) RETURNS text LANGUAGE sql IMMUTABLE
AS $$ SELECT COALESCE(substring(btrim(value) FROM '^\S+'), '') $$;
CREATE FUNCTION pg_temp.last_name(value text) RETURNS text LANGUAGE sql IMMUTABLE
AS $$ SELECT COALESCE(btrim(regexp_replace(btrim(value), '^\S+\s*', '')), '') $$;

ALTER TABLE private_clients
  ADD COLUMN first_name text NOT NULL DEFAULT '',
  ADD COLUMN last_name text NOT NULL DEFAULT '';
UPDATE private_clients SET first_name = pg_temp.first_name(name), last_name = pg_temp.last_name(name);
ALTER TABLE private_clients DROP COLUMN name;
ALTER TABLE private_clients ADD COLUMN name text GENERATED ALWAYS AS (btrim(first_name || ' ' || last_name)) STORED;

ALTER TABLE payment_contact_requests
  ADD COLUMN first_name text NOT NULL DEFAULT '',
  ADD COLUMN last_name text NOT NULL DEFAULT '';
UPDATE payment_contact_requests SET first_name = pg_temp.first_name(name), last_name = pg_temp.last_name(name);
ALTER TABLE payment_contact_requests DROP COLUMN name;
ALTER TABLE payment_contact_requests ADD COLUMN name text GENERATED ALWAYS AS (btrim(first_name || ' ' || last_name)) STORED;

-- Backfilling answers must not re-run follow-up, history or email triggers.
ALTER TABLE consultation_attempts DISABLE TRIGGER USER;
ALTER TABLE consultation_pending DISABLE TRIGGER USER;
ALTER TABLE consultation_applications DISABLE TRIGGER USER;
UPDATE consultation_attempts SET answers = answers || jsonb_build_object(
  'firstName', pg_temp.first_name(answers->>'name'), 'lastName', pg_temp.last_name(answers->>'name'))
WHERE NOT answers ? 'firstName';
UPDATE consultation_pending SET answers = answers || jsonb_build_object(
  'firstName', pg_temp.first_name(answers->>'name'), 'lastName', pg_temp.last_name(answers->>'name'))
WHERE NOT answers ? 'firstName';
UPDATE consultation_applications SET answers = answers || jsonb_build_object(
  'firstName', pg_temp.first_name(answers->>'name'), 'lastName', pg_temp.last_name(answers->>'name'))
WHERE NOT answers ? 'firstName';
ALTER TABLE consultation_attempts ENABLE TRIGGER USER;
ALTER TABLE consultation_pending ENABLE TRIGGER USER;
ALTER TABLE consultation_applications ENABLE TRIGGER USER;

CREATE OR REPLACE FUNCTION ensure_private_client_case() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('payment-case:' || lower(NEW.email), 0));
  IF btrim(NEW.name) <> '' AND NOT EXISTS (
    SELECT 1 FROM consultation_attempts WHERE lower(email) = lower(NEW.email)
  ) THEN
    INSERT INTO consultation_attempts(id,email,answers,submitted_at,status,last_step)
    VALUES(gen_random_uuid(),lower(NEW.email),jsonb_build_object(
      'email',lower(NEW.email),'firstName',NEW.first_name,'lastName',NEW.last_name,'name',NEW.name,
      'packagePreference',CASE NEW.tier WHEN 'START' THEN 'Start' WHEN 'PRO' THEN 'Pro' ELSE 'VIP' END
    ),NEW.created_at,'payment','payment:' || NEW.tier);
  END IF;
  RETURN NEW;
END;
$$;
