-- Richer, less generic listings: videos, highlights, nearby places, and per-lot pricing (JSON columns).
ALTER TABLE listings ADD COLUMN video_url TEXT;
ALTER TABLE listings ADD COLUMN highlights TEXT NOT NULL DEFAULT '[]';
ALTER TABLE listings ADD COLUMN places TEXT NOT NULL DEFAULT '[]';
ALTER TABLE listings ADD COLUMN lots TEXT NOT NULL DEFAULT '[]';
ALTER TABLE banners ADD COLUMN video_url TEXT;
