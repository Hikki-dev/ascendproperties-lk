import { all, one } from './db';

const PAGE = 15; // 15 + 1 inline ad = 16 cells per page like the reference site

export type Filters = { type: string; category?: string; district?: string; city?: string; min?: number; max?: number; q?: string; page?: number };

export async function browse(f: Filters) {
  const where = ["status IN ('available','sold')", 'type = ?', "(published_at IS NULL OR published_at <= datetime('now'))"];
  const p: unknown[] = [f.type];
  if (f.category) { where.push('category = ?'); p.push(f.category); }
  if (f.district) { where.push('district = ?'); p.push(f.district); }
  if (f.city) { where.push('city LIKE ?'); p.push(`%${f.city}%`); }
  if (f.min) { where.push('price >= ?'); p.push(f.min); }
  if (f.max) { where.push('price <= ?'); p.push(f.max); }
  if (f.q) { where.push('(title LIKE ? OR city LIKE ?)'); p.push(`%${f.q}%`, `%${f.q}%`); }
  const W = where.join(' AND ');
  const page = Math.max(1, f.page || 1);
  const total = (await one<{ n: number }>(`SELECT COUNT(*) n FROM listings WHERE ${W}`, ...p))!.n;
  const rows = await all(`SELECT * FROM listings WHERE ${W} ORDER BY status='sold', featured DESC, published_at DESC, id DESC LIMIT ? OFFSET ?`, ...p, PAGE, (page - 1) * PAGE);
  return { rows, total, pages: Math.max(1, Math.ceil(total / PAGE)), page };
}

export const latest = (limit = 8) =>
  all(`SELECT * FROM listings WHERE status='available' AND (published_at IS NULL OR published_at <= datetime('now')) ORDER BY published_at DESC, id DESC LIMIT ?`, limit);

export const featured = (type: string, limit = 4) =>
  all(`SELECT * FROM listings WHERE status='available' AND type=? ORDER BY featured DESC, published_at DESC LIMIT ?`, type, limit);

export const bySlug = (slug: string) => one(`SELECT * FROM listings WHERE slug = ? AND status IN ('available','sold')`, slug);

export const activeBanners = (slot: string) =>
  all(`SELECT * FROM banners WHERE slot=? AND active=1 AND (starts_at IS NULL OR starts_at='' OR starts_at<=date('now')) AND (ends_at IS NULL OR ends_at='' OR ends_at>=date('now')) ORDER BY sort, id`, slot);

export const counts = () =>
  all<{ type: string; n: number }>(`SELECT type, COUNT(*) n FROM listings WHERE status='available' GROUP BY type`);
