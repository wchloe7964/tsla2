'use client'

import { useState, useEffect } from 'react'
import { 
  X, ShieldCheck, Copy, Check, 
  RefreshCw, Download, AlertTriangle, 
  Smartphone, Loader2
} from 'lucide-react'

interface TwoFactorModalProps {
  onClose: () => void
  onComplete: () => void
}

export default function TwoFactorModal({ onClose, onComplete }: TwoFactorModalProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data from API
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [recoveryKeys, setRecoveryKeys] = useState<string[]>([])
  
  // UI States
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  // 1. Fetch initial Setup Data (Secret & QR)
  useEffect(() => {
    async function initSetup() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/security/2fa')
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        
        setQrCodeUrl(data.qrCodeUrl)
        setSecretKey(data.secret)
      } catch (err) {
        setError('Failed to initialize 2FA. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    initSetup()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadKeys = () => {
    const element = document.createElement("a");
    const file = new Blob([recoveryKeys.join('\n')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "recovery-keys.txt";
    document.body.appendChild(element);
    element.click();
    setHasDownloaded(true);
  }

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)
    setError(null)
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  // 2. Handle Verification (Step 2 -> Step 3)
  const handleVerify = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/security/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otp.join('') }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Verification failed')

      setRecoveryKeys(data.recoveryKeys)
      setStep(3)
    } catch (err: any) {
      setError(err.message)
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <div 
            className="h-full bg-blue-500 transition-all duration-700 ease-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <button onClick={onClose} className="absolute right-8 top-8 text-gray-500 hover:text-white transition-colors z-10">
          <X size={20} />
        </button>

        {/* STEP 1: SCAN QR */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/10 mx-auto mb-6">
                <Smartphone className="text-blue-500" size={32} />
              </div>
              <h3 className="text-2xl font-light tracking-tight mb-2">Setup 2FA</h3>
              <p className="text-sm text-gray-500">Scan this code with your authenticator app.</p>
            </div>

            <div className="bg-white p-3 rounded-3xl w-48 h-48 mx-auto flex items-center justify-center border-8 border-white/5 relative">
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              ) : (
                <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-full rounded-xl" />
              )}
            </div>

            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold text-center">Manual Entry Key</p>
              <div className="flex items-center gap-2 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                <code className="flex-1 text-center text-blue-400 font-mono tracking-widest text-sm">
                  {isLoading ? '••••-••••-••••' : secretKey}
                </code>
                <button onClick={handleCopy} disabled={isLoading} className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30">
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500" />}
                </button>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              Continue to Verification
            </button>
          </div>
        )}

        {/* STEP 2: VERIFY CODE */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/10 mx-auto mb-6">
                <ShieldCheck className="text-blue-500" size={32} />
              </div>
              <h3 className="text-2xl font-light tracking-tight mb-2">Verify Device</h3>
              <p className="text-sm text-gray-500">Enter the 6-digit code from your app.</p>
            </div>

            <div className="flex justify-center gap-2 md:gap-3">
              {otp.map((data, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={data}
                  autoComplete="one-time-code"
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className={`w-12 h-16 bg-white/[0.03] border rounded-xl text-center text-2xl font-light focus:ring-4 focus:ring-blue-500/10 transition-all outline-none 
                    ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                />
              ))}
            </div>

            {error && <p className="text-center text-red-500 text-[10px] uppercase tracking-widest font-bold">{error}</p>}

            <button 
              disabled={otp.join('').length < 6 || isLoading}
              onClick={handleVerify}
              className="w-full py-5 bg-white text-black disabled:bg-white/5 disabled:text-gray-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Connection'}
            </button>
          </div>
        )}

        {/* STEP 3: RECOVERY KEYS */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/10 mx-auto mb-6">
                <AlertTriangle className="text-yellow-500" size={32} />
              </div>
              <h3 className="text-2xl font-light tracking-tight mb-2">Final Security Step</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                Save these recovery keys. They are the <strong>only way</strong> to access your account if you lose your phone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-6 bg-white/[0.02] border border-white/5 rounded-3xl font-mono text-[11px] text-gray-400">
              {recoveryKeys.map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full" />
                  {key}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button 
                onClick={downloadKeys}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                <Download size={16} />
                Download Backup Codes (.txt)
              </button>
              
              <button 
                disabled={!hasDownloaded}
                onClick={() => { onComplete(); onClose(); }}
                className={`w-full py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all
                  ${hasDownloaded 
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-500/20' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                  }`}
              >
                {hasDownloaded ? 'Finish & Activate' : 'Download codes to finish'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}