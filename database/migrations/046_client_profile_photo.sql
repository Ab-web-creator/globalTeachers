ALTER TABLE private_clients
  ADD COLUMN profile_photo bytea,
  ADD COLUMN profile_photo_type text CHECK (profile_photo_type IN ('image/jpeg', 'image/png', 'image/webp')),
  ADD CONSTRAINT private_client_photo_size CHECK (octet_length(profile_photo) <= 2097152),
  ADD CONSTRAINT private_client_photo_pair CHECK ((profile_photo IS NULL) = (profile_photo_type IS NULL));
