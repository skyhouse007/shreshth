import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Search, Shield, Sparkles, Star } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import SEO from '../components/SEO.jsx';
import EmiCalculator from '../components/EmiCalculator.jsx';
import AppreciationCalculators from '../components/AppreciationCalculators.jsx';
import StaticProjectCard from '../components/StaticProjectCard.jsx';
import { api } from '../api/client.js';
import { mergePortfolioProjects } from '../utils/mergePortfolioProjects.js';
import { WHATSAPP_DEFAULT } from '../utils/constants.js';

const testimonials = [
  {
    name: 'Meera Kapoor',
    role: 'Wellness hospitality founder',
    quote:
      'We wanted a peaceful base near the sacred precinct — Shresth distilled floor plans, timelines, and trust into one quiet decision.',
  },
  {
    name: 'Arjun Desai',
    role: 'Tech executive, Bengaluru',
    quote:
      'From virtual walk-throughs to stamp-duty clarity, the team treated Bodh Gaya like a global launch — disciplined and understated.',
  },
  {
    name: 'Priya & Rahul Verma',
    role: 'NRI buyers',
    quote:
      'They choreographed every milestone from abroad — candid pricing, vetted paperwork, and no drama at registration.',
  },
];

const HERO_AUTOPLAY_MS = 6500;

