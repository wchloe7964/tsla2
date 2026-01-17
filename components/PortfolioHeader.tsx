'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Bell, ShieldCheck } from 'lucide-react'

export default function PortfolioHeader({ onRefresh }: { onRefresh: () => void }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">
          Node Active // {time}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw size={14} className="hover:rotate-180 transition-transform duration-500" />
          Sync Data
        </button>
        <div className="h-4 w-[1px] bg-white/10" />
        <Bell size={18} className="text-gray-400 hover:text-white cursor-pointer" />
      </div>
    </header>
  )
}