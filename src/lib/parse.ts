// Turns a pasted WhatsApp listing message into a draft listing. Pure functions, no runtime imports, so it can be unit tested.

export type Parsed = {
  title: string; type: 'land' | 'house' | 'apartment'; district: string; city: string; price: number; price_label: string;
  extent: string; description: string; facilities: string[];
};

const UNIT: Record<string, number> = { lakh: 1e5, lakhs: 1e5, lk: 1e5, lks: 1e5, l: 1e5, million: 1e6, mn: 1e6, m: 1e6, k: 1e3, cr: 1e7, crore: 1e7 };

/** "5.5 lakhs", "Rs. 1,250,000", "12M" → rupees. Prefers amounts written next to "perch" or "price". */
export function findPrice(text: string): { price: number; perPerch: boolean } {
  const re = /(?:rs\.?|lkr|රු\.?)?\s*(\d[\d,]*(?:\.\d+)?)\s*(lakhs?|lks?|lk|million|mn|crore|cr|m|k|l)?\b/gi;
  const found: { value: number; score: number; perPerch: boolean }[] = [];
  for (const m of text.matchAll(re)) {
    const num = parseFloat(m[1].replace(/,/g, ''));
    const unit = (m[2] ?? '').toLowerCase();
    const value = Math.round(num * (UNIT[unit] ?? 1));
    const after = text.slice(m.index! + m[0].length, m.index! + m[0].length + 24).toLowerCase();
    const before = text.slice(Math.max(0, m.index! - 24), m.index!).toLowerCase();
    const isExtent = /^\s*(perch|perches|acre|acres|rood|roods|sq|sqft|bed|bath|ft|feet|km|min|m\b)/.test(after) || /^\s*(perch|p\b)/.test(after);
    if (isExtent || value < 10000 || /^(0\d{9}|94\d{9})$/.test(m[1].replace(/[,\s]/g, ''))) continue; // sizes, phone numbers
    let score = 0;
    if (/rs|lkr|රු|price|only/.test(before)) score += 2;
    if (/per\s*perch|\/\s*perch|perch/.test(after)) score += 3;
    if (unit) score += 1;
    found.push({ value, score, perPerch: /per\s*perch|\/\s*perch|perch\s*(rate|price)/.test(after + before) });
  }
  found.sort((a, b) => b.score - a.score);
  const best = found[0];
  return { price: best?.value ?? 0, perPerch: best?.perPerch ?? /per\s*perch/i.test(text) };
}

export function parseListing(raw: string, districts: string[]): Parsed {
  const text = raw.replace(/\r/g, '').replace(/[*_~]/g, '').trim();
  const lower = text.toLowerCase();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const district = districts.find((d) => new RegExp(`\\b${d}\\b`, 'i').test(text)) ?? '';
  const type = /\b(apartment|flat|condo)\b/.test(lower) ? 'apartment' : /\b(house|villa|bungalow|bedrooms?|bed\s*rooms?)\b/.test(lower) ? 'house' : 'land';
  const { price, perPerch } = findPrice(text);
  const perch = text.match(/(\d+(?:\.\d+)?)\s*(?:-|to)?\s*(\d+(?:\.\d+)?)?\s*(?:perch(?:es)?|p\b)/i);
  const acre = text.match(/(\d+(?:\.\d+)?)\s*acres?/i);
  const extent = perch ? `${perch[1]}${perch[2] ? ' to ' + perch[2] : ''} perches` : acre ? `${acre[1]} acres` : '';
  const facilities = [
    /\b(clear|freehold|sinnakkara)\b.*\b(deed|title)\b|\b(deed|title)\b.*\b(clear|freehold)\b|\bclear\s*(deed|title)\b/i.test(text) && 'Clear title',
    /\bsurvey\s*plan\b/i.test(text) && 'Survey plan',
    /\bapproved\b/i.test(text) && 'Approved plan',
    /\b(electricity|current|power)\b/i.test(text) && 'Electricity',
    /\b(water|pipe[- ]?borne)\b/i.test(text) && 'Water',
    /\b(tarred|carpeted|paved|main)\s*road\b/i.test(text) && 'Tarred road',
  ].filter(Boolean) as string[];
  const clean = (s: string) => s.replace(/^[^\p{L}\p{N}]+/u, '').replace(/\s+/g, ' ').trim();
  const boiler = /^(urgent\s+)?(land|house|apartment|plots?|property|villa)?\s*(for\s+sale|available|sale|new)?\W*$/i;
  let title = clean(lines.find((l) => /\p{L}/u.test(l) && !boiler.test(clean(l).replace(/[^\p{L}\p{N}\s]/gu, '').trim()) && !/^(rs|lkr|price|call|contact|\+?\d)/i.test(clean(l))) ?? '');
  title = title.replace(/^(for sale|urgent sale)[:\-\s]*/i, '').slice(0, 100);
  if (!title) title = `${type === 'land' ? 'Land' : type === 'house' ? 'House' : 'Apartment'} for sale${district ? ' in ' + district : ''}`;
  return { title, type, district, city: '', price, price_label: type === 'land' ? (perPerch || /perch/i.test(text) ? 'per perch' : 'total price') : 'total price', extent, description: text.slice(0, 5000), facilities };
}
