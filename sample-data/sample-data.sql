-- Richer SAMPLE data for screenshots. Run after seed.sql (see sample-data/load.sh).
-- Everything here is made up. The photos are in sample-data/photos (credits in docs/Photo credits.md); the plot plan is drawn by sample-data/make_images.py.

UPDATE listings SET
  cover = 'pub/sample-galle-paddy.jpg',
  images = '["pub/sample-galle-paddy.jpg","pub/sample-plan.webp"]',
  extent = '12 plots, 10 to 20 perches',
  highlights = '["Clear deed, ready to build","Walking distance to the main road","Coconut trees on the boundary","Instalments with no bank loan"]',
  places = '["Habaraduwa junction – 4 min","Galle town – 20 min","Unawatuna beach – 12 min","Southern Expressway entrance – 25 min"]',
  lots = '[{"l":"Plot 1","p":12,"price":6600000,"s":"sold"},{"l":"Plot 2","p":10,"price":5500000,"s":"available"},{"l":"Plot 3","p":14.5,"price":8000000,"s":"reserved"},{"l":"Plot 4","p":15,"price":8250000,"s":"available"},{"l":"Plot 5","p":18,"price":9900000,"s":"available"},{"l":"Plot 6","p":20,"price":11000000,"s":"available"}]',
  description = 'A quiet coconut land a short drive from Galle, divided into plots. Every plot has electricity and water at the gate.'
WHERE slug = 'green-valley-galle';

UPDATE listings SET
  cover = 'pub/sample-kandy-tea.jpg',
  images = '["pub/sample-kandy-tea.jpg"]',
  highlights = '["Cool hill-country air","Clear deed","Tarred road to the gate"]',
  places = '["Peradeniya town – 8 min","University of Peradeniya – 10 min","Kandy city – 25 min"]'
WHERE slug = 'hill-view-kandy';

UPDATE listings SET
  cover = 'pub/sample-beira-lake.jpg',
  images = '["pub/sample-beira-lake.jpg"]',
  highlights = '["Waterfront, 60 feet of frontage","Tarred road","Clear title"]',
  places = '["Boralesgamuwa town – 6 min","Colombo Fort – 35 min"]'
WHERE slug = 'lake-side-colombo';

UPDATE listings SET
  cover = 'pub/sample-galle-house.jpg',
  images = '["pub/sample-galle-house.jpg"]',
  extent = '4 bedrooms, 12 perches',
  highlights = '["Garden and parking for two cars","Close to schools","Quiet lane"]',
  places = '["Kadawatha town – 7 min","Highway entrance – 10 min"]'
WHERE slug = 'family-home-gampaha';

UPDATE listings SET
  cover = 'pub/sample-towers-b.jpg',
  images = '["pub/sample-towers-b.jpg"]',
  extent = '3 bedrooms, 1,350 sq ft',
  highlights = '["Lift, pool and gym","Covered parking","Backup power"]',
  places = '["Thalawathugoda junction – 3 min","Colombo – 25 min"]'
WHERE slug = 'skyline-apartment-colombo';

INSERT INTO inquiries (listing_id, name, phone, email, message, status, created_at) VALUES
((SELECT id FROM listings WHERE slug='green-valley-galle'), 'Nimali Perera', '0771234567', 'nimali@example.com', 'Is Plot 4 still available? Can we visit on Saturday?', 'new', datetime('now','-1 hour')),
((SELECT id FROM listings WHERE slug='hill-view-kandy'), 'Ruwan Silva', '0712345678', NULL, 'What is the payment plan for 15 perches?', 'contacted', datetime('now','-1 day')),
((SELECT id FROM listings WHERE slug='skyline-apartment-colombo'), 'Fathima Rizwan', '0759876543', 'fathima@example.com', 'Please send the brochure.', 'closed', datetime('now','-3 day'));

INSERT INTO seller_leads (name, mobile, address, city, extent, price, description, status, created_at) VALUES
('Kasun Jayasinghe', '0701112233', 'Mirissa Road', 'Matara', '20 perches', 'LKR 4,500,000 per perch', 'Flat land, 80 feet from the main road. Electricity at the gate.', 'new', datetime('now','-2 hour')),
('Dilani Fernando', '0724445566', 'Temple Road', 'Kurunegala', '1 acre', 'Open to offers', 'Coconut and mango trees. Deed in my name.', 'contacted', datetime('now','-2 day'));
