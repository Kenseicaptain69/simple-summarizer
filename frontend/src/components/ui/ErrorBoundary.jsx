import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔴 ERROR BOUNDARY CAUGHT ERROR:', error)
    console.error('📍 Component Stack:', errorInfo?.componentStack)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
          <div className="max-w-2xl w-full glass rounded-xl p-8 border-2 border-error/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-error" />
              </div>
              <div>
                <h1 className="text-error text-2xl font-bold">Something went wrong</h1>
                <p className="text-text-muted text-sm mt-1">The component crashed unexpectedly</p>
              </div>
            </div>

            <div className="rounded-lg p-4 mb-6" style={{ background: 'var(--bg-code)' }}>
              <h3 className="text-error text-sm font-bold mb-2">Error Message:</h3>
              <p className="text-text-secondary text-sm font-mono">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            {this.state.errorInfo?.componentStack && (
              <div className="rounded-lg p-4 mb-6 max-h-64 overflow-auto" style={{ background: 'var(--bg-code)' }}>
                <h3 className="text-error text-sm font-bold mb-2">Component Stack:</h3>
                <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-error hover:bg-error/90 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1 glass hover:bg-surface-hover text-text-primary font-bold py-3 px-6 rounded-lg transition"
              >
                Go to Dashboard
              </button>
            </div>

            <p className="text-text-hint text-xs text-center mt-6">
              💡 Tip: Check browser console (F12) for more details about this error
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
