import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Code } from 'lucide-react'
import GlassCard from './GlassCard'

const CollapsibleSection = ({ title, subtitle, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <GlassCard hover>
      <div className="space-y-4">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between group"
          id={`collapsible-${title?.replace(/\s+/g, '-').toLowerCase()}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-primary-400/10 transition-colors" style={{ background: 'var(--surface)' }}>
              <Icon className="w-4 h-4 text-text-muted" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-text-primary group-hover:text-primary-400 transition-colors">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-text-muted">{subtitle}</p>
              )}
            </div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-primary-400/10 transition-colors"
            style={{ background: 'var(--surface)' }}
          >
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </motion.div>
        </button>

        {/* Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}

export const JsonViewer = ({ data, maxHeight = '400px' }) => {
  const jsonString = JSON.stringify(data, null, 2)

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => navigator.clipboard.writeText(jsonString)}
          className="px-3 py-1.5 rounded-lg glass text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-2"
          id="copy-json-btn"
        >
          <Code className="w-3 h-3" />
          Copy JSON
        </button>
      </div>

      <div
        className="rounded-lg p-4 overflow-auto code-block"
        style={{ maxHeight }}
      >
        <pre className="text-xs font-mono leading-relaxed">
          {jsonString.split('\n').map((line, index) => {
            let className = 'text-text-secondary'

            if (line.includes('"') && line.includes(':')) {
              className = 'text-cyan-500'
            } else if (line.trim().startsWith('"') && line.includes(':')) {
              className = 'text-emerald-500'
            } else if (line.trim().match(/^-?\d+\.?\d*$/)) {
              className = 'text-amber-500'
            } else if (line.trim() === 'true' || line.trim() === 'false') {
              className = 'text-purple-500'
            } else if (line.trim() === 'null') {
              className = 'text-red-500'
            }

            return (
              <div key={index} className={className}>
                {line}
              </div>
            )
          })}
        </pre>
      </div>
    </div>
  )
}

export default CollapsibleSection
