'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, Terminal, RotateCcw, ShieldAlert } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  isRecovering: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isRecovering: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isRecovering: false }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 2026: Automatic telemetry logging to internal TSLA-Diag servers
    console.error('Diagnostic Event Captured:', error, errorInfo)
  }

  private handleRecovery = () => {
    this.setState({ isRecovering: true })
    // Simulate a kinetic system recalibration
    setTimeout(() => {
      this.setState({ hasError: false, error: null, isRecovering: false })
      if (!this.props.fallback) window.location.reload()
    }, 800)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="relative min-h-[400px] w-full flex items-center justify-center p-8 bg-gray-50 dark:bg-black/40 backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-700">
          
          {/* Background Technical Watermark */}
          <div className="absolute top-10 left-10 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
            <ShieldAlert className="w-64 h-64 rotate-12" />
          </div>

          <div className="relative z-10 max-w-sm w-full text-center">
            {/* Minimalist Diagnostic Icon */}
            <div className="inline-flex relative mb-8">
              <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative h-16 w-16 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-amber-500/30 shadow-2xl">
                <AlertCircle className="w-8 h-8 text-amber-500 stroke-[1.5px]" />
              </div>
            </div>
            
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-black dark:text-white mb-4">
              Diagnostic Interruption
            </h3>
            
            <div className="flex items-start gap-3 p-4 mb-8 bg-black/[0.02] dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl text-left">
              <Terminal className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400 leading-relaxed break-all">
                {this.state.error?.name}: {this.state.error?.message || 'Unexpected logic fault detected.'}
              </p>
            </div>

            <button
              onClick={this.handleRecovery}
              disabled={this.state.isRecovering}
              className="group relative w-full tesla-button-black py-4 overflow-hidden"
            >
              <span className={`flex items-center justify-center gap-3 transition-all duration-500 ${this.state.isRecovering ? 'opacity-0 scale-90' : 'opacity-100'}`}>
                <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-500" />
                Recalibrate Component
              </span>
              
              {/* 2026 Loading State Overlay */}
              {this.state.isRecovering && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1 w-24 bg-gray-800 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-tesla-red animate-[shimmer_1.5s_infinite]" style={{ width: '40%' }} />
                  </div>
                </div>
              )}
            </button>
            
            <p className="mt-6 text-[9px] uppercase tracking-widest text-gray-400 font-medium">
              Error Hash: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary