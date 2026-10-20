import { useRef, useState } from 'react';
import { strFromU8, unzipSync } from 'fflate';
import { findListings, isImage, parseChat } from '../lib/chat';
import { parseListing } from '../lib/parse';
import { DISTRICTS } from '../lib/pure';

type Item = { text: string; files: string[]; title: string; price: number; district: string; extent: string; on: boolean };
const base = (n: string) => n.split('/').pop()!;

async function toJpeg(bytes: Uint8Array): Promise<Blob> {
  const bmp = await createImageBitmap(new Blob([bytes as BlobPart]));
  const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), 'image/jpeg', 0.82));
}

/** Reads a WhatsApp "Export chat" .zip in the browser, finds the listing posts and their photos, and makes hidden drafts. */
export default function ChatImport() {
  const zip = useRef<Uint8Array | null>(null);
  const names = useRef<Map<string, string>>(new Map());
  const [items, setItems] = useState<Item[]>([]);
  const [stage, setStage] = useState<'pick' | 'found' | 'working' | 'done'>('pick');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [made, setMade] = useState(0);

  async function pick(file?: File) {
    if (!file) return;
    setError(''); setMsg('Reading your chat…');
    try {
      let chatText = '';
      names.current = new Map();
      if (/\.txt$/i.test(file.name)) { chatText = await file.text(); zip.current = null; }
      else {
        const u8 = new Uint8Array(await file.arrayBuffer());
        zip.current = u8;
        const files = unzipSync(u8, { filter: (f) => { names.current.set(base(f.name), f.name); return /\.txt$/i.test(f.name); } });
        const biggest = Object.entries(files).sort((a, b) => b[1].length - a[1].length)[0];
        if (!biggest) throw new Error('no chat file');
        chatText = strFromU8(biggest[1]);
      }
      const found = findListings(parseChat(chatText)).map((f) => {
        const p = parseListing(f.text, DISTRICTS);
        const files = f.files.filter((n) => names.current.has(n));
        return { text: f.text, files, title: p.title, price: p.price, district: p.district, extent: p.extent, on: true };
      });
      setItems(found);
      setStage('found');
      setMsg('');
      if (!found.length) setError('We could not find any listing messages. A listing message needs a price (like “Rs 5.5 lakhs per perch”) or a size in perches.');
    } catch {
      setMsg(''); setError('We could not read that file. Please choose the .zip you got from WhatsApp “Export chat”.');
    }
  }

  async function create() {
    const chosen = items.filter((i) => i.on);
    if (!chosen.length) return;
    setStage('working');
    const payload: { text: string; photos: string[] }[] = [];
    let done = 0; const total = chosen.reduce((n, i) => n + Math.min(i.files.length, 12), 0);
    for (const it of chosen) {
      const wanted = new Set(it.files.slice(0, 12).map((n) => names.current.get(n)!));
      const photos: string[] = [];
      if (zip.current && wanted.size) {
        const got = unzipSync(zip.current, { filter: (f) => wanted.has(f.name) });
        for (const n of it.files.slice(0, 12)) {
          const bytes = got[names.current.get(n)!];
          done++; setMsg(`Uploading photos ${done} of ${total}…`);
          if (!bytes || bytes.length < 5000 || !isImage(n)) continue; // skip stickers and thumbnails
          try {
            const fd = new FormData();
            fd.set('file', new File([await toJpeg(bytes)], 'img.jpg', { type: 'image/jpeg' }));
            const r = await fetch('/admin/api/upload', { method: 'POST', body: fd });
            if (r.ok) photos.push(((await r.json()) as { key: string }).key);
          } catch { /* skip a photo that will not decode */ }
        }
      }
      payload.push({ text: it.text, photos });
    }
    setMsg('Saving drafts…');
    const r = await fetch('/admin/api/import-batch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: payload }) });
    if (!r.ok) { setError('Saving failed. Please try again.'); setStage('found'); setMsg(''); return; }
    setMade(((await r.json()) as { created: number }).created);
    setMsg(''); setStage('done');
  }

  const set = (i: number, on: boolean) => setItems(items.map((x, j) => (j === i ? { ...x, on } : x)));
  const picked = items.filter((i) => i.on).length;

  return (
    <div className="stack">
      {stage === 'pick' && (
        <>
          <label className="upload-zone" style={{ display: 'block' }}>
            <strong>Choose the WhatsApp export file (.zip)</strong>
            <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Nothing is shared until you press “Create drafts”</div>
            <input type="file" accept=".zip,.txt,application/zip" onChange={(e) => pick(e.target.files?.[0])} style={{ marginTop: 12 }} />
          </label>
          {msg && <p className="notice" role="status">{msg}</p>}
        </>
      )}
      {error && <p className="notice err" role="alert">{error}</p>}
      {stage === 'found' && items.length > 0 && (
        <>
          <p style={{ margin: 0 }}><b>{items.length}</b> {items.length === 1 ? 'listing' : 'listings'} found. Untick any you do not want.</p>
          <div className="stack" style={{ gap: 10 }}>
            {items.map((it, i) => (
              <label key={i} className="panel" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: 16, cursor: 'pointer' }}>
                <input type="checkbox" checked={it.on} onChange={(e) => set(i, e.target.checked)} style={{ marginTop: 4 }} />
                <span style={{ minWidth: 0 }}>
                  <b>{it.title}</b><br />
                  <span className="muted" style={{ fontSize: 14 }}>
                    {[it.district || 'District not found', it.extent, it.price ? `LKR ${it.price.toLocaleString('en-LK')}` : 'Price not found', `${it.files.length} ${it.files.length === 1 ? 'photo' : 'photos'}`].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <div className="row">
            <button type="button" className="btn lg" disabled={!picked} onClick={create}>Create {picked} {picked === 1 ? 'draft' : 'drafts'}</button>
            <button type="button" className="btn ghost lg" onClick={() => { setStage('pick'); setItems([]); setError(''); }}>Start again</button>
          </div>
        </>
      )}
      {stage === 'found' && items.length === 0 && <button type="button" className="btn ghost lg" style={{ alignSelf: 'flex-start' }} onClick={() => { setStage('pick'); setError(''); }}>Try another file</button>}
      {stage === 'working' && <p className="notice" role="status">{msg || 'Working…'} Please keep this page open.</p>}
      {stage === 'done' && (
        <div className="stack">
          <p className="notice" role="status">{made} {made === 1 ? 'draft' : 'drafts'} created and hidden from the website.</p>
          <a className="btn lg" style={{ alignSelf: 'flex-start' }} href="/admin/listings">Review and publish them</a>
        </div>
      )}
    </div>
  );
}
