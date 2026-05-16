import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';

const chairmenFounders = [{ name: 'Shalini Shreshth', role: 'Chairman & Founder', image: null }];

const directors = [
  { name: 'Dr. Mrigendra Kumar', role: 'Director', image: '/team/kumar-santosh.png' },
  { name: 'Kumar Santosh', role: 'Director - Finance', image: '/team/mrigendra-kumar.png' },
  { name: 'Ranjan Kumar', role: 'Director-HR', image: '/team/ranjan-kumar.png' },
];

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="Shresth Properties — boutique real estate advisory with a flagship upcoming residential project in Bodh Gaya, Bihar."
      />
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <p className="text-xs font-semibold heading-dlf text-gold">Our story</p>
          <h1 className="mt-3 heading-dlf font-display text-4xl font-semibold leading-tight text-neutral-900 dark:text-white md:text-5xl">Grounded in Bodh Gaya, built for the long horizon</h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            Shresth Properties began as a boutique desk advising founders on their first marquee purchases; today our
            flagship focus is an upcoming collection of 2 and 3 BHK homes in Bodh Gaya, Bihar — stillness you can own — plus
            a select wider portfolio, always with transparent economics and quiet execution.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <h2 className="heading-dlf font-display text-2xl font-semibold text-gold">Vision</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300">
              To be the most trusted gateway for considered homes and land in Bodh Gaya and beyond — blending design literacy
              with institutional rigor.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <h2 className="heading-dlf font-display text-2xl font-semibold text-gold">Mission</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300">
              Pair every client with assets that age beautifully — through disciplined sourcing, candid pricing, and
              uncompromising paper trails.
            </p>
          </motion.div>
        </div>

        <section className="mt-20">
          <h2 className="heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white">
            Chairman &amp; Founder
          </h2>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Founding leadership shaping Shresth Properties&apos; direction and standards.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {chairmenFounders.map((member, i) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white px-5 pb-5 pt-6 text-center dark:border-neutral-800 dark:bg-neutral-900 sm:px-8 sm:pb-6 sm:pt-8"
              >
                <div className="mx-auto flex aspect-[3/4] w-full max-w-[11rem] items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 sm:max-w-[12rem]">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="h-full w-full object-cover object-top" />
                  ) : (
                    <span className="heading-dlf select-none text-3xl font-semibold tracking-tight text-neutral-400 dark:text-neutral-500 sm:text-4xl">
                      {member.name
                        .split(/\s+/)
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 3)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="mt-4 w-full border-t border-neutral-200 pt-4 dark:border-neutral-800">
                  <h3 className="heading-dlf font-display text-lg font-semibold text-neutral-900 dark:text-white sm:text-xl">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gold">{member.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white">Directors</h2>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Stewardship and governance for Shresth Properties&apos; developments and advisory mandate.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {directors.map((member, i) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white px-5 pb-5 pt-6 text-center dark:border-neutral-800 dark:bg-neutral-900 sm:px-8 sm:pb-6 sm:pt-8"
              >
                <div className="mx-auto aspect-[3/4] w-full max-w-[11rem] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 sm:max-w-[12rem]">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover object-top" />
                </div>
                <div className="mt-4 w-full border-t border-neutral-200 pt-4 dark:border-neutral-800">
                  <h3 className="heading-dlf font-display text-lg font-semibold text-neutral-900 dark:text-white sm:text-xl">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-gold">{member.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
