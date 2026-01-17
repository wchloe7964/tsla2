import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
  Wallet,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  ArrowUpRight,
  Car,
  Eye,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format";
import BalanceToggle from "@/components/dashboard/BalanceToggle";

export default async function DashboardPage() {
  await connectDB();

  const headerList = await headers();
  const userId = headerList.get("x-user-id");

  if (!userId) notFound();

  const user = await User.findById(userId)
    .select("name wallet portfolio investments isActive")
    .lean();

  if (!user) notFound();

  // Financial Logic Sync
  const walletCash = user.wallet?.balance || 0;
  const capitalInvested = user.portfolio?.totalCost || 0;
  const accruedProfit = user.portfolio?.totalProfitLoss || 0;
  const totalAccountValue = walletCash + capitalInvested + accruedProfit;

  // Transaction Sorting & Filtering
  const allTransactions = [...(user.wallet?.transactions || [])].sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const recentTransactions = allTransactions.slice(0, 5);

  const pendingWithdrawals = allTransactions.filter(
    (tx: any) =>
      tx.status === "pending" &&
      (tx.type === "withdraw" || tx.type === "withdrawal")
  );

  const pendingAmount = pendingWithdrawals.reduce(
    (acc: number, tx: any) => acc + tx.amount,
    0
  );

  // Calculation for Visual Indicator
  const liquidPercentage = (walletCash / (totalAccountValue || 1)) * 100;
  const investedPercentage = 100 - liquidPercentage;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-20 px-6 overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <h1 className="text-xs uppercase tracking-[0.6em] font-black text-blue-500 mb-6 italic">
              Welcome Back!
            </h1>
            <h2 className="text-6xl md:text-8xl font-light tracking-tighter leading-none">
              Hi, {user.name.split(" ")[0]}.
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black text-emerald-500 italic">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Account Sync
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Equity Stats */}
          <div className="lg:col-span-7 space-y-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] opacity-10 blur-xl"></div>
              <div className="relative bg-white/[0.03] border border-white/10 rounded-[3rem] p-12 backdrop-blur-3xl">
                <BalanceToggle
                  amount={totalAccountValue}
                  label="Net Equity Value"
                />

                {/* VISUAL INDICATOR: Liquidity Ratio Bar */}
                <div className="mt-12 space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-500 italic">
                      Asset Allocation
                    </p>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-blue-500 italic">
                      {Math.round(liquidPercentage)}% Liquid
                    </p>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                    {/* Available Balance Segment */}
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                      style={{ width: `${liquidPercentage}%` }}
                    />
                    {/* Invested + Profit Segment */}
                    <div
                      className="h-full bg-indigo-400/30 transition-all duration-1000 ease-out"
                      style={{ width: `${investedPercentage}%` }}
                    />
                  </div>
                  <div className="flex gap-4 px-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[8px] uppercase font-black text-gray-600 tracking-tighter">
                        Liquid Cash
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/30" />
                      <span className="text-[8px] uppercase font-black text-gray-600 tracking-tighter">
                        Active Capital
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8 mt-12">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-black mb-1 italic">
                      Available Balance
                    </p>
                    <p className="text-xl font-light">
                      {formatCurrency(walletCash)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-black mb-1 italic">
                      Capital Invested
                    </p>
                    <p className="text-xl font-light">
                      {formatCurrency(capitalInvested)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-emerald-500 font-black mb-1 italic">
                      Total Profit
                    </p>
                    <p className="text-xl font-light text-emerald-400">
                      +{formatCurrency(accruedProfit)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-8">
              <Link
                href="/portfolio"
                className="group bg-white text-black p-10 rounded-[3rem] flex flex-col justify-between h-56 hover:scale-[1.02] transition-all shadow-2xl">
                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black mb-2 opacity-40">
                    View Account
                  </p>
                  <p className="text-3xl font-light tracking-tighter">
                    My Assets
                  </p>
                </div>
              </Link>
              <Link
                href="/investments"
                className="group bg-white/5 border border-white/10 p-10 rounded-[3rem] flex flex-col justify-between h-56 hover:bg-white/10 transition-all shadow-2xl">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <Car size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black mb-2 text-gray-500">
                    Earn More
                  </p>
                  <p className="text-3xl font-light tracking-tighter">
                    Pick a Plan
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Alerts & Activity */}
          <div className="lg:col-span-5 space-y-8">
            {/* PENDING WITHDRAWALS ALERT */}
            {pendingAmount > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-8 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="text-amber-500" size={18} />
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-500">
                    Settlement Pending
                  </h4>
                </div>
                <p className="text-2xl font-light tracking-tight text-white mb-2">
                  {formatCurrency(pendingAmount)}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold leading-relaxed">
                  Funds are currently undergoing security verification. Balance
                  will update upon approval.
                </p>
              </div>
            )}

            {/* RECENT ACTIVITY */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-500 mb-10 italic">
                Recent Activity
              </h4>
              <div className="space-y-8">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            tx.status === "pending"
                              ? "bg-amber-500 animate-pulse"
                              : tx.status === "declined"
                              ? "bg-red-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-200 uppercase tracking-tighter group-hover:text-white transition-colors">
                            {tx.description || "Capital Sync"}
                          </p>
                          <p className="text-[9px] text-zinc-600 font-mono uppercase">
                            {tx.status} •{" "}
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
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
                  <p className="text-[10px] text-zinc-600 uppercase italic">
                    No ledger entries found.
                  </p>
                )}
              </div>
            </div>

            {/* SECURITY BOX */}
            <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-4">
                <Shield size={20} className="text-blue-500/50" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic text-zinc-500">
                  Account Secured
                </p>
              </div>
              <p className="text-[11px] font-light leading-relaxed text-zinc-500 uppercase tracking-tighter">
                Your money and identity are safe. We use high-level protection
                to keep your data private.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
