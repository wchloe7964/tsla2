'use client'

import { KYCVerification } from '@/components/account/KYCVerification'
import { BadgeCheck, ShieldAlert, Info, StepBack as Steps, CheckCircle2, Circle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function IdentityPage() {
  const { user } = useAuth()
  const currentLevel = user?.kycLevel || 'LEVEL_1'

  // Helper to determine step styles
  const getStepStatus = (step: string) => {
    if (currentLevel === 'LEVEL_2') return 'complete'
    if (step === 'review' && currentLevel === 'PENDING') return 'active'
    if (step === 'submit' && currentLevel === 'LEVEL_1') return 'active'
    if (step === 'submit' && currentLevel === 'PENDING') return 'complete'
    return 'pending'
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <BadgeCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">Identity Verification</h1>
            <p className="text-sm text-gray-500">Tiered access based on your verification level.</p>
          </div>
        </div>

        {/* Mini Progress Tracker */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] p-2 rounded-2xl border border-gray-100 dark:border-white/5">
           <StepIcon status={getStepStatus('submit')} label="Submit" />
           <div className="w-4 h-px bg-gray-200 dark:bg-white/10" />
           <StepIcon status={getStepStatus('review')} label="Review" />
           <div className="w-4 h-px bg-gray-200 dark:bg-white/10" />
           <StepIcon status={getStepStatus('verified')} label="Verified" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <KYCVerification />
          
          {/* Status-specific Help Note */}
          {currentLevel === 'PENDING' && (
             <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Our compliance team is currently reviewing your documents. You will receive an email notification once the process is complete. 
                </p>
             </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4 text-emerald-500">
              <BadgeCheck size={18} />
              <p className="text-xs font-bold uppercase tracking-widest">Benefits</p>
            </div>
            <ul className="space-y-4">
              <BenefitItem text="Daily withdrawals up to $50k" active={currentLevel === 'LEVEL_2'} />
              <BenefitItem text="Fiat Currency on-ramps" active={currentLevel === 'LEVEL_2'} />
              <BenefitItem text="Governance voting rights" active={currentLevel === 'LEVEL_2'} />
            </ul>
          </div>

          <div className="p-6 rounded-[2rem] border border-amber-500/10 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3 text-amber-600">
              <ShieldAlert size={18} />
              <p className="text-xs font-bold uppercase tracking-widest">Security Note</p>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Documents are processed through an encrypted vault. Your data is used strictly for KYC/AML compliance and is never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-components for cleaner code
function StepIcon({ status, label }: { status: 'complete' | 'active' | 'pending', label: string }) {
  return (
    <div className="flex items-center gap-2 px-2">
      {status === 'complete' ? <CheckCircle2 size={14} className="text-emerald-500" /> : 
       status === 'active' ? <Circle size={14} className="text-blue-500 fill-blue-500/20" /> : 
       <Circle size={14} className="text-gray-300 dark:text-gray-600" />}
      <span className={`text-[10px] font-bold uppercase tracking-tighter ${status === 'pending' ? 'text-gray-400' : 'text-black dark:text-white'}`}>
        {label}
      </span>
    </div>
  )
}

function BenefitItem({ text, active }: { text: string, active: boolean }) {
  return (
    <li className={`flex items-center gap-3 text-xs ${active ? 'text-black dark:text-white font-medium' : 'text-gray-400'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-gray-300 dark:bg-gray-700'}`} />
      {text}
    </li>
  )
}