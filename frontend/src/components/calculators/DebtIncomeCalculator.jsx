import { useMemo, useState } from 'react';
import { Gauge } from 'lucide-react';
import { fmtInr } from '../../utils/financeCalculators.js';

const inputCls =
  'mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-gold/30 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white';

const labelCls =
  'text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400';

/** Debt-to-income: total monthly obligations versus gross monthly salary (banks often benchmark ~40–50% FOIR for home loans — varies). */
export default function DebtIncomeCalculator() {
  const [grossMonthly, setGrossMonthly] = useState('275000');
  const [existingEmis, setExistingEmis] = useState('35000');
  const [homeEmi, setHomeEmi] = useState('65000');

  const out = useMemo(() => {
    const income = Number(grossMonthly) || 0;
    const other = Number(existingEmis) || 0;
    const hm = Number(homeEmi) || 0;
    const total = Math.max(0, other + hm);
    const dtiPct = income > 0 ? (total / income) * 100 : 0;

    let band = '';
    if (dtiPct <= 0) band = '';
    else if (dtiPct <= 40) band = 'Often within lender comfort (~40%)';
    else if (dtiPct <= 50) band = 'Borderline — many lenders cap near 45–55% FOIR depending on income';
    else band = 'High — underwriting may tighten or reduce eligible loan';

    return { income, total, dtiPct, band };
  }, [grossMonthly, existingEmis, homeEmi]);

  return (
    <div id="demi" className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 dark:bg-gold/10">
          <Gauge className="h-5 w-5 text-gold-dark dark:text-gold" aria-hidden />
        </div>
        <div>
          <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white md:text-3xl">
            Debt-to-income ratio (DTI)
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Total monthly EMI obligations ÷ gross monthly income. Sometimes called DEMI-style checks during home loan underwriting.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div>
            <label htmlFor="dti-income" className={labelCls}>
              Gross monthly income (₹)
            </label>
            <input
              id="dti-income"
              type="number"
              inputMode="decimal"
              min={0}
              value={grossMonthly}
              onChange={(e) => setGrossMonthly(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="dti-existing" className={labelCls}>
                Other EMIs / month (₹)
              </label>
              <input
                id="dti-existing"
                type="number"
                inputMode="decimal"
                min={0}
                value={existingEmis}
                onChange={(e) => setExistingEmis(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="dti-home" className={labelCls}>
                Proposed home EMI (₹)
              </label>
              <input
                id="dti-home"
                type="number"
                inputMode="decimal"
                min={0}
                value={homeEmi}
                onChange={(e) => setHomeEmi(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <dl className="flex flex-col justify-center gap-4 rounded-xl border border-gold/20 bg-neutral-50 p-5 dark:border-gold/25 dark:bg-neutral-950/60">
          <div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">DTI ratio</dt>
            <dd className="font-sans text-3xl font-semibold tabular-nums text-gold-dark dark:text-gold">{out.dtiPct.toFixed(1)}%</dd>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <dt className="text-neutral-600 dark:text-neutral-400">Total obligations / month</dt>
            <dd className="font-semibold tabular-nums text-neutral-900 dark:text-white">{fmtInr(out.total)}</dd>
          </div>
          {out.income > 0 ? (
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{out.band}</p>
          ) : (
            <p className="text-sm text-neutral-500">Enter income to gauge DTI.</p>
          )}
        </dl>
      </div>
    </div>
  );
}
