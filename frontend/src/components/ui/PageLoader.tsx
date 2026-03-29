import { motion } from 'framer-motion'

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent"
            animate={{ scale: [1, 1.5], opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-text-muted text-sm">Loading...</p>
      </motion.div>
    </div>
  )
}

export default PageLoader
