import React from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Sparkles, FileText, AlignLeft, Hash, TrendingUp } from 'lucide-react'
import GlassCard from './GlassCard'

const SummaryCard = ({ summary, onCopy, copied }) => {
  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">AI Summary</h2>
              <p className="text-xs text-text-muted">Generated from video transcript</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-hint">
              {summary?.length || 0} chars
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-primary-400/10 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">Copy</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Summary Text */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary/50 pointer-events-none" />
          <p className="text-text-primary leading-relaxed text-base relative z-10">
            {summary || 'No summary available'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-400/10 text-primary-400 text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            AI-Powered
          </span>
          <span className="text-xs text-text-hint">
            {summary?.split(/\s+/).filter(Boolean).length || 0} words
          </span>
        </div>
      </div>
    </GlassCard>
  )
}

export default SummaryCard
