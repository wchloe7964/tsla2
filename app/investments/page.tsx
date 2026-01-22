"use client";

import { useState, useEffect, useCallback } from "react";
import { Zap, ArrowRight, X, Loader2, Clock, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils/format";

export default function UserInvestPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [pendingInvestments, setPendingInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Data Fetching with Auth Guard
  const fetchData = useCallback(async () => {
    try {
      const [plansRes, pendingRes] = await Promise.all([
        fetch("/api/user/plans"), // Updated to the user-filtered endpoint
        fetch("/api/user/investments?status=pending"),
      ]);

      // If either returns 401, we stop to prevent the '<' Syntax Error
      if (plansRes.status === 401 || pendingRes.status === 401) {
        console.error("Authentication required.");
        return;
      }

      const plansData = await plansRes.json();
      const pendingData = await pendingRes.json();

      if (plansData.success) setPlans(plansData.plans);
      if (pendingData.success) setPendingInvestments(pendingData.investments);
    } catch (err) {
      console.error("System Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Deployment Authorization Request
  const handleInvest = async () => {
    if (!selectedPlan || !amount) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan._id,
          amount: parseFloat(amount),
        }),
      });

      // Defensive JSON check
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await res.json();

      if (data.success) {
        alert(`Deployment Authorized. Awaiting Admin Confirmation.`);
        setSelectedPlan(null);
        setAmount("");
        fetchData(); // Instantly refresh pending section
      } else {
        alert(data.error || "Allocation Failed");
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("System Offline: Connection to Ledger Failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
          Accessing Nodes...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pt-32 pb-20 px-4 md:px-10 min-h-screen bg-black text-white selection:bg-red-500/30">
      {/* Header Section */}
      <div className="mb-16 md:mb-24 relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
          <h2 className="text-red-600 text-[10px] font-black uppercase tracking-[0.5em]">
            Capital Allocation
          </h2>
        </div>
        <h1 className="text-4xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
          Select{" "}
          <span className="text-zinc-900 drop-shadow-[0_0_1px_rgba(255,255,255,0.2)]">
            Node
          </span>
        </h1>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div
              key={plan._id}
              className="group relative bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 flex flex-col hover:border-red-600/40 transition-all duration-500 overflow-hidden shadow-2xl">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">
                    {plan.durationDays} Day Cycle
                  </p>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-red-500 transition-colors">
                    {plan.name}
                  </h3>
                </div>
                <Zap
                  className="text-red-600 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all"
                  size={20}
                />
              </div>

              <div className="mb-12">
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tighter">
                    {plan.dailyReturn}
                  </span>
                  <span className="text-xl font-bold text-red-600">%</span>
                </div>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mt-2">
                  Daily ROI
                </p>
              </div>

              <div className="mt-auto space-y-6">
                <div className="flex justify-between items-center py-5 border-t border-white/5">
                  <span className="text-zinc-700 text-[9px] font-black uppercase tracking-widest">
                    Entry Floor
                  </span>
                  <span className="text-lg font-mono font-bold">
                    {formatCurrency(plan.minAmount)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-500">
                  Initialize Node <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-zinc-900/10 border border-dashed border-white/5 rounded-[3rem] text-center">
            <ShieldAlert className="mx-auto text-zinc-800 mb-4" size={32} />
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              No nodes available for public deployment
            </p>
          </div>
        )}
      </div>

      {/* PENDING AUTHORIZATIONS (ONLY VISIBLE IF EXISTS) */}
      {pendingInvestments.length > 0 && (
        <div className="mt-20 pt-16 border-t border-white/5 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3 mb-10">
            <Clock className="text-amber-500" size={16} />
            <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">
              Pending Authorizations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingInvestments.map((inv) => (
              <div
                key={inv._id}
                className="bg-zinc-950 border border-amber-500/10 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-amber-500/30 transition-all">
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">
                    Awaiting Admin
                  </p>
                  <h4 className="text-lg font-black uppercase italic tracking-tighter">
                    {inv.planId?.name || "System Node"}
                  </h4>
                  <p className="text-xl font-mono font-bold text-zinc-400">
                    {formatCurrency(inv.amount)}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL OVERLAY */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedPlan(null)}
          />
          <div className="relative bg-[#080808] border border-white/10 p-10 md:p-14 rounded-[4rem] max-w-xl w-full shadow-[0_0_80px_rgba(220,38,38,0.1)] animate-in zoom-in-95">
            <button
              onClick={() => {
                setSelectedPlan(null);
                setAmount("");
              }}
              className="absolute top-10 right-10 text-zinc-600 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="mb-12 text-center">
              <div className="w-16 h-16 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-600/20">
                <Zap className="text-red-600" size={28} />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
                Authorize Request
              </h2>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
                {selectedPlan.name}
              </p>
            </div>

            <div className="space-y-6 mb-12">
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex justify-between items-center">
                <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">
                  Protocol Term
                </span>
                <span className="text-sm font-bold font-mono">
                  {selectedPlan.durationDays} Days
                </span>
              </div>
              <div>
                <label className="text-[9px] text-zinc-600 uppercase font-black mb-4 block text-center tracking-[0.2em]">
                  Deployment Amount (USD)
                </label>
                <input
                  type="number"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min: ${selectedPlan.minAmount}`}
                  className="w-full bg-transparent border-b border-white/10 py-6 text-center text-5xl font-black outline-none focus:border-red-600 transition-all text-white placeholder:text-zinc-900"
                />
                <div className="flex justify-between mt-6 px-2">
                  <p className="text-[9px] text-zinc-700 uppercase font-black tracking-tighter">
                    Threshold: {formatCurrency(selectedPlan.minAmount)}
                  </p>
                  <p className="text-[9px] text-emerald-500 uppercase font-black tracking-tighter">
                    Liquid: {formatCurrency(user?.wallet?.balance || 0)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleInvest}
              disabled={
                Number(amount) < selectedPlan.minAmount ||
                isSubmitting ||
                Number(amount) > (user?.wallet?.balance || 0)
              }
              className="w-full py-7 bg-red-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-red-500 disabled:opacity-10 transition-all shadow-2xl shadow-red-600/20">
              {isSubmitting ? (
                <Loader2 className="animate-spin mx-auto" size={20} />
              ) : (
                "Finalize Authorization"
              )}
            </button>

            <p className="mt-8 text-[8px] text-zinc-800 text-center uppercase font-black tracking-widest leading-relaxed px-10">
              Funds are secured in escrow until manual system verification is
              completed by the administrative core.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
