import { useMemo, useState } from 'react';
import { Banknote, TrendingUp } from 'lucide-react';
import { compoundFuture, fmtInr } from '../utils/financeCalculators.js';

const inputCls =
  'mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-gold/30 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white';

const labelCls =
  'text-xs font-semibold heading-dlf text-neutral-500 dark:text-neutral-400';

/** Summary panel: grid keeps dt/dd from colliding when the column is narrow. */
const summaryRowBorder =
  'grid grid-cols-1 gap-1 border-b border-neutral-200 pb-4 dark:border-neutral-800 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-x-4';

const summaryRow =
  'grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-x-4';

const summaryDt = 'min-w-0 text-sm text-neutral-600 dark:text-neutral-400';

const summaryDdLg =
  'min-w-0 justify-self-start font-sans text-lg font-semibold tabular-nums text-gold-dark dark:text-gold sm:justify-self-end sm:text-right sm:text-xl';

const summaryDdSm =
  'min-w-0 justify-self-start text-sm font-semibold tabular-nums text-neutral-900 dark:text-white sm:justify-self-end sm:text-right';

export default function AppreciationCalculators({ showSectionIntro = true }) {
  const [priceValue, setPriceValue] = useState('7500000');
  const [priceGrowth, setPriceGrowth] = useState('7');
  const [priceYears, setPriceYears] = useState('10');

  const [rentMonthly, setRentMonthly] = useState('45000');
  const [rentGrowth, setRentGrowth] = useState('5');
  const [rentYears, setRentYears] = useState('10');

  const priceOutcome = useMemo(
    () => compoundFuture(priceValue, priceGrowth, priceYears),
    [priceValue, priceGrowth, priceYears],
  );

  const rentOutcome = useMemo(
    () => compoundFuture(rentMonthly, rentGrowth, rentYears),
    [rentMonthly, rentGrowth, rentYears],
  );

  const pvNum = Number(priceValue) || 0;
  const pricePctGain = pvNum > 0 ? (priceOutcome.delta / pvNum) * 100 : 0;

  const rentNow = Number(rentMonthly) || 0;
  const rentPctGain = rentNow > 0 ? (rentOutcome.delta / rentNow) * 100 : 0;

  const rentAnnualToday = rentNow * 12;
  const rentAnnualFuture = rentOutcome.future * 12;

  return (
    <div className="space-y-4">
      {showSectionIntro ? (
      <div className="mb-6 text-center lg:text-left">
        <p className="text-xs font-semibold heading-dlf text-gold">Planning tools</p>
        <h2 className="mt-2 heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white md:text-3xl">
          Price &amp; rent appreciation
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400 lg:mx-0">
          Compound growth illustration only — markets and leases vary by location and contract.
        </p>
      </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 dark:bg-gold/10">
              <TrendingUp className="h-5 w-5 text-gold-dark dark:text-gold" aria-hidden />
            </div>
            <div>
              <h3 className="heading-dlf font-display text-xl font-semibold text-neutral-900 dark:text-white md:text-2xl">
                Property price
              </h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Future value at a steady annual appreciation rate.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,1.08fr)] lg:gap-8">
            <div className="min-w-0 space-y-4">
              <div>
                <label htmlFor="appr-price-value" className={labelCls}>
                  Today&apos;s value (₹)
                </label>
                <input
                  id="appr-price-value"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={100000}
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="appr-price-rate" className={labelCls}>
                    Appreciation (% p.a.)
                  </label>
                  <input
                    id="appr-price-rate"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={50}
                    step={0.5}
                    value={priceGrowth}
                    onChange={(e) => setPriceGrowth(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="appr-price-years" className={labelCls}>
                    Horizon (years)
                  </label>
                  <input
                    id="appr-price-years"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={50}
                    step={1}
                    value={priceYears}
                    onChange={(e) => setPriceYears(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            <dl className="flex min-w-0 flex-col justify-center gap-4 rounded-xl border border-gold/20 bg-neutral-50 p-5 dark:border-gold/25 dark:bg-neutral-950/60">
              <div className={summaryRowBorder}>
                <dt className={`${summaryDt} font-medium`}>Future value</dt>
                <dd className={summaryDdLg}>{fmtInr(priceOutcome.future)}</dd>
              </div>
              <div className={summaryRow}>
                <dt className={summaryDt}>Absolute gain</dt>
                <dd className={summaryDdSm}>{fmtInr(priceOutcome.delta)}</dd>
              </div>
              <div className={summaryRow}>
                <dt className={summaryDt}>Return on today&apos;s value</dt>
                <dd className={summaryDdSm}>{pricePctGain.toFixed(1)}%</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 dark:bg-gold/10">
              <Banknote className="h-5 w-5 text-gold-dark dark:text-gold" aria-hidden />
            </div>
            <div>
              <h3 className="heading-dlf font-display text-xl font-semibold text-neutral-900 dark:text-white md:text-2xl">
                Monthly rent
              </h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Projected rent if it rises by the same % every year.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,1.08fr)] lg:gap-8">
            <div className="min-w-0 space-y-4">
              <div>
                <label htmlFor="appr-rent-now" className={labelCls}>
                  Current rent / month (₹)
                </label>
                <input
                  id="appr-rent-now"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={1000}
                  value={rentMonthly}
                  onChange={(e) => setRentMonthly(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="appr-rent-rate" className={labelCls}>
                    Increase (% p.a.)
                  </label>
                  <input
                    id="appr-rent-rate"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={50}
                    step={0.5}
                    value={rentGrowth}
                    onChange={(e) => setRentGrowth(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="appr-rent-years" className={labelCls}>
                    Horizon (years)
                  </label>
                  <input
                    id="appr-rent-years"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={50}
                    step={1}
                    value={rentYears}
                    onChange={(e) => setRentYears(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            <dl className="flex min-w-0 flex-col justify-center gap-4 rounded-xl border border-gold/20 bg-neutral-50 p-5 dark:border-gold/25 dark:bg-neutral-950/60">
              <div className={summaryRowBorder}>
                <dt className={`${summaryDt} font-medium`}>Rent after horizon</dt>
                <dd className={`${summaryDdLg} whitespace-nowrap`}>
                  {fmtInr(rentOutcome.future)}
                  <span className="ml-1 text-xs font-normal text-neutral-500 dark:text-neutral-400">/ mo</span>
                </dd>
              </div>
              <div className={`${summaryRow} sm:items-start`}>
                <dt className={summaryDt}>Annual rent (then vs now)</dt>
                <dd className="min-w-0 justify-self-start text-xs font-semibold tabular-nums leading-relaxed text-neutral-900 dark:text-white sm:justify-self-end sm:text-right">
                  <span className="block">{fmtInr(rentAnnualFuture)}</span>
                  <span className="font-normal text-neutral-500 dark:text-neutral-400">was {fmtInr(rentAnnualToday)}</span>
                </dd>
              </div>
              <div className={summaryRow}>
                <dt className={summaryDt}>Increase on monthly rent</dt>
                <dd className={summaryDdSm}>
                  {fmtInr(rentOutcome.delta)} ({rentPctGain.toFixed(1)}%)
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