export default function Home() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [q, setQ] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroSlidesLoaded, setHeroSlidesLoaded] = useState(false);
  const [emiPrincipal, setEmiPrincipal] = useState('7500000');
  const [emiRate, setEmiRate] = useState('8.5');
  const [emiYears, setEmiYears] = useState('20');

  const [portfolioList, setPortfolioList] = useState([]);

  const heroLen = heroSlides.length;
  const goHero = useCallback(
    (dir) => {
      if (heroLen < 2) return;
      setHeroIndex((i) => (i + dir + heroLen) % heroLen);
    },
    [heroLen],
  );

  useEffect(() => {
    if (heroLen <= 1 || reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroLen);
    }, HERO_AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [heroLen, reduceMotion]);

  useEffect(() => {
    setHeroIndex((i) => Math.min(i, Math.max(0, heroLen - 1)));
  }, [heroLen]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/site/hero-slides');
        const list = Array.isArray(data?.slides) ? data.slides : [];
        const normalized = list
          .filter((s) => s && typeof s.src === 'string' && s.src.trim().length > 0)
          .map((s) => ({
            src: s.src.trim(),
            alt: typeof s.alt === 'string' ? s.alt.trim() : '',
          }));
        if (!cancelled) setHeroSlides(normalized);
      } catch {
        if (!cancelled) setHeroSlides([]);
      } finally {
        if (!cancelled) setHeroSlidesLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/site-projects');
        if (!cancelled) setPortfolioList(mergePortfolioProjects(data.items || []));
      } catch {
        if (!cancelled) setPortfolioList(mergePortfolioProjects([]));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('location', q.trim());
    navigate(`/projects?${params.toString()}`);
  };

  const whatsappHomeMessage =
    'Hello Shresth Properties, I would like to know more about the Bodh Gaya project.';
  const whatsappHref = WHATSAPP_DEFAULT
    ? `https://wa.me/${WHATSAPP_DEFAULT}?text=${encodeURIComponent(whatsappHomeMessage)}`
    : '';

  return (
    <>
      <SEO
        path="/"
        title="Bodh Gaya — upcoming 2 & 3 BHK"
        description="Shresth Properties in Bodh Gaya, Bihar: an upcoming residential project offering calm, considered 2 and 3 BHK homes near India’s spiritual heartland — private briefings by appointment."
      />
      <section
        className="relative w-full overflow-hidden border-b border-border bg-neutral-950 dark:border-white/10"
        aria-label="Upcoming Bodh Gaya residential project banner"
      >
        <div
          className="group/slider relative mx-auto aspect-video w-full max-w-[1920px] overflow-hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Project imagery"
        >
          {heroSlidesLoaded && heroLen > 0 ? (
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: reduceMotion ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: reduceMotion ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 overflow-hidden bg-neutral-950"
              >
                <img
                  src={heroSlides[heroIndex].src}
                  alt={heroSlides[heroIndex].alt}
                  width={1920}
                  height={1080}
                  sizes="100vw"
                  loading={heroIndex === 0 ? 'eager' : 'lazy'}
                  fetchPriority={heroIndex === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 bg-neutral-950" aria-hidden />
          )}

          {heroSlidesLoaded && heroLen > 1 ? (
            <>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 pointer-events-auto">
                {heroSlides.map((slide, i) => (
                  <button
                    key={`${slide.src}-${i}`}
                    type="button"
                    aria-label={`Show slide ${i + 1} of ${heroLen}`}
                    aria-current={i === heroIndex ? 'true' : undefined}
                    onClick={() => setHeroIndex(i)}
                    className={`h-2 rounded-full transition-[width,background-color] duration-300 ${
                      i === heroIndex ? 'w-8 bg-gold' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => goHero(-1)}
                className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/35 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/50 group-hover/slider:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:block"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => goHero(1)}
                className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/35 p-2 text-white backdrop-blur-sm transition hover:bg-black/50 md:block opacity-0 transition-opacity group-hover/slider:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </>
          ) : null}
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,42,66,0.09),transparent_52%),radial-gradient(ellipse_at_15%_0%,rgba(114,47,55,0.07),transparent_48%),radial-gradient(ellipse_at_65%_120%,rgba(26,70,57,0.06),transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(200,170,110,0.12),transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 text-xs font-semibold heading-dlf text-gold">Bodh Gaya, Bihar · Spiritual city</p>
            <h1 className="heading-dlf font-display text-4xl font-semibold leading-tight text-neutral-900 dark:text-white md:text-5xl lg:text-6xl">
              stillness, <span className="text-gold">made address</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-neutral-600 dark:text-neutral-300">
              Our upcoming Bodh Gaya project brings refined 2 and 3 BHK residences to a rare residential canvas — light-filled
              plans, curated materials, and advisory that respects both devotion and long-term value.
            </p>
            <form onSubmit={search} className="mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Bodh Gaya, landmark, or neighborhood"
                  className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none ring-gold/30 focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-navy shadow-sm hover:bg-gold-dark hover:text-navy-deep"
              >
                Search
              </button>
            </form>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#20BD5A]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                WhatsApp us
              </a>
            ) : null}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-16 px-4 py-14 md:px-6 lg:px-8">
        <EmiCalculator
          principal={emiPrincipal}
          rate={emiRate}
          years={emiYears}
          onPrincipalChange={setEmiPrincipal}
          onRateChange={setEmiRate}
          onYearsChange={setEmiYears}
        />
        <div className="border-t border-neutral-200 pt-16 dark:border-neutral-800">
          <AppreciationCalculators />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white">Projects</h2>
            <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
              Bodh Gaya, South Bengaluru, and Jaipur — each development has maps and a short inquiry path.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 self-start rounded-full border border-gold bg-gold/10 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-gold hover:text-navy dark:text-white dark:hover:text-navy-deep sm:self-auto"
          >
            View all
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioList.map((p, i) => (
            <StaticProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
        <h2 className="heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white">Why choose us</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: 'Bespoke shortlists',
              text: 'We listen first — then surface three perfect options, not thirty mediocre ones.',
            },
            {
              icon: Shield,
              title: 'Title & compliance',
              text: 'Partnered counsel for DD, encumbrance checks, and NRI-friendly documentation.',
            },
            {
              icon: Star,
              title: 'White-glove previews',
              text: 'Private dusk tours, staging, and discreet seller conversations on your behalf.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <item.icon className="mb-4 h-8 w-8 text-gold" />
              <h3 className="heading-dlf font-display text-xl font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-navy-deep via-navy to-navy py-16 text-stone-100">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <h2 className="heading-dlf font-display text-3xl font-semibold">Clients &amp; pilgrims</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-sm leading-relaxed text-neutral-200">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-xs text-gold-muted">
                  <span className="font-semibold text-white">{t.name}</span>
                  <span className="text-neutral-400"> · {t.role}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-navy/[0.08] via-surface to-white p-10 text-center dark:from-navy/35 dark:via-navy-deep dark:to-navy-deep md:p-14"
        >
          <h2 className="heading-dlf font-display text-3xl font-semibold text-neutral-900 dark:text-white">Register interest — Bodh Gaya</h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-600 dark:text-neutral-300">
            Request a private briefing on the upcoming 2 and 3 BHK plans, pricing bands, and possession roadmap — we respond
            with a considered path within 48 hours.
          </p>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="mt-8 inline-flex rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-wine dark:bg-gold dark:text-navy dark:hover:bg-gold-muted dark:hover:text-navy-deep"
          >
            Brief us on your move
          </button>
        </motion.div>
      </section>
    </>
  );
}
