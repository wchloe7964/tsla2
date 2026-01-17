'use client'

import { useState, useRef } from 'react'
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Loader2, FileCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export const KYCVerification = () => {
  const { user, refresh } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('passport')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const kycLevel = user?.kycLevel || 'LEVEL_1'

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File is too large. Maximum size is 5MB.')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a document to upload.')
      return
    }

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('documentType', docType)

    try {
      const res = await fetch('/api/user/kyc/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        // This re-triggers checkAuth(true) in the AuthProvider
        await refresh() 
        setFile(null) // Reset the input
      } else {
        setError(data.error || 'Submission failed.')
      }
    } catch (err) {
      setError('Network error. Check your connection.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[2.5rem]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
          <FileText size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-black dark:text-white">Identity Verification</h3>
          <p className="text-sm text-gray-500">Increase your security and account limits.</p>
        </div>
      </div>

      {(kycLevel === 'LEVEL_1' || kycLevel === 'REJECTED') && (
        <form onSubmit={handleUpload} className="space-y-6">
          {kycLevel === 'REJECTED' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase tracking-wider">
              <AlertCircle size={16} />
              Rejected: {user?.kycData?.rejectionReason || 'Please provide a clearer document.'}
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Document Type</label>
            <select 
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full mt-2 bg-white dark:bg-black border border-gray-100 dark:border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all cursor-pointer"
            >
              <option value="passport">International Passport</option>
              <option value="national_id">National ID Card</option>
              <option value="drivers_license">Driver's License</option>
            </select>
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`group border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
              file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gray-200 dark:border-white/10 hover:border-emerald-500/50 hover:bg-gray-100/50 dark:hover:bg-white/5'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={onFileChange}
              className="hidden" 
              accept="image/*,.pdf"
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <FileCheck className="text-emerald-500 mb-2" size={32} />
                <p className="text-sm font-bold text-black dark:text-white truncate max-w-xs">{file.name}</p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Click to swap file</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto text-gray-400 group-hover:text-emerald-500 transition-colors mb-2" />
                <p className="text-xs text-gray-500 font-medium">Click to upload JPG, PNG or PDF</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Max 5MB</p>
              </>
            )}
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center animate-shake">{error}</p>}

          <button 
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {uploading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Submit for Review'}
          </button>
        </form>
      )}

      {kycLevel === 'PENDING' && (
        <div className="text-center py-10 bg-blue-500/5 rounded-3xl border border-blue-500/10">
          <Clock className="mx-auto text-blue-500 mb-4 animate-pulse" size={40} />
          <h4 className="font-bold text-black dark:text-white uppercase tracking-widest text-xs">Verification Pending</h4>
          <p className="text-[11px] text-gray-500 mt-2 px-6 leading-relaxed">
            We are reviewing your <strong>{user?.kycData?.documentType?.replace('_', ' ')}</strong>. Documents are usually processed within 24 hours.
          </p>
        </div>
      )}

      {kycLevel === 'LEVEL_2' && (
        <div className="text-center py-10 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="text-white" size={32} />
          </div>
          <h4 className="font-bold text-emerald-500 uppercase tracking-widest text-xs">Identity Verified</h4>
          <p className="text-[11px] text-gray-500 mt-2">All withdrawal limits and platform features are now unlocked.</p>
        </div>
      )}
    </div>
  )
}