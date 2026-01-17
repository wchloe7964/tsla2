'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, Save, AlertTriangle, Power, 
  UserPlus, Wallet2, Percent, ArrowDownCircle,
  Loader2, CheckCircle2
} from 'lucide-react'

export default function GlobalSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => data.success && setSettings(data.settings))
  }, [])

  const updateSetting = async (updates: any) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const data = await res.json()
      if (data.success) {
        setSettings(data.settings)
        setMessage('Configuration synchronized.')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (!settings) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  )

  return (
    <div className="p-8 max-w-5xl">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light tracking-tighter text-white mb-2 uppercase">Global Settings</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Platform Control Infrastructure</p>
        </div>
        {message && (
          <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={14} /> {message}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Toggle: Maintenance Mode */}
        <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${settings.maintenanceMode ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'bg-white/5 border-white/10'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-white/5"><Power className={settings.maintenanceMode ? 'text-red-500' : 'text-gray-500'} size={20}/></div>
            <button 
              onClick={() => updateSetting({ maintenanceMode: !settings.maintenanceMode })}
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${settings.maintenanceMode ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'}`}
            >
              {settings.maintenanceMode ? 'Active' : 'Offline'}
            </button>
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Maintenance</h3>
          <p className="text-[10px] text-gray-500 leading-relaxed uppercase">Lock platform for all non-admin users.</p>
        </div>

        {/* Toggle: Registrations */}
        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-white/5"><UserPlus className="text-blue-500" size={20}/></div>
            <button 
              onClick={() => updateSetting({ allowNewRegistrations: !settings.allowNewRegistrations })}
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${settings.allowNewRegistrations ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}
            >
              {settings.allowNewRegistrations ? 'Open' : 'Closed'}
            </button>
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Onboarding</h3>
          <p className="text-[10px] text-gray-500 leading-relaxed uppercase">Allow or prevent new account creations.</p>
        </div>

        {/* Toggle: Withdrawals */}
        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-white/5"><Wallet2 className="text-emerald-500" size={20}/></div>
            <button 
              onClick={() => updateSetting({ withdrawalEnabled: !settings.withdrawalEnabled })}
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${settings.withdrawalEnabled ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}
            >
              {settings.withdrawalEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Payouts</h3>
          <p className="text-[10px] text-gray-500 leading-relaxed uppercase">Enable global withdrawal requests.</p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        
        {/* Fee Configuration */}
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500"><Percent size={18} /></div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Fee Structure</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Withdrawal Fee (%)</label>
              <div className="mt-2 relative">
                <input 
                  type="number"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                  // Use || 0 to prevent "uncontrolled" state
                  value={settings.withdrawalFeePercent || 0}
                  onChange={(e) => setSettings({...settings, withdrawalFeePercent: e.target.value})}
                />
                <button 
                  onClick={() => updateSetting({ withdrawalFeePercent: settings.withdrawalFeePercent })}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest rounded-lg text-white transition-all"
                >
                  Apply
                </button>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Minimum Payout (USD)</label>
              <div className="mt-2 relative">
                <input 
                  type="number"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                  // Use || 0 to prevent "uncontrolled" state
                  value={settings.minWithdrawalAmount || 0}
                  onChange={(e) => setSettings({...settings, minWithdrawalAmount: e.target.value})}
                />
                <button 
                  onClick={() => updateSetting({ minWithdrawalAmount: settings.minWithdrawalAmount })}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest rounded-lg text-white transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Notice */}
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500"><AlertTriangle size={18} /></div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Global Banner</h3>
          </div>
          
          <textarea 
            className="flex-1 w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-xs text-white outline-none focus:border-yellow-500 transition-all resize-none mb-4"
            placeholder="Type message to appear at the top of all user screens..."
            // Use || '' to prevent "uncontrolled" state
            value={settings.systemNotice || ''}
            onChange={(e) => setSettings({...settings, systemNotice: e.target.value})}
          />
          
          <button 
            onClick={() => updateSetting({ systemNotice: settings.systemNotice })}
            className="w-full py-4 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
          >
            <Save size={14} /> Update Notification
          </button>
        </div>

      </div>
    </div>
  )
}