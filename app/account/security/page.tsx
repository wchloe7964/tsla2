'use client'

import { Shield, AlertTriangle, MonitorSmartphone } from 'lucide-react'
import ActiveSessions from '@/components/ActiveSessions'
import { PasswordSettings } from '@/components/account/PasswordSettings'
import { TwoFactorSettings } from '@/components/account/TwoFactorSettings'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export default function SecurityPage() {
  const { logout } = useAuth()
  const [isTerminating, setIsTerminating] = useState(false)

  const terminateOtherSessions = async () => {
    if (!confirm('This will log you out of every other device. Continue?')) return;
    
    setIsTerminating(true);
    try {
      const res = await fetch('/api/auth/sessions/terminate-others', { method: 'DELETE' });
      if (res.ok) {
        // Refresh the page or the ActiveSessions component state
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to terminate sessions');
    } finally {
      setIsTerminating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black shadow-lg">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Account Security</h1>
          <p className="text-sm text-gray-500">Manage your access and protection settings.</p>
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-white/5 w-full mb-10" />

      {/* Settings Sections */}
      <div className="space-y-6">
        <TwoFactorSettings />
        <PasswordSettings />
      </div>

      {/* Active Sessions Monitoring */}
      <div className="mt-10 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <ActiveSessions />
      </div>

      {/* Danger Zone / Security Override */}
      <div className="mt-12 p-8 rounded-[2rem] border border-red-500/10 bg-red-500/5">
        <div className="flex items-start gap-4 mb-6">
          <AlertTriangle className="text-red-500 w-5 h-5 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-600 dark:text-red-400">Security Override</p>
            <p className="text-xs text-gray-500 mt-1">
              If you suspect your account is compromised, use this to force a logout on all other instances.
            </p>
          </div>
        </div>
        <button 
          onClick={terminateOtherSessions}
          disabled={isTerminating}
          className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTerminating ? 'Processing...' : 'Terminate Other Sessions'}
        </button>
      </div>
    </div>
  )
}