"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { useStockSocket } from "@/hooks/useStockSocket";
import {
  Loader2,
  Globe,
  Newspaper,
  ArrowLeft,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  Layers,
  History,
  Activity,
  Zap,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import StockChart from "@/components/StockChart";

export default function StockDetailPage() {
  const { id } = useParams();
  const [marketData, setMarketData] = useState<any>(null);
  const [candles, setCandles] = useState<any[]>([]);
  const [userHolding, setUserHolding] = useState<any>(null);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- REAL-TIME DATA STREAM ---
  const livePrice = useStockSocket(id as string);
  const prevPriceRef = useRef<number | null>(null);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    if (livePrice !== null && prevPriceRef.current !== null) {
      if (livePrice > prevPriceRef.current) {
        setFlashClass(
          "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]",
        );
      } else if (livePrice < prevPriceRef.current) {
        setFlashClass(
          "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]",
        );
      }
      const timer = setTimeout(() => setFlashClass(""), 800);
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = livePrice;
  }, [livePrice]);

  useEffect(() => {
    async function fetchNeuralDetails() {
      try {
        setLoading(true);
        const [marketRes, candleRes, holdingsRes] = await Promise.all([
          fetch(`/api/stocks/${id}`),
          fetch(`/api/stocks/${id}/candles`),
          fetch(`/api/stocks`),
        ]);

        if (!marketRes.ok) throw new Error("Neural Node Offline");

        const marketJson = await marketRes.json();
        const candleJson = await candleRes.json();
        const holdingsJson = await holdingsRes.json();

        if (marketJson.success) setMarketData(marketJson.data);
        if (candleJson.success) setCandles(candleJson.data);

        if (holdingsJson.success) {
          const symbolStr = (id as string).toUpperCase();
          const specificStock = holdingsJson.data.stocks.find(
            (s: any) => s.symbol.toUpperCase() === symbolStr,
          );
          setUserHolding(specificStock);

          const total = holdingsJson.data.stocks.reduce(
            (acc: number, s: any) => acc + s.price * s.shares,
            0,
          );
          setTotalPortfolioValue(total);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchNeuralDetails();
  }, [id]);

  const analytics = useMemo(() => {
    const currentPrice =
      livePrice || (candles.length ? candles[candles.length - 1].close : 0);
    if (!userHolding || !currentPrice)
      return {
        pnl: { value: 0, percent: 0, isPositive: true },
        concentration: 0,
        currentPrice,
      };

    const diff = currentPrice - userHolding.price;
    const pnlValue = diff * userHolding.shares;
    const pnlPercent = (diff / userHolding.price) * 100;
    const thisValue = currentPrice * userHolding.shares;
    const concentration =
      totalPortfolioValue > 0 ? (thisValue / totalPortfolioValue) * 100 : 0;

    return {
      pnl: { value: pnlValue, percent: pnlPercent, isPositive: diff >= 0 },
      concentration: Math.min(Math.round(concentration), 100),
      currentPrice,
    };
  }, [userHolding, candles, totalPortfolioValue, livePrice]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin stroke-[1px]" />
        <p className="text-[10px] uppercase tracking-[0.8em] text-zinc-600 font-black">
          Syncing Neural Data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold mb-2 uppercase tracking-tighter">
          Access Denied
        </h2>
        <p className="text-zinc-500 text-sm mb-6">{error}</p>
        <Link
          href="/stocks"
          className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest">
          Return to Terminal
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/stocks"
          className="flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors w-fit group">
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] uppercase font-black tracking-widest">
            Back to Ledger
          </span>
        </Link>

        {/* 1. PROFILE HEADER */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-12 p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-10">
            {marketData?.profile?.logo ? (
              <img
                src={marketData.profile.logo}
                alt="Logo"
                className="w-32 h-32 rounded-[2.5rem] bg-white p-5 shadow-2xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-light text-zinc-700">
                {id?.[0]}
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-6xl font-light tracking-tighter uppercase mb-2">
                {marketData?.profile?.name || id}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <span className="text-blue-500 text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                  {marketData?.profile?.finnhubIndustry || "Strategic Node"}
                </span>
                {livePrice && (
                  <span className="flex items-center gap-1 text-emerald-400 text-[9px] font-black uppercase tracking-widest animate-pulse">
                    <Zap size={10} fill="currentColor" /> Live Feed
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-center lg:text-right">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">
              Market Valuation
            </p>
            <p
              className={`text-6xl font-light tracking-tighter transition-all duration-300 ${flashClass || "text-white"}`}>
              $
              {analytics.currentPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* 2. ALLOCATION INTEL & HISTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <HoldingCard
              label="Asset Allocation"
              value={`${userHolding?.shares?.toLocaleString() ?? 0} Units`}
              sub={`Avg Entry: $${userHolding?.price?.toFixed(2) ?? "0.00"}`}
              icon={<Layers size={18} />}
            />
            <HoldingCard
              label="Neural Value"
              value={`$${(userHolding?.shares * analytics.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              sub="Current Equity"
              icon={<Target size={18} />}
            />
            <HoldingCard
              label="Growth Delta"
              value={`${analytics.pnl.isPositive ? "+" : ""}$${Math.abs(analytics.pnl.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              sub={`${analytics.pnl.percent.toFixed(2)}% Performance`}
              icon={
                analytics.pnl.isPositive ? (
                  <TrendingUp size={18} />
                ) : (
                  <TrendingDown size={18} />
                )
              }
              color={
                analytics.pnl.isPositive ? "text-emerald-400" : "text-red-400"
              }
            />
          </div>

          <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-8 text-zinc-500">
              <History size={16} />
              <h4 className="text-[10px] uppercase font-black tracking-[0.3em]">
                Node History
              </h4>
            </div>
            <div className="space-y-8">
              <TimelineItem
                label="Last Ledger Sync"
                date={
                  userHolding?.updatedAt
                    ? new Date(userHolding.updatedAt).toLocaleDateString()
                    : "N/A"
                }
                time={
                  userHolding?.updatedAt
                    ? new Date(userHolding.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }
              />
              <TimelineItem
                label="Initial Link"
                date={
                  userHolding?.allocatedAt
                    ? new Date(userHolding.allocatedAt).toLocaleDateString()
                    : "Genesis"
                }
                time=""
              />
            </div>
          </div>
        </div>

        {/* 3. TECHNICAL CHART */}
        {candles.length > 0 && <StockChart data={candles} />}

        {/* 4. MARKET FUNDAMENTALS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-12">
          <MetricBox
            label="Cycle High (52W)"
            value={
              marketData?.fundamentals?.weekHigh52 &&
              marketData.fundamentals.weekHigh52 !== "N/A"
                ? `$${marketData.fundamentals.weekHigh52}`
                : "N/A"
            }
          />
          <MetricBox
            label="P/E Ratio"
            value={marketData?.fundamentals?.peRatio ?? "N/A"}
          />
          <MetricBox
            label="Volatility Index (Beta)"
            value={marketData?.fundamentals?.beta ?? "N/A"}
          />
          <MetricBox
            label="Market Cap"
            value={
              marketData?.fundamentals?.marketCap &&
              marketData.fundamentals.marketCap !== "N/A"
                ? `${(marketData.fundamentals.marketCap / 1000).toFixed(2)}B`
                : "N/A"
            }
          />
        </div>

        {/* 5. PORTFOLIO CONCENTRATION BREAKDOWN */}
        <div className="bg-blue-600/5 border border-white/5 rounded-[2.5rem] p-10 mb-20 flex flex-col md:flex-row justify-between items-center backdrop-blur-sm">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-blue-500 mb-2 flex items-center justify-center md:justify-start gap-3">
              <Activity size={14} /> Neural Concentration
            </h4>
            <p className="text-sm text-zinc-400 font-medium max-w-sm">
              This node accounts for{" "}
              <span className="text-white font-bold">
                {analytics.concentration}%
              </span>{" "}
              of your total allocated ledger.
            </p>
          </div>
          <div className="flex items-center gap-6 bg-black/40 p-4 rounded-3xl border border-white/5">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Exposure
            </span>
            <div className="h-1.5 w-64 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-1000 ease-out"
                style={{ width: `${analytics.concentration}%` }}
              />
            </div>
            <span className="text-[12px] font-mono text-blue-500 font-bold">
              {analytics.concentration}%
            </span>
          </div>
        </div>

        {/* 6. NEWS FEED */}
        <div className="space-y-6 mt-20">
          <div className="flex items-center justify-between mb-12 px-4">
            <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-zinc-500 flex items-center gap-3">
              <Newspaper size={16} className="text-blue-500" /> Intelligence
              Stream
            </h3>
            <div className="h-[1px] flex-1 bg-white/5 mx-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketData?.news?.length > 0 ? (
              marketData.news.map((item: any) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-8 bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] hover:border-blue-500/30 hover:bg-white/[0.01] transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {new Date(
                        item.datetime * 1000,
                      ).toLocaleDateString()} — {item.source}
                    </p>
                    <ExternalLink
                      size={14}
                      className="text-zinc-700 group-hover:text-blue-400 transition-colors"
                    />
                  </div>
                  <h4 className="text-xl font-bold group-hover:text-blue-400 transition-colors leading-tight mb-4">
                    {item.headline}
                  </h4>
                  <p className="text-sm text-zinc-500 line-clamp-2 font-medium">
                    {item.summary}
                  </p>
                </a>
              ))
            ) : (
              <div className="col-span-full py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem] text-center">
                <ShieldAlert className="mx-auto text-zinc-700 mb-4" size={32} />
                <p className="text-zinc-600 uppercase text-[10px] tracking-widest font-black">
                  No Signal Detected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function HoldingCard({ label, value, sub, icon, color = "text-white" }: any) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem]">
      <div className="flex items-center gap-3 mb-4 text-zinc-500">
        {icon}
        <span className="text-[9px] uppercase font-black tracking-widest">
          {label}
        </span>
      </div>
      <p className={`text-3xl font-light tracking-tighter mb-1 ${color}`}>
        {value}
      </p>
      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
        {sub}
      </p>
    </div>
  );
}

function MetricBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-[2rem]">
      <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-xl font-light tracking-tight text-zinc-200">{value}</p>
    </div>
  );
}

function TimelineItem({
  label,
  date,
  time,
}: {
  label: string;
  date: string;
  time: string;
}) {
  return (
    <div className="relative pl-8 border-l border-white/10">
      <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-2">
        {label}
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-white tracking-tight">{date}</p>
        {time && (
          <p className="text-[10px] font-mono text-zinc-600 uppercase">
            {time}
          </p>
        )}
      </div>
    </div>
  );
}
