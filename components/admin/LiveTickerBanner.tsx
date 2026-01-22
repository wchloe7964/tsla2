"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const TICKERS = ["TSLA", "BINANCE:BTCUSDT", "NVDA", "AAPL", "MSFT"];

export default function LiveTickerBanner() {
  const [prices, setPrices] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const results = await Promise.all(
          TICKERS.map(async (symbol) => {
            const res = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_NEXT_PUBLIC_NEXT_PUBLIC_NEXT_PUBLIC_NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY}`,
            );
            const data = await res.json();
            return {
              symbol: symbol.replace("BINANCE:", ""),
              price: data.c,
              change: data.dp,
            };
          }),
        );
        setPrices(results);
      } catch (err) {
        console.error("Ticker fetch failed", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-blue-600/5 border-b border-white/5 overflow-hidden py-2 backdrop-blur-md">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...prices, ...prices].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 mx-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {item.symbol}
            </span>
            <span className="text-xs font-mono font-bold text-white">
              $
              {item.price?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
            <span
              className={`text-[10px] font-bold flex items-center gap-1 ${
                item.change >= 0 ? "text-green-500" : "text-red-500"
              }`}>
              {item.change >= 0 ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              {Math.abs(item.change || 0).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
