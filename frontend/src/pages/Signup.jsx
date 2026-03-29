import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Eye, EyeOff, Sparkles } from 'lucide-react'
import client from '../api/client'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

/**
 * Signup page — dark glassmorphism style
 */
const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    if (password !== confirmPwd) { toast.error('Passwords do not match'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      await client.post('/api/auth/signup', { email, password })
      const res = await client.post('/api/auth/login', { email, password })
      login(res.data.access_token, email)
      toast.success('Account created! Welcome to Glimpse 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
      <div className="grain-overlay" />

      {/* BG orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-[#AAFF00]/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[#00F5FF]/6 rounded-full blur-3xl" />
        <div className="grid-bg absolute inset-0 opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md"
      >
        <div className="bento-card p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-lg font-bold bg-gradient-to-br from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent font-['Syne']">L</span>
            </div>
            <span className="text-xl font-bold font-['Syne'] bg-gradient-to-r from-[#00F5FF] to-[#AAFF00] bg-clip-text text-transparent">
              Glimpse
            </span>
          </div>

          <h1 className="text-3xl font-bold font-['Syne'] text-white mb-2">Create account</h1>
          <p className="text-[#555] mb-8 text-sm">Start understanding YouTube videos with AI</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#666] mb-2 font-medium uppercase tracking-wider">Email</label>
              <input
                id="signup-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#444] outline-none focus:border-[#AAFF00]/50 focus:shadow-[0_0_0_3px_rgba(170,255,0,0.1)] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-[#666] mb-2 font-medium uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  id="signup-password-input"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-[#444] outline-none focus:border-[#AAFF00]/50 focus:shadow-[0_0_0_3px_rgba(170,255,0,0.1)] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#666] mb-2 font-medium uppercase tracking-wider">Confirm Password</label>
              <input
                id="signup-confirm-input"
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#444] outline-none focus:border-[#AAFF00]/50 focus:shadow-[0_0_0_3px_rgba(170,255,0,0.1)] transition-all text-sm"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-glow w-full flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              id="signup-btn"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <><UserPlus className="w-5 h-5" /> Create Account</>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-[#555]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#00F5FF] hover:text-[#AAFF00] transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-[#444] hover:text-[#666] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup
