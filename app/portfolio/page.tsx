'use client'

import { useState, useEffect, useMemo, useReducer } from 'react'
import { 
  PieChart, TrendingUp, Shield, RefreshCw, Loader2, 
  Eye, EyeOff, ChevronRight, Zap, Box, BarChart3, Clock
} from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency } from '@/lib/utils/format'
import ProtectedRoute from '@/components/ProtectedRoute'
import AnalyticsModal from '@/components/portfolio/AnalyticsModal'

const portfolioReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_START': return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS': return { ...state, isLoading: false, data: action.payload };
    case 'FETCH_ERROR': return { ...state, isLoading: false, error: action.payload };
    default: return state;
  }
}

export default function PortfolioPage() {
  const { user } = useAuth()
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [state, dispatch] = useReducer(portfolioReducer, {
    data: null,
    isLoading: true,
    error: null
  })

  const fetchPortfolio = async () => {
    try {
      setRefreshing(true)
      dispatch({ type: 'FETCH_START' })
      const response = await apiClient.getPortfolio()
      if (response.success) {
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data.portfolio })
      } else {
        dispatch({ type: 'FETCH_ERROR', payload: response.error })
      }
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: 'Could not connect to server' })
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchPortfolio() }, [])

  const processedHoldings = useMemo(() => {
    if (!state.data) return []
    const { investments = [], stocks = [] } = state.data
    return [
      ...investments.map((inv: any) => ({
        id: inv._id,
        name: `${inv.planType} Plan`, // Simplified "Node" to "Plan"
        type: 'Investment',
        value: inv.amount + (inv.returns || 0),
        gain: inv.returns || 0,
        rawReturns: inv.returns,
      })),
      ...stocks.map((stock: any) => ({
        id: stock.symbol,
        name: stock.symbol,
        type: 'Stock',
        value: stock.currentValue,
        gain: stock.currentValue - (stock.averagePrice * stock.quantity),
        rawReturns: stock.currentValue - (stock.averagePrice * stock.quantity),
      }))
    ]
  }, [state.data])

  const handleOpenAnalytics = (asset: any) => {
    setSelectedAsset(asset)
    setIsModalOpen(true)
  }

  if (state.isLoading && !state.data) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-white/20" />
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-20 px-6">
        {/* Soft UI Glow */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h1 className="text-xs uppercase tracking-[0.6em] font-bold text-gray-500 mb-4">Your Investments</h1>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-none">Account.</h2>
            </div>
            <button 
              onClick={fetchPortfolio} 
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-white transition-all"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} /> Update Data
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Summary */}
            <div className="lg:col-span-7 space-y-12">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] opacity-20 blur-sm group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-gray-50 dark:bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl overflow-hidden">
                  <div className="flex justify-between items-start mb-12">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">Total Account Value</p>
                      <div className="flex items-center gap-4">
                        <h3 className="text-5xl font-light tracking-tight">
                          {balanceVisible ? formatCurrency(state.data?.totalValue || 0) : '•••••••'}
                        </h3>
                        <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-gray-500 hover:text-white transition-colors">
                          {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <PieChart className="w-8 h-8 opacity-20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">Cash Balance</p>
                      <p className="text-lg font-medium">{formatCurrency(user?.wallet?.balance || 0)}</p>
                    </div>
                    <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">Total Profit/Loss</p>
                      <p className={`text-lg font-medium ${state.data?.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {state.data?.totalProfit >= 0 ? '+' : ''}{formatCurrency(state.data?.totalProfit || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-100 dark:bg-white/5 border border-transparent p-8 rounded-[2rem] flex flex-col justify-between h-48">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center"><Zap className="w-5 h-5 text-blue-500" /></div>
                  <div><p className="text-[11px] uppercase tracking-[0.3em] font-bold mb-1 text-gray-500">Active Plans</p><p className="text-3xl font-light">{state.data?.investments?.length || 0}</p></div>
                </div>
                <div className="bg-gray-100 dark:bg-white/5 border border-transparent p-8 rounded-[2rem] flex flex-col justify-between h-48">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center"><Box className="w-5 h-5 text-purple-500" /></div>
                  <div><p className="text-[11px] uppercase tracking-[0.3em] font-bold mb-1 text-gray-500">Stock Assets</p><p className="text-3xl font-light">{state.data?.stocks?.length || 0}</p></div>
                </div>
              </div>
            </div>

            {/* Right Column: Holdings List */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">Current Holdings</h4>
                  <BarChart3 className="w-4 h-4 text-gray-600" />
                </div>
                <div className="space-y-6">
                  {processedHoldings.map((item: any) => (
                    <div key={item.id} onClick={() => handleOpenAnalytics(item)} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-blue-500/50 transition-colors">
                          <ChevronRight size={14} className="text-gray-500 group-hover:text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wider">{item.name}</p>
                          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{item.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(item.value)}</p>
                        <p className={`text-[10px] font-bold ${item.gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>{item.gain >= 0 ? '+' : ''}{formatCurrency(item.gain)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-8 rounded-[2.5rem] bg-[#111] border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Secure Asset Protection</p>
                </div>
                <p className="text-xs font-light text-gray-400 leading-relaxed">
                  Your investments are protected by multi-layer encryption. Prices are updated automatically to ensure your portfolio reflects current market value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnalyticsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        asset={selectedAsset} 
      />
    </ProtectedRoute>
  )
}