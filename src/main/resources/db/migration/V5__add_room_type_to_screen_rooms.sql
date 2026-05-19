-- V5__add_room_type_to_screen_rooms.sql

ALTER TABLE screen_rooms ADD COLUMN IF NOT EXISTS room_type VARCHAR(50) NOT NULL DEFAULT 'STANDARD';

-- Update existing seed rooms to their correct types
UPDATE screen_rooms SET room_type = 'IMAX' WHERE id = 1;
UPDATE screen_rooms SET room_type = 'GOLD_CLASS' WHERE id = 3;
UPDATE screen_rooms SET room_type = 'DELUXE' WHERE id = 7;
