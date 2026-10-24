-- Puts the real sample photos on the four "Demo" listings of the LIVE demo site.
-- Run it only after this branch is merged AND deployed (the older deployed code cannot show a full https link):
--   npx wrangler d1 execute ascend-db --remote --file=demo/live-photos.sql
-- The photos are served from this repository on GitHub. Credits are in docs/Photo credits.md.
UPDATE listings SET cover = 'https://raw.githubusercontent.com/Hikki-dev/ascendproperties-lk/main/demo/photos/galle-paddy.jpg',
  images = '["https://raw.githubusercontent.com/Hikki-dev/ascendproperties-lk/main/demo/photos/galle-paddy.jpg","https://raw.githubusercontent.com/Hikki-dev/ascendproperties-lk/main/demo/photos/paddy-terraces.jpg"]' WHERE slug = 'demo-green-valley-galle';
UPDATE listings SET cover = 'https://raw.githubusercontent.com/Hikki-dev/ascendproperties-lk/main/demo/photos/kandy-tea.jpg',
  images = '["https://raw.githubusercontent.com/Hikki-dev/ascendproperties-lk/main/demo/photos/kandy-tea.jpg"]' WHERE slug = 'demo-hill-view-kandy';
UPDATE listings SET cover = 'https://raw.githubusercontent.com/Hikki-dev/ascendproperties-lk/main/demo/photos/beira-lake.jpg',
  images = '["https://raw.githubusercontent.com/Hikki-dev/ascendproperties-lk/main/demo/photos/beira-lake.jpg"]' WHERE slug = 'demo-lake-side-colombo';
UPDATE listings SET cover = 'https://raw.githubusercontent.com/Hikki-dev/ascendproperties-lk/main/demo/photos/galle-house.jpg',
  images = '["https://raw.githubusercontent.com/Hikki-dev/ascendproperties-lk/main/demo/photos/galle-house.jpg"]' WHERE slug = 'demo-family-home-kandy';
