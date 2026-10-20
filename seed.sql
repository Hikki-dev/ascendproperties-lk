-- SAMPLE DATA for local dev only. Names/prices are placeholders; delete via /admin before launch.
INSERT INTO listings (slug,type,category,title,district,city,price,price_label,description,facilities,down_payment_pct,months,status,featured,published_at) VALUES
('sample-land-one','land','Coconut Land','Sample Land One – Galle','Galle','Habaraduwa',550000,'per perch upwards','Sample description. Replace in admin.','["Electricity","Water","Tarred road"]',20,24,'available',1,datetime('now')),
('sample-land-two','land','Residential','Sample Land Two – Kandy','Kandy','Peradeniya',920000,'per perch','Sample description. Replace in admin.','["Electricity","Clear title"]',25,36,'available',1,datetime('now','-1 day')),
('sample-land-three','land','Water Front Land','Sample Land Three – Colombo','Colombo','Boralesgamuwa',2565000,'per perch','Sample description. Replace in admin.','["Water","Tarred road","Clear title"]',30,12,'available',0,datetime('now','-2 day')),
('sample-house-one','house',NULL,'Sample House One – Gampaha','Gampaha','Kadawatha',22500000,NULL,'Sample description. Replace in admin.','["Parking","Garden"]',NULL,NULL,'available',1,datetime('now','-3 day')),
('sample-apartment-one','apartment',NULL,'Sample Apartment One – Colombo','Colombo','Thalawathugoda',59000000,NULL,'Sample description. Replace in admin.','["Lift","Pool","Gym"]',NULL,NULL,'available',1,datetime('now','-4 day'));

INSERT INTO banners (slot,title,body,cta_label,cta_url,active,sort) VALUES
('home_banner','Sample campaign headline','Edit or replace this banner in Admin → Banners & ads.','Browse lands','/lands',1,0),
('listing_inline','Sample sponsored slot','Shown inside the listings grid.','Learn more','/contact',1,0);
