import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { getCalculatorBlogPost } from '../data/calculatorBlogPosts.js';

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getCalculatorBlogPost(slug) : null;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const calcTo = `/calculators#${post.calculatorHash}`;

  return (
    <>
      <SEO
        path={`/blog/${post.slug}`}
        title={post.title}
        description={post.excerpt}
      />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 md:px-6 lg:px-8">
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-neutral-600 dark:text-neutral-400"
          aria-label="Breadcrumb"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 font-medium text-gold transition-colors hover:text-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-deep"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All calculator guides
          </Link>
        </motion.nav>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="mt-8"
        >
          <p className="text-xs font-semibold heading-dlf text-gold">Calculator guide</p>
          <h1 className="mt-3 heading-dlf font-display text-3xl font-semibold leading-tight text-neutral-900 dark:text-white md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{post.excerpt}</p>

          <p className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400">
            These guides support planning conversations only. Tax, stamp duty, indexation, lender policy, and title
            matters vary by case—confirm with your chartered accountant, lawyer, and bank.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={calcTo}
              className="inline-flex items-center gap-2 rounded-none bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-deep"
            >
              <Calculator className="h-4 w-4 shrink-0" aria-hidden />
              Open this calculator
            </Link>
            <Link
              to="/calculators"
              className="inline-flex items-center justify-center rounded-none border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:border-gold hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-gold dark:hover:text-white dark:focus-visible:ring-offset-navy-deep"
            >
              All calculators
            </Link>
          </div>

          <div className="mt-14 space-y-12">
            {post.sections.map((section, si) => (
              <section key={`${section.heading}-${si}`}>
                <h2 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">
                  {section.heading}
                </h2>
                {section.paragraphs?.length ? (
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {section.paragraphs.map((p, pi) => (
                      <p key={pi}>{p}</p>
                    ))}
                  </div>
                ) : null}
                {section.items?.length ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {section.items.map((item, ii) => (
                      <li key={ii}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </motion.article>
      </div>
    </>
  );
}
