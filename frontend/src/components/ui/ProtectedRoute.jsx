import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()

  // If no token, redirect to root (which shows loading then redirects to dashboard)
  // But since we always set a token now, this should never happen
  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
