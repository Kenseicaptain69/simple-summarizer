import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ThemeToggle from './ui/ThemeToggle'

/**
 * Global Navbar — dark glassmorphism style
 * No auth — open access for everyone
 */
const Navbar = () => {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="backdrop-blur-xl bg-[#0A0A0F]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-base font-bold bg-gradient-to-br from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent font-['Syne']">
                L
              </span>
            </div>
            <span className="text-lg font-bold font-['Syne'] bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent hidden sm:block">
              Glimpse
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-2026 text-sm text-[#A0A0A0] hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#00F5FF]" />
              Dashboard
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
