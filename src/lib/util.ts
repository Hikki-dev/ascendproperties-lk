import { secrets, media } from './db';

export const DISTRICTS = ['Ampara','Anuradhapura','Badulla','Batticaloa','Colombo','Galle','Gampaha','Hambantota','Jaffna','Kalutara','Kandy','Kegalle','Kilinochchi','Kurunegala','Mannar','Matale','Matara','Monaragala','Mullaitivu','Nuwara Eliya','Polonnaruwa','Puttalam','Ratnapura','Trincomalee','Vavuniya'];
export const LAND_CATEGORIES = ['Land','Coconut Land','Water Front Land','Agriculture Land','Paddy field facing lands','Mountain view','Up country lands','Down south lands','Close to sacred / ancient city lands','Close to highways','Close to Airport','Close to railway stations','Residential','Commercial'];
export const FACILITIES = ['Clear title','Survey plan','Approved plan','Electricity','Water','Tarred road','Parking','Garden','Lift','Pool','Gym','Security'];
export const STAGES = ['Booking confirmed','Agreement signed','Payments in progress','Deed preparation','Handover'];
export const TYPES = { land: 'Lands', house: 'Houses', apartment: 'Apartments' } as const;
export type ListingType = keyof typeof TYPES;

export const lkr = (n: number) => new Intl.NumberFormat('en-LK').format(n);
export const dateFmt = (s?: string | null) => (s ? new Date(s.replace(' ', 'T') + (s.includes('T') ? '' : 'Z')).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'listing';

/** Safe parse of a JSON array column. */
export const arr = (s: unknown): string[] => {
  try { const v = JSON.parse(String(s ?? '[]')); return Array.isArray(v) ? v.map(String) : []; } catch { return []; }
};

export const mediaUrl = (key?: string | null) => (key ? `/media/${key}` : '');

/** Banner/ad links must be same-site paths or http(s); blocks javascript: URLs. */
export const safeUrl = (u?: string | null) => (u && /^(\/(?!\/)|https?:\/\/)/i.test(u) ? u : '#');

export const str = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? '').trim().slice(0, max);
export const int = (f: FormData, k: string) => {
  const n = parseInt(String(f.get(k) ?? '').replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
};

export async function verifyTurnstile(f: FormData, ip: string | null) {
  const secret = secrets().TURNSTILE_SECRET;
  if (!secret) return true; // not configured (local dev)
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', String(f.get('cf-turnstile-response') ?? ''));
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  return ((await r.json()) as { success?: boolean }).success === true;
}

const ALLOWED = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'application/pdf': 'pdf' } as const;

/** Store an uploaded file in R2. prefix: pub | priv | lead. Returns the key or null if rejected. */
export async function saveFile(file: File, prefix: 'pub' | 'priv' | 'lead', maxMB = 8) {
  const ext = ALLOWED[file.type as keyof typeof ALLOWED];
  if (!ext || file.size === 0 || file.size > maxMB * 1024 * 1024) return null;
  const key = `${prefix}/${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  await media().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  return key;
}

export const monthly = (loan: number, years: number, ratePct: number) => {
  const n = years * 12, r = ratePct / 100 / 12;
  if (n <= 0) return 0;
  return r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
};

/** "5.5 lakhs" / "1.2 million": how Sri Lankans say prices out loud. */
export const inWords = (n: number) => {
  const f = (x: number) => String(Math.round(x * 100) / 100).replace(/\.0+$/, '');
  if (n >= 10_000_000) return `${f(n / 1_000_000)} million`;
  if (n >= 100_000) return `${f(n / 100_000)} lakhs`;
  return '';
};

/** Normalise a Sri Lankan number to 94XXXXXXXXX, or '' if it can't be one. Accepts 077 123 4567, +94 77 123 4567, 94771234567, 0112 345 678. */
export const lkPhone = (raw: string) => {
  let d = raw.replace(/[^\d]/g, '');
  if (d.startsWith('0094')) d = d.slice(2);
  if (d.startsWith('0')) d = '94' + d.slice(1);
  else if (d.length === 9) d = '94' + d;
  return /^94[1-9]\d{8}$/.test(d) ? d : '';
};

export const mapLink = (u?: string | null) =>
  u && /^https:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(u) ? u : '';
