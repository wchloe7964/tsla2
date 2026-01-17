'use client'

import { X, TrendingUp, Zap, Activity, ShieldCheck, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'

export default function AnalyticsModal({ isOpen, onClose, asset }: any) {
  if (!isOpen || !asset) return null

  // Example product target: Tesla Powerwall 3 (~$11,500)
  const productTarget = 11500
  const productProgress = Math.min((asset.rawReturns / productTarget) * 100, 100)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop - Matches Deposit/Withdraw style */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-white/[0.02] to-transparent">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-blue-500 mb-1">Live Asset Overview</p>
            <h3 className="text-3xl font-light tracking-tight text-white">{asset.name}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Performance Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4 flex items-center gap-2">
                <TrendingUp size={12} /> Total Growth
              </p>
              <p className="text-2xl font-light text-white">+{((asset.gain / (asset.value - asset.gain)) * 100).toFixed(2)}%</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4 flex items-center gap-2">
                <Activity size={12} /> Account Status
              </p>
              <p className="text-2xl font-light text-blue-500 uppercase tracking-tight">Active</p>
            </div>
          </div>

          {/* Goal/Product Bridge Logic */}
          <div className="p-8 rounded-[2rem] bg-blue-600/5 border border-blue-500/20">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Purchase Goal</p>
              </div>
              <p className="text-[10px] font-bold text-blue-500">{productProgress.toFixed(1)}% REACHED</p>
            </div>
            <p className="text-sm font-light text-gray-400 mb-6">
              You can put your earnings from this investment toward a Tesla Powerwall or other hardware.
            </p>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000" 
                style={{ width: `${productProgress}%` }} 
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-500 w-5 h-5" />
              <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-gray-500 italic">Verified Balance</p>
            </div>
            <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-white px-8 py-3 bg-blue-600 rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
              Withdraw Earnings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}