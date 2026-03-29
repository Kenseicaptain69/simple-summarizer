import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

/**
 * Global Footer — dark glassmorphism style
 */
const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-10 px-6 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-sm font-bold bg-gradient-to-br from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent font-['Syne']">
              L
            </span>
          </div>
          <span className="text-base font-bold font-['Syne'] text-white">Glimpse</span>
          <span className="text-xs text-[#333] ml-1">Video Intelligence</span>
        </div>

        {/* Tagline */}
        <p className="text-xs text-[#444] text-center">
          © 2026 Glimpse · Powered by FastAPI &amp; React · Made with{' '}
          <Sparkles className="w-3 h-3 inline text-[#00F5FF]" />
        </p>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-[#555]">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
