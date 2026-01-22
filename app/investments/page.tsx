"use client";

import { useState, useEffect } from "react";
import { Zap, ArrowRight, X, Loader2, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Assuming you have this to get balance
import { formatCurrency } from "@/lib/utils/format";

export default function UserInvestPage() {
  const { user } = useAuth(); // To check current user's wallet balance
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Admin-created plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/admin/plans");
        const data = await res.json();
        if (data.success) {
          setPlans(data.plans);
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleInvest = async () => {
    if (!selectedPlan || !amount) return;

    const investmentAmount = parseFloat(amount);

    // Client-side safety check
    if (investmentAmount < selectedPlan.minAmount) {
      alert(
        `Minimum investment for this node is ${formatCurrency(selectedPlan.minAmount)}`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan._id,
          amount: investmentAmount,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Success! Node ${selectedPlan.name} is now active.`);
        setSelectedPlan(null);
        setAmount("");
        // Optional: window.location.href = "/portfolio";
      } else {
        alert(data.error || "Transaction failed");
      }
    } catch (err) {
      alert("System connection error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pt-32 pb-20 px-4 md:px-10 min-h-screen bg-black text-white">
      {/* Header */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-red-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 text-center md:text-left">
          Capital Deployment
        </h2>
        <h1 className="text-4xl md:text-7xl font-light uppercase tracking-tighter leading-none text-center md:text-left">
          Select Your{" "}
          <span className="font-black italic opacity-20">Growth Node</span>
        </h1>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col hover:border-red-600/40 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">
                    {plan.durationDays} Day Cycle
                  </p>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight group-hover:text-red-500 transition-colors">
                    {plan.name}
                  </h3>
                </div>
                <Zap
                  className="text-red-600 opacity-20 group-hover:opacity-100 transition-opacity"
                  size={20}
                />
              </div>

              <div className="mb-12">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-light tracking-tighter">
                    {plan.dailyReturn}
                  </span>
                  <span className="text-xl font-bold text-red-600">%</span>
                </div>
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2">
                  Projected Daily Yield
                </p>
              </div>

              <div className="mt-auto space-y-6">
                <div className="flex justify-between items-center py-4 border-t border-white/5">
                  <span className="text-zinc-600 text-[9px] font-black uppercase">
                    Min. Requirement
                  </span>
                  <span className="text-lg font-bold font-mono">
                    {formatCurrency(plan.minAmount)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all active:scale-95">
                  Configure Node <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-zinc-500 uppercase tracking-widest text-xs">
              No active nodes available at this time.
            </p>
          </div>
        )}
      </div>

      {/* SELECTION MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#080808] border border-white/10 p-8 md:p-12 rounded-[2.5rem] max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => {
                setSelectedPlan(null);
                setAmount("");
              }}
              className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="mb-10 text-center">
              <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-red-600" size={24} />
              </div>
              <h2 className="text-2xl font-black uppercase italic mb-2 tracking-tight">
                Confirm Allocation
              </h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                Deploying to {selectedPlan.name} Node
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] uppercase font-black text-zinc-500">
                  Duration
                </span>
                <span className="text-sm font-bold">
                  {selectedPlan.durationDays} Days
                </span>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-black mb-3 block text-center">
                  Investment Capital (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min: ${selectedPlan.minAmount}`}
                  className="w-full bg-transparent border-b-2 border-white/10 py-4 text-center text-3xl font-light outline-none focus:border-red-600 transition-all placeholder:text-zinc-800"
                />
                <div className="flex justify-between mt-4 px-2">
                  <p className="text-[9px] text-zinc-600 uppercase font-bold">
                    Min Entry: {formatCurrency(selectedPlan.minAmount)}
                  </p>
                  <p className="text-[9px] text-red-500/80 uppercase font-bold">
                    Wallet: {formatCurrency(user?.wallet?.balance || 0)}
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
              className="w-full py-6 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-red-500 transition-all disabled:opacity-20 disabled:grayscale shadow-lg shadow-red-600/20">
              {isSubmitting ? (
                <Loader2 className="animate-spin mx-auto" size={18} />
              ) : (
                "Authorize Deployment"
              )}
            </button>

            <p className="mt-6 text-[8px] text-zinc-700 text-center uppercase tracking-widest leading-relaxed">
              By authorizing, you agree to the term duration and profit
              distribution model of the {selectedPlan.name}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
