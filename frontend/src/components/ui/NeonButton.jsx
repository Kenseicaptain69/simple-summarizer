import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const NeonButton = ({ children, onClick, loading = false, variant = 'primary', className, disabled = false }) => {
  const isDisabled = loading || disabled

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      className={clsx(
        'px-6 py-2.5 rounded-lg font-medium transition-all duration-200',
        variant === 'primary' && [
          'bg-gradient-to-r from-primary-400 to-accent-400 text-bg-primary',
          'hover:glow-primary disabled:opacity-50 disabled:cursor-not-allowed',
        ],
        variant === 'ghost' && [
          'border border-primary-400 text-primary-400',
          'hover:bg-primary-400/10 disabled:opacity-50 disabled:cursor-not-allowed',
        ],
        variant === 'danger' && [
          'bg-error/20 border border-error text-error',
          'hover:bg-error/30 disabled:opacity-50 disabled:cursor-not-allowed',
        ],
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        {children}
      </div>
    </motion.button>
  )
}

export default NeonButton
