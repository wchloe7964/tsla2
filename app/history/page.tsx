'use client'

import { useState, useEffect } from 'react'
import { 
  History, ArrowUpRight, ArrowDownLeft, Filter, 
  Search, Loader2, RefreshCw, ChevronRight 
} from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { formatCurrency } from '@/lib/utils/format'
import { format } from 'date-fns'

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState('all')

  const fetchHistory = async () => {
    try {
      setRefreshing(true)
      const response = await apiClient.getWallet()
      if (response.success) {
        setTransactions(response.data.transactions)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const filteredData = transactions.filter(tx => {
    if (filter === 'all') return true
    return tx.type === filter
  })

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-white/20" />
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h1 className="text-xs uppercase tracking-[0.6em] font-bold text-gray-500 mb-6">Financial Ledger</h1>
              <h2 className="text-6xl md:text-8xl font-light tracking-tighter leading-none">History.</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                {['all', 'deposit', 'withdrawal'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${filter === t ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={fetchHistory} className="text-gray-500 hover:text-white transition-colors">
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Table-less List Structure */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden">
            <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">Record Entry</p>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">Amount & Status</p>
            </div>

            <div className="divide-y divide-white/5">
              {filteredData.length > 0 ? (
                filteredData.map((tx) => (
                  <div key={tx._id} className="p-10 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                        tx.type === 'deposit' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-white/5 border-white/5 text-gray-400'
                      }`}>
                        {tx.type === 'deposit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div>
                        <p className="text-lg font-medium tracking-tight group-hover:text-blue-500 transition-colors">{tx.description}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">
                          {format(new Date(tx.createdAt), 'MMM dd, yyyy • HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${tx.type === 'deposit' ? 'text-blue-500' : 'text-white'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'completed' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                        <p className="text-[10px] uppercase tracking-tighter text-gray-500 font-bold">{tx.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-32 text-center">
                  <History className="w-12 h-12 text-gray-800 mx-auto mb-6" />
                  <p className="text-gray-500 text-xs uppercase tracking-[0.3em] font-bold">No transaction records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}