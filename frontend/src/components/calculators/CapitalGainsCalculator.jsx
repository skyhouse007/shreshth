import { useMemo, useState } from 'react';
import { Scale } from 'lucide-react';
import { CII_BY_FY_LABEL, fmtInr } from '../../utils/financeCalculators.js';

const inputCls =
  'mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-gold/30 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white';

const labelCls =
  'text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400';

/** Immovable property: long-term if held at least ~24 months (simplified eligibility). */
const LONG_TERM_MONTHS = 24;

function ciiForSelectIndex(selectIdx) {
  const row = CII_BY_FY_LABEL[selectIdx];
  return row?.[1] ?? 363;
}

export default function CapitalGainsCalculator() {
  const lastIdx = CII_BY_FY_LABEL.length - 1;

  const [monthsHeld, setMonthsHeld] = useState('36');
  const [purchaseCost, setPurchaseCost] = useState('8500000');
  const [improvementCost, setImprovementCost] = useState('350000');
  const [salePrice, setSalePrice] = useState('13000000');
  const [brokeragePct, setBrokeragePct] = useState('1');
  const [purchaseFyIdx, setPurchaseFyIdx] = useState(Math.max(0, lastIdx - 5));
  const [saleFyIdx, setSaleFyIdx] = useState(lastIdx);
  const [stcgSlabPct, setStcgSlabPct] = useState('30');

  const outcome = useMemo(() => {
    const trimmed = String(monthsHeld).trim();
    const holdingParsed = trimmed === '' ? NaN : Number(trimmed);

    const cost = Number(purchaseCost) || 0;
    const impr = Number(improvementCost) || 0;
    const sale = Number(salePrice) || 0;
    const br = (Number(brokeragePct) || 0) / 100;
    const netSale = Math.max(0, sale - sale * br);

    const ciiP = ciiForSelectIndex(purchaseFyIdx);
    const ciiS = ciiForSelectIndex(saleFyIdx);
    const idxRatio = ciiP > 0 ? ciiS / ciiP : 1;
    const indexedCost = Math.round(cost * idxRatio + impr * idxRatio);

    const useStcg = Number.isFinite(holdingParsed) && holdingParsed >= 0 && holdingParsed < LONG_TERM_MONTHS;

    let regime;
    let taxableGain;
    let taxEstimated;
    let indexedCostUsed;
    let isStcg;

    if (useStcg) {
      regime = `Short-term (under ${LONG_TERM_MONTHS} months)`;
      taxableGain = Math.max(0, netSale - cost - impr);
      const slab = (Number(stcgSlabPct) || 0) / 100;
      taxEstimated = taxableGain * slab;
      indexedCostUsed = cost + impr;
      isStcg = true;
    } else if (!Number.isFinite(holdingParsed) || trimmed === '') {
      regime = 'Long-term (enter holding months for ST/LT routing — illustrating LTCG indexation)';
      taxableGain = Math.max(0, netSale - indexedCost);
      taxEstimated = taxableGain * 0.2;
      indexedCostUsed = indexedCost;
      isStcg = false;
    } else {
      regime = `Long-term (${LONG_TERM_MONTHS}+ months, indexation illustrative)`;
      taxableGain = Math.max(0, netSale - indexedCost);
      taxEstimated = taxableGain * 0.2;
      indexedCostUsed = indexedCost;
      isStcg = false;
    }

    return {
      regime,
      taxableGain,
      taxEstimated,
      indexedCostUsed,
      netSale,
      isStcg,
    };
  }, [
    monthsHeld,
    purchaseCost,
    improvementCost,
    salePrice,
    brokeragePct,
    purchaseFyIdx,
    saleFyIdx,
    stcgSlabPct,
  ]);

  return (
    <div id="capital-gains" className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 dark:bg-gold/10">
          <Scale className="h-5 w-5 text-gold-dark dark:text-gold" aria-hidden />
        </div>
        <div>
          <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white md:text-3xl">
            Capital gains (property — illustrative)
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Real filings involve Section 54 exemptions, bifurcation, and CII year rules — verify with your CA.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div>
            <label htmlFor="cg-months" className={labelCls}>
              Holding period (months)
            </label>
            <input
              id="cg-months"
              type="number"
              inputMode="numeric"
              min={0}
              value={monthsHeld}
              onChange={(e) => setMonthsHeld(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
              Under {LONG_TERM_MONTHS} months: short-term style gain × your slab assumption. Above: simplified indexed LTCG
              at 20%.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cg-purchase" className={labelCls}>
                Purchase / cost (₹)
              </label>
              <input
                id="cg-purchase"
                type="number"
                inputMode="decimal"
                min={0}
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="cg-improve" className={labelCls}>
                Improvement cost (₹)
              </label>
              <input
                id="cg-improve"
                type="number"
                inputMode="decimal"
                min={0}
                value={improvementCost}
                onChange={(e) => setImprovementCost(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cg-sale" className={labelCls}>
                Sale consideration (₹)
              </label>
              <input
                id="cg-sale"
                type="number"
                inputMode="decimal"
                min={0}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="cg-broker" className={labelCls}>
                Brokerage / transfer (%)
              </label>
              <input
                id="cg-broker"
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.1}
                value={brokeragePct}
                onChange={(e) => setBrokeragePct(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cg-fyp" className={labelCls}>
                Purchase FY (CII)
              </label>
              <select
                id="cg-fyp"
                value={purchaseFyIdx}
                onChange={(e) => setPurchaseFyIdx(Number(e.target.value))}
                className={inputCls}
              >
                {CII_BY_FY_LABEL.map((row, i) => (
                  <option key={row[0]} value={i}>
                    {row[0]} · CII {row[1]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cg-fys" className={labelCls}>
                Sale FY (CII)
              </label>
              <select
                id="cg-fys"
                value={saleFyIdx}
                onChange={(e) => setSaleFyIdx(Number(e.target.value))}
                className={inputCls}
              >
                {CII_BY_FY_LABEL.map((row, i) => (
                  <option key={`s-${row[0]}`} value={i}>
                    {row[0]} · CII {row[1]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {outcome.isStcg ? (
            <div>
              <label htmlFor="cg-stcg-rate" className={labelCls}>
                Assumed ST slab on gain (%)
              </label>
              <input
                id="cg-stcg-rate"
                type="number"
                inputMode="decimal"
                min={0}
                max={45}
                step={0.5}
                value={stcgSlabPct}
                onChange={(e) => setStcgSlabPct(e.target.value)}
                className={inputCls}
              />
            </div>
          ) : null}
        </div>

        <dl className="flex flex-col justify-center gap-4 rounded-xl border border-gold/20 bg-neutral-50 p-5 dark:border-gold/25 dark:bg-neutral-950/60">
          <div>
            <dt className="text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400">Regime</dt>
            <dd className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">{outcome.regime}</dd>
          </div>
          <div className="flex flex-col gap-3 border-y border-neutral-200 py-4 dark:border-neutral-800">
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-neutral-600 dark:text-neutral-400">Net sale after brokerage</dt>
              <dd className="font-semibold tabular-nums text-neutral-900 dark:text-white">{fmtInr(outcome.netSale)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-neutral-600 dark:text-neutral-400">
                {outcome.isStcg ? 'Adjusted cost basis' : 'Indexed cost basis'}
              </dt>
              <dd className="font-semibold tabular-nums text-neutral-900 dark:text-white">{fmtInr(outcome.indexedCostUsed)}</dd>
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-neutral-600 dark:text-neutral-400">Estimated taxable gain</dt>
            <dd className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-white">{fmtInr(outcome.taxableGain)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Rough tax</dt>
            <dd className="font-sans text-2xl font-semibold tabular-nums text-gold-dark dark:text-gold">{fmtInr(outcome.taxEstimated)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
