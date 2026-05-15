import { useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { computeEmi, fmtInr } from '../utils/financeCalculators.js';

export default function EmiCalculator({
  principal: principalProp,
  rate: rateProp,
  years: yearsProp,
  onPrincipalChange,
  onRateChange,
  onYearsChange,
}) {
  const { emi, total, interest } = useMemo(
    () => computeEmi(principalProp, rateProp, yearsProp),
    [principalProp, rateProp, yearsProp],
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 dark:bg-gold/10">
          <Calculator className="h-5 w-5 text-gold-dark dark:text-gold" aria-hidden />
        </div>
        <div>
          <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white md:text-3xl">
            Home loan EMI
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Estimate monthly instalments — figures are illustrative; actual terms depend on your lender.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div>
            <label htmlFor="emi-principal" className="text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400">
              Loan amount (₹)
            </label>
            <input
              id="emi-principal"
              type="number"
              inputMode="decimal"
              min={0}
              step={50000}
              value={principalProp}
              onChange={(e) => onPrincipalChange(e.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-gold/30 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="emi-rate" className="text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400">
                Interest (% p.a.)
              </label>
              <input
                id="emi-rate"
                type="number"
                inputMode="decimal"
                min={0}
                max={30}
                step={0.1}
                value={rateProp}
                onChange={(e) => onRateChange(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-gold/30 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="emi-tenure" className="text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400">
                Tenure (years)
              </label>
              <input
                id="emi-tenure"
                type="number"
                inputMode="numeric"
                min={1}
                max={40}
                step={1}
                value={yearsProp}
                onChange={(e) => onYearsChange(e.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-gold/30 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              />
            </div>
          </div>
        </div>

        <dl className="flex flex-col justify-center gap-4 rounded-xl border border-gold/20 bg-neutral-50 p-5 dark:border-gold/25 dark:bg-neutral-950/60">
          <div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Monthly EMI</dt>
            <dd className="font-sans text-2xl font-semibold tabular-nums text-gold-dark dark:text-gold">{fmtInr(emi)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-neutral-600 dark:text-neutral-400">Total payable</dt>
            <dd className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-white">{fmtInr(total)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-neutral-600 dark:text-neutral-400">Total interest</dt>
            <dd className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-white">{fmtInr(interest)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
