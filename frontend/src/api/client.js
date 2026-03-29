import axios from 'axios'

// In production: set VITE_API_URL to your deployed backend URL
// e.g. https://your-backend.railway.app
const API_URL = import.meta.env.VITE_API_URL || ''

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

export default client
