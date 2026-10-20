import { useState } from 'react';

type Props = { price: number; perPerch: boolean; depositPct: number; months: number };
const lkr = (n: number) => Math.round(n).toLocaleString('en-LK');

/** "What you'd pay": price × plot size, deposit, and monthly instalment. */
export default function PlanCalc({ price, perPerch, depositPct, months }: Props) {
  const [perches, setPerches] = useState(10);
  const [m, setM] = useState(months);
  const total = price * (perPerch ? Math.max(1, perches) : 1);
  const deposit = (total * depositPct) / 100;
  const monthly = m > 0 ? (total - deposit) / m : 0;
  const stat = (label: string, value: string, strong = false) => (
    <div><div className="muted" style={{ fontSize: 13 }}>{label}</div><b style={{ fontSize: 20, color: strong ? 'var(--blue)' : undefined }}>{value}</b></div>
  );
  return (
    <div className="panel" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>
      {perPerch && (
        <label className="field">Plot size (perch)
          <input inputMode="numeric" value={perches} style={{ width: 120 }} onChange={(e) => setPerches(Number(e.target.value.replace(/\D/g, '')) || 0)} />
        </label>
      )}
      <label className="field">Pay over
        <select value={m} style={{ width: 160 }} onChange={(e) => setM(Number(e.target.value))}>
          {[...new Set([6, 12, 24, 36, months])].sort((a, b) => a - b).map((x) => <option key={x} value={x}>{x} months</option>)}
        </select>
      </label>
      <div aria-live="polite" style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
        {stat('Total', `LKR ${lkr(total)}`)}
        {stat(`Deposit (${depositPct}%)`, `LKR ${lkr(deposit)}`)}
        {stat('Per month', `LKR ${lkr(monthly)}`, true)}
      </div>
    </div>
  );
}
