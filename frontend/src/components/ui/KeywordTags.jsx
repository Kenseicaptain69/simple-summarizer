import React from 'react'
import { motion } from 'framer-motion'
import { Hash, TrendingUp } from 'lucide-react'
import GlassCard from './GlassCard'

const KeywordTags = ({ keywords = [], topBigrams = [] }) => {
  if (!keywords?.length && !topBigrams?.length) return null

  return (
    <div className="space-y-6">
      {/* Keywords Section */}
      {keywords?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Top Keywords</h3>
                  <p className="text-xs text-text-muted">Most frequent terms</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {keywords.slice(0, 15).map((keyword, index) => (
                  <motion.div
                    key={keyword.word}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="group"
                  >
                    <div className="relative px-4 py-2 rounded-full glass hover:bg-primary-400/20 transition-all cursor-default">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary group-hover:text-primary-400 transition-colors">
                          {keyword.word}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-hint group-hover:bg-primary-400/20 transition-colors">
                          {keyword.count}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Top Bigrams Section */}
      {topBigrams?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Key Phrases</h3>
                  <p className="text-xs text-text-muted">Common two-word combinations</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {topBigrams.slice(0, 10).map((bigram, index) => (
                  <motion.div
                    key={bigram}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="group"
                  >
                    <div className="px-4 py-2 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 transition-all cursor-default">
                      <span className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        {bigram}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

export default KeywordTags
