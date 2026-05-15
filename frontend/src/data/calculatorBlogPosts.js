/** Guides for each calculator on /calculators — content only; UI lives in pages. */

export const calculatorBlogPosts = [
  {
    slug: 'capital-gains-tax-calculator',
    title: 'Capital gains tax calculator for property',
    excerpt:
      'Estimate tax on sale of real estate, compare long-term versus short-term treatment, and see why modelling gains early keeps deals honest.',
    calculatorHash: 'capital-gains',
    sections: [
      {
        heading: 'Why this calculator matters',
        paragraphs: [
          'Selling a home or investment plot triggers capital gains rules that depend on holding period, indexed cost, and allowable deductions. Getting a rough number before you sign helps you negotiate exit timelines and reinvestment plans without surprises at filing time.',
          'India’s regime rewards longer holds and specific re-investment avenues; the gap between short-term and long-term outcomes can be large, so clarity early is part of sound exit planning.',
        ],
      },
      {
        heading: 'Why it is useful',
        paragraphs: [
          'You can scenario-test purchase price, improvements, sale price, and holding period in one place instead of juggling spreadsheets while the other party is waiting for an answer.',
          'It is especially useful when you are choosing between selling now versus later, or comparing a taxable sale with options your chartered accountant may outline.',
        ],
      },
      {
        heading: 'Benefits',
        items: [
          'Frames the tax conversation with buyers, sellers, and advisors using the same baseline numbers.',
          'Highlights how holding period flips the character of the gain and the rate that applies.',
          'Surfaces the role of improvements and brokerage so you do not forget deductions you might discuss with a tax professional.',
        ],
      },
      {
        heading: 'How to use it',
        paragraphs: [
          'Open the Capital gains section on our Calculators page. Enter purchase details, any improvement cost, the expected sale consideration, brokerage or charges, and the financial year of purchase and sale where applicable.',
          'Adjust the holding window or rate assumptions to mirror guidance you have received; our tool is indicative and does not replace professional advice on indexation, exemptions, or special provisions.',
        ],
      },
    ],
  },
  {
    slug: 'emi-calculator',
    title: 'Home loan EMI calculator',
    excerpt:
      'Translate loan amount, rate, and tenure into monthly outgo and total interest — the first checkpoint before you fall in love with a budget.',
    calculatorHash: 'emi',
    sections: [
      {
        heading: 'Why this calculator matters',
        paragraphs: [
          'The EMI is usually the largest line item in a household budget after you buy. Knowing the monthly debit and total interest helps you align the loan with income stability and life goals instead of guessing at a bank’s provisional quote.',
          'Small changes in rate or tenure move the EMI noticeably; modelling that sensitivity is how disciplined borrowers avoid being stretched by a quarter-point swing later.',
        ],
      },
      {
        heading: 'Why it is useful',
        paragraphs: [
          'You can hold principal, rate, and tenure constant while you compare properties at different prices, or keep the property price fixed while you test how a larger down payment changes cash flow.',
          'It gives a language-neutral snapshot you can share with a co-borrower or advisor in minutes.',
        ],
      },
      {
        heading: 'Benefits',
        items: [
          'Immediate visibility into monthly cash outflow and total interest over the loan life.',
          'Easy comparison of “cheaper EMI, longer tenure” versus “higher EMI, shorter tenure” without a spreadsheet.',
          'Supports realistic budgeting alongside insurance, maintenance, and stamp duty—so the home feels affordable after closing, not only on paper.',
        ],
      },
      {
        heading: 'How to use it',
        paragraphs: [
          'On the Calculators page, find the EMI section. Enter the principal you intend to borrow (after down payment), the annual interest rate your lender quoted, and the tenure in years.',
          'Update any field as quotes change; use the result as a planning range because final sanction, processing fees, and floating-rate revisions will be governed by your loan agreement.',
        ],
      },
    ],
  },
  {
    slug: 'price-rent-appreciation-calculator',
    title: 'Price & rent appreciation calculator',
    excerpt:
      'Project capital value and residential rent growth with compound annual assumptions — a simple way to stress-test “buy versus hold” stories.',
    calculatorHash: 'price-appreciation',
    sections: [
      {
        heading: 'Why this calculator matters',
        paragraphs: [
          'Long-term owners and investors often anchor on a single growth number; compounding turns small percentage differences into large gaps over ten or twenty years.',
          'Separating price growth from rent growth keeps you honest about yield: rising capital values without rent traction can signal a market you experience differently as an occupier versus a landlord.',
        ],
      },
      {
        heading: 'Why it is useful',
        paragraphs: [
          'You can sketch illustrative curves for conservative, base, and optimistic CAGR assumptions without building a financial model.',
          'It helps compare locations or product types when each has a different historical growth and rental story.',
        ],
      },
      {
        heading: 'Benefits',
        items: [
          'Builds intuition for how CAGR acts over multi-year holds—not just headline “5% per year”.',
          'Pairs naturally with EMI and tax calculators so you see debt service against an assumed growth path.',
          'Useful in family discussions when expectations about future rent or resale need a shared reference point.',
        ],
      },
      {
        heading: 'How to use it',
        paragraphs: [
          'Scroll to Price & rent appreciation on our Calculators page. For price growth, enter today’s value, an assumed annual appreciation rate, and the horizon in years; repeat the pattern for the rent module if you want a rental trajectory.',
          'Treat outputs as scenarios, not forecasts—local supply, policy, and interest rates will move realised outcomes away from any straight-line assumption.',
        ],
      },
    ],
  },
  {
    slug: 'debt-to-income-calculator',
    title: 'Debt-to-income (DTI) calculator',
    excerpt:
      'See how proposed home-loan EMIs sit inside total income after existing obligations — a coarse match for how many lenders think about serviceability.',
    calculatorHash: 'demi',
    sections: [
      {
        heading: 'Why this calculator matters',
        paragraphs: [
          'Lenders assess whether income can comfortably cover existing debts plus the new housing EMI. Even when you are under the bank’s formal cutoff, your own stress test may be stricter if income varies quarter to quarter.',
          'Understanding the ratio before application reduces last-minute scrambling to restructure other loans or add co-borrowers.',
        ],
      },
      {
        heading: 'Why it is useful',
        paragraphs: [
          'You can plug net or gross income as you prefer for a private sanity check, then add car loans, cards, and the proposed home EMI to see combined load.',
          'It clarifies whether a slightly smaller loan—or clearing a smaller debt first—improves resilience more than stretching for the maximum eligible amount.',
        ],
      },
      {
        heading: 'Benefits',
        items: [
          'Surfaces breathing room (or the lack of it) before you commit to a long-term obligation.',
          'Helps align household spending, savings, and contingency buffers with a realistic EMI band.',
          'Complements salary-to-EMI tools: one looks from income down, the other from loan requirement up.',
        ],
      },
      {
        heading: 'How to use it',
        paragraphs: [
          'Open the Debt-to-income block on the Calculators page. Enter monthly income, existing EMIs or committed debt service, and the EMI you expect on the new home loan.',
          'Banks use proprietary policies and may include or exclude certain allowances; use this as a directional view alongside your relationship manager’s assessment.',
        ],
      },
    ],
  },
  {
    slug: 'uds-calculator',
    title: 'UDS (undivided share) calculator',
    excerpt:
      'Relate super built-up area, aggregate land, and total units to your undivided share of land — a core concept in apartment economics and title comfort.',
    calculatorHash: 'uds',
    sections: [
      {
        heading: 'Why this calculator matters',
        paragraphs: [
          'In multi-unit projects your apartment’s value and enforceability tie partly to the undivided share (UDS) of the underlying land. Buyers who ignore UDS may misunderstand what they truly own beyond the four walls.',
          'Comparing quotes across projects without normalising UDS can mislead: a lower ticket with weak UDS is not automatically the better deal.',
        ],
      },
      {
        heading: 'Why it is useful',
        paragraphs: [
          'You can translate carpet or saleable area, total land under the development, and unit count into an indicative UDS for benchmarking against disclosures in agreements.',
          'It supports conversations with developers and lawyers when you verify schedules and annexures.',
        ],
      },
      {
        heading: 'Benefits',
        items: [
          'Builds literacy on how your stake in common land scales with unit size and project footprint.',
          'Helps compare offerings where marketing focuses on amenities but legal schedules carry the economic substance.',
          'Reduces reliance on opaque “trust us” explanations before registration.',
        ],
      },
      {
        heading: 'How to use it',
        paragraphs: [
          'Use the UDS section: enter total land area, total aggregate saleable or super area across the project (as defined in your documents), and your unit’s saleable or super area as consistent with the first two inputs.',
          'Always reconcile the calculator output with your agreement’s explicit UDS figure; definitions of “area” vary by builder and jurisdiction.',
        ],
      },
    ],
  },
  {
    slug: 'salary-for-emi-calculator',
    title: 'Salary required for EMI calculator',
    excerpt:
      'Work backwards from loan size, rate, tenure, and a target FOIR band to a rough income requirement — helpful when the bank’s “maximum eligibility” language feels abstract.',
    calculatorHash: 'salary',
    sections: [
      {
        heading: 'Why this calculator matters',
        paragraphs: [
          'Forward EMI math starts from loan parameters, but many buyers start from “I earn X—what can I borrow?” This tool flips the question: for the home you want, what income band keeps the EMI inside a prudent limit?',
          'FOIR (fixed obligations to income ratio) caps vary by lender and profile; testing 40–50% bands shows how sensitive affordability is to policy and risk appetite.',
        ],
      },
      {
        heading: 'Why it is useful',
        paragraphs: [
          'Couples can align salary growth plans or co-borrowing decisions with a concrete EMI target.',
          'It bridges the gap between property shortlists and HR or career conversations when purchase timing is flexible.',
        ],
      },
      {
        heading: 'Benefits',
        items: [
          'Prevents falling in love with a sanction amount that implies an uncomfortably thin personal FOIR.',
          'Makes trade-offs visible: lower FOIR may imply waiting, a co-borrower, or a smaller ticket.',
          'Pairs cleanly with the standard EMI calculator for the same loan assumptions.',
        ],
      },
      {
        heading: 'How to use it',
        paragraphs: [
          'In Salary for EMI, enter expected loan amount, interest rate, tenure in years, and your assumed maximum FOIR percentage.',
          'The result is indicative; lenders net out taxes, existing EMIs, and credit behaviour differently when they approve a final ticket.',
        ],
      },
    ],
  },
  {
    slug: 'stamp-duty-calculator',
    title: 'Stamp duty & registration calculator',
    excerpt:
      'Approximate transaction taxes on the agreement value so the “all-in” cost of acquisition is not an afterthought.',
    calculatorHash: 'stamp-duty',
    sections: [
      {
        heading: 'Why this calculator matters',
        paragraphs: [
          'Stamp duty, registration charges, and related levies are material cash outflows at closing. They affect your effective equity from day one and sometimes influence mortgage disbursal planning.',
          'Slabs differ by state, asset type, gender, and concessions; even an approximate bracket improves negotiation and fund planning.',
        ],
      },
      {
        heading: 'Why it is useful',
        paragraphs: [
          'You can layer percentage assumptions on deal value and add a registration component to see a rounded total.',
          'Buyers comparing states or asset classes gain a quick sense of how friction costs shift the net economics.',
        ],
      },
      {
        heading: 'Benefits',
        items: [
          'Avoids surprise liquidity needs in the week of registration when every rupee is already allocated.',
          'Supports apples-to-apples comparison of two properties at different values or concession eligibility.',
          'Complements capital gains and EMI math for a fuller picture of lifecycle cash flows.',
        ],
      },
      {
        heading: 'How to use it',
        paragraphs: [
          'Open Stamp & reg. on the Calculators page. Enter consideration or circle-rate-based value as appropriate, stamp duty percentage (from local schedules or advisor guidance), and registration charges or percentage where the tool allows.',
          'Verify against the latest government notifications; rebates, surcharges, and penalties are not one-size-fits-all.',
        ],
      },
    ],
  },
];

export function getCalculatorBlogPost(slug) {
  return calculatorBlogPosts.find((p) => p.slug === slug) ?? null;
}
