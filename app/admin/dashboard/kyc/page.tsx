'use client'

import { useState, useEffect } from 'react'
import { Check, X, Eye, ExternalLink, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'

export default function KYCReviewPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchPending()
  }, [])

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/admin/kyc/pending')
      const data = await res.json()
      setPendingUsers(data.users || [])
    } catch (err) {
      console.error("Failed to load KYC queue")
    } finally {
      setLoading(false)
    }
  }

  const handleDecision = async (userId: string, status: 'LEVEL_1' | 'REJECTED') => {
    setProcessingId(userId)
    try {
      const res = await fetch('/api/admin/kyc/decision', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          status, 
          reason: status === 'REJECTED' ? 'Document verification failed. Please re-upload.' : '' 
        })
      })
      if (res.ok) {
        setPendingUsers(prev => prev.filter(u => u._id !== userId))
      }
    } catch (err) {
      alert("Decision failed to save")
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  )

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      <header className="mb-12">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Identity Verification</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-2">
          {pendingUsers.length} Documents Awaiting Review
        </p>
      </header>

      {pendingUsers.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-20 text-center">
          <ShieldCheck className="mx-auto text-emerald-500/20 mb-4" size={64} />
          <p className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Queue is clear. No pending KYC.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pendingUsers.map((user) => (
            <div key={user._id} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col">
              {/* Cloudinary Preview Header */}
              <div 
                className="aspect-[4/3] bg-black relative group cursor-zoom-in overflow-hidden"
                onClick={() => setPreviewUrl(user.kycData?.documentUrl)}
              >
                <img 
                  src={user.kycData?.documentUrl} 
                  alt="KYC Proof"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                   <div className="bg-blue-600 p-2 rounded-lg"><Eye size={14} /></div>
                   <span className="text-[9px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                     Click to Inspect
                   </span>
                </div>
              </div>

              {/* Info & Actions */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-bold tracking-tight">{user.name}</h3>
                  <p className="text-[10px] text-gray-500 font-mono mb-4">{user.email}</p>
                  <div className="flex items-center gap-2 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="text-[9px] font-black uppercase text-blue-500 tracking-tighter">
                      {user.kycData?.documentType || 'ID_DOCUMENT'}
                    </span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                  <button 
                    disabled={processingId === user._id}
                    onClick={() => handleDecision(user._id, 'LEVEL_1')}
                    className="py-4 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {processingId === user._id ? <Loader2 className="animate-spin" size={12}/> : <Check size={14} />} Approve
                  </button>
                  <button 
                    disabled={processingId === user._id}
                    onClick={() => handleDecision(user._id, 'REJECTED')}
                    className="py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cloudinary Fullscreen Lightbox */}
      {previewUrl && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col p-10 animate-in fade-in duration-300">
          <button 
            onClick={() => setPreviewUrl(null)}
            className="self-end p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
          >
            <X size={32} />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <img 
              src={previewUrl} 
              className="max-h-full max-w-full rounded-3xl shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10 object-contain"
            />
          </div>
          <div className="mt-8 flex justify-center">
            <a 
              href={previewUrl} 
              target="_blank" 
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3"
            >
              View Full Resolution <ExternalLink size={16} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}