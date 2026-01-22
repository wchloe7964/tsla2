"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Users,
  Coins,
  Clock,
  Shield,
} from "lucide-react";

export default function GlobalActivityPage() {
  const [investments, setInvestments] = useState([]);
  const [summary, setSummary] = useState({
    totalCapital: 0,
    dailyLiability: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/investments")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setInvestments(json.data);
          setSummary(json.summary);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-10 bg-[#050505] min-h-screen text-white">
      {/* HUD Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatCard
          label="Total Capital Locked"
          value={`$${summary.totalCapital.toLocaleString()}`}
          icon={<Coins />}
          color="text-white"
        />
        <StatCard
          label="Projected Daily Payout"
          value={`$${summary.dailyLiability.toFixed(2)}`}
          icon={<ArrowUpRight />}
          color="text-red-600"
        />
        <StatCard
          label="Active Nodes"
          value={investments.length}
          icon={<Activity />}
          color="text-red-600"
        />
      </div>

      <div className="mb-10">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase">
          Live <span className="text-zinc-800">Activity</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
          Real-time Node Monitoring & Capital Flow
        </p>
      </div>

      <div className="bg-[#0c0c0c] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                Investor
              </th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                Node Configuration
              </th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                Capital
              </th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                Maturity
              </th>
              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-zinc-600 text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {investments.map((inv: any) => (
              <tr
                key={inv._id}
                className="hover:bg-white/[0.01] transition-colors group">
                <td className="p-8">
                  <p className="font-bold text-zinc-200 uppercase text-xs tracking-tight">
                    {inv.userId?.name || "Member"}
                  </p>
                  <p className="text-[10px] text-zinc-600 font-mono">
                    {inv.userId?.email}
                  </p>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600">
                      <Shield size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase italic">
                        {inv.planName}
                      </p>
                      <p className="text-[9px] text-emerald-500 font-bold">
                        {inv.dailyReturn}% Daily ROI
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <p className="text-sm font-mono font-bold text-white">
                    ${inv.amount.toLocaleString()}
                  </p>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase">
                    <Clock size={12} />{" "}
                    {new Date(inv.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-8 text-right">
                  <span className="px-4 py-2 bg-red-600/10 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-red-600/20">
                    Active Node
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
      <div
        className={`absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        {icon}
      </div>
      <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`text-4xl font-black italic tracking-tighter ${color}`}>
        {value}
      </p>
    </div>
  );
}
