import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, ArrowLeft, WifiOff } from 'lucide-react'
import GlassCard from './GlassCard'

const ErrorCard = ({ error, onRetry, onBack }) => {
  const getErrorConfig = () => {
    const message = error?.toLowerCase() || ''

    if (message.includes('timeout') || message.includes('refused')) {
      return {
        icon: WifiOff,
        title: 'Connection Error',
        subtitle: 'Backend server is not responding',
        gradient: 'from-red-500 to-orange-500',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/20',
        buttonText: 'Retry Connection'
      }
    }

    if (message.includes('not found') || message.includes('404')) {
      return {
        icon: AlertCircle,
        title: 'Not Found',
        subtitle: 'The requested resource could not be located',
        gradient: 'from-amber-500 to-yellow-500',
        bgGradient: 'from-amber-500/10 to-yellow-500/10',
        borderColor: 'border-amber-500/20',
        buttonText: 'Go Back'
      }
    }

    if (message.includes('auth') || message.includes('401') || message.includes('403')) {
      return {
        icon: AlertCircle,
        title: 'Authentication Error',
        subtitle: 'Please log in again to continue',
        gradient: 'from-violet-500 to-purple-500',
        bgGradient: 'from-violet-500/10 to-purple-500/10',
        borderColor: 'border-violet-500/20',
        buttonText: 'Log In Again'
      }
    }

    return {
      icon: AlertCircle,
      title: 'Something Went Wrong',
      subtitle: 'An unexpected error occurred',
      gradient: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-500/10 to-rose-500/10',
      borderColor: 'border-red-500/20',
      buttonText: 'Try Again'
    }
  }

  const config = getErrorConfig()
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <GlassCard className={`border-2 ${config.borderColor}`}>
          <div className="text-center space-y-6">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${config.bgGradient}`}
            >
              <Icon className={`w-12 h-12 bg-gradient-to-br ${config.gradient} bg-clip-text text-transparent`} />
            </motion.div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text-primary">
                {config.title}
              </h2>
              <p className="text-text-muted text-sm">
                {config.subtitle}
              </p>
            </div>

            {/* Error Message */}
            <div className="rounded-lg p-4" style={{ background: 'var(--bg-code)' }}>
              <p className="text-xs text-text-hint font-mono text-left">
                {error || 'An unexpected error occurred'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              {onRetry && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRetry}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow`}
                  id="error-retry-btn"
                >
                  <RefreshCw className="w-4 h-4" />
                  {config.buttonText}
                </motion.button>
              )}

              {onBack && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBack}
                  className="w-full py-3 rounded-xl glass text-text-primary font-semibold flex items-center justify-center gap-2 transition-colors"
                  id="error-back-btn"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </motion.button>
              )}
            </div>

            {/* Help Text */}
            <p className="text-xs text-text-hint pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              If this problem persists, please check the browser console (F12) for more details.
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default ErrorCard
