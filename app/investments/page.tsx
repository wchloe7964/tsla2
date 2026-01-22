"use client";

import { useState, useEffect } from "react";
import { Zap, ArrowRight, ShieldCheck, X, Wallet, Loader2 } from "lucide-react";

export default function UserInvestPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch real plans from the API we built for the Admin
  useEffect(() => {
    fetch("/api/admin/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPlans(data.plans);
        else
          setPlans([
            // Fallback if API isn't ready
            {
              name: "Model 3 Node",
              dailyReturn: 1.8,
              minAmount: 500,
              durationDays: 30,
            },
            {
              name: "Model X Matrix",
              dailyReturn: 2.5,
              minAmount: 5000,
              durationDays: 60,
            },
            {
              name: "Cybertruck Prime",
              dailyReturn: 3.2,
              minAmount: 15000,
              durationDays: 90,
            },
          ]);
      });
  }, []);

  const handleInvest = async () => {
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
        // Show Success Animation/Toast
        alert(`Node Authorized. Remaining Balance: $${data.newBalance}`);
        setSelectedPlan(null);
      } else {
        alert(data.error || "System Error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-6 min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
          Capital Allocation
        </h2>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          Choose Your{" "}
          <span className="text-zinc-800 text-outline">Growth Node</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-10 flex flex-col hover:border-red-600/30 transition-all group relative overflow-hidden">
            <div className="mb-8">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">
                {plan.durationDays} Day Term
              </p>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                {plan.name}
              </h3>
            </div>

            <div className="mb-10">
              <p className="text-5xl font-light tracking-tighter mb-1 text-white">
                {plan.dailyReturn}%
              </p>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                Daily Profit Margin
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-600 text-[10px] font-black uppercase">
                  Min. Entry
                </span>
                <span className="text-xl font-bold italic text-white">
                  ${plan.minAmount.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedPlan(plan)}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl">
                Select Node <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* INVESTMENT MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-[#0c0c0c] border border-white/10 p-10 rounded-[3rem] max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-8 right-8 text-zinc-500 hover:text-white">
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-black uppercase italic text-white mb-2">
                Confirm Allocation
              </h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">
                {selectedPlan.name} — {selectedPlan.dailyReturn}% Daily
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <label className="text-[9px] text-zinc-600 uppercase font-black mb-3 block">
                  Enter Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={selectedPlan.minAmount}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-10 pr-6 text-white outline-none focus:border-red-600 transition-all font-mono"
                  />
                </div>
                <p className="text-[9px] text-zinc-700 mt-2 uppercase font-bold">
                  Available Balance: $12,450.00
                </p>
              </div>
            </div>

            <button
              onClick={handleInvest}
              disabled={Number(amount) < selectedPlan.minAmount || isSubmitting}
              className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-700 transition-all disabled:opacity-50 disabled:bg-zinc-800">
              {isSubmitting ? (
                <Loader2 className="animate-spin mx-auto" size={18} />
              ) : (
                "Initialize Growth Node"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
