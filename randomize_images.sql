-- Create a function to get random photos from a pool
CREATE OR REPLACE FUNCTION get_random_photos(category text) RETURNS text[] AS $$
DECLARE
    apartment_pool text[] := ARRAY[
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
        'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80',
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80'
    ];
    house_pool text[] := ARRAY[
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80', 
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80',
        'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80',
        'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1200&q=80'
    ];
    land_pool text[] := ARRAY[
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
        'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=1200&q=80',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80',
        'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=1200&q=80',
        'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=1200&q=80'
    ];
    shuffled_pool text[];
BEGIN
    IF category = 'Apartment' THEN
        -- Select 3 random unique images
        SELECT array_agg(elem) INTO shuffled_pool 
        FROM (SELECT unnest(apartment_pool) AS elem ORDER BY random() LIMIT 3) AS t;
    ELSIF category = 'House' THEN
        SELECT array_agg(elem) INTO shuffled_pool 
        FROM (SELECT unnest(house_pool) AS elem ORDER BY random() LIMIT 3) AS t;
    ELSIF category = 'Land' THEN
        SELECT array_agg(elem) INTO shuffled_pool 
        FROM (SELECT unnest(land_pool) AS elem ORDER BY random() LIMIT 3) AS t;
    ELSE
         SELECT array_agg(elem) INTO shuffled_pool 
        FROM (SELECT unnest(house_pool) AS elem ORDER BY random() LIMIT 3) AS t;
    END IF;
    
    RETURN shuffled_pool;
END;
$$ LANGUAGE plpgsql;

-- Apply Updates Row-by-Row to ensure randomness per row
UPDATE properties SET photos = get_random_photos('Apartment')
WHERE title ILIKE '%Apartment%' OR title ILIKE '%Condo%' OR title ILIKE '%Flat%' OR propert_type_text = 'Apartment';

UPDATE properties SET photos = get_random_photos('House')
WHERE title ILIKE '%Villa%' OR title ILIKE '%House%' OR title ILIKE '%Home%' OR title ILIKE '%Bungalow%' OR propert_type_text = 'House';

UPDATE properties SET photos = get_random_photos('Land')
WHERE title ILIKE '%Land%' OR propert_type_text = 'Land';

-- Catch all fallback
UPDATE properties SET photos = get_random_photos('House')
WHERE array_length(photos, 1) IS NULL;

-- Cleanup
DROP FUNCTION IF EXISTS get_random_photos(text);
