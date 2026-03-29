import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const SentimentBadge = ({ sentiment_overall, sentiment_label, subjectivity }) => {
  const getSentimentConfig = () => {
    const value = sentiment_overall || 0
    const label = sentiment_label || 'neutral'
    
    if (value > 0.1) {
      return {
        label: 'Positive',
        icon: TrendingUp,
        gradient: 'from-success to-emerald-400',
        bgGradient: 'from-success/10 to-emerald-400/10',
        textColor: 'text-success',
        borderColor: 'border-success/20',
        description: 'The content has a positive tone'
      }
    } else if (value < -0.1) {
      return {
        label: 'Negative',
        icon: TrendingDown,
        gradient: 'from-error to-red-400',
        bgGradient: 'from-error/10 to-red-400/10',
        textColor: 'text-error',
        borderColor: 'border-error/20',
        description: 'The content has a negative tone'
      }
    } else {
      return {
        label: 'Neutral',
        icon: Minus,
        gradient: 'from-warning to-amber-400',
        bgGradient: 'from-warning/10 to-amber-400/10',
        textColor: 'text-warning',
        borderColor: 'border-warning/20',
        description: 'The content has a neutral tone'
      }
    }
  }

  const config = getSentimentConfig()
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} p-6`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${config.textColor}`}>
                {config.label}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {config.description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted font-medium">Sentiment Score</span>
              <span className={`text-sm font-bold ${config.textColor}`}>
                {Math.round((sentiment_overall || 0) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.abs(sentiment_overall || 0) * 100}%` }}
                transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted font-medium">Subjectivity</span>
              <span className="text-sm font-bold text-text-primary">
                {Math.round((subjectivity || 0) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(subjectivity || 0) * 100}%` }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl" style={{ background: 'var(--accent-dim)' }} />
    </motion.div>
  )
}

export default SentimentBadge
