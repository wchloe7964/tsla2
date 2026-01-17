'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Check, AlertCircle, ArrowLeft, RefreshCw, ShieldCheck, Lock } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // API call to handle password recovery
      await new Promise(resolve => setTimeout(resolve, 1800))
      setSuccess(true)
    } catch (err: any) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[420px] z-10 transition-all duration-700">
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/[0.05] border border-white/10 mb-6 group hover:scale-105 transition-all duration-500">
              {success ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400 animate-in zoom-in duration-500" />
              ) : (
                <Lock className="w-7 h-7 text-white group-hover:text-blue-400 transition-colors" />
              )}
            </div>
            <h1 className="text-3xl font-tesla tracking-tighter text-white mb-2 uppercase">
              {success ? 'Link Sent' : 'Reset Password'}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold px-4">
              {success 
                ? 'Check your inbox for further instructions' 
                : 'Recover access to your account'}
            </p>
          </div>

          <div className="px-8 pb-10">
            {success ? (
              /* Success State UI */
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400/80 leading-relaxed font-bold">
                    A recovery email has been sent to:
                    <span className="block text-white mt-1 tracking-tight lowercase">{email}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all duration-500 active:scale-[0.98]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                  <button
                    onClick={() => setSuccess(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Resend Email
                  </button>
                </div>
              </div>
            ) : (
              /* Recovery Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    placeholder="name@email.com"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative overflow-hidden bg-white text-black py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all duration-500 active:scale-[0.98] disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Request Reset Link"}
                    </span>
                  </button>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-600 hover:text-blue-400 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Return to Login
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Help Footer */}
          <div className="py-6 bg-white/[0.02] border-t border-white/5 text-center">
             <p className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-bold">
               Need Help? 
               <Link href="/help" className="ml-2 text-white hover:text-blue-400 transition-colors">
                 Contact Support
               </Link>
             </p>
          </div>
        </div>

        {/* Security Meta */}
        <div className="mt-8 flex flex-col items-center gap-2 opacity-30">
           <div className="flex items-center gap-2">
             <ShieldCheck className="w-3 h-3 text-white" />
             <span className="text-[9px] uppercase tracking-widest text-white">Secure Encrypted Recovery</span>
           </div>
           <p className="text-[8px] uppercase tracking-[0.2em] text-gray-400">
             Links expire after 60 minutes
           </p>
        </div>
      </div>
    </div>
  )
}