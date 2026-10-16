-- Older Send Key clients predate payment-page candidate registration.
-- Preserve their private access, messages and bookings; only add missing cases.
INSERT INTO consultation_attempts (id, email, answers, submitted_at, status, last_step)
SELECT gen_random_uuid(), client.email,
  jsonb_build_object(
    'email', client.email,
    'name', btrim(client.name),
    'packagePreference', CASE client.tier WHEN 'START' THEN 'Start' WHEN 'PRO' THEN 'Pro' ELSE 'VIP' END
  ), client.created_at, 'payment', 'payment:' || client.tier
FROM private_clients client
WHERE btrim(client.name) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM consultation_attempts attempt WHERE lower(attempt.email) = lower(client.email)
  );
