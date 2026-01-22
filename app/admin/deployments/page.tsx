"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Cpu,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  User,
  Calendar,
  History,
} from "lucide-react";
import InvestmentControls from "@/components/admin/InvestmentControls";
import { formatCurrency } from "@/lib/utils/format";

export default function AdminDeploymentsPage() {
  const [deployments, setDeployments] = useState<any[]>([]); // Initialized as array
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchDeployments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/investments");
      const data = await res.json();

      // Safety Check: Ensure we always set an array
      if (data.success && Array.isArray(data.investments)) {
        setDeployments(data.investments);
      } else {
        setDeployments([]);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
      setDeployments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  // FIX: Added (deployments || []) to prevent the 'filter' of undefined error
  const filteredData = (deployments || []).filter((d) => {
    if (!d) return false;

    const matchesSearch =
      d.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.planId?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || d.status === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
          Syncing Management Data...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
            Active <span className="text-red-600">Requests</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
            Administrative Oversight Portal
          </p>
        </div>
        <button
          onClick={fetchDeployments}
          className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Grid of User Requests */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredData.map((inv) => (
          <div
            key={inv._id}
            className="bg-zinc-900/30 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col md:flex-row">
            {/* User & Plan Details */}
            <div className="flex-1 p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={12} className="text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Client Account
                    </span>
                  </div>
                  <h3 className="font-bold text-sm">
                    {inv.userId?.email || "Unknown User"}
                  </h3>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                    inv.status === "active"
                      ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
                      : inv.status === "pending"
                        ? "border-amber-500/20 text-amber-500 bg-amber-500/5"
                        : "border-zinc-500/20 text-zinc-500 bg-zinc-500/5"
                  }`}>
                  {inv.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                    Capital
                  </p>
                  <p className="text-xl font-black font-mono">
                    {formatCurrency(inv.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                    Return Rate
                  </p>
                  <p className="text-xl font-black font-mono text-emerald-500">
                    {inv.dailyReturn}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  Initiated: {new Date(inv.requestedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Management Controls Component */}
            <div className="w-full md:w-80 bg-white/[0.01] border-l border-white/5 p-6 flex flex-col justify-center">
              <InvestmentControls inv={inv} onRefresh={fetchDeployments} />
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-40 border border-dashed border-white/5 rounded-[4rem]">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 italic">
            No active records found
          </p>
        </div>
      )}
    </div>
  );
}
