-- Allow multiple schedule rows per (girl_id, date) with different area_id
-- Old: UNIQUE(girl_id, date)
-- New: UNIQUE(girl_id, date, area_id) with NULLS NOT DISTINCT

ALTER TABLE schedules DROP CONSTRAINT IF EXISTS schedules_girl_id_date_key;
ALTER TABLE schedules ADD CONSTRAINT schedules_girl_id_date_area_key
  UNIQUE NULLS NOT DISTINCT (girl_id, date, area_id);
