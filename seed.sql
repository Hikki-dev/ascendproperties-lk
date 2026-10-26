-- Starter data for local development only. The names and prices are made up; delete them in /admin before launch.
INSERT INTO listings (slug,type,category,title,district,city,price,price_label,description,facilities,down_payment_pct,months,status,featured,published_at) VALUES
('green-valley-galle','land','Coconut Land','Green Valley Plots, Habaraduwa','Galle','Habaraduwa',550000,'per perch upwards','Quiet residential plots a short walk from the road, ready to build.','["Electricity","Water","Tarred road"]',20,24,'available',1,datetime('now')),
('hill-view-kandy','land','Residential','Hill View Lands, Peradeniya','Kandy','Peradeniya',920000,'per perch','Cool-climate plots with a mountain view and year-round water.','["Electricity","Clear title"]',25,36,'available',1,datetime('now','-1 day')),
('lake-side-colombo','land','Water Front Land','Lake Side Residencies, Boralesgamuwa','Colombo','Boralesgamuwa',2565000,'per perch','Rare waterfront plots close to Colombo.','["Water","Tarred road","Clear title"]',30,12,'available',0,datetime('now','-2 day')),
('family-home-gampaha','house',NULL,'Family Home, Kadawatha','Gampaha','Kadawatha',22500000,NULL,'Four bedroom home with a garden, ready to move in.','["Parking","Garden"]',NULL,NULL,'available',1,datetime('now','-3 day')),
('skyline-apartment-colombo','apartment',NULL,'Skyline Apartment, Thalawathugoda','Colombo','Thalawathugoda',59000000,NULL,'Three bedroom apartment with a lift, pool and gym.','["Lift","Pool","Gym"]',NULL,NULL,'available',1,datetime('now','-4 day'));

INSERT INTO banners (slot,title,body,cta_label,cta_url,active,sort) VALUES
('home_banner','Find land you can pay for in instalments','Choose a plot, pay a deposit and the rest monthly. Ask our advisor on WhatsApp.','Browse lands','/lands',1,0),
('listing_inline','Not sure which plot to pick?','Tell our advisor your budget and the area. We send two or three that fit.','Message us','/contact',1,0);
