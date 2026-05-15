import { useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import { computeEmi, fmtInr } from '../../utils/financeCalculators.js';

const inputCls =
  'mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-gold/30 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white';

const labelCls =
  'text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400';

/** Typical Indian retail mortgage check: EMI should stay within FOIR (~fixed obligation to income ratio). */
export default function SalaryForEmiCalculator() {
  const [loan, setLoan] = useState('6500000');
  const [rate, setRate] = useState('9');
  const [years, setYears] = useState('20');
  const [foirPct, setFoirPct] = useState('45');

  const out = useMemo(() => {
    const { emi } = computeEmi(loan, rate, years);
    const f = (Number(foirPct) || 0) / 100;
    const minMonthly = f > 0 ? emi / f : 0;
    return { emi, minMonthly };
  }, [loan, rate, years, foirPct]);

  return (
    <div id="salary" className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 dark:bg-gold/10">
          <Wallet className="h-5 w-5 text-gold-dark dark:text-gold" aria-hidden />
        </div>
        <div>
          <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white md:text-3xl">
            Salary band for EMI (FOIR)
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Back-solves gross monthly income so that EMI / income matches your FOIR assumption — illustrative only for planning.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div>
            <label htmlFor="sal-loan" className={labelCls}>
              Desired loan principal (₹)
            </label>
            <input
              id="sal-loan"
              type="number"
              inputMode="decimal"
              min={0}
              step={50000}
              value={loan}
              onChange={(e) => setLoan(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sal-rate" className={labelCls}>
                Interest (% p.a.)
              </label>
              <input
                id="sal-rate"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="sal-years" className={labelCls}>
                Tenure (years)
              </label>
              <input
                id="sal-years"
                type="number"
                inputMode="numeric"
                min={1}
                max={40}
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor="sal-foir" className={labelCls}>
              Target FOIR — fixed obligations as % of income
            </label>
            <input
              id="sal-foir"
              type="number"
              inputMode="decimal"
              min={1}
              max={90}
              step={1}
              value={foirPct}
              onChange={(e) => setFoirPct(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <dl className="flex flex-col justify-center gap-4 rounded-xl border border-gold/20 bg-neutral-50 p-5 dark:border-gold/25 dark:bg-neutral-950/60">
          <div className="flex justify-between gap-4 border-b border-neutral-200 pb-4 text-sm dark:border-neutral-800">
            <dt className="text-neutral-600 dark:text-neutral-400">EMI at assumed rate</dt>
            <dd className="font-semibold tabular-nums text-neutral-900 dark:text-white">{fmtInr(out.emi)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Indicative gross monthly income</dt>
            <dd className="font-sans text-2xl font-semibold tabular-nums text-gold-dark dark:text-gold">{fmtInr(out.minMonthly)}</dd>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            Banks use verified income, deductions, bureau scores, employer category, moratoriums, and overlays — FOIR differs by borrower.
          </p>
        </dl>
      </div>
    </div>
  );
}
