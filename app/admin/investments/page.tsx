"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  HardDrive,
  Loader2,
  X,
  Activity,
  Settings,
  TrendingUp,
  Zap,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export default function AdminInvestments() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openEditModal = (plan: any) => {
    setFormData({
      name: plan.name,
      minAmount: plan.minAmount.toString(),
      dailyReturn: plan.dailyReturn.toString(),
      durationDays: plan.durationDays.toString(),
    });
    setEditingId(plan._id);
    setIsCreating(true);
  };

  const closePortal = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: "", minAmount: "", dailyReturn: "", durationDays: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to decommission this node?")) return;
    try {
      const res = await fetch(`/api/admin/plans?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchPlans();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = editingId ? "PATCH" : "POST";
    const payload = editingId ? { ...formData, id: editingId } : formData;

    try {
      const res = await fetch("/api/admin/plans", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closePortal();
        fetchPlans();
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats Calculation
  const avgROI = plans.length
    ? (
        plans.reduce((acc: any, p: any) => acc + p.dailyReturn, 0) /
        plans.length
      ).toFixed(2)
    : 0;
  const totalMinEntry = plans.reduce(
    (acc: any, p: any) => acc + p.minAmount,
    0,
  );

  return (
    <div className="p-6 md:p-10 bg-[#050505] min-h-screen text-white selection:bg-red-500/30">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pt-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">
              System Core
            </h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            Tesla{" "}
            <span className="text-zinc-900 drop-shadow-[0_0_1px_rgba(255,255,255,0.1)]">
              Investment
            </span>
          </h1>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="group px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:bg-red-600 hover:text-white transition-all duration-500 flex items-center gap-2">
          <Plus size={16} strokeWidth={3} /> Add New Plan
        </button>
      </div>

      {/* GLOBAL ANALYTICS CARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
          <p className="text-zinc-600 text-[8px] font-black uppercase mb-2 tracking-widest">
            Active Plans
          </p>
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className="text-red-600" />
            <span className="text-2xl font-bold font-mono">{plans.length}</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
          <p className="text-zinc-600 text-[8px] font-black uppercase mb-2 tracking-widest">
            Avg Daily Yield
          </p>
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-emerald-500" />
            <span className="text-2xl font-bold font-mono">{avgROI}%</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
          <p className="text-zinc-600 text-[8px] font-black uppercase mb-2 tracking-widest">
            Cumulative Entry
          </p>
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-amber-500" />
            <span className="text-2xl font-bold font-mono">
              ${totalMinEntry.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
          <p className="text-zinc-600 text-[8px] font-black uppercase mb-2 tracking-widest">
            Protocol Status
          </p>
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase text-blue-500">
              Encrypted
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-20">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] uppercase font-black tracking-widest">
            Syncing Ledger...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan: any) => (
            <div
              key={plan._id}
              className="group relative bg-[#0a0a0a] border border-white/[0.03] rounded-[3rem] p-8 md:p-10 transition-all hover:border-red-600/50 overflow-hidden shadow-2xl">
              <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-red-600 border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                  <HardDrive size={24} />
                </div>
                <span className="flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />{" "}
                  Active
                </span>
              </div>

              <h3 className="text-2xl font-black mb-1 italic uppercase tracking-tighter group-hover:text-red-500 transition-colors">
                {plan.name}
              </h3>
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <Activity size={10} /> {plan.durationDays} Day Cycle
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <p className="text-zinc-600 text-[8px] font-black uppercase mb-1">
                    Daily ROI
                  </p>
                  <p className="text-xl font-mono font-bold">
                    {plan.dailyReturn}%
                  </p>
                </div>
                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <p className="text-zinc-600 text-[8px] font-black uppercase mb-1">
                    Min Entry
                  </p>
                  <p className="text-xl font-mono font-bold">
                    ${plan.minAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <button
                  onClick={() => openEditModal(plan)}
                  className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                  <Settings size={12} /> Update Plan
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="p-3 bg-red-600/5 hover:bg-red-600 hover:text-white text-red-600 rounded-xl transition-all ml-auto">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={closePortal}
          />
          <form
            onSubmit={handleSubmit}
            className="relative bg-[#0c0c0c] border border-white/10 p-8 md:p-12 rounded-[3rem] max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                  {editingId ? "Update" : "Deploy"}{" "}
                  <span className="text-red-600">Node</span>
                </h2>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-1">
                  Database Write Authorization Required
                </p>
              </div>
              <button
                type="button"
                onClick={closePortal}
                className="p-3 text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 mb-10">
              <div className="space-y-2">
                <label className="text-[9px] text-zinc-600 uppercase font-black px-1">
                  Identifier
                </label>
                <input
                  required
                  value={formData.name}
                  placeholder="PLAN NAME"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 text-white outline-none focus:border-red-600 uppercase font-bold text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-600 uppercase font-black px-1">
                    ROI (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.dailyReturn}
                    placeholder="2.5"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 text-white outline-none focus:border-red-600 font-mono"
                    onChange={(e) =>
                      setFormData({ ...formData, dailyReturn: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-zinc-600 uppercase font-black px-1">
                    Days
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.durationDays}
                    placeholder="30"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 text-white outline-none focus:border-red-600 font-mono"
                    onChange={(e) =>
                      setFormData({ ...formData, durationDays: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] text-zinc-600 uppercase font-black px-1">
                  Min Entry ($)
                </label>
                <input
                  type="number"
                  required
                  value={formData.minAmount}
                  placeholder="500"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 text-white outline-none focus:border-red-600 font-mono"
                  onChange={(e) =>
                    setFormData({ ...formData, minAmount: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-red-500 disabled:opacity-50 flex items-center justify-center gap-3 transition-all">
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Finalize Changes"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
