import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock } from 'lucide-react'
import GlassCard from './GlassCard'

const LoadingPipeline = ({ currentStep }) => {
  const steps = [
    { id: 0, label: 'Fetching Transcript', icon: '📹' },
    { id: 1, label: 'Running NLP Analysis', icon: '🧠' },
    { id: 2, label: 'Building Search Index', icon: '📊' },
    { id: 3, label: 'Generating Summary', icon: '✨' },
  ]

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep
            const isCompleted = idx < currentStep

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className={isActive ? 'glow-primary' : ''}>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{step.icon}</div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">{step.label}</p>
                    </div>
                    <div>
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <CheckCircle className="w-6 h-6 text-success" />
                        </motion.div>
                      )}
                      {isActive && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        >
                          <Clock className="w-6 h-6 text-primary-400" />
                        </motion.div>
                      )}
                      {!isActive && !isCompleted && (
                        <div className="w-6 h-6 rounded-full border-2 border-text-hint opacity-30" />
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default LoadingPipeline
