import React from 'react'
import { motion } from 'framer-motion'

/**
 * 2026 Bento Grid Skeleton Loaders
 * Match the bento card layout with shimmer effects
 */

const shimmerVariants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

const Skeleton = ({ className = '', children }) => (
  <div 
    className={`bg-gradient-to-r from-white/[0.05] via-white/[0.08] to-white/[0.05] bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`}
  >
    {children}
  </div>
)

export const BentoSkeleton = () => {
  return (
    <div className="bento-grid">
      {/* Large Summary Card */}
      <div className="bento-card bento-large accent-border">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-5" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-1/2 h-6" />
        </div>
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>
      </div>

      {/* Key Takeaways Card */}
      <div className="bento-card bento-medium">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-28 h-5" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-1.5 h-1.5 rounded-full mt-2" />
              <Skeleton className="flex-1 h-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Chapters Card */}
      <div className="bento-card bento-medium">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-20 h-5" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between py-2 border-b border-white/5">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Verdict Card */}
      <div className="bento-card bento-wide">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="w-32 h-5" />
        </div>
        <Skeleton className="w-full h-10 mb-2" />
        <Skeleton className="w-2/3 h-10" />
      </div>

      {/* Sentiment Card */}
      <div className="bento-card bento-medium">
        <Skeleton className="w-36 h-6 mb-4" />
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-16 h-4" />
            </div>
            <Skeleton className="w-full h-2 rounded-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-12 h-4" />
            </div>
            <Skeleton className="w-full h-2 rounded-full" />
          </div>
        </div>
      </div>

      {/* Keywords Card */}
      <div className="bento-card bento-medium">
        <Skeleton className="w-28 h-6 mb-4" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-24 h-8 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export const InputSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-2026 rounded-full p-2 flex items-center gap-4">
        <div className="flex-1 relative">
          <Skeleton className="w-full h-14 rounded-full" />
        </div>
        <Skeleton className="w-32 h-14 rounded-full" />
      </div>
    </div>
  )
}

export default BentoSkeleton
