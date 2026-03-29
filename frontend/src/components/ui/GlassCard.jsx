import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const GlassCard = ({ children, className, hover = true, glow = false }) => {
  return (
    <motion.div
      className={clsx(
        'glass p-6 rounded-2xl',
        glow && 'glow-primary',
        hover && 'hover:shadow-lg',
        className
      )}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard
