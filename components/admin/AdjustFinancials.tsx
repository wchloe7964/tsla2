"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  X,
  PlusCircle,
  MinusCircle,
  Loader2,
  Wallet,
  TrendingUp,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

export default function AdjustFinancials({
  userId,
  initialProfit,
  initialInvested,
}: {
  userId: string;
  initialProfit: number;
  initialInvested: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"deposit" | "debit">("deposit");
  const [amount, setAmount] = useState("");
  const [profitOverride, setProfitOverride] = useState(
    (initialProfit ?? 0).toString()
  );
  const [investedOverride, setInvestedOverride] = useState(
    (initialInvested ?? 0).toString()
  );
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleAction = async () => {
    setLoading(true);
    try {
      const endpoint =
        mode === "deposit"
          ? "/api/admin/users/deposit"
          : "/api/admin/users/debit";

      const payload: any = {
        userId,
        amount: parseFloat(amount) || 0,
        description, // User never sees "Admin Update" anymore
      };

      if (parseFloat(profitOverride) !== initialProfit) {
        payload.newProfit = parseFloat(profitOverride);
      }

      if (parseFloat(investedOverride) !== initialInvested) {
        payload.newInvested = parseFloat(investedOverride);
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsOpen(false);
        setAmount("");
        setDescription(""); // Clear description for next time
        router.refresh();
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      alert("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest">
        <ShieldCheck size={14} /> Update Balance
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
                  Equity Adjustment
                </h2>
                <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
                  Secure Ledger Override
                </p>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X className="text-zinc-500 hover:text-white transition-colors" />
              </button>
            </div>

            {/* TOGGLE MODE */}
            <div className="flex p-1 bg-white/5 rounded-2xl mb-6 border border-white/5">
              <button
                onClick={() => setMode("deposit")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                  mode === "deposit"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}>
                <PlusCircle size={14} /> Credit Ledger
              </button>
              <button
                onClick={() => setMode("debit")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                  mode === "debit"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}>
                <MinusCircle size={14} /> Debit Ledger
              </button>
            </div>

            <div className="space-y-5">
              {/* WALLET ADJUSTMENT */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Cash Balance (+/-)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 p-4 pl-8 rounded-2xl text-white outline-none focus:border-emerald-500/50 font-mono text-lg transition-all"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* INVESTED OVERRIDE */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Briefcase size={12} className="text-blue-400" /> Capital
                  Invested
                </label>
                <input
                  type="number"
                  className="w-full bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl text-blue-400 outline-none focus:border-blue-400 font-mono text-lg"
                  value={investedOverride}
                  onChange={(e) => setInvestedOverride(e.target.value)}
                />
              </div>

              {/* PROFIT OVERRIDE */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <TrendingUp size={12} className="text-emerald-400" /> Accrued
                  Profits
                </label>
                <input
                  type="number"
                  className="w-full bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 outline-none focus:border-emerald-400 font-mono text-lg"
                  value={profitOverride}
                  onChange={(e) => setProfitOverride(e.target.value)}
                />
              </div>

              {/* STEALTH DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Public Ledger Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Network Yield Rebalance"
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-zinc-300 outline-none focus:border-white/20 text-xs italic"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-[9px] text-zinc-600 px-1 italic">
                  Note: The user will see this in their transaction history.
                </p>
              </div>

              <button
                disabled={loading}
                onClick={handleAction}
                className="w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all mt-4 bg-white text-black hover:bg-emerald-500 hover:text-white flex items-center justify-center gap-2 shadow-xl shadow-white/5">
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
