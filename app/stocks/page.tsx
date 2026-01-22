"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  Activity,
  ChevronRight,
  AlertCircle,
  Radio,
  Globe,
  Zap,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Stock {
  _id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export default function PartnerDashboard() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);

  const fetchStocks = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getStocks();
      if (response.success) {
        setStocks(response.data.stocks || []);
        setLastUpdated(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        );
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      setError("Synchronizer Error: Connection to Node 01 failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) fetchStocks();
  }, [authLoading, isAuthenticated]);

  const filteredStocks = useMemo(() => {
    return stocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [stocks, search]);

  if (authLoading) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-12">
          {/* TOP STATUS BAR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_#2563eb]" />
                <h2 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em]">
                  Partner Terminal v4.0.1
                </h2>
              </div>
              <h1 className="text-6xl font-light tracking-tighter uppercase font-tesla">
                Neural <span className="text-zinc-600 italic">Index</span>
              </h1>
            </div>

            <div className="flex items-center gap-6 bg-white/[0.03] border border-white/10 px-8 py-4 rounded-[2rem] backdrop-blur-md">
              <div className="text-right border-r border-white/10 pr-6">
                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                  Operator
                </p>
                <p className="text-xs font-bold text-zinc-200">{user?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                  Network
                </p>
                <p className="text-xs font-bold text-green-400 flex items-center gap-2">
                  <ShieldCheck size={14} /> Encrypted
                </p>
              </div>
            </div>
          </div>

          {/* MARKET INTEL CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <StatCard
              label="Active Nodes"
              value={stocks.length}
              icon={<Globe size={18} />}
              trend="Global"
            />
            <StatCard
              label="Avg. Volatility"
              value="Stable"
              icon={<Activity size={18} />}
              trend="Nominal"
              color="text-emerald-500"
            />
            <StatCard
              label="Last Handshake"
              value={lastUpdated || "--:--"}
              icon={<RefreshCw size={18} />}
              trend="Auto-Sync"
              color="text-blue-500"
            />
          </div>

          {/* SEARCH & REFRESH */}
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="QUERY SYMBOL OR ASSET NAME..."
                className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={fetchStocks}
              className="px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all flex items-center gap-3 group shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <Zap
                className={`w-4 h-4 ${loading ? "animate-pulse" : "group-hover:scale-110"}`}
              />
              <span className="text-[10px] uppercase tracking-widest font-black">
                Refresh
              </span>
            </button>
          </div>

          {/* DATA LEDGER */}
          <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            {loading ? (
              <div className="py-32 flex flex-col items-center gap-6">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin stroke-[1px]" />
                <p className="text-[10px] uppercase tracking-[0.8em] text-zinc-600 font-black animate-pulse">
                  Authenticating Stream...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-10 py-8 text-[9px] uppercase tracking-[0.4em] font-black text-zinc-500">
                        Asset Identity
                      </th>
                      <th className="px-10 py-8 text-[9px] uppercase tracking-[0.4em] font-black text-zinc-500 text-right">
                        Valuation
                      </th>
                      <th className="px-10 py-8 text-[9px] uppercase tracking-[0.4em] font-black text-zinc-500 text-right">
                        24H Delta
                      </th>
                      <th className="px-10 py-8 text-[9px] uppercase tracking-[0.4em] font-black text-zinc-500 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {filteredStocks.map((stock) => (
                      <tr
                        key={stock._id}
                        className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-tesla text-lg text-blue-500 group-hover:border-blue-500/30 transition-all">
                              {stock.symbol[0]}
                            </div>
                            <div>
                              <p className="text-sm font-black tracking-widest uppercase mb-1">
                                {stock.symbol}
                              </p>
                              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
                                {stock.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right font-mono text-sm tracking-tighter">
                          $
                          {stock.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className={`px-10 py-8 text-right font-black text-xs ${stock.changePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          <div className="flex items-center justify-end gap-2">
                            {stock.changePercent >= 0 ? (
                              <TrendingUp size={14} />
                            ) : (
                              <TrendingDown size={14} />
                            )}
                            {Math.abs(stock.changePercent).toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <Link
                            href={`/stocks/${stock.symbol}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-all">
                            Analyze <ChevronRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ label, value, icon, trend, color = "text-white" }: any) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl text-zinc-400 group-hover:text-blue-500 transition-colors">
          {icon}
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 px-3 py-1 bg-white/5 rounded-full">
          {trend}
        </span>
      </div>
      <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-black mb-1">
        {label}
      </p>
      <p className={`text-4xl font-light tracking-tighter ${color}`}>{value}</p>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl" />
    </div>
  );
}
