"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Shield,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff,
  ArrowUpRight,
  Clock,
  Activity,
  Lock,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import ProtectedRoute from "@/components/ProtectedRoute";
import DepositModal from "@/components/wallet/DepositModal";
import WithdrawModal from "@/components/wallet/WithdrawModal";
import HistoryModal from "@/components/wallet/HistoryModal";
import { formatCurrency } from "@/lib/utils/format";

export default function WalletPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const fetchWalletData = async () => {
    try {
      setRefreshing(true);
      const response = await apiClient.getWallet();
      if (response.success) {
        setWalletData(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  const currentBalance = walletData?.wallet?.balance || 0;
  const transactions = walletData?.transactions || [];
  // NEW: Get restriction status from API
  const canWithdraw = walletData?.canWithdraw !== false;

  const pendingAmount = transactions
    .filter(
      (tx: any) =>
        tx.status === "pending" &&
        (tx.type === "withdraw" || tx.type === "withdrawal")
    )
    .reduce((acc: number, tx: any) => acc + tx.amount, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-20 px-6 overflow-x-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <h1 className="text-xs uppercase tracking-[0.6em] font-black text-blue-500 mb-6 italic">
                Cash Liquidity
              </h1>
              <h2 className="text-6xl md:text-8xl font-light tracking-tighter leading-none">
                My Wallet.
              </h2>
            </div>
            <button
              onClick={fetchWalletData}
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 hover:text-white transition-all italic">
              <RefreshCw
                size={14}
                className={
                  refreshing
                    ? "animate-spin"
                    : "group-hover:rotate-180 transition-transform duration-700"
                }
              />
              Sync Ledger
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT SIDE: Visual Balance & Primary Actions */}
            <div className="lg:col-span-7 space-y-12">
              <div className="relative group">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${
                    !canWithdraw
                      ? "from-red-600 to-orange-600 opacity-20"
                      : "from-blue-600 to-indigo-600 opacity-10"
                  } rounded-[3rem] blur-xl group-hover:opacity-20 transition duration-1000`}></div>
                <div className="relative bg-white/[0.03] border border-white/10 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl">
                  <div className="flex justify-between items-start mb-16">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-500 italic">
                          Available Balance
                        </p>
                        {!canWithdraw && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-[8px] font-black text-red-500 uppercase italic tracking-widest animate-pulse">
                            <Lock size={8} /> Ledger Locked
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <h3
                          className={`text-7xl font-light tracking-tighter leading-none ${
                            !canWithdraw && balanceVisible
                              ? "text-zinc-200"
                              : ""
                          }`}>
                          {balanceVisible
                            ? formatCurrency(currentBalance)
                            : "••••••••"}
                        </h3>
                        <button
                          onClick={() => setBalanceVisible(!balanceVisible)}
                          className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                          {balanceVisible ? (
                            <EyeOff size={24} />
                          ) : (
                            <Eye size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div
                      className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border ${
                        !canWithdraw
                          ? "bg-red-600/10 border-red-500/20"
                          : "bg-blue-600/10 border-blue-500/20"
                      }`}>
                      {canWithdraw ? (
                        <Wallet className="text-blue-500 w-8 h-8" />
                      ) : (
                        <Lock className="text-red-500 w-8 h-8" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-gray-500 font-black mb-1 italic">
                        Withdrawal Status
                      </p>
                      <p
                        className={`text-sm font-bold tracking-widest uppercase ${
                          canWithdraw ? "text-white" : "text-red-500"
                        }`}>
                        {canWithdraw ? "UNLIMITED" : "PAUSED"}
                      </p>
                    </div>
                    {pendingAmount > 0 && (
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-widest text-amber-500 font-black mb-1 italic animate-pulse">
                          In Review
                        </p>
                        <p className="text-sm font-bold text-amber-500">
                          {formatCurrency(pendingAmount)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Grid */}
              <div className="grid grid-cols-2 gap-8">
                <button
                  onClick={() => setDepositModalOpen(true)}
                  className="group bg-white text-black p-10 rounded-[3rem] flex flex-col justify-between h-64 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
                  <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center">
                    <Plus size={28} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black mb-2 opacity-40 italic">
                      Inbound Fund
                    </p>
                    <p className="text-4xl font-light tracking-tighter">
                      Deposit
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  className={`group p-10 rounded-[3rem] flex flex-col justify-between h-64 transition-all shadow-2xl hover:scale-[1.02] active:scale-95 border ${
                    !canWithdraw
                      ? "bg-red-500/5 border-red-500/20 cursor-not-allowed"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      !canWithdraw ? "bg-red-500/10" : "bg-white/5"
                    }`}>
                    {canWithdraw ? (
                      <Minus size={28} className="text-zinc-500" />
                    ) : (
                      <Lock size={28} className="text-red-500" />
                    )}
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-[10px] uppercase tracking-[0.2em] font-black mb-2 italic ${
                        !canWithdraw ? "text-red-500" : "text-gray-500"
                      }`}>
                      {canWithdraw ? "Outbound Fund" : "Ledger Restricted"}
                    </p>
                    <p className="text-4xl font-light tracking-tighter">
                      Withdraw
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Activity Tracking */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-3">
                    <Activity size={16} className="text-blue-500" />
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-500 italic">
                      Live History
                    </h4>
                  </div>
                  <button
                    onClick={() => setHistoryModalOpen(true)}
                    className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-500 hover:text-blue-400 flex items-center gap-2 group">
                    View All{" "}
                    <ArrowUpRight
                      size={12}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </button>
                </div>

                <div className="space-y-8">
                  {transactions.length > 0 ? (
                    transactions.slice(0, 4).map((tx: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              tx.type === "deposit"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-white/5 text-zinc-500"
                            }`}>
                            {tx.type === "deposit" ? (
                              <TrendingUp size={18} />
                            ) : (
                              <TrendingDown size={18} />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-200 uppercase tracking-tighter group-hover:text-white transition-colors italic">
                              {tx.type === "withdrawal" ? "Withdraw" : tx.type}
                            </p>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  tx.status === "pending"
                                    ? "bg-amber-500"
                                    : tx.status === "declined"
                                    ? "bg-red-500"
                                    : "bg-emerald-500"
                                }`}
                              />
                              <p className="text-[9px] uppercase tracking-tighter text-gray-600 font-black">
                                {tx.status}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p
                          className={`text-sm font-black font-mono ${
                            tx.type === "deposit"
                              ? "text-emerald-500"
                              : "text-white"
                          }`}>
                          {tx.type === "deposit" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[10px] text-zinc-600 uppercase font-black italic">
                        No records found
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Verification Box */}
              <div
                className={`p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden transition-colors ${
                  !canWithdraw
                    ? "bg-red-500/5 border-red-500/10"
                    : "bg-zinc-900 border-white/10"
                }`}>
                {!canWithdraw && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full" />
                )}
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <Shield
                    size={20}
                    className={!canWithdraw ? "text-red-500" : "text-blue-500"}
                  />
                  <p
                    className={`text-[10px] uppercase tracking-[0.2em] font-black italic ${
                      !canWithdraw ? "text-red-500" : ""
                    }`}>
                    Security Protocol
                  </p>
                </div>
                <p className="text-sm font-light leading-relaxed text-zinc-400 relative z-10">
                  {canWithdraw
                    ? "Withdrawal requests are validated against our internal ledger. Completed transfers are irreversible and protected by bank-level encryption."
                    : "Your account is currently under security review. Outbound fund processing is temporarily disabled to protect your capital. Please contact support."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Components */}
        <DepositModal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          onSuccess={fetchWalletData}
          currentBalance={currentBalance} // FIX: Pass the required balance prop
        />
        <WithdrawModal
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          onSuccess={fetchWalletData}
          currentBalance={currentBalance}
          canWithdraw={canWithdraw}
        />
        <HistoryModal
          isOpen={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          transactions={transactions}
        />
      </div>
    </ProtectedRoute>
  );
}
