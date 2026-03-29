import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import client from '../../api/client'
import toast from 'react-hot-toast'

const ChatBox = ({ videoId }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const suggestedQuestions = [
    'What is the main topic?',
    'List the key takeaways',
    'Who is the target audience?',
    'What should I learn next?',
  ]

  const handleSendMessage = async (question) => {
    if (!question.trim()) return

    const userMessage = { role: 'user', content: question }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await client.post('/api/chat', {
        video_id: videoId,
        question,
      })

      const aiMessage = { role: 'ai', content: response.data.answer }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to get response'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard>
      <div className="flex flex-col h-[600px]">
        {/* Header */}
        <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="text-lg font-bold text-text-primary">Chat with this Video</h3>
          <p className="text-sm text-text-muted mt-1">Ask anything — I've read the entire transcript</p>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-text-muted text-sm mb-4">Suggested questions:</p>
                <div className="grid gap-2">
                  {suggestedQuestions.map((question) => (
                    <motion.button
                      key={question}
                      onClick={() => handleSendMessage(question)}
                      whileHover={{ scale: 1.02 }}
                      className="text-left p-4 rounded-lg border border-primary-400/30 hover:bg-primary-400/10 transition-colors glass"
                    >
                      <p className="text-sm text-text-primary">{question}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-primary-400 to-accent-400 text-bg-primary rounded-tr-none'
                        : 'glass text-text-primary rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="px-4 py-3 rounded-2xl glass">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary-400"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ delay: i * 0.1, duration: 0.8, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSendMessage(input)
              }
            }}
            placeholder="Ask a question about this video..."
            className="flex-1 px-4 py-3 rounded-lg glass focus:ring-2 focus:ring-primary-400 outline-none transition-all disabled:opacity-50"
            disabled={loading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || loading}
            className="p-3 rounded-lg bg-gradient-to-r from-primary-400 to-accent-400 text-bg-primary hover:glow-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </GlassCard>
  )
}

export default ChatBox
