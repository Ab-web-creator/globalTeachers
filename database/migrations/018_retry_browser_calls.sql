ALTER TABLE browser_calls DROP CONSTRAINT browser_calls_state_check;
ALTER TABLE browser_calls ADD CONSTRAINT browser_calls_state_check
  CHECK (state IN ('waiting','ringing','accepted','declined','ended','revoked'));
