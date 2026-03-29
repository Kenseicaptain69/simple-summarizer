import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Loader, Sparkles, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import client from '../api/client'
import toast from 'react-hot-toast'

/**
 * 2026 Production-Grade Dashboard
 * Dark Glassmorphism + Bento Grid Layout
 */
const Dashboard2026 = () => {
  const [url, setUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  
  // Mock data for demonstration
  const [mockResult, setMockResult] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL')
      return
    }

    setAnalyzing(true)
    setAnalysisStep(1)
    
    // Simulate analysis steps
    setTimeout(() => setAnalysisStep(2), 1000)
    setTimeout(() => setAnalysisStep(3), 2000)
    setTimeout(() => setAnalysisStep(4), 3000)
    
    try {
      const response = await client.post('/api/analyze', { youtube_url: url })
      toast.success('Analysis complete!')
      setMockResult(response.data)
      setAnalyzing(false)
      setAnalysisStep(0)
    } catch (error) {
      toast.error('Analysis failed')
      setAnalyzing(false)
      setAnalysisStep(0)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
      {/* Grain Texture Overlay */}
      <div className="grain-overlay" />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#00F5FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header 
          className="flex items-center justify-between mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-br from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent font-['Syne']">
                L
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-['Syne'] text-white">
                Glimpse
              </h1>
              <p className="text-sm text-[#666]">Video Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="accent-dot" />
            <span className="text-sm text-[#666]">System Online</span>
          </div>
        </motion.header>

        {/* URL Input Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleAnalyze} className="max-w-4xl mx-auto">
            <div className="glass-2026 rounded-full p-2 flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  className="w-full bg-transparent text-white placeholder-[#666] px-6 py-4 text-lg outline-none"
                  disabled={analyzing}
                />
              </div>
              <motion.button
                type="submit"
                disabled={analyzing || !url.trim()}
                whileHover={{ scale: analyzing ? 1 : 1.02 }}
                whileTap={{ scale: analyzing ? 1 : 0.98 }}
                className="btn-glow flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Analysis Progress */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto mt-6"
              >
                <div className="space-y-3">
                  {[
                    { step: 1, label: 'Fetching transcript', icon: Play },
                    { step: 2, label: 'Running NLP analysis', icon: Clock },
                    { step: 3, label: 'Generating summary', icon: Sparkles },
                    { step: 4, label: 'Building insights', icon: CheckCircle }
                  ].map(({ step, label, icon: Icon }) => (
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
                        ) : analysisStep === step ? (
                          <Icon className="w-5 h-5 text-[#00F5FF]" />
                        ) : (
                          <Icon className="w-5 h-5 text-[#666]" />
                        )}
                      </div>
                      <span className={`font-medium ${
                        analysisStep >= step ? 'text-white' : 'text-[#666]'
                      }`}>
                        {label}
                      </span>
                      {analysisStep === step && (
                        <Loader className="w-4 h-4 text-[#00F5FF] animate-spin ml-auto" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bento Grid Results */}
        <AnimatePresence>
          {mockResult && (
            <motion.div
              className="bento-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Card 1: Full Summary - Large */}
              <motion.div variants={cardVariants} className="bento-card bento-large accent-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5FF] to-[#AAFF00] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#0A0A0F]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-['Syne'] text-white">Full Summary</h2>
                    <p className="text-sm text-[#666]">AI-generated overview</p>
                  </div>
                </div>
                <p className="text-lg text-[#A0A0A0] leading-relaxed">
                  {mockResult.summary || 'The video explores fundamental concepts in machine learning, covering both supervised and unsupervised approaches. The presenter breaks down complex algorithms into digestible explanations, making it accessible for beginners while still providing depth for intermediate learners.'}
                </p>
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4">
                  <span className="text-sm text-[#666]">
                    {mockResult.analytics?.word_count || 487} words
                  </span>
                  <span className="text-sm text-[#666]">
                    {mockResult.analytics?.sentence_count || 12} sentences
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] text-sm font-medium">
                    {mockResult.analytics?.sentiment_label || 'positive'}
                  </span>
                </div>
              </motion.div>

              {/* Card 2: Key Takeaways */}
              <motion.div variants={cardVariants} className="bento-card bento-medium">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#AAFF00]/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[#AAFF00]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-['Syne'] text-white">Key Takeaways</h2>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Supervised vs unsupervised learning fundamentals',
                    'Real-world applications in tech industry',
                    'Hands-on coding demonstrations',
                    'Best practices for model optimization'
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] mt-2 flex-shrink-0" />
                      <span className="text-[#A0A0A0]">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Card 3: Chapter Timestamps */}
              <motion.div variants={cardVariants} className="bento-card bento-medium">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#00F5FF]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#00F5FF]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-['Syne'] text-white">Chapters</h2>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '0:00', title: 'Introduction' },
                    { time: '2:45', title: 'ML Basics' },
                    { time: '8:20', title: 'Deep Dive' },
                    { time: '15:30', title: 'Applications' }
                  ].map((chapter, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                    >
                      <span className="font-mono text-[#00F5FF]">{chapter.time}</span>
                      <span className="text-[#A0A0A0]">{chapter.title}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Card 4: One Line Verdict */}
              <motion.div 
                variants={cardVariants} 
                className="bento-card bento-wide bg-gradient-to-br from-[#00F5FF]/10 to-[#AAFF00]/10 border-[#00F5FF]/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-[#00F5FF]" />
                  <h2 className="text-lg font-bold font-['Syne'] text-white">One Line Verdict</h2>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-['Syne'] leading-tight">
                  <span className="bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent">
                    Essential viewing for anyone starting their AI journey
                  </span>
                </p>
              </motion.div>

              {/* Card 5: Sentiment Analysis */}
              <motion.div variants={cardVariants} className="bento-card bento-medium">
                <h2 className="text-lg font-bold font-['Syne'] text-white mb-4">Sentiment Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#666]">Overall Tone</span>
                      <span className="text-[#00F5FF] font-medium">{(mockResult.analytics?.sentiment_overall || 0.7) * 100}% Positive</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(mockResult.analytics?.sentiment_overall || 0.7) * 100}%` }}
                        transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#666]">Subjectivity</span>
                      <span className="text-[#AAFF00] font-medium">{(mockResult.analytics?.subjectivity || 0.6) * 100}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(mockResult.analytics?.subjectivity || 0.6) * 100}%` }}
                        transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
                        className="h-full bg-[#AAFF00] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 6: Top Keywords */}
              <motion.div variants={cardVariants} className="bento-card bento-medium">
                <h2 className="text-lg font-bold font-['Syne'] text-white mb-4">Top Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {(mockResult.analytics?.top_keywords || [
                    { word: 'machine learning', count: 42 },
                    { word: 'algorithm', count: 28 },
                    { word: 'data', count: 24 },
                    { word: 'model', count: 19 },
                    { word: 'training', count: 15 }
                  ]).slice(0, 5).map((kw, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="px-4 py-2 rounded-full glass-2026 text-sm text-[#A0A0A0] hover:text-[#00F5FF] cursor-default"
                    >
                      {kw.word}
                      <span className="ml-2 text-xs text-[#666]">{kw.count}</span>
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!mockResult && !analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-[#00F5FF]" />
              </div>
              <h2 className="text-2xl font-bold font-['Syne'] text-white mb-3">
                Ready to Analyze
              </h2>
              <p className="text-[#666]">
                Paste a YouTube URL above to get an AI-powered summary, key takeaways, and insights
              </p>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          className="mt-20 pt-8 border-t border-white/5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-[#666]">
            Powered by Glimpse • Built with FastAPI & React • 2026
          </p>
        </motion.footer>
      </div>
    </div>
  )
}

export default Dashboard2026
