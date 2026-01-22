"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronRight,
  Loader2,
} from "lucide-react";

// You can swap this with your actual API endpoint or use a lib/stocks.ts helper
const SYMBOLS = ["TSLA", "AAPL", "NVDA", "MSFT", "AMZN", "GOOGL"];

const Markets = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        // In a real app, you'd fetch from your own /api/stocks to hide API keys
        const res = await fetch("/api/market-data");
        const data = await res.json();
        if (data.success) {
          setStocks(data.data);
        }
      } catch (error) {
        console.error("Market data sync error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    // Refresh every 60 seconds
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  // Clinical Skeleton Loader
  const MarketSkeleton = () => (
    <div className="lg:col-span-8 space-y-px bg-gray-100 dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-6 bg-white dark:bg-black animate-pulse">
          <div className="flex items-center gap-6">
            <div className="h-8 w-16 bg-gray-100 dark:bg-white/5 rounded" />
            <div className="h-4 w-32 bg-gray-100 dark:bg-white/5 rounded hidden sm:block" />
          </div>
          <div className="h-8 w-24 bg-gray-100 dark:bg-white/5 rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 animate-tesla-reveal">
          <div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black dark:text-white font-tesla uppercase">
              Markets
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 font-light max-w-xl">
              Real-time monitoring of global equities, top movers, and
              high-volume assets.
            </p>
          </div>
          <Link
            href="/terminal"
            className="mt-6 md:mt-0 text-xs font-medium uppercase tracking-[0.3em] dark:text-white flex items-center gap-2 hover:opacity-50 transition-opacity">
            Terminal View <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {loading ? (
            <MarketSkeleton />
          ) : (
            <div className="lg:col-span-8 space-y-px bg-gray-100 dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden animate-tesla-reveal">
              <div className="bg-gray-50 dark:bg-black/40 px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Security / Symbol
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Price & Change
                </span>
              </div>
              {stocks.map((stock, index) => (
                <div
                  key={stock.symbol}
                  className="group flex items-center justify-between p-6 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="text-2xl font-medium tracking-tighter dark:text-white w-20 font-tesla">
                      {stock.symbol}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                        {stock.name || "Equity Asset"}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          LIVE
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-medium dark:text-white font-mono tracking-tighter">
                      $
                      {stock.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      className={`text-xs font-bold mt-1 font-mono ${
                        stock.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
                      {stock.change >= 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Right Panel remains similar but can be populated by the same fetch */}
          <div className="lg:col-span-4 space-y-8 animate-tesla-reveal [animation-delay:200ms]">
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <Activity className="w-5 h-5 mb-4 text-gray-400" />
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2 font-black">
                Market Sentiment
              </h3>
              <p className="text-2xl font-tesla dark:text-white">BULLISH</p>
              <div className="mt-6 h-1 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "65%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Markets;
