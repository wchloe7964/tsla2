import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { notFound } from "next/navigation";
import {
  Shield,
  FileText,
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  TrendingUp,
  Briefcase,
  Lock,
  Unlock,
} from "lucide-react";
import AdjustFinancials from "@/components/admin/AdjustFinancials";
import RestrictionToggle from "@/components/admin/RestrictionToggle";
import AccountActions from "@/components/admin/AccountActions"; // The Client Component for Logic

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();

  // Fetch user with sensitive flags
  const user = await User.findById(id)
    .select("+kycData.documentUrl +restrictions")
    .lean();

  if (!user) notFound();

  // Sort transactions by date descending
  const transactions = [...(user.wallet?.transactions || [])].sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const currentProfit = user.portfolio?.totalProfitLoss ?? 0;
  const currentInvested = user.portfolio?.totalCost ?? 0;
  const walletBalance = user.wallet?.balance ?? 0;

  // Total Trading Equity calculation
  const tradingAccountValue = walletBalance + currentInvested + currentProfit;

  const growthPercent =
    currentInvested > 0
      ? ((currentProfit / currentInvested) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="p-10 bg-[#000] min-h-screen text-white font-sans selection:bg-red-500/30">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-10">
        <div className="flex items-center gap-8">
          <div className="relative">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=111&color=fff`
              }
              className="w-32 h-32 rounded-[2.5rem] object-cover border-2 border-white/5 shadow-2xl"
              alt={user.name}
            />
            <div className="absolute -top-2 -right-2 bg-blue-600 p-2 rounded-xl border border-white/20">
              <Shield size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-6xl font-black italic uppercase tracking-tighter">
                {user.name}
              </h1>
              <span
                className={`px-4 py-1 rounded-full text-[10px] font-black border tracking-widest ${
                  user.isActive
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                    : "bg-red-500/10 border-red-500/50 text-red-400"
                }`}>
                {user.isActive ? "VERIFIED TRADER" : "ACCOUNT FROZEN"}
              </span>
            </div>
            <p className="text-zinc-500 font-mono tracking-widest uppercase text-xs">
              {user.email}{" "}
              <span className="text-zinc-800 ml-2">UID: {id.slice(-6)}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1 italic">
            Total Trading Equity
          </p>
          <h2 className="text-5xl font-light tracking-tighter text-emerald-500">
            ${tradingAccountValue.toLocaleString()}
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
            Performance:{" "}
            <span className="text-emerald-400">+{growthPercent}%</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT SIDE: Financials & Ledger */}
        <div className="col-span-8 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                <Briefcase size={14} className="text-blue-500" /> Capital
                Management
              </h3>
              <AdjustFinancials
                userId={id}
                initialProfit={currentProfit}
                initialInvested={currentInvested}
                initialBalance={walletBalance}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard
                icon={<Wallet size={16} />}
                label="Available Balance"
                value={`$${walletBalance.toLocaleString()}`}
              />
              <StatCard
                icon={<TrendingUp size={16} />}
                label="Capital Invested"
                value={`$${currentInvested.toLocaleString()}`}
              />
              <StatCard
                icon={<Activity size={16} />}
                label="Net Profits"
                value={`$${currentProfit.toLocaleString()}`}
                color="text-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                <History size={14} className="text-emerald-500" /> Ledger
                Activity
              </h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-5 w-12 text-zinc-700">
                        {tx.type === "deposit" ? (
                          <ArrowDownLeft
                            size={20}
                            className="text-emerald-500"
                          />
                        ) : (
                          <ArrowUpRight size={20} className="text-zinc-500" />
                        )}
                      </td>
                      <td className="px-4 py-5 font-mono text-[10px]">
                        <p className="text-white font-black uppercase italic">
                          {tx.type}
                        </p>
                        <p className="text-zinc-600">
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 py-5">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-tighter italic">
                          {tx.description || "Automated System Processing"}
                        </p>
                        <p className="text-[8px] text-zinc-600 uppercase font-black">
                          {tx.status}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-right font-black italic">
                        <span
                          className={
                            tx.type === "deposit" || tx.type === "profit"
                              ? "text-emerald-500"
                              : "text-white"
                          }>
                          {tx.type === "deposit" || tx.type === "profit"
                            ? "+"
                            : "-"}
                          ${tx.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: KYC & Safety Controls */}
        <div className="col-span-4 space-y-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-6 tracking-widest text-center italic">
              KYC Compliance
            </h3>
            {user.kycData?.documentUrl ? (
              <div className="space-y-4">
                <img
                  src={user.kycData.documentUrl}
                  className="w-full rounded-3xl border border-white/10 aspect-video object-cover"
                  alt="ID Document"
                />
                <div className="flex gap-2">
                  <AccountActions userId={id} type="kyc-approve" />
                  <AccountActions userId={id} type="kyc-decline" />
                </div>
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <FileText size={40} className="mx-auto mb-4 text-zinc-800" />
                <p className="text-[10px] font-black text-zinc-700 italic">
                  Documentation Pending
                </p>
              </div>
            )}
          </div>

          {/* WITHDRAWAL LOCK & SAFETY */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-4 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-widest text-center italic">
              Safety Controls
            </h3>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-2">
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-[9px] font-black uppercase text-zinc-400 italic">
                  Withdrawal Lock
                </p>
                {user.restrictions?.canWithdraw === false ? (
                  <Lock size={12} className="text-red-500" />
                ) : (
                  <Unlock size={12} className="text-emerald-500" />
                )}
              </div>
              <RestrictionToggle
                userId={id}
                currentStatus={user.restrictions?.canWithdraw !== false}
              />
            </div>

            {/* Client-side Action Buttons */}
            <AccountActions userId={id} type="terminate" />
            <AccountActions
              userId={id}
              isActive={user.isActive}
              type="status"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color = "text-white" }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.05] transition-all">
      <div className="flex items-center gap-2 text-zinc-500 mb-3">
        <span className="text-blue-500/50">{icon}</span>
        <span className="text-[9px] font-black uppercase tracking-widest italic">
          {label}
        </span>
      </div>
      <p
        className={`text-2xl font-black italic uppercase tracking-tighter ${color}`}>
        {value}
      </p>
    </div>
  );
}
