-- Update English translation for gommone category: "RIB / Dinghy" → "Rubber dinghy"
update public.vehicle_categories
set name_en = 'Rubber dinghy'
where slug = 'gommone';
