import React from 'react'
import { motion } from 'framer-motion'
import { FileText, AlignLeft, Hash, TrendingUp, Activity, Gauge } from 'lucide-react'
import GlassCard from './GlassCard'

const StatCard = ({ icon: Icon, label, value, suffix = '', color = 'primary', delay = 0 }) => {
  const colorClasses = {
    primary: 'from-primary-400 to-primary-500 text-primary-400',
    success: 'from-success to-emerald-500 text-success',
    error: 'from-error to-red-500 text-error',
    warning: 'from-warning to-amber-500 text-warning',
    cyan: 'from-cyan-400 to-cyan-500 text-cyan-400',
    violet: 'from-violet-400 to-violet-500 text-violet-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
    >
      <GlassCard hover className="h-full">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-text-primary truncate">
              {value}{suffix && <span className="text-lg text-text-muted ml-1">{suffix}</span>}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

const AnalyticsGrid = ({ analytics }) => {
  if (!analytics) return null

  const stats = [
    {
      icon: FileText,
      label: 'Word Count',
      value: analytics.word_count?.toLocaleString() || 0,
      color: 'primary'
    },
    {
      icon: AlignLeft,
      label: 'Sentences',
      value: analytics.sentence_count?.toLocaleString() || 0,
      color: 'cyan'
    },
    {
      icon: Hash,
      label: 'Avg Sentence',
      value: analytics.avg_sentence_length?.toFixed(1) || 0,
      color: 'violet',
      suffix: 'words'
    },
    {
      icon: TrendingUp,
      label: 'Sentiment',
      value: Math.round((analytics.sentiment_overall || 0) * 100),
      color: analytics.sentiment_overall > 0 ? 'success' : 'error',
      suffix: '%'
    },
    {
      icon: Activity,
      label: 'Subjectivity',
      value: Math.round((analytics.subjectivity || 0) * 100),
      color: 'warning',
      suffix: '%'
    },
    {
      icon: Gauge,
      label: 'Readability',
      value: analytics.readability_score?.toFixed(1) || 0,
      color: 'primary',
      suffix: '/100'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index} />
      ))}
    </div>
  )
}

export default AnalyticsGrid
