import React from "react";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import Stock from "@/lib/models/Stock";
import AssignStockForm from "@/components/admin/AssignStockForm";
import StockRegistryTable from "@/components/admin/StockRegistryTable";
import LiveTickerBanner from "@/components/admin/LiveTickerBanner";
import {
  TrendingUp,
  Briefcase,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";

/**
 * DIRECT DATA ACCESS
 * Fetches MongoDB records and merges with live TSLA price from Binance.
 */
async function getStockAdminData() {
  try {
    await connectDB();

    // 1. Fetch Live TSLA Price for server-side initial stats
    let livePrice = 242.5; // Fallback price
    try {
      const res = await fetch(
        "https://api.binance.com/api/v3/ticker/price?symbol=TSLAUSDT",
        { next: { revalidate: 30 } }, // Cache for 30 seconds
      );
      const data = await res.json();
      if (data.price) livePrice = parseFloat(data.price);
    } catch (e) {
      console.warn("Live market price fetch failed, using fallback.");
    }

    // 2. Concurrent DB Fetch
    const [users, stocks] = await Promise.all([
      User.find({}).select("name email role balance").lean(),
      Stock.find({}).populate("userId", "name email").lean(),
    ]);

    // 3. Financial Calculations
    const totalPrincipal = stocks.reduce(
      (acc: number, s: any) => acc + (s.entryPrice || 0) * (s.shares || 0),
      0,
    );
    const currentMarketValue = stocks.reduce(
      (acc: number, s: any) => acc + livePrice * (s.shares || 0),
      0,
    );
    const totalYield = currentMarketValue - totalPrincipal;

    return {
      marketStats: {
        activeTrades: stocks.length,
        principalValue: totalPrincipal,
        currentMarketValue: currentMarketValue,
        totalYield: totalYield,
        livePrice: livePrice,
      },
      users: JSON.parse(JSON.stringify(users)),
      allocations: JSON.parse(JSON.stringify(stocks)),
    };
  } catch (error) {
    console.error("DATABASE_FETCH_ERROR:", error);
    return {
      marketStats: {
        activeTrades: 0,
        principalValue: 0,
        currentMarketValue: 0,
        totalYield: 0,
        livePrice: 0,
      },
      users: [],
      allocations: [],
    };
  }
}

export default async function AdminStocksPage() {
  const { marketStats, users, allocations } = await getStockAdminData();

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-blue-500/30">
      <LiveTickerBanner />

      <div className="p-8">
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_#2563eb]" />
              <h2 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em]">
                Equity Management System v4.0
              </h2>
            </div>
            <h1 className="text-6xl font-light tracking-tighter uppercase text-white font-tesla">
              Stock <span className="text-zinc-600 italic">Portfolio</span>
            </h1>
          </div>

          <div className="flex items-center gap-6 bg-white/[0.03] border border-white/10 px-8 py-4 rounded-[2rem] backdrop-blur-md">
            <div className="text-right">
              <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                Global Status
              </p>
              <p className="text-xs font-bold text-green-400 flex items-center gap-2 justify-end">
                <ShieldCheck size={14} /> Encrypted
              </p>
            </div>
          </div>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <MetricCard
            title="Registry Volume"
            value={marketStats.activeTrades}
            label="Active Ledger Entries"
            icon={<Zap size={20} />}
            color="text-blue-500"
          />
          <MetricCard
            title="Total Holdings"
            value={`$${marketStats.currentMarketValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            label={`Value @ $${marketStats.livePrice} TSLA`}
            icon={<Briefcase size={20} />}
            color="text-emerald-500"
          />
          <MetricCard
            title="Platform Yield"
            value={`${marketStats.totalYield >= 0 ? "+" : ""}$${marketStats.totalYield.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            label="Unrealized Performance"
            icon={<TrendingUp size={20} />}
            color={
              marketStats.totalYield >= 0 ? "text-emerald-400" : "text-red-500"
            }
          />
        </div>

        {/* MAIN INTERFACE */}
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Forms & Table */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <AssignStockForm users={users} />
            </section>
            <section className="pt-4">
              <StockRegistryTable initialStocks={allocations} />
            </section>
          </div>

          {/* Right: User Registry Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-[2.5rem] p-8 sticky top-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 pb-4 border-b border-white/5">
                Shareholder Index
              </h3>
              <div className="space-y-6">
                {users.length > 0 ? (
                  users.slice(0, 10).map((user: any) => (
                    <div key={user._id} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:border-blue-500/50">
                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-200 uppercase tracking-tight">
                          {user.name}
                        </p>
                        <p className="text-[9px] text-zinc-600 font-medium">
                          ID: {user._id.toString().slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-600 text-[9px] uppercase font-bold text-center">
                    No Users Found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * REUSABLE METRIC CARD COMPONENT
 */
function MetricCard({ title, value, label, icon, color }: any) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all group relative overflow-hidden">
      <div className={`${color} mb-6 p-4 bg-white/5 w-fit rounded-2xl`}>
        {icon}
      </div>
      <p className="text-zinc-500 text-[10px] uppercase tracking-[0.25em] font-black mb-1">
        {title}
      </p>
      <p className="text-4xl font-light tracking-tighter text-white mb-2">
        {value}
      </p>
      <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">
        {label}
      </p>
      {/* Decorative background glow */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors" />
    </div>
  );
}
