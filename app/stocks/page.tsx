"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Bell,
  Filter,
  RefreshCw,
  Sun,
  Moon,
  Loader2,
  Activity,
  ChevronRight,
  AlertCircle,
  Radio,
} from "lucide-react";
import Link from "next/link";

// Logic & Context
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext"; // UPDATED: Correct source
import ProtectedRoute from "@/components/ProtectedRoute";

// Types
interface Stock {
  _id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  sector?: string;
}

function StocksPage() {
  // 1. Auth & Identity
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  // 2. State Management
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  // Data State
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [marketStats, setMarketStats] = useState({ gainers: 0, losers: 0 });

  // 3. Data Fetching logic
  const fetchStocks = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getStocks();

      if (response.success) {
        // Assuming API returns { stocks: [], gainersCount: 0, losersCount: 0 }
        const data = response.data;
        setStocks(data.stocks || []);
        setMarketStats({
          gainers: data.stocks.filter((s: Stock) => s.changePercent > 0).length,
          losers: data.stocks.filter((s: Stock) => s.changePercent < 0).length,
        });
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      setError(err.message || "Market synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchStocks();
    }
  }, [authLoading, isAuthenticated]);

  // 4. Client-side Search/Filter logic
  const filteredStocks = useMemo(() => {
    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
        stock.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [stocks, search]);

  // 5. Formatters
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(p);
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    return num.toLocaleString();
  };

  // Handle Loading Gate
  if (authLoading) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-white">
        <main className="max-w-7xl mx-auto px-6 pt-32 pb-12">
          {/* Hero: Market Status */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 mb-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-tesla">Marketplace</h1>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold tracking-widest border border-green-500/20">
                    <Radio className="w-3 h-3 animate-pulse" /> LIVE
                  </span>
                </div>
                <p className="text-blue-100 text-lg opacity-80">
                  Identity Verified: {user?.name}
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-blue-200/50 mt-4">
                  Sync: {lastUpdated}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[140px]">
                  <p className="text-[10px] uppercase tracking-widest text-blue-200 mb-1">
                    Gainers
                  </p>
                  <p className="text-2xl font-bold">{marketStats.gainers}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[140px]">
                  <p className="text-[10px] uppercase tracking-widest text-blue-200 mb-1">
                    Losers
                  </p>
                  <p className="text-2xl font-bold">{marketStats.losers}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          </section>

          {/* Search & Utility Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search neural index..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={fetchStocks}
              className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Refresh
              </span>
            </button>
          </div>

          {/* Market Table */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden">
            {loading ? (
              <div className="py-24 flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin stroke-[1px]" />
                <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500">
                  Syncing Node Data
                </p>
              </div>
            ) : error ? (
              <div className="py-24 text-center">
                <AlertCircle className="w-12 h-12 text-red-500/50 mx-auto mb-4" />
                <p className="text-red-400">{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                        Asset
                      </th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                        Price
                      </th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                        24h Change
                      </th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                        Market Cap
                      </th>
                      <th className="px-8 py-5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStocks.map((stock) => (
                      <tr
                        key={stock._id}
                        className="group hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center font-tesla text-blue-400">
                              {stock.symbol[0]}
                            </div>
                            <div>
                              <p className="font-bold tracking-wider">
                                {stock.symbol}
                              </p>
                              <p className="text-[10px] text-gray-500 uppercase">
                                {stock.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-mono">
                          {formatPrice(stock.price)}
                        </td>
                        <td
                          className={`px-8 py-6 font-bold ${
                            stock.changePercent >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}>
                          {stock.changePercent.toFixed(2)}%
                        </td>
                        <td className="px-8 py-6 text-gray-400">
                          {formatNumber(stock.marketCap || 0)}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Link
                            href={`/stocks/${stock.symbol}`}
                            className="inline-flex p-3 rounded-xl bg-white/5 hover:bg-blue-600 transition-all">
                            <ChevronRight className="w-4 h-4" />
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

export default StocksPage;
