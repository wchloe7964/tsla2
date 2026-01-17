"use client";

import { useState } from "react";
import {
  X,
  ChevronRight,
  Landmark,
  Globe,
  Smartphone,
  ShieldAlert,
  Loader2,
  ArrowDownCircle,
  Link,
  Hash,
  Lock,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import TransactionSuccess from "./TransactionSuccess";
import { formatCurrency } from "@/lib/utils/format";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBalance: number;
  canWithdraw?: boolean; // NEW: Prop from parent
}

export default function WithdrawModal({
  isOpen,
  onClose,
  onSuccess,
  currentBalance,
  canWithdraw = true, // Default to true
}: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState<"bank" | "global" | "crypto">(
    "bank"
  );
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Field states for the destination details
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("ERC20");
  const [bankName, setBankName] = useState("");

  if (!isOpen) return null;

  const isOverBalance = Number(amount) > (currentBalance ?? 0);

  const isFormInvalid =
    !amount ||
    Number(amount) <= 0 ||
    isOverBalance ||
    (destination === "crypto" && (!address || address.length < 10)) ||
    (destination === "global" && !address);

  const handleWithdraw = async () => {
    if (isFormInvalid || !canWithdraw) return;
    setLoading(true);
    setServerError(null);

    try {
      const res = await apiClient.postWallet({
        action: "withdraw",
        amount: Number(amount),
        method: destination,
        address:
          destination === "crypto"
            ? `${network}: ${address}`
            : `${bankName}: ${address}`,
      });

      if (res.success) {
        setIsSuccess(true);
        onSuccess();
      } else {
        setServerError(res.error || "Withdrawal failed");
      }
    } catch (err: any) {
      setServerError("Verification server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setAmount("");
    setAddress("");
    setServerError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="p-8 md:p-10">
          {isSuccess ? (
            <TransactionSuccess
              amount={amount}
              type="withdrawal"
              onClose={handleClose}
            />
          ) : !canWithdraw ? (
            /* NEW: LEDGER LOCKED UI */
            <div className="py-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Lock className="text-red-500" size={32} />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.4em] font-black text-red-500 mb-4 italic">
                  Security Restriction
                </h3>
                <p className="text-3xl font-light tracking-tight text-white mb-4">
                  Ledger Locked.
                </p>
                <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-black italic max-w-[280px] mx-auto">
                  Your account is currently undergoing a security audit.
                  Outbound transfers are temporarily paused.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Close Portal
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-500 mb-2 italic">
                    Send Funds
                  </p>
                  <h3 className="text-3xl font-light tracking-tight text-white">
                    Withdrawal
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full bg-white/5 text-gray-500">
                  <X size={20} />
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-4 mb-8">
                <div className="relative">
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light transition-colors ${
                      isOverBalance ? "text-red-500" : "text-gray-600"
                    }`}>
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full bg-transparent border-none pl-8 text-6xl font-light tracking-tighter focus:ring-0 transition-colors ${
                      isOverBalance ? "text-red-500" : "text-white"
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center px-1 text-[10px] font-black uppercase italic text-gray-500">
                  <span>Available Balance</span>
                  <span
                    className={
                      isOverBalance ? "text-red-400" : "text-white/60"
                    }>
                    {formatCurrency(currentBalance ?? 0)}
                  </span>
                </div>
              </div>

              {/* Destination Type */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { id: "bank", icon: Landmark, label: "Bank" },
                  { id: "global", icon: Globe, label: "Wire" },
                  { id: "crypto", icon: Smartphone, label: "Crypto" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDestination(item.id as any)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      destination === item.id
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-gray-500 border-white/5"
                    }`}>
                    <item.icon size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* DYNAMIC FIELDS */}
              <div className="space-y-4 mb-8">
                {destination === "crypto" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-500 italic ml-1">
                        Network
                      </label>
                      <select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:ring-blue-500 appearance-none">
                        <option value="ERC20">Ethereum (ERC20)</option>
                        <option value="TRC20">Tron (TRC20)</option>
                        <option value="BEP20">BNB Smart Chain (BEP20)</option>
                        <option value="BTC">Bitcoin Network</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-500 italic ml-1">
                        Wallet Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Paste your address here"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-bold text-white placeholder:text-gray-700"
                        />
                        <Link
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                          size={16}
                        />
                      </div>
                    </div>
                  </>
                )}

                {(destination === "bank" || destination === "global") && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-500 italic ml-1">
                        Bank Name & Branch
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chase Bank, New York"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white placeholder:text-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-500 italic ml-1">
                        Account Number / IBAN
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Account or IBAN"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-bold text-white placeholder:text-gray-700"
                        />
                        <Hash
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                          size={16}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {(isOverBalance || serverError) && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8">
                  <ShieldAlert className="text-red-500" size={18} />
                  <p className="text-[11px] text-red-200/80 font-black italic uppercase tracking-tighter">
                    {serverError || "Insufficient funds available."}
                  </p>
                </div>
              )}

              {/* Confirm Button */}
              <button
                disabled={isFormInvalid || loading}
                onClick={handleWithdraw}
                className={`group w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isFormInvalid
                    ? "bg-gray-800 text-gray-600"
                    : "bg-white text-black hover:bg-gray-100"
                }`}>
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Proceed to Review <ChevronRight size={14} />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
