"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Zap,
  ArrowRight,
  X,
  Loader2,
  Clock,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils/format";
import { apiClient } from "@/lib/api/client"; // Importing your existing API client

export default function UserInvestPage() {
  const { user: authUser } = useAuth(); // Renamed to avoid confusion
  const [plans, setPlans] = useState<any[]>([]);
  const [pendingInvestments, setPendingInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: State for real-time wallet data to ensure button clickability
  const [liveBalance, setLiveBalance] = useState(0);

  // 1. Unified Data Fetching (Plans + Pending + Fresh Balance)
  const fetchData = useCallback(async () => {
    try {
      // We use your existing apiClient for the wallet to stay consistent with WalletPage
      const [plansRes, pendingRes, walletRes] = await Promise.all([
        fetch("/api/user/plans"),
        fetch("/api/user/investments?status=pending"),
        apiClient.getWallet(),
      ]);

      if (plansRes.status === 401 || pendingRes.status === 401) return;

      const plansData = await plansRes.json();
      const pendingData = await pendingRes.json();

      if (plansData.success) setPlans(plansData.plans);
      if (pendingData.success) setPendingInvestments(pendingData.investments);

      // Syncing live balance exactly like WalletPage does
      if (walletRes.success) {
        setLiveBalance(walletRes.data?.wallet?.balance || 0);
      }
    } catch (err) {
      console.error("System Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Precise Validation (Using Live Balance)
  const validation = useMemo(() => {
    if (!selectedPlan || !amount) return { valid: false, msg: "Enter Amount" };

    const numAmount = parseFloat(amount);

    // We prioritize liveBalance over authUser.balance for accuracy
    const balance = liveBalance;

    if (isNaN(numAmount) || numAmount <= 0)
      return { valid: false, msg: "Invalid Amount" };
    if (numAmount < selectedPlan.minAmount)
      return { valid: false, msg: `Below Min (${selectedPlan.minAmount})` };
    if (selectedPlan.maxAmount && numAmount > selectedPlan.maxAmount)
      return { valid: false, msg: `Above Max (${selectedPlan.maxAmount})` };
    if (numAmount > balance)
      return { valid: false, msg: "Insufficient Liquid Balance" };

    return { valid: true, msg: "Authorize Deployment" };
  }, [amount, selectedPlan, liveBalance]);

  // 3. Deployment Authorization Request
  const handleInvest = async () => {
    if (!validation.valid) return;

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

      const data = await res.json();

      if (data.success) {
        alert(`Deployment Authorized. Awaiting Admin Confirmation.`);
        setSelectedPlan(null);
        setAmount("");
        fetchData(); // Refresh both pending list and live balance
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
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500 italic">
          Accessing Nodes...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pt-32 pb-20 px-4 md:px-10 min-h-screen bg-black text-white">
      {/* Header */}
      <div className="mb-16 md:mb-24">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
          <h2 className="text-red-600 text-[10px] font-black uppercase tracking-[0.5em] italic">
            Capital Allocation
          </h2>
        </div>
        <h1 className="text-4xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
          Select <span className="opacity-20">Node</span>
        </h1>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="group relative bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-12 hover:border-red-600/40 transition-all duration-500">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1 italic">
                  {plan.durationDays} Day Cycle
                </p>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-red-500 transition-colors">
                  {plan.name}
                </h3>
              </div>
              <Zap
                className="text-red-600 opacity-20 group-hover:opacity-100 transition-all"
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
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mt-2 italic">
                Daily ROI
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-700 text-[9px] font-black uppercase italic">
                  Entry Floor
                </span>
                <span className="text-lg font-mono font-bold">
                  {formatCurrency(plan.minAmount)}
                </span>
              </div>
              <button
                onClick={() => setSelectedPlan(plan)}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-500">
                Choose Node <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Section */}
      {pendingInvestments.length > 0 && (
        <div className="mt-20 pt-16 border-t border-white/5">
          <div className="flex items-center gap-3 mb-10">
            <Clock className="text-amber-500" size={16} />
            <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] italic">
              Pending Authorizations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingInvestments.map((inv) => (
              <div
                key={inv._id}
                className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black uppercase italic tracking-tighter text-zinc-300">
                    {inv.planId?.name}
                  </h4>
                  <p className="text-xl font-mono font-bold text-zinc-500">
                    {formatCurrency(inv.amount)}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/98 backdrop-blur-xl"
            onClick={() => setSelectedPlan(null)}
          />
          <div className="relative bg-[#080808] border border-white/10 p-10 md:p-14 rounded-[4rem] max-w-xl w-full">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-10 right-10 text-zinc-600 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="mb-12 text-center">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
                Authorize Request
              </h2>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] italic">
                {selectedPlan.name}
              </p>
            </div>

            <div className="space-y-6 mb-12">
              {!validation.valid && amount && (
                <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500">
                  <AlertTriangle size={14} />
                  <p className="text-[10px] font-black uppercase italic tracking-widest">
                    {validation.msg}
                  </p>
                </div>
              )}

              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex justify-between items-center">
                <span className="text-[9px] uppercase font-black text-zinc-600 italic">
                  Term
                </span>
                <span className="text-sm font-bold">
                  {selectedPlan.durationDays} Days
                </span>
              </div>

              <div>
                <input
                  type="number"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min ${selectedPlan.minAmount}`}
                  className="w-full bg-transparent border-b border-white/10 py-6 text-center text-6xl font-black outline-none focus:border-red-600 transition-all text-white"
                />
                <div className="flex justify-between mt-6 px-2">
                  <p className="text-[9px] text-zinc-700 uppercase font-black italic">
                    Min: {formatCurrency(selectedPlan.minAmount)}
                  </p>
                  <p
                    className={`text-[9px] uppercase font-black italic ${parseFloat(amount) > liveBalance ? "text-red-500" : "text-emerald-500"}`}>
                    Liquid: {formatCurrency(liveBalance)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleInvest}
              disabled={!validation.valid || isSubmitting}
              className={`w-full py-7 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] transition-all duration-500
                ${validation.valid ? "bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.2)]" : "bg-zinc-900 text-zinc-700 cursor-not-allowed"}`}>
              {isSubmitting ? "Processing Ledger..." : validation.msg}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
