"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Activity, ChevronRight } from "lucide-react";
import { stockData } from "@/lib/constants";

const Markets = () => {
  return (
    <section className="bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header - Minimalist & Technical */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 animate-tesla-reveal">
          <div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black dark:text-white font-tesla">
              Markets
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 font-light max-w-xl">
              Real-time monitoring of global equities, top movers, and
              high-volume assets.
            </p>
          </div>
          <Link
            href="/stocks"
            className="mt-6 md:mt-0 text-xs font-medium uppercase tracking-[0.3em] dark:text-white flex items-center gap-2 hover:opacity-50 transition-opacity">
            Terminal View <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* 1. Primary Market Feed - Clinical List Style */}
          <div className="lg:col-span-8 space-y-px bg-gray-100 dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden animate-tesla-reveal">
            <div className="bg-gray-50 dark:bg-black/40 px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Security / Symbol
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Price & Change
              </span>
            </div>
            {stockData.featured.map((stock, index) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.symbol.toLowerCase()}`}
                className="group flex items-center justify-between p-6 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-center gap-6">
                  <div className="text-2xl font-medium tracking-tighter dark:text-white w-20">
                    {stock.symbol}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs uppercase tracking-widest text-gray-400">
                      {stock.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Activity className="w-3 h-3 text-tesla-red opacity-50" />
                      <span className="text-[10px] text-gray-500 font-mono">
                        LIVE FEED
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-medium dark:text-white font-mono">
                    {stock.price}
                  </p>
                  <p
                    className={`text-xs font-medium mt-1 uppercase tracking-wider ${
                      stock.change.includes("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                    {stock.change}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* 2. Side Panel - Categorized Lists */}
          <div className="lg:col-span-4 space-y-8 animate-tesla-reveal [animation-delay:200ms]">
            {/* Movers Section */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6 font-bold flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-tesla-red" /> Top Movers
              </h3>
              <div className="space-y-4">
                {[
                  ...stockData.gainers.slice(0, 2),
                  ...stockData.losers.slice(0, 2),
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-sm font-medium dark:text-white tracking-tight">
                      {item.symbol}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        item.change.includes("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}>
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Volume Section */}
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4 font-bold">
                Volume Leaders
              </h3>
              <div className="space-y-4">
                {stockData.active.slice(0, 3).map((active) => (
                  <div key={active.symbol} className="flex flex-col">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium dark:text-white">
                        {active.symbol}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {active.volume}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 dark:bg-white/10 mt-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tesla-red opacity-60"
                        style={{ width: "70%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Markets;
