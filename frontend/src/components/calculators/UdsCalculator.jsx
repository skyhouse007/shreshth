import { useMemo, useState } from 'react';
import { Layers } from 'lucide-react';

const inputCls =
  'mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-gold/30 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white';

const labelCls =
  'text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400';

/** UDS share of aggregate land attributable to one unit — proportionate to measured sale area (illustrative). */
export default function UdsCalculator() {
  const [totalLandSqft, setTotalLandSqft] = useState('24000');
  const [aggregateSaleSqft, setAggregateSaleSqft] = useState('180000');
  const [yourUnitSqft, setYourUnitSqft] = useState('1400');

  const out = useMemo(() => {
    const land = Number(totalLandSqft) || 0;
    const agg = Number(aggregateSaleSqft) || 0;
    const unit = Number(yourUnitSqft) || 0;
    const sharePct = agg > 0 ? (unit / agg) * 100 : 0;
    const uds = land > 0 && agg > 0 ? (unit / agg) * land : 0;
    return { sharePct, uds };
  }, [totalLandSqft, aggregateSaleSqft, yourUnitSqft]);

  return (
    <div id="uds" className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 dark:bg-gold/10">
          <Layers className="h-5 w-5 text-gold-dark dark:text-gold" aria-hidden />
        </div>
        <div>
          <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white md:text-3xl">
            Undivided share (UDS)
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Use identical units everywhere — commonly sale super-built totals from the allotment / registration schedules.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div>
            <label htmlFor="uds-land" className={labelCls}>
              Total underlying land parcel
            </label>
            <input
              id="uds-land"
              type="number"
              inputMode="decimal"
              min={0}
              value={totalLandSqft}
              onChange={(e) => setTotalLandSqft(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="uds-agg" className={labelCls}>
              Sum of sale floors for all units (aggregate)
            </label>
            <input
              id="uds-agg"
              type="number"
              inputMode="decimal"
              min={0}
              value={aggregateSaleSqft}
              onChange={(e) => setAggregateSaleSqft(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="uds-unit" className={labelCls}>
              Your unit sale floor
            </label>
            <input
              id="uds-unit"
              type="number"
              inputMode="decimal"
              min={0}
              value={yourUnitSqft}
              onChange={(e) => setYourUnitSqft(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <dl className="flex flex-col justify-center gap-4 rounded-xl border border-gold/20 bg-neutral-50 p-5 dark:border-gold/25 dark:bg-neutral-950/60">
          <div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Estimated UDS (area units)</dt>
            <dd className="font-sans text-3xl font-semibold tabular-nums text-gold-dark dark:text-gold">{out.uds.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <dt className="text-neutral-600 dark:text-neutral-400">Share of aggregate sale area</dt>
            <dd className="font-semibold tabular-nums text-neutral-900 dark:text-white">{out.sharePct.toFixed(4)}%</dd>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            Agreements may exclude amenity footprints or treat parking differently — this is algebraic proportion only.
          </p>
        </dl>
      </div>
    </div>
  );
}
