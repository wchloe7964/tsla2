"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  HardDrive,
  Loader2,
  X,
  Activity,
  TrendingUp,
  BarChart3,
  Zap,
} from "lucide-react";

export default function AdminInvestments() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    minAmount: "",
    dailyReturn: "",
    durationDays: "",
  });

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (data.success) setPlans(data.plans);
    } catch (err) {
      console.error("Sync Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsCreating(false);
        setFormData({
          name: "",
          minAmount: "",
          dailyReturn: "",
          durationDays: "",
        });
        fetchPlans();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-10 bg-[#050505] min-h-screen text-white selection:bg-red-500/30">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">
              Asset Management System
            </h2>
          </div>
          <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">
            Growth{" "}
            <span className="text-zinc-900 drop-shadow-[0_0_1px_rgba(255,255,255,0.1)]">
              Nodes
            </span>
          </h1>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="group relative overflow-hidden px-10 py-5 bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-full hover:bg-red-600 hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <span className="relative z-10 flex items-center gap-2">
            <Plus size={18} strokeWidth={3} /> Deploy New Node
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-red-600" size={32} />
          <p className="text-[10px] uppercase font-black tracking-widest text-zinc-700">
            Accessing Database...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan: any) => (
            <div
              key={plan._id}
              className="group relative bg-[#0a0a0a] border border-white/[0.03] rounded-[3.5rem] p-10 transition-all duration-500 hover:border-red-600/50 hover:bg-[#0f0f0f] hover:-translate-y-2 overflow-hidden shadow-2xl">
              {/* Background Accent */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors" />

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-red-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <HardDrive size={28} />
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />{" "}
                    Live
                  </span>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-1 italic uppercase tracking-tighter group-hover:text-red-500 transition-colors">
                  {plan.name}
                </h3>
                <div className="flex items-center gap-2 mb-8">
                  <Activity size={12} className="text-zinc-700" />
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    {plan.durationDays} Day Deployment Cycle
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/[0.02] border border-white/[0.03] p-6 rounded-[2rem] hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={10} className="text-emerald-500" />
                      <p className="text-zinc-600 text-[8px] font-black uppercase tracking-tighter">
                        Daily ROI
                      </p>
                    </div>
                    <p className="text-2xl font-mono font-bold text-white tracking-tighter">
                      {plan.dailyReturn}
                      <span className="text-xs text-emerald-500 ml-0.5">%</span>
                    </p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.03] p-6 rounded-[2rem] hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={10} className="text-amber-500" />
                      <p className="text-zinc-600 text-[8px] font-black uppercase tracking-tighter">
                        Min. Entry
                      </p>
                    </div>
                    <p className="text-2xl font-mono font-bold text-white tracking-tighter">
                      <span className="text-xs text-zinc-500 mr-0.5">$</span>
                      {plan.minAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <button className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors flex items-center gap-2">
                    <BarChart3 size={12} /> Analytics
                  </button>
                  <button className="p-3 bg-red-600/5 hover:bg-red-600 hover:text-white text-red-600 rounded-2xl transition-all border border-red-600/10">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL: TECH OVERLAY */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsCreating(false)}
          />

          <form
            onSubmit={handleCreate}
            className="relative bg-[#0c0c0c] border border-white/10 p-12 rounded-[4rem] max-w-2xl w-full shadow-[0_0_100px_rgba(220,38,38,0.15)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                  Configure <span className="text-red-600">Node</span>
                </h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2">
                  Manual Asset Initialization
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-4 bg-white/5 rounded-full hover:bg-white/10 text-zinc-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8 mb-12">
              <div className="group">
                <label className="text-[9px] text-zinc-600 uppercase font-black mb-3 block px-1 group-focus-within:text-red-500 transition-colors">
                  Node Identifier
                </label>
                <input
                  required
                  placeholder="e.g. MODEL S PERFORMANCE"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-red-600 focus:bg-white/[0.05] transition-all font-bold tracking-tight uppercase"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] text-zinc-600 uppercase font-black mb-3 block px-1">
                    Daily Return Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="0.00"
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-red-600 transition-all font-mono"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dailyReturn: e.target.value,
                        })
                      }
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">
                      %
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-600 uppercase font-black mb-3 block px-1">
                    Cycle Duration (Days)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="30"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-red-600 transition-all font-mono"
                    onChange={(e) =>
                      setFormData({ ...formData, durationDays: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-zinc-600 uppercase font-black mb-3 block px-1">
                  Threshold Entry Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 pl-10 text-white outline-none focus:border-red-600 transition-all font-mono"
                    onChange={(e) =>
                      setFormData({ ...formData, minAmount: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-red-600 text-white rounded-3xl font-black uppercase text-[12px] tracking-[0.3em] hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50">
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Authorize Deployment"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
