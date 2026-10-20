import { useState } from 'react';

const monthly = (loan: number, years: number, ratePct: number) => {
  const n = years * 12, r = ratePct / 100 / 12;
  if (n <= 0 || loan <= 0) return 0;
  return r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
};

export default function LoanCalc({ price }: { price: number }) {
  const [loan, setLoan] = useState(Math.round(price * 0.7));
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const m = monthly(loan, years, rate);
  const num = (set: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => set(Number(e.target.value.replace(/[^\d.]/g, '')) || 0);
  return (
    <div className="panel">
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>Loan calculator</h2>
      <div className="row" style={{ alignItems: 'flex-end' }}>
        <label className="field" style={{ flex: '1 1 140px' }}>Loan amount (LKR)<input inputMode="numeric" value={loan} onChange={num(setLoan)} /></label>
        <label className="field" style={{ flex: '1 1 100px' }}>Years<input inputMode="numeric" value={years} onChange={num(setYears)} /></label>
        <label className="field" style={{ flex: '1 1 100px' }}>Rate %<input inputMode="decimal" value={rate} onChange={num(setRate)} /></label>
        <div style={{ flex: '1 1 200px', background: '#EAF1FF', borderRadius: 10, padding: '10px 16px' }} aria-live="polite">
          <div className="muted" style={{ fontSize: 12, fontWeight: 600 }}>Monthly payment</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, color: '#0F2F7A' }}>LKR {Math.round(m).toLocaleString('en-LK')}</div>
        </div>
      </div>
      <p className="muted" style={{ fontSize: 12, margin: '12px 0 0' }}>Estimate only. Actual rates depend on your bank.</p>
    </div>
  );
}
