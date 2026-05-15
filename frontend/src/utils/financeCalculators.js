/** INR formatting (whole rupees). */
export function fmtInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(Number(amount) || 0));
}

/** Home loan amortizing EMI (principal, annual %, years). */
export function computeEmi(principal, annualRatePct, tenureYears) {
  const principalNum = Number(principal) || 0;
  const ratePct = Number(annualRatePct) || 0;
  const years = Number(tenureYears) || 0;
  const n = Math.max(0, Math.round(years * 12));

  if (principalNum <= 0 || n <= 0) {
    return { emi: 0, total: 0, interest: 0 };
  }

  const r = ratePct / 12 / 100;
  if (r === 0) {
    const emi = principalNum / n;
    return {
      emi,
      total: principalNum,
      interest: 0,
    };
  }

  const pow = (1 + r) ** n;
  const emi = (principalNum * r * pow) / (pow - 1);
  const total = emi * n;
  const interest = Math.max(0, total - principalNum);

  return { emi, total, interest };
}

/** Compound appreciation for price or monthly rent levels. */
export function compoundFuture(presentValue, annualRatePct, years) {
  const pv = Number(presentValue) || 0;
  const r = (Number(annualRatePct) || 0) / 100;
  const n = Math.max(0, Number(years) || 0);
  if (pv <= 0) return { future: 0, delta: 0 };
  if (n <= 0) return { future: pv, delta: 0 };
  const future = pv * (1 + r) ** n;
  return { future, delta: future - pv };
}

/** Indian cost inflation indices (Finance Act / CBDT announcements; illustrative). */
export const CII_BY_FY_LABEL = Object.freeze([
  ['2001–02', 100],
  ['2002–03', 105],
  ['2003–04', 109],
  ['2004–05', 113],
  ['2005–06', 117],
  ['2006–07', 122],
  ['2007–08', 129],
  ['2008–09', 137],
  ['2009–10', 148],
  ['2010–11', 167],
  ['2011–12', 184],
  ['2012–13', 200],
  ['2013–14', 220],
  ['2014–15', 240],
  ['2015–16', 254],
  ['2016–17', 264],
  ['2017–18', 272],
  ['2018–19', 280],
  ['2019–20', 289],
  ['2020–21', 301],
  ['2021–22', 317],
  ['2022–23', 331],
  ['2023–24', 348],
  ['2024–25', 363],
]);

export function closestCii(fyOptionIndex) {
  const row = CII_BY_FY_LABEL[fyOptionIndex];
  return row ? row[1] : 363;
}
