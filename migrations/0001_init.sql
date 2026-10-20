CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin','customer')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('land','house','apartment')),
  category TEXT,
  title TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  price_label TEXT,
  description TEXT,
  facilities TEXT NOT NULL DEFAULT '[]',
  down_payment_pct INTEGER,
  months INTEGER,
  map_url TEXT,
  cover TEXT,
  images TEXT NOT NULL DEFAULT '[]',
  brochure TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','available','sold')),
  featured INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_listings_browse ON listings (type, status, district, price);

CREATE TABLE banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slot TEXT NOT NULL CHECK (slot IN ('hero','home_banner','listing_inline')),
  title TEXT NOT NULL,
  body TEXT,
  cta_label TEXT,
  cta_url TEXT,
  image TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  starts_at TEXT,
  ends_at TEXT,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seller_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  extent TEXT,
  price TEXT,
  description TEXT,
  images TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- after-sales
CREATE TABLE purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
  lot TEXT,
  total INTEGER NOT NULL,
  stage INTEGER NOT NULL DEFAULT 0,
  next_due_on TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_purchases_user ON purchases (user_id);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id INTEGER NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  paid_on TEXT NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  receipt TEXT
);
CREATE INDEX idx_payments_purchase ON payments (purchase_id);

CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id INTEGER NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_documents_purchase ON documents (purchase_id);

CREATE TABLE tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purchase_id INTEGER REFERENCES purchases(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE ticket_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_role TEXT NOT NULL CHECK (author_role IN ('admin','customer')),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
