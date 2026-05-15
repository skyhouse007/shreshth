import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import EmiCalculator from '../components/EmiCalculator.jsx';
import AppreciationCalculators from '../components/AppreciationCalculators.jsx';
import CapitalGainsCalculator from '../components/calculators/CapitalGainsCalculator.jsx';
import DebtIncomeCalculator from '../components/calculators/DebtIncomeCalculator.jsx';
import UdsCalculator from '../components/calculators/UdsCalculator.jsx';
import SalaryForEmiCalculator from '../components/calculators/SalaryForEmiCalculator.jsx';
import StampDutyCalculator from '../components/calculators/StampDutyCalculator.jsx';

const toc = [
  { href: '#capital-gains', label: 'Capital gains' },
  { href: '#emi', label: 'EMI' },
  { href: '#price-appreciation', label: 'Price & rent' },
  { href: '#demi', label: 'Debt-to-income' },
  { href: '#uds', label: 'UDS' },
  { href: '#salary', label: 'Salary for EMI' },
  { href: '#stamp-duty', label: 'Stamp & reg.' },
];

const chip =
  'shrink-0 rounded-full border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-800 transition-colors hover:border-gold hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-gold';

export default function CalculatorsPage() {
  const location = useLocation();
  const [principal, setPrincipal] = useState('7500000');
  const [rate, setRate] = useState('8.5');
  const [years, setYears] = useState('20');

  useEffect(() => {
    const id = location.hash.replace(/^#/, '');
    if (!id) return;
    const t = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(t);
  }, [location.hash]);

  return (
    <>
      <SEO
        path="/calculators"
        title="Mortgage & property calculators — Shresth"
        description="EMI, capital gains, price and rent appreciation, debt-to-income, UDS, salary band against FOIR, and stamp duty calculators for India — indicative planning tools."
      />

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 md:px-6 lg:px-8">
        <p className="text-xs font-semibold heading-dlf text-gold">Finance toolkit</p>
        <h1 className="mt-3 heading-dlf font-display text-4xl font-semibold leading-tight text-neutral-900 dark:text-white md:text-5xl">
          Property calculators
        </h1>
        <p className="mt-4 max-w-3xl text-neutral-600 dark:text-neutral-400">
          Indicative numbers for conversation with your chartered accountant &amp; mortgage partner — regimes, rebates, overlays, jurisdictional slabs, lender policies, deed categories, exemptions, surcharge, cess, rebate for women/ST, MMR circle rates, bifurcation, and documentation charges are not exhaustive here.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">
          New to these tools?{' '}
          <Link to="/blog" className="font-medium text-gold underline-offset-2 hover:underline">
            Read a short guide for each calculator on our blog
          </Link>
          .
        </p>

        <nav
          aria-label="Calculator sections"
          className="-mx-1 mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-thin md:flex-wrap md:overflow-visible"
        >
          {toc.map((t) => (
            <a key={t.href} href={t.href} className={chip}>
              {t.label}
            </a>
          ))}
        </nav>

        <div className="mt-16 flex flex-col gap-16 md:gap-20">
          <CapitalGainsCalculator />

          <div id="emi" className="scroll-mt-28">
            <EmiCalculator
              principal={principal}
              rate={rate}
              years={years}
              onPrincipalChange={setPrincipal}
              onRateChange={setRate}
              onYearsChange={setYears}
            />
          </div>

          <section id="price-appreciation" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs font-semibold heading-dlf text-gold">Growth trajectory</p>
              <h2 className="mt-3 heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white">Price &amp; rent appreciation</h2>
              <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
                Compound annual uplift on capital value versus residential rent — illustrative scenario curves.
              </p>
            </div>
            <AppreciationCalculators showSectionIntro={false} />
          </section>

          <DebtIncomeCalculator />
          <UdsCalculator />
          <SalaryForEmiCalculator />
          <StampDutyCalculator />
        </div>
      </div>
    </>
  );
}
