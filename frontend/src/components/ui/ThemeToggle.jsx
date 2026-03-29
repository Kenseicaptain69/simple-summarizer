import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-16 h-9 rounded-full flex items-center px-1 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(170, 255, 0, 0.05))'
          : 'linear-gradient(135deg, rgba(0, 151, 167, 0.1), rgba(255, 200, 50, 0.1))',
        border: `1px solid var(--border)`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      id="theme-toggle-btn"
    >
      {/* Background icons for context */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className="w-3.5 h-3.5 text-amber-400/30" />
        <Moon className="w-3.5 h-3.5 text-cyan-400/30" />
      </div>

      {/* Sliding knob */}
      <motion.div
        layout
        className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, var(--accent), var(--accent-green))'
            : 'linear-gradient(135deg, #FFC107, #FF9800)',
        }}
        animate={{
          x: isDark ? 0 : 26,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 0 : 180, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-[#0A0A0F]" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-white" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle
