import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';
import SEO from '../components/SEO.jsx';

const team = [
  { name: 'Vikram Shresth', role: 'Founding Principal', bio: 'Two decades shaping residential and hospitality-led corridors from Bodh Gaya to metros with family offices and global funds.' },
  { name: 'Ananya Menon', role: 'Head of Advisory', bio: 'Architect-turned-broker; champions light, volume, and honest comparables.' },
  { name: 'Kabir Dalal', role: 'Legal & Compliance', bio: 'Former AM law firm associate focused on title clarity for large land assemblies.' },
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
          <h2 className="heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white">Leadership</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {team.map((member, i) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <UserCircle className="h-5 w-5" />
                </div>
                <h3 className="heading-dlf font-display text-xl font-semibold text-neutral-900 dark:text-white">{member.name}</h3>
                <p className="text-sm font-medium text-gold">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{member.bio}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
