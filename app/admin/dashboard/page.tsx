"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ShieldAlert,
  Wallet,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  if (!stats) return <div className="p-10">Loading Stats...</div>;

  return (
    <div className="p-10">
      <div className="mb-12">
        <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
          Live Intelligence
        </h2>
        <h1 className="text-5xl font-black italic tracking-tighter uppercase">
          Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users />}
          color="blue"
        />
        <StatCard
          title="Pending KYC"
          value={stats.pendingKyc}
          icon={<ShieldAlert />}
          color="amber"
        />
        <StatCard
          title="Verified"
          value={stats.verifiedUsers}
          icon={<CheckCircle />}
          color="emerald"
        />
        <StatCard
          title="Platform Liquidity"
          value={`$${stats.totalBalance}`}
          icon={<Wallet />}
          color="purple"
        />
      </div>

      <div className="mt-12 p-8 bg-zinc-900/30 border border-white/5 rounded-[3rem] flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1">System Health</h3>
          <p className="text-zinc-500 text-sm">
            All core services are operational and secure.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
            Live
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    purple: "text-purple-500 bg-purple-500/10",
  };
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] hover:bg-zinc-900 transition-all group">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
        {title}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
        <ArrowUpRight
          size={16}
          className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
