import { useMemo, useState } from 'react';
import { FileSignature } from 'lucide-react';
import { fmtInr } from '../../utils/financeCalculators.js';

const inputCls =
  'mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-gold/30 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white';

const labelCls =
  'text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400';

const PRESETS = [
  { label: 'Custom', stamp: '', reg: '' },
  { label: 'Illustrative — ~6% stamp + ~1% registration', stamp: '6', reg: '1' },
  { label: 'Illustrative — ~7% combined style (manual split)', stamp: '6.5', reg: '0.5' },
  { label: 'Illustrative — urban leasehold heavy stamp', stamp: '7', reg: '1' },
];

export default function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState('9000000');
  const [stampPct, setStampPct] = useState('6');
  const [regPct, setRegPct] = useState('1');
  const [presetIdx, setPresetIdx] = useState(1);

  const out = useMemo(() => {
    const v = Number(propertyValue) || 0;
    const s = (Number(stampPct) || 0) / 100;
    const r = (Number(regPct) || 0) / 100;
    const stampDuty = v * s;
    const registration = v * r;
    return {
      stampDuty,
      registration,
      totalGov: stampDuty + registration,
    };
  }, [propertyValue, stampPct, regPct]);

  function applyPreset(i) {
    setPresetIdx(i);
    const p = PRESETS[i];
    if (p.stamp !== '') setStampPct(p.stamp);
    if (p.reg !== '') setRegPct(p.reg);
  }

  return (
    <div id="stamp-duty" className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 dark:bg-gold/10">
          <FileSignature className="h-5 w-5 text-gold-dark dark:text-gold" aria-hidden />
        </div>
        <div>
          <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white md:text-3xl">
            Stamp duty &amp; registration
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Percentages diverge materially by circle, slab, buyer profile, deed type, municipal limits, concessions, and rebates — pick your state norms or enter exact counsel figures.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div>
            <label htmlFor="stamp-preset" className={labelCls}>
              Quick presets (illus. only — not jurisdictional advice)
            </label>
            <select
              id="stamp-preset"
              value={presetIdx}
              onChange={(e) => applyPreset(Number(e.target.value))}
              className={inputCls}
            >
              {PRESETS.map((p, i) => (
                <option key={p.label} value={i}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="stamp-value" className={labelCls}>
              Agreement consideration (₹)
            </label>
            <input
              id="stamp-value"
              type="number"
              inputMode="decimal"
              min={0}
              step={50000}
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="stamp-pct" className={labelCls}>
                Stamp duty (%)
              </label>
              <input
                id="stamp-pct"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.05}
                value={stampPct}
                onChange={(e) => {
                  setPresetIdx(0);
                  setStampPct(e.target.value);
                }}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="stamp-reg" className={labelCls}>
                Registration (%)
              </label>
              <input
                id="stamp-reg"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.05}
                value={regPct}
                onChange={(e) => {
                  setPresetIdx(0);
                  setRegPct(e.target.value);
                }}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <dl className="flex flex-col justify-center gap-4 rounded-xl border border-gold/20 bg-neutral-50 p-5 dark:border-gold/25 dark:bg-neutral-950/60">
          <div className="flex justify-between gap-4 text-sm">
            <dt className="text-neutral-600 dark:text-neutral-400">Estimated stamp duty</dt>
            <dd className="font-semibold tabular-nums text-neutral-900 dark:text-white">{fmtInr(out.stampDuty)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-sm border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <dt className="text-neutral-600 dark:text-neutral-400">Estimated registration</dt>
            <dd className="font-semibold tabular-nums text-neutral-900 dark:text-white">{fmtInr(out.registration)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Indicative govt levy total</dt>
            <dd className="font-sans text-2xl font-semibold tabular-nums text-gold-dark dark:text-gold">{fmtInr(out.totalGov)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
