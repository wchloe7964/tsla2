'use client'

import React from 'react'
import { TrendingUp, ShieldCheck, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

interface InvestmentCardProps {
  product: {
    _id: string
    name: string
    symbol: string
    expectedReturn: number
    minAmount: number
    riskLevel: 'Low' | 'Medium' | 'High'
    duration: string
    category: string
  }
}

const InvestmentCard = ({ product }: InvestmentCardProps) => {
  return (
    <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 hover:bg-[#0f0f0f] hover:border-blue-500/30 transition-all duration-500 overflow-hidden shadow-2xl">
      {/* Subtle Background Glow */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-600/5 blur-[100px] group-hover:bg-blue-600/10 transition-colors" />
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-bold uppercase tracking-widest mb-3">
            {product.category}
          </span>
          <h3 className="text-xl font-tesla tracking-wide text-white group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Plan: {product.symbol}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
          <Zap className="w-5 h-5 text-blue-500" />
        </div>
      </div>

      {/* Investment Details */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Estimated Profit</p>
          <p className="text-lg font-bold text-green-400">+{product.expectedReturn}%</p>
        </div>
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Timeframe</p>
          <p className="text-lg font-bold text-white">{product.duration}</p>
        </div>
      </div>

      {/* Footer & Call to Action */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold">
          <div className="flex items-center gap-2 text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Risk: {product.riskLevel}</span>
          </div>
          <span className="text-white">Start with {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(product.minAmount)}</span>
        </div>

        <Link 
          href={`/investments/${product._id}`}
          className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-600/20 active:scale-[0.98]"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default InvestmentCard