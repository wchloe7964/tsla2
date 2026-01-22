import React from "react";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import Stock from "@/lib/models/Stock"; // Assuming your model name
import AssignStockForm from "@/components/admin/AssignStockForm";
import StockRegistryTable from "@/components/admin/StockRegistryTable";
import LiveTickerBanner from "@/components/admin/LiveTickerBanner";
import {
  TrendingUp,
  Briefcase,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  Globe,
  Zap,
} from "lucide-react";

/**
 * DIRECT DATA ACCESS (Bypasses API/Middleware fetch issues)
 */

async function getStockAdminData() {
  try {
    await connectDB();

    const [users, stocks] = await Promise.all([
      User.find({}).select("name email role balance").lean(),
      Stock.find({})
        .populate("userId", "name email") // FIX: Must match 'userId' from Stock.js
        .lean(),
    ]);

    const platformValue = stocks.reduce(
      (acc: number, s: any) => acc + (s.entryPrice || 0) * (s.shares || 0),
      0,
    );

    return {
      marketStats: {
        activeTrades: stocks.length,
        platformValue: platformValue || 0,
        volatility: "Stable",
      },
      users: JSON.parse(JSON.stringify(users)),
      allocations: JSON.parse(JSON.stringify(stocks)),
    };
  } catch (error) {
    console.error("DATABASE_FETCH_ERROR:", error);
    return {
      marketStats: { activeTrades: 0, platformValue: 0, volatility: "Offline" },
      users: [],
      allocations: [],
    };
  }
}

export default async function AdminStocksPage() {
  // This now runs directly on the server without calling an API route
  const { marketStats, users, allocations } = await getStockAdminData();

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-blue-500/30">
      <LiveTickerBanner />
      <div className="p-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <MetricCard
            title="Registry Volume"
            value={allocations.length}
            label="Active Allocations"
            icon={<Zap size={20} />}
            color="text-blue-500"
          />
          <MetricCard
            title="A.U.M"
            value={`$${marketStats.platformValue.toLocaleString()}`}
            label="Estimated Value"
            icon={<Briefcase size={20} />}
            color="text-emerald-500"
          />
          <MetricCard
            title="System Risk"
            value={marketStats.volatility}
            label="Volatility Index"
            icon={<Activity size={20} />}
            color="text-amber-500"
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <section>
              <AssignStockForm users={users} />
            </section>
            <section className="pt-4">
              <StockRegistryTable initialStocks={allocations} />
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-[2.5rem] p-8 sticky top-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 pb-4 border-b border-white/5">
                User Registry
              </h3>
              <div className="space-y-6">
                {users.length > 0 ? (
                  users.slice(0, 8).map((user: any) => (
                    <div key={user._id} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
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

function MetricCard({ title, value, label, icon, color }: any) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/20 transition-all group relative overflow-hidden">
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
    </div>
  );
}
