// Pure helpers: no runtime imports, so they can be unit tested with plain Node.

/** Safe parse of a JSON array column. */
export const arr = (s: unknown): string[] => {
  try { const v = JSON.parse(String(s ?? '[]')); return Array.isArray(v) ? v.map(String) : []; } catch { return []; }
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

const mapParts = (u?: string | null) => {
  try {
    const x = new URL(u ?? '');
    const h = x.hostname.toLowerCase().replace(/\.$/, '');
    const google = /^(www\.)?google\.(com|lk|co\.[a-z]{2}|com\.[a-z]{2}|[a-z]{2,3})$/.test(h);
    const short = h === 'maps.app.goo.gl' || (h === 'goo.gl' && x.pathname.startsWith('/maps'));
    if (x.protocol !== 'https:' || x.username || x.password) return null;
    if (short || (google && x.pathname.startsWith('/maps'))) return { url: x.href, embed: google && x.pathname.startsWith('/maps/embed') };
  } catch { /* not a URL */ }
  return null;
};

/** A Google Maps link we are willing to show as a button ('' if not exactly Google). */
export const mapLink = (u?: string | null) => mapParts(u)?.url ?? '';
/** An embeddable Google Maps URL for an iframe ('' otherwise). */
export const mapEmbed = (u?: string | null) => { const m = mapParts(u); return m?.embed ? m.url : ''; };

// ---- video links: YouTube, Facebook and TikTok only (hosts are matched exactly) ----
export type Video = { kind: 'youtube' | 'facebook' | 'tiktok'; embed: string; thumb: string };
export const video = (u?: string | null): Video | null => {
  try {
    const x = new URL(u ?? '');
    if (x.protocol !== 'https:') return null;
    const h = x.hostname.toLowerCase().replace(/^(www|m)\./, '');
    if (h === 'youtube.com' || h === 'youtu.be') {
      const id = h === 'youtu.be' ? x.pathname.slice(1) : x.searchParams.get('v') ?? x.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1] ?? '';
      return /^[\w-]{11}$/.test(id) ? { kind: 'youtube', embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` } : null;
    }
    if (h === 'facebook.com' || h === 'fb.watch') return { kind: 'facebook', embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(x.href)}&show_text=false&autoplay=true`, thumb: '' };
    if (h === 'tiktok.com') {
      const id = x.pathname.match(/\/video\/(\d{8,})/)?.[1];
      return id ? { kind: 'tiktok', embed: `https://www.tiktok.com/embed/v2/${id}`, thumb: '' } : null;
    }
  } catch { /* not a URL */ }
  return null;
};

// ---- lots: a land project is usually sold as numbered blocks ----
export type Lot = { l: string; p: number; price: number; s: 'available' | 'reserved' | 'sold' };
export const lots = (s: unknown): Lot[] => {
  try {
    return (JSON.parse(String(s ?? '[]')) as any[]).slice(0, 80).map((x) => ({
      l: String(x.l ?? '').slice(0, 30), p: Math.max(0, Number(x.p) || 0), price: Math.max(0, Math.round(Number(x.price) || 0)),
      s: (['available', 'reserved', 'sold'].includes(x.s) ? x.s : 'available') as Lot['s'],
    })).filter((x) => x.l);
  } catch { return []; }
};

/** One line per place: "Galle town – 12 min" → ['Galle town', '12 min']. */
export const places = (s: unknown): [string, string][] =>
  arr(s).map((line) => { const m = line.split(/\s+[–—-]\s+|\s*:\s*/); return [m[0], m.slice(1).join(' – ')] as [string, string]; }).filter(([a]) => a);

export const lines = (raw: string, max = 8, len = 120) => raw.split('\n').map((x) => x.replace(/^[\s•\-*✅✔]+/, '').trim().slice(0, len)).filter(Boolean).slice(0, max);
