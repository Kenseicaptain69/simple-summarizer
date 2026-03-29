import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Loader, Sparkles, Clock, CheckCircle, History, Trash2,
} from 'lucide-react'
import client from '../api/client'
import toast from 'react-hot-toast'
import ThemeToggle from '../components/ui/ThemeToggle'

/* ─── History Card ─── */
const HistoryCard = ({ item, onSelect, onDelete }: { item: any; onSelect: (id: string) => void; onDelete: (id: string) => void }) => {
  const thumbnail = `https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="bento-card cursor-pointer group relative"
    >
      <div onClick={() => onSelect(item.id)}>
        {/* Thumbnail */}
        <div className="relative overflow-hidden rounded-xl mb-4 h-36 bg-white/5">
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-[#00F5FF]/15 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-[#00F5FF] fill-[#00F5FF]" />
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-2">
          <span className="px-2 py-1 rounded text-xs font-mono bg-[#00F5FF]/10 text-[#00F5FF]">
            {item.video_id}
          </span>
          <p className="text-sm text-[#A0A0A0] line-clamp-2 leading-relaxed">
            {item.summary || 'No summary available'}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#555]">{new Date(item.created_at).toLocaleDateString()}</span>
            <span className="text-xs text-[#00F5FF] group-hover:text-[#AAFF00] transition-colors">
              View Results →
            </span>
          </div>
        </div>
      </div>

      {/* Delete button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </motion.button>
    </motion.div>
  )
}

/* ─── Analysis Steps ─── */
const STEPS = [
  { step: 1, label: 'Fetching transcript',   icon: Play       },
  { step: 2, label: 'Running NLP analysis',  icon: Clock      },
  { step: 3, label: 'Building search index', icon: Sparkles   },
  { step: 4, label: 'Generating summary',    icon: CheckCircle },
]

/* ══════════════════════════════════════════════
   DASHBOARD — No Auth Required
══════════════════════════════════════════════ */
const Dashboard = () => {
  const [url, setUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const navigate = useNavigate()

  // Fetch history on mount
  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true)
      const res = await client.get('/api/history')
      setHistory(res.data)
    } catch (err) {
      // History fetch failed silently — not critical
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await client.delete(`/api/history/${id}`)
      setHistory(prev => prev.filter(item => item.id !== Number(id)))
      toast.success('Analysis deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) { toast.error('Please enter a YouTube URL'); return }

    setAnalyzing(true)
    setAnalysisStep(1)

    try {
      await new Promise(r => setTimeout(r, 800)); setAnalysisStep(2)
      await new Promise(r => setTimeout(r, 800)); setAnalysisStep(3)
      const response = await client.post('/api/analyze', { youtube_url: url })
      setAnalysisStep(4)
      await new Promise(r => setTimeout(r, 500))
      toast.success('Analysis complete!')
      setUrl('')
      setAnalyzing(false)
      setAnalysisStep(0)
      navigate(`/result/${response.data.id}`)
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Analysis failed. Please check the URL.'
      toast.error(msg)
      setAnalyzing(false)
      setAnalysisStep(0)
    }
  }

  /* ─── render ─── */
  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
      <div className="grain-overlay" />

      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#00F5FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl" />
        <div className="grid-bg absolute inset-0 opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* ─── Header ─── */}
        <motion.header
          className="flex items-center justify-between mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center">
              <span className="text-xl font-bold bg-gradient-to-br from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent font-['Syne']">
                L
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold font-['Syne'] text-white">Glimpse</h1>
              <p className="text-xs text-[#555]">Video Intelligence</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="accent-dot" />
              <span className="text-sm text-[#555]">System Online</span>
            </div>
          </div>
        </motion.header>

        {/* ─── URL Input ─── */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold font-['Syne'] text-white mb-3 leading-tight">
              Understand any{' '}
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent">
                YouTube
              </span>{' '}
              video
            </h2>
            <p className="text-[#555] text-lg">Paste a URL and get AI-powered insights instantly</p>
          </div>

          <form onSubmit={handleAnalyze} className="max-w-4xl mx-auto">
            <div className="glass-2026 rounded-full p-2 flex items-center gap-4">
              <span className="text-2xl pl-4">📺</span>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                className="flex-1 bg-transparent text-white placeholder-[#444] py-4 text-base outline-none"
                disabled={analyzing}
                id="youtube-url-input"
              />
              <motion.button
                type="submit"
                disabled={analyzing || !url.trim()}
                whileHover={{ scale: analyzing ? 1 : 1.02 }}
                whileTap={{ scale: analyzing ? 1 : 0.98 }}
                className="btn-glow flex items-center gap-2 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                id="analyze-btn"
              >
                {analyzing ? (
                  <><Loader className="w-5 h-5 animate-spin" /><span>Analyzing…</span></>
                ) : (
                  <><Sparkles className="w-5 h-5" /><span>Analyze</span></>
                )}
              </motion.button>
            </div>
          </form>

          {/* Progress steps */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto mt-6 space-y-3"
              >
                {STEPS.map(({ step, label, icon: Icon }) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (step - 1) * 0.1 }}
                    className={`glass-2026 rounded-xl p-4 flex items-center gap-4 ${
                      analysisStep >= step ? 'border-[#00F5FF]/30' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      analysisStep > step
                        ? 'bg-[#00F5FF]/20'
                        : analysisStep === step
                          ? 'bg-[#00F5FF]/10 animate-pulse'
                          : 'bg-white/5'
                    }`}>
                      {analysisStep > step ? (
                        <CheckCircle className="w-5 h-5 text-[#00F5FF]" />
                      ) : (
                        <Icon className={`w-5 h-5 ${analysisStep >= step ? 'text-[#00F5FF]' : 'text-[#555]'}`} />
                      )}
                    </div>
                    <span className={`font-medium flex-1 ${analysisStep >= step ? 'text-white' : 'text-[#555]'}`}>
                      {label}
                    </span>
                    {analysisStep === step && (
                      <Loader className="w-4 h-4 text-[#00F5FF] animate-spin ml-auto" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── History Section ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#00F5FF]/10 flex items-center justify-center">
              <History className="w-5 h-5 text-[#00F5FF]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-['Syne'] text-white">Recent Analyses</h2>
              <p className="text-sm text-[#555]">Pick up where you left off</p>
            </div>
          </div>

          {loadingHistory ? (
            /* Loading skeleton */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bento-card animate-pulse">
                  <div className="rounded-xl mb-4 h-36 bg-white/5" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-white/5 rounded" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-2/3 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : history.length > 0 ? (
            /* Actual history grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  onSelect={(id) => navigate(`/result/${id}`)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur border border-white/10 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-[#00F5FF]" />
              </div>
              <h3 className="text-2xl font-bold font-['Syne'] text-white mb-3">Ready to Analyze</h3>
              <p className="text-[#555] max-w-sm mx-auto">
                Paste a YouTube URL above to get an AI-powered summary, key takeaways, and insights.
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="mt-20 pt-8 border-t border-white/5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-[#444]">Powered by Glimpse · Built with FastAPI &amp; React · 2026</p>
        </motion.footer>

      </div>
    </div>
  )
}

export default Dashboard
