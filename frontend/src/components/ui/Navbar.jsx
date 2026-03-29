import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

/**
 * Legacy Navbar (ui/) — No auth
 */
const Navbar = () => {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg-primary/80 border-b border-border"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="gradient-text font-bold text-xl hidden sm:block">Glimpse</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-white transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
