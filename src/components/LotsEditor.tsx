import { useState } from 'react';

type Lot = { l: string; p: string; price: string; s: 'available' | 'reserved' | 'sold' };
const num = (v: string) => v.replace(/[^\d.]/g, '');

/** Table of numbered plots. Staff add rows; the list is sent as JSON in a hidden field. */
export default function LotsEditor({ initial }: { initial: { l: string; p: number; price: number; s: Lot['s'] }[] }) {
  const [rows, setRows] = useState<Lot[]>(initial.map((x) => ({ l: x.l, p: String(x.p || ''), price: String(x.price || ''), s: x.s })));
  const set = (i: number, patch: Partial<Lot>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const add = () => setRows([...rows, { l: `Plot ${rows.length + 1}`, p: '', price: '', s: 'available' }]);
  const out = rows.filter((r) => r.l.trim()).map((r) => ({ l: r.l.trim(), p: Number(r.p) || 0, price: Number(r.price) || 0, s: r.s }));
  return (
    <div className="stack" style={{ gap: 12 }}>
      <input type="hidden" name="lots" value={JSON.stringify(out)} />
      {rows.length === 0 && <p className="muted" style={{ margin: 0 }}>No plots yet. Add one row for each plot or block you are selling.</p>}
      {rows.map((r, i) => (
        <div key={i} className="lot-row">
          <label className="field">Plot<input value={r.l} maxLength={30} onChange={(e) => set(i, { l: e.target.value })} /></label>
          <label className="field">Size (perches)<input inputMode="decimal" value={r.p} onChange={(e) => set(i, { p: num(e.target.value) })} /></label>
          <label className="field">Price (rupees)<input inputMode="numeric" value={r.price} onChange={(e) => set(i, { price: num(e.target.value) })} /></label>
          <label className="field">Status
            <select value={r.s} onChange={(e) => set(i, { s: e.target.value as Lot['s'] })}><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select></label>
          <button type="button" className="btn danger sm" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label={`Remove ${r.l}`}>Remove</button>
        </div>
      ))}
      <button type="button" className="btn ghost" style={{ alignSelf: 'flex-start' }} onClick={add}>+ Add a plot</button>
    </div>
  );
}
