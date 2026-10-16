-- Existing browser calling is reused; appointment calls also require a client session.
ALTER TABLE browser_calls ADD COLUMN appointment_slot_id uuid UNIQUE REFERENCES appointment_slots(id);
