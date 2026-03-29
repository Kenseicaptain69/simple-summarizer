import React, { useEffect, memo } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

const Counter = memo(({ from = 0, to, duration = 1.5 }) => {
  const motionValue = useMotionValue(from)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = motionValue.set(to)
    motionValue.animate(to, { duration, ease: 'easeOut' })
  }, [to, motionValue, duration])

  return <motion.span>{rounded}</motion.span>
})

Counter.displayName = 'Counter'

const colorClasses = {
  violet: 'text-primary-400',
  cyan: 'text-accent-400',
  green: 'text-success',
  red: 'text-error',
  amber: 'text-warning',
}

const StatCard = memo(({ label, value, icon: Icon, color, suffix = '' }) => {
  return (
    <motion.div
      className="glass p-6 rounded-2xl relative overflow-hidden group cursor-default"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/5 to-accent-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-text-muted text-sm font-medium tracking-wide uppercase">{label}</div>
            <div className={`text-4xl font-bold font-mono mt-2 ${colorClasses[color]}`}>
              <Counter to={typeof value === 'number' ? value : 0} />
              {suffix}
            </div>
          </div>
          {Icon && <Icon className={`w-8 h-8 ${colorClasses[color]}`} />}
        </div>
        <div className={`h-1 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 opacity-60`} />
      </div>
    </motion.div>
  )
})

StatCard.displayName = 'StatCard'

export default StatCard
