import React, { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Zap, Brain, Clock, ArrowRight, Play, CheckCircle, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/* ─── Animated counter (safe hook usage as a component) ─── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        start = target
        clearInterval(timer)
      }
      if (ref.current) ref.current.textContent = Math.floor(start).toLocaleString() + suffix
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, suffix])

  return <span ref={ref}>0{suffix}</span>
}

/* ─── Stat card (safe: each is its own component so hooks work) ─── */
function StatCard({
  value,
  suffix,
  label,
  index,
}: {
  value: number
  suffix: string
  label: string
  index: number
}) {
  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="bento-card text-center"
    >
      <div className="text-4xl font-bold font-['Syne'] gradient-text mb-2">
        <Counter target={value} suffix={suffix} />
      </div>
      <div className="text-sm text-[#666]">{label}</div>
    </motion.div>
  )
}

/* ─── Data ─── */
const features = [
  {
    icon: Brain,
    title: 'AI Summarization',
    desc: 'State-of-the-art NLP distils hours of video into clear, concise paragraphs in seconds.',
    color: '#00F5FF',
  },
  {
    icon: Zap,
    title: 'Instant Insights',
    desc: 'Sentiment analysis, keyword extraction, and topic modelling run in parallel — zero wait.',
    color: '#AAFF00',
  },
  {
    icon: Clock,
    title: 'Chapter Timestamps',
    desc: 'Auto-detected chapters let you jump directly to the moment that matters most.',
    color: '#FF6B6B',
  },
  {
    icon: CheckCircle,
    title: 'One-Line Verdict',
    desc: 'A single sentence captures the entire value of the video — perfect for quick decisions.',
    color: '#C084FC',
  },
]

const steps = [
  { n: '01', title: 'Paste URL', desc: 'Copy any YouTube link and drop it into Glimpse.' },
  { n: '02', title: 'AI Analyzes', desc: 'Transcript is fetched, processed, and enriched with NLP.' },
  { n: '03', title: 'Get Insights', desc: 'Read the summary, explore keywords, and jump to chapters.' },
]

const stats = [
  { value: 50,  suffix: 'K+', label: 'Videos Analyzed' },
  { value: 99,  suffix: '%',  label: 'Accuracy Rate'   },
  { value: 3,   suffix: 's',  label: 'Avg. Response'   },
  { value: 120, suffix: '+',  label: 'Countries'       },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
  }),
}

/* ══════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════ */
export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      {/* grain */}
      <div className="grain-overlay" />

      {/* ─── NAVBAR ─── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="backdrop-blur-xl bg-[#0A0A0F]/70 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center">
                <span className="text-lg font-bold bg-gradient-to-br from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent font-['Syne']">
                  L
                </span>
              </div>
              <span className="text-xl font-bold font-['Syne'] bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent">
                Glimpse
              </span>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8 text-sm text-[#666]">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how" className="hover:text-white transition-colors">How it works</a>
              <a href="#stats" className="hover:text-white transition-colors">Stats</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-glow flex items-center gap-2 px-5 py-2 text-sm font-semibold"
                  >
                    <Sparkles className="w-4 h-4" /> Dashboard
                  </motion.span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-[#666] hover:text-white transition-colors flex items-center gap-1 px-3 py-2"
                  >
                    <LogIn className="w-4 h-4" /> Sign in
                  </Link>
                  <Link to="/signup">
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-glow flex items-center gap-2 px-5 py-2 text-sm font-semibold"
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* BG orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#00F5FF]/6 rounded-full blur-3xl"
            animate={{ y: [0, 40, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#AAFF00]/6 rounded-full blur-3xl"
            animate={{ y: [0, -40, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <div className="grid-bg absolute inset-0 opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-2026 mb-8"
          >
            <div className="accent-dot" />
            <span className="text-sm text-[#A0A0A0]">AI-powered · Free forever · Instant results</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold font-['Syne'] leading-[1.05] tracking-tight mb-6"
          >
            Understand any{' '}
            <span className="bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent">
              YouTube
            </span>{' '}
            video in seconds.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-xl text-[#666] max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Paste a link and get an AI summary, sentiment analysis, keywords, chapter timestamps,
            and a one-line verdict — all in one beautiful view.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-glow flex items-center gap-2 px-8 py-4 text-base font-semibold"
              >
                <Sparkles className="w-5 h-5" />
                {isAuthenticated ? 'Open Dashboard' : 'Start for free'}
              </motion.span>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-6 py-4 rounded-full glass-2026 text-[#A0A0A0] hover:text-white text-sm font-medium transition-colors"
            >
              <Play className="w-4 h-4 text-[#00F5FF]" /> Watch demo
            </motion.button>
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="glass-2026 rounded-2xl p-2 flex items-center gap-4">
              <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <span className="text-2xl">📺</span>
                <span className="text-[#444] text-sm">https://youtube.com/watch?v=…</span>
              </div>
              <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] text-[#0A0A0F] font-bold text-sm whitespace-nowrap">
                Analyze →
              </div>
            </div>

            {/* result preview cards */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Summary',  value: 'AI-generated overview', color: '#00F5FF' },
                { label: 'Sentiment', value: '87% Positive',         color: '#AAFF00' },
                { label: 'Keywords', value: '12 extracted',          color: '#C084FC' },
              ].map((card) => (
                <div key={card.label} className="glass-2026 rounded-xl p-4 text-left">
                  <div className="text-xs mb-1" style={{ color: card.color }}>{card.label}</div>
                  <div className="text-sm text-[#A0A0A0]">{card.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section id="stats" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm text-[#00F5FF] font-medium tracking-wider uppercase">Features</span>
            <h2 className="text-5xl font-bold font-['Syne'] mt-3 mb-4">Everything you need.</h2>
            <p className="text-[#666] text-lg max-w-xl mx-auto">
              No fluff, no filler — just the information that actually matters.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bento-card group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${f.color}15` }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold font-['Syne'] text-white mb-3">{f.title}</h3>
                <p className="text-[#666] leading-relaxed">{f.desc}</p>
                <div
                  className="mt-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm text-[#AAFF00] font-medium tracking-wider uppercase">Process</span>
            <h2 className="text-5xl font-bold font-['Syne'] mt-3 mb-4">Three steps.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bento-card relative"
              >
                <span className="absolute -top-5 left-6 text-6xl font-bold font-['Syne'] text-white/5 select-none pointer-events-none">
                  {s.n}
                </span>
                <h3 className="text-xl font-bold font-['Syne'] text-white mb-3 mt-4">{s.title}</h3>
                <p className="text-[#666] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bento-card accent-border text-center py-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/5 to-[#AAFF00]/5 rounded-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-5xl md:text-6xl font-bold font-['Syne'] mb-4 leading-tight">
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent">
                  Stop watching.
                </span>
                <br />
                Start understanding.
              </h2>
              <p className="text-[#666] text-lg mb-10 max-w-xl mx-auto">
                Join thousands of learners, researchers, and curators who save time every day.
              </p>
              <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-glow inline-flex items-center gap-2 px-10 py-4 text-base font-semibold"
                >
                  <Sparkles className="w-5 h-5" />
                  {isAuthenticated ? 'Go to Dashboard' : "Get started — it's free"}
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-sm font-bold bg-gradient-to-br from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent font-['Syne']">
                L
              </span>
            </div>
            <span className="text-sm font-semibold font-['Syne'] text-white">Glimpse</span>
          </div>
          <p className="text-xs text-[#555]">
            © 2026 Glimpse · Powered by FastAPI &amp; React · Built with ❤️
          </p>
          <div className="flex items-center gap-6 text-xs text-[#555]">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
