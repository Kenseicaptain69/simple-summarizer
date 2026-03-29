import React from 'react'
import { motion } from 'framer-motion'

const Shimmer = ({ className }) => (
  <motion.div
    className={`rounded ${className}`}
    animate={{
      backgroundPosition: ['200% 0', '-200% 0'],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    }}
    style={{
      background: `linear-gradient(90deg, var(--skeleton-base) 0%, var(--skeleton-shine) 50%, var(--skeleton-base) 100%)`,
      backgroundSize: '200% 100%',
    }}
  />
)

export const SummarySkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Shimmer className="w-10 h-10 rounded-xl" />
      <div className="space-y-2">
        <Shimmer className="w-24 h-4 rounded" />
        <Shimmer className="w-32 h-3 rounded" />
      </div>
    </div>
    <div className="space-y-3">
      <Shimmer className="w-full h-4 rounded" />
      <Shimmer className="w-full h-4 rounded" />
      <Shimmer className="w-3/4 h-4 rounded" />
      <Shimmer className="w-1/2 h-4 rounded" />
    </div>
  </div>
)

export const AnalyticsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="glass rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Shimmer className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Shimmer className="w-20 h-3 rounded" />
            <Shimmer className="w-16 h-6 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const KeywordTagsSkeleton = () => (
  <div className="glass rounded-xl p-6">
    <div className="flex items-center gap-3 mb-4">
      <Shimmer className="w-8 h-8 rounded-lg" />
      <Shimmer className="w-24 h-4 rounded" />
    </div>
    <div className="flex flex-wrap gap-2">
      {[...Array(8)].map((_, i) => (
        <Shimmer key={i} className="w-20 h-8 rounded-full" />
      ))}
    </div>
  </div>
)

export const SentimentSkeleton = () => (
  <div className="glass rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-6">
      <Shimmer className="w-12 h-12 rounded-xl" />
      <Shimmer className="w-24 h-6 rounded" />
    </div>
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Shimmer className="w-20 h-3 rounded" />
          <Shimmer className="w-12 h-3 rounded" />
        </div>
        <Shimmer className="w-full h-2 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Shimmer className="w-20 h-3 rounded" />
          <Shimmer className="w-12 h-3 rounded" />
        </div>
        <Shimmer className="w-full h-2 rounded-full" />
      </div>
    </div>
  </div>
)

export const ResultPageSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 mt-20">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Shimmer className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <Shimmer className="w-48 h-6 rounded" />
          <Shimmer className="w-32 h-4 rounded" />
        </div>
      </div>
      <Shimmer className="w-32 h-10 rounded-lg" />
    </div>

    {/* Summary */}
    <div className="glass rounded-2xl p-8">
      <SummarySkeleton />
    </div>

    {/* Analytics Grid */}
    <AnalyticsGridSkeleton />

    {/* Sentiment */}
    <SentimentSkeleton />

    {/* Keywords */}
    <KeywordTagsSkeleton />
  </div>
)

export default ResultPageSkeleton
