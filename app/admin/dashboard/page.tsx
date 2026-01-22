"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ShieldAlert,
  Wallet,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Zap,
  AlertCircle,
  Clock,
  LayoutDashboard,
  ListChecks,
  BarChart3,
  HardDrive,
} from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Sync Core Stats
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
      })
      .catch((err) => console.error("Stats Error:", err));

    // Sync Live Feed
    const fetchActivity = async () => {
      try {
        const res = await fetch("/api/admin/activity");
        const json = await res.json();
        if (json.success) setActivities(json.data);
      } catch (err) {
        console.error("Feed Error:", err);
      }
    };

    fetchActivity();
    const streamInterval = setInterval(fetchActivity, 15000);
    return () => clearInterval(streamInterval);
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Zap className="text-red-600 animate-pulse" size={32} />
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-600">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-10 bg-[#050505] min-h-screen text-white">
      {/* 1. HEADER */}
      <div className="flex justify-between items-end mb-16">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#dc2626]" />
            <span className="text-red-600 text-[9px] font-black uppercase tracking-[0.4em]">
              Admin Live Mode
            </span>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
            Tesla <span className="text-zinc-800">Admin</span>
          </h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Platform Status
          </p>
          <p className="text-2xl font-light tracking-tighter text-emerald-500">
            All Systems Online
          </p>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={18} />}
          trend="Active Now"
          color="blue"
        />
        <StatCard
          title="Pending ID Checks"
          value={stats.pendingKyc}
          icon={<ShieldAlert size={18} />}
          trend="Need Review"
          color="amber"
        />
        <StatCard
          title="Verified Users"
          value={stats.verifiedUsers}
          icon={<CheckCircle size={18} />}
          trend="Approved"
          color="emerald"
        />
        <StatCard
          title="Total Money"
          value={`$${stats.totalBalance?.toLocaleString()}`}
          icon={<Wallet size={18} />}
          trend="Platform Total"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-zinc-900/20 border border-white/5 rounded-[3rem] p-10 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <Activity className="text-red-600" size={20} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                Recent Activity
              </h3>
            </div>
            <button className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white">
              Full Logs
            </button>
          </div>

          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                      <Zap size={16} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">
                        New Investment
                      </p>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                        User #{act.user} — {act.planName} Plan
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-emerald-400 font-bold">
                      +${act.amount.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-zinc-600 uppercase font-black">
                      {new Date(act.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl">
                <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                  No new updates...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4. SYSTEM HEALTH */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 flex items-center gap-2">
              <BarChart3 size={14} /> System Health
            </h4>
            <div className="space-y-8">
              <InsightRow
                label="Server Speed"
                value="Fast"
                color="text-emerald-400"
              />
              <InsightRow
                label="Database"
                value="Synced"
                color="text-blue-400"
              />
              <InsightRow
                label="API Status"
                value="Online"
                color="text-emerald-400"
              />
            </div>
          </div>

          <div className="bg-red-600/5 border border-red-600/10 rounded-[3rem] p-10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <AlertCircle className="text-red-600" size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                Action Required
              </h4>
            </div>
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative z-10">
              <p className="text-[10px] text-red-600 font-bold uppercase mb-2">
                ID Verification
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                3 users need their ID manually checked before they can withdraw
                funds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function StatCard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    red: "text-red-500 bg-red-600/10 border-red-600/20",
  };
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all group relative overflow-hidden">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
        {title}
      </p>
      <h3 className="text-4xl font-light tracking-tighter mb-4">{value}</h3>
      <div className="flex items-center gap-2">
        <span
          className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${colors[color]}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function InsightRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center group">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
        {label}
      </span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}
