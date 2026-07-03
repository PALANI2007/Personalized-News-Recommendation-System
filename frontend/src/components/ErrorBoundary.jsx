import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * ErrorBoundary — Class component (required by React for error boundaries).
 * Catches JS errors anywhere in the component tree and shows a fallback UI
 * instead of crashing the entire application.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, you would log to an error tracking service here
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Navigate to home safely
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center bg-[#070a13] p-6"
        >
          <div className="max-w-lg w-full text-center space-y-6">
            {/* Animated error icon */}
            <div className="relative mx-auto w-24 h-24">
              <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-400" aria-hidden="true" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 animate-ping opacity-50" />
            </div>

            {/* Error message */}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 mb-2">
                Something Went Wrong
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                An unexpected error occurred in the application. This has been noted and our team has been alerted.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">
                    Show error details (dev only)
                  </summary>
                  <pre className="mt-2 p-3 bg-slate-900 rounded-lg text-xs text-red-300 overflow-auto max-h-32 border border-red-500/20">
                    {this.state.error.toString()}
                    {'\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/25 text-sm font-bold hover:bg-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a13]"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
