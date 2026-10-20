// Reads a WhatsApp "Export chat" text file (Android or iPhone, any language setting) and finds listing posts with their photos.
// Pure functions, no runtime imports.
import { findPrice } from './parse.ts';

export type Msg = { t: number; who: string; text: string; files: string[] };
export type Found = { text: string; files: string[]; when: number };

const IOS = /^‎?\[(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::\d{2})?\s?([AaPp]\.?[Mm]\.?)?\]\s+([^:]+?):\s?(.*)$/;
const ANDROID = /^‎?(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::\d{2})?\s?([AaPp]\.?[Mm]\.?)?\s+-\s+([^:]+?):\s?(.*)$/;
const FILE = /(?:<attached:\s*([^>]+)>|([^\s<>]+\.(?:jpe?g|png|webp|gif|mp4|pdf|opus|vcf))\s*\((?:file attached|attached)\))/gi;
const IMG = /\.(jpe?g|png|webp)$/i;

export const isImage = (name: string) => IMG.test(name);

/** Split the export into messages. Continuation lines are joined to the previous message. */
export function parseChat(raw: string): Msg[] {
  const rows: { a: number; b: number; c: number; h: number; m: number; ap: string; who: string; text: string }[] = [];
  for (const line of raw.replace(/\r/g, '').split('\n')) {
    const m = IOS.exec(line) ?? ANDROID.exec(line);
    if (m) rows.push({ a: +m[1], b: +m[2], c: +m[3], h: +m[4], m: +m[5], ap: (m[6] ?? '').toLowerCase().replace(/[.\s]/g, ''), who: m[7].trim(), text: m[8] });
    else if (rows.length && line.trim()) rows[rows.length - 1].text += '\n' + line.replace(/^‎/, '');
  }
  // 12/31 → month first; otherwise Sri Lankan default day first
  const monthFirst = rows.some((r) => r.a > 12) ? false : rows.some((r) => r.b > 12);
  return rows.map((r) => {
    const day = monthFirst ? r.b : r.a, month = monthFirst ? r.a : r.b;
    let h = r.h; if (r.ap === 'pm' && h < 12) h += 12; if (r.ap === 'am' && h === 12) h = 0;
    const year = r.c < 100 ? 2000 + r.c : r.c;
    const t = Math.floor(Date.UTC(year, month - 1, day, h, r.m) / 60000);
    const files: string[] = [];
    const text = r.text.replace(FILE, (_x, a, b) => { files.push((a ?? b).trim()); return ''; }).replace(/‎/g, '').replace(/<Media omitted>|image omitted|video omitted|sticker omitted/gi, '').trim();
    return { t, who: r.who, text, files };
  });
}

const looksLikeListing = (text: string) => text.length >= 25 && (findPrice(text).price > 0 || /\bperch(es)?\b/i.test(text)) && !/^\s*(how much|is it available|available\?)/i.test(text);

/** Listing posts, each with the photos the same person sent within `windowMin` minutes. */
export function findListings(msgs: Msg[], windowMin = 15): Found[] {
  const posts = msgs.map((m, i) => ({ m, i })).filter(({ m }) => looksLikeListing(m.text));
  const seen = new Set<string>(), out: (Found & { who: string })[] = [];
  for (const { m } of posts) {
    const key = m.text.toLowerCase().replace(/\W+/g, ' ').slice(0, 200);
    if (seen.has(key)) continue; // same ad posted twice
    seen.add(key);
    out.push({ text: m.text, files: m.files.filter(isImage), when: m.t, who: m.who });
  }
  const taken = new Set<string>(out.flatMap((o) => o.files));
  for (const m of msgs) {
    for (const f of m.files.filter((x) => isImage(x) && !taken.has(x))) {
      let best: (typeof out)[number] | null = null, d = Infinity;
      for (const o of out) { const diff = Math.abs(o.when - m.t); if (o.who === m.who && diff <= windowMin && diff < d) { best = o; d = diff; } }
      if (best && best.files.length < 12) { best.files.push(f); taken.add(f); }
    }
  }
  return out.map(({ text, files, when }) => ({ text, files, when }));
}
