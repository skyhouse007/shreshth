import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { calculatorBlogPosts } from '../data/calculatorBlogPosts.js';

const cardClass =
  'group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-gold/40 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-gold/35 md:p-8';

export default function Blog() {
  return (
    <>
      <SEO
        path="/blog"
        title="Calculator guides & blog"
        description="How to use Shresth Properties’ mortgage and India property calculators: capital gains, EMI, appreciation, debt-to-income, UDS, salary for EMI, and stamp duty — with benefits and practical tips."
      />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 md:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <p className="text-xs font-semibold heading-dlf text-gold">Guides</p>
          <h1 className="mt-3 heading-dlf font-display text-4xl font-semibold leading-tight text-neutral-900 dark:text-white md:text-5xl">
            Calculator blog
          </h1>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            One short article per tool on our{' '}
            <Link to="/calculators" className="font-medium text-gold underline-offset-2 hover:underline">
              Calculators
            </Link>{' '}
            page: why each one matters, what you gain from using it, and how to work through the inputs. Numbers are
            indicative; always confirm tax, stamp duty, and credit decisions with qualified professionals.
          </p>
        </motion.div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {calculatorBlogPosts.map((post, i) => (
            <motion.li
              key={post.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <article className={cardClass}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <BookOpen className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="heading-dlf font-display text-xl font-semibold text-neutral-900 dark:text-white">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-deep"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold/90"
                >
                  Read guide
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </>
  );
}
