import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Clock, CheckCircle, AlertCircle, ArrowLeft,
  Loader, Brain, TrendingUp,
} from 'lucide-react'
import client from '../api/client'
import toast from 'react-hot-toast'

const Result = () => {
  const { analysis_id, id } = useParams()
  const navigate = useNavigate()
  const resolvedId = analysis_id || id

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!resolvedId) return
    fetchResult()
  }, [resolvedId])

  const fetchResult = async () => {
    try {
      const res = await client.get(`/api/history/${resolvedId}`)
      setData(res.data)
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to load result'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] },
    }),
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
      <div className="grain-overlay" />

      {/* BG glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#00F5FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl" />
        <div className="grid-bg absolute inset-0 opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#666] hover:text-white transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </motion.button>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader className="w-10 h-10 text-[#00F5FF] animate-spin" />
            <p className="text-[#555]">Loading results…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bento-card text-center py-20 max-w-md mx-auto"
          >
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold font-['Syne'] text-white mb-2">Could not load result</h2>
            <p className="text-[#555] text-sm mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-glow px-6 py-2 text-sm font-semibold"
            >
              Go Back
            </button>
          </motion.div>
        )}

        {/* Results */}
        {data && !loading && (
          <motion.div
            className="bento-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {/* Card 1: Full Summary */}
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="bento-card bento-large accent-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5FF] to-[#AAFF00] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#0A0A0F]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-['Syne'] text-white">Full Summary</h2>
                  <p className="text-sm text-[#555]">AI-generated overview</p>
                </div>
              </div>
              <p className="text-lg text-[#A0A0A0] leading-relaxed">
                {data.summary || 'No summary available.'}
              </p>
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4">
                <span className="text-sm text-[#555]">{data.analytics?.word_count || '—'} words</span>
                <span className="text-sm text-[#555]">{data.analytics?.sentence_count || '—'} sentences</span>
                {data.analytics?.sentiment_label && (
                  <span className="px-3 py-1 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] text-sm font-medium capitalize">
                    {data.analytics.sentiment_label}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Card 2: Key Takeaways */}
            {data.key_takeaways && (
              <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="bento-card bento-medium">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#AAFF00]/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[#AAFF00]" />
                  </div>
                  <h2 className="text-lg font-bold font-['Syne'] text-white">Key Takeaways</h2>
                </div>
                <ul className="space-y-3">
                  {data.key_takeaways.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] mt-2 flex-shrink-0" />
                      <span className="text-[#A0A0A0] text-sm">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Card 3: Chapters */}
            {data.chapters && data.chapters.length > 0 && (
              <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="bento-card bento-medium">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#00F5FF]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#00F5FF]" />
                  </div>
                  <h2 className="text-lg font-bold font-['Syne'] text-white">Chapters</h2>
                </div>
                <div className="space-y-3">
                  {data.chapters.map((ch, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="font-mono text-[#00F5FF] text-sm">{ch.time}</span>
                      <span className="text-[#A0A0A0] text-sm">{ch.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Card 4: One-line verdict */}
            {data.one_line_verdict && (
              <motion.div
                custom={3}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bento-card bento-wide bg-gradient-to-br from-[#00F5FF]/10 to-[#AAFF00]/10 border-[#00F5FF]/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-[#00F5FF]" />
                  <h2 className="text-lg font-bold font-['Syne'] text-white">One-Line Verdict</h2>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-['Syne'] leading-tight">
                  <span className="bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent">
                    {data.one_line_verdict}
                  </span>
                </p>
              </motion.div>
            )}

            {/* Card 5: Sentiment */}
            {data.analytics && (
              <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className="bento-card bento-medium">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#C084FC]/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#C084FC]" />
                  </div>
                  <h2 className="text-lg font-bold font-['Syne'] text-white">Sentiment Analysis</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#555]">Overall Tone</span>
                      <span className="text-[#00F5FF] font-medium">
                        {Math.round((data.analytics.sentiment_overall || 0) * 100)}% Positive
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.analytics.sentiment_overall || 0) * 100}%` }}
                        transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] rounded-full"
                      />
                    </div>
                  </div>
                  {data.analytics.subjectivity !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#555]">Subjectivity</span>
                        <span className="text-[#AAFF00] font-medium">
                          {Math.round(data.analytics.subjectivity * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.analytics.subjectivity * 100}%` }}
                          transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
                          className="h-full bg-[#AAFF00] rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Card 6: Keywords */}
            {data.analytics?.top_keywords && (
              <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible" className="bento-card bento-medium">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#AAFF00]/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#AAFF00]" />
                  </div>
                  <h2 className="text-lg font-bold font-['Syne'] text-white">Top Keywords</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.analytics.top_keywords.slice(0, 8).map((kw, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + idx * 0.07 }}
                      className="px-4 py-2 rounded-full glass-2026 text-sm text-[#A0A0A0] hover:text-[#00F5FF] cursor-default transition-colors"
                    >
                      {kw.word}
                      <span className="ml-2 text-xs text-[#555]">{kw.count}</span>
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        <motion.footer
          className="mt-20 pt-8 border-t border-white/5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-[#333]">Powered by Glimpse · Built with FastAPI &amp; React · 2026</p>
        </motion.footer>
      </div>
    </div>
  )
}

export default Result
