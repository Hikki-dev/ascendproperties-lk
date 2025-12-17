-- 1. Apartments/Condos
UPDATE properties
SET photos = ARRAY[
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'
]
WHERE title ILIKE '%Apartment%' OR title ILIKE '%Condo%' OR title ILIKE '%Flat%' OR property_type::text ILIKE 'Apartment';

-- 2. Villas/Houses/Bungalows
UPDATE properties
SET photos = ARRAY[
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80', 
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80'
]
WHERE title ILIKE '%Villa%' OR title ILIKE '%House%' OR title ILIKE '%Home%' OR title ILIKE '%Bungalow%' OR property_type::text ILIKE 'House';

-- 3. Commercial/Office
UPDATE properties
SET photos = ARRAY[
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
  'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80'
]
WHERE title ILIKE '%Office%' OR title ILIKE '%Commercial%' OR property_type::text ILIKE 'Commercial';

-- 4. Land
UPDATE properties
SET photos = ARRAY[
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
  'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=1200&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80'
]
WHERE title ILIKE '%Land%' OR property_type::text ILIKE 'Land';

-- 5. Fix Broken Placeholders (from previous runs)
UPDATE properties
SET photos = ARRAY[
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80'
]
WHERE photos::text LIKE '%placehold.co%';

-- 6. CATCH-ALL: For any property that still has NO photos (NULL or Empty Array)
-- This ensures 100% coverage.
UPDATE properties
SET photos = ARRAY[
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80'
]
WHERE photos IS NULL OR photos = '{}' OR array_length(photos, 1) IS NULL;
