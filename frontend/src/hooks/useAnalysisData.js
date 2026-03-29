import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import client from '../api/client'

/**
 * Hook for fetching analysis/history data from the backend
 * Handles both /api/history and /api/result endpoints
 * 
 * @param {string|number} id - The analysis ID to fetch
 * @returns {Object} { data, loading, error, refetch }
 */
export const useAnalysisData = (id) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('📊 Fetching analysis data for ID:', id)
      
      if (!id) {
        const message = 'No analysis ID provided'
        console.error('❌', message)
        setError(message)
        setLoading(false)
        return
      }

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const apiUrl = `/api/history/${id}`
      console.log(`🌐 Fetching from: ${apiUrl}`)

      const response = await client.get(apiUrl, {
        signal: controller.signal,
      })
      clearTimeout(timeout)

      console.log('✅ API Response structure:', {
        hasData: !!response.data,
        hasSummary: !!response.data?.summary,
        hasAnalytics: !!response.data?.analytics,
        keys: Object.keys(response.data || {}),
      })
      console.log('📦 Full response:', response.data)

      // Process and normalize the response data
      const processedData = normalizeResponseData(response.data)

      setData(processedData)
      setError(null)
      console.log('💾 Data saved to state:', processedData)

    } catch (err) {
      console.error('❌ Failed to load analysis')
      console.error('   Error name:', err.name)
      console.error('   Error message:', err.message)
      console.error('   Error response:', err.response)
      console.error('   Status:', err.response?.status)
      console.error('   Data:', err.response?.data)

      let message
      if (err.name === 'AbortError') {
        message = 'Request timeout - server took too long to respond'
      } else {
        message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to load analysis'
      }

      setError(message)
      toast.error(message)

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id && !isNaN(id)) {
      fetchData()
    } else if (id) {
      console.warn('⚠️ ID is not a number:', id)
      setLoading(false)
    }
  }, [id])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Normalizes API response data to ensure consistent structure
 * Handles various response formats and ensures required fields exist
 * 
 * @param {Object} data - Raw response data from API
 * @returns {Object} Normalized data object
 */
function normalizeResponseData(data) {
  const normalized = { ...data }

  // Handle nested summary structure (data.data.summary)
  if (!normalized.summary && normalized.data?.summary) {
    normalized.summary = normalized.data.summary
    console.log('📝 Extracted summary from nested data.data.summary')
  }

  // Provide fallback for missing summary
  if (!normalized.summary) {
    console.warn('⚠️ No summary field found in response, using placeholder')
    normalized.summary = 'Summary not available'
  }

  // Ensure analytics object exists with default values
  if (!normalized.analytics) {
    console.warn('⚠️ No analytics field found, using default structure')
    normalized.analytics = {
      word_count: 0,
      sentence_count: 0,
      sentiment_overall: 0,
      sentiment_label: 'neutral',
      top_keywords: [],
    }
  }

  // Ensure all expected analytics fields exist
  normalized.analytics = {
    word_count: normalized.analytics?.word_count || 0,
    sentence_count: normalized.analytics?.sentence_count || 0,
    sentiment_overall: normalized.analytics?.sentiment_overall || 0,
    sentiment_label: normalized.analytics?.sentiment_label || 'neutral',
    top_keywords: normalized.analytics?.top_keywords || [],
  }

  return normalized
}

export default useAnalysisData
