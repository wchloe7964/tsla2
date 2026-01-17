'use client'

import { motion } from 'framer-motion'
import { Check, Download, ArrowRight, Share2 } from 'lucide-react'

interface SuccessProps {
  amount: string
  type: 'deposit' | 'withdrawal'
  onClose: () => void
}

export default function TransactionSuccess({ amount, type, onClose }: SuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-500">
      
      {/* 1. Success Icon */}
      <div className="relative mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Check className="w-12 h-12 text-green-500 stroke-[3px]" />
          </motion.div>
        </motion.div>
        
        {/* Subtle pulsing background */}
        <div className="absolute inset-0 border border-green-500/30 rounded-full animate-ping opacity-10" />
      </div>

      {/* 2. Simple Confirmation Text */}
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-green-500 mb-2">
          Success
        </p>
        <h3 className="text-4xl font-light tracking-tighter text-white mb-2">
          ${parseFloat(amount || '0').toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h3>
        <p className="text-sm text-gray-400 font-light">
          {type === 'deposit' 
            ? 'Your money has been added to your balance.' 
            : 'Your request is being processed.'}
        </p>
      </div>

      {/* 3. Clean Summary Card */}
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 space-y-4">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
          <span className="text-gray-500">Status</span>
          <span className="text-green-500">Confirmed</span>
        </div>
        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
          <span className="text-gray-500">Reference</span>
          <span className="text-white font-mono">{Math.random().toString(36).toUpperCase().substring(2, 8)}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
          <span className="text-gray-500">Date & Time</span>
          <span className="text-white">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="grid grid-cols-1 w-full gap-4">
        <button 
          onClick={onClose}
          className="w-full bg-white text-black h-14 rounded-2xl font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95"
        >
          Return to Wallet
          <ArrowRight size={14} />
        </button>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors">
            <Download size={14} />
            Save Receipt
          </button>
          <button className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors">
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}