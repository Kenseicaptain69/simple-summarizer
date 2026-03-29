import { useCallback, useState } from 'react'
import client from '../api/client'

export const useAnalysis = () => {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const analyze = useCallback(async (url) => {
    try {
      setStatus('step1')
      setError(null)

      await new Promise((r) => setTimeout(r, 500))
      setStatus('step2')

      await new Promise((r) => setTimeout(r, 500))
      setStatus('step3')

      const response = await client.post('/api/analyze', { youtube_url: url })

      setStatus('step4')
      await new Promise((r) => setTimeout(r, 300))

      setData(response.data)
      setStatus('done')
      return response.data
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        'Failed to analyze video'
      setError(message)
      setStatus('error')
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setData(null)
    setError(null)
  }, [])

  return { analyze, status, data, error, reset }
}
