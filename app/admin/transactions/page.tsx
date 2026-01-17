"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Check,
  X,
  Clock,
  Wallet,
  Loader2,
  ExternalLink,
  Search,
  History,
  Inbox,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Eye,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

export default function AdminTransactionsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 1. FETCH DATA (Ensures evidenceUrl is explicitly mapped)
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "pending"
          ? "/api/admin/transactions"
          : "/api/admin/transactions/history";

      const res = await fetch(endpoint);
      const data = await res.json();

      if (data.success) {
        const rawData =
          activeTab === "pending" ? data.transactions : data.history;

        // Ensure evidenceUrl is handled even if null
        const mappedData = (rawData || []).map((tx: any) => ({
          ...tx,
          evidenceUrl: tx.evidenceUrl || null,
        }));

        setTransactions(mappedData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // 2. SEARCH & FILTER LOGIC
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx: any) => {
      const name = tx.userName?.toLowerCase() || "";
      const email = tx.userEmail?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);
      const matchesType = filterType === "all" || tx.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, filterType]);

  // 3. STATS CALCULATION
  const stats = useMemo(() => {
    const deposits = transactions
      .filter((t) => t.type === "deposit")
      .reduce((acc, t) => acc + t.amount, 0);
    const withdrawals = transactions
      .filter((t) => t.type === "withdraw" || t.type === "withdrawal")
      .reduce((acc, t) => acc + t.amount, 0);
    return { deposits, withdrawals };
  }, [transactions]);

  // 4. APPROVE / DECLINE ACTION
  const handleAction = async (
    userId: string,
    transactionId: string,
    newStatus: "completed" | "declined"
  ) => {
    setProcessingId(transactionId);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, transactionId, newStatus }),
      });

      if (res.ok) {
        // Immediate UI feedback
        setTransactions((prev) =>
          prev.filter((tx: any) => tx._id !== transactionId)
        );
      }
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  // 5. CSV EXPORT
  const exportToCSV = () => {
    const headers = ["User,Email,Type,Amount,Method,Date,Status\n"];
    const rows = filteredTransactions.map(
      (tx) =>
        `${tx.userName},${tx.userEmail},${tx.type},${tx.amount},${
          tx.method
        },${new Date(tx.date).toLocaleDateString()},${tx.status}`
    );
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  if (loading && transactions.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505]">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
          Fetching records...
        </p>
      </div>
    );

  return (
    <div className="p-10 bg-[#050505] min-h-screen text-white">
      {/* IMAGE PREVIEW MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}>
          <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 transition-transform duration-500"
            alt="Transaction Evidence"
          />
        </div>
      )}

      {/* HEADER & STATS */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 italic">
            Management Portal
          </h2>
          <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">
            {activeTab === "pending" ? "Active" : "Past"}{" "}
            <span className="text-zinc-800">
              {activeTab === "pending" ? "Queue" : "Logs"}
            </span>
          </h1>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/[0.03] border border-white/5 p-5 rounded-[2rem] min-w-[180px]">
            <p className="text-[9px] font-black text-emerald-500 uppercase italic mb-1 flex items-center gap-1">
              <ArrowDownLeft size={10} /> Total In
            </p>
            <p className="text-2xl font-black italic">
              {formatCurrency(stats.deposits)}
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-5 rounded-[2rem] min-w-[180px]">
            <p className="text-[9px] font-black text-red-500 uppercase italic mb-1 flex items-center gap-1">
              <ArrowUpRight size={10} /> Total Out
            </p>
            <p className="text-2xl font-black italic">
              {formatCurrency(stats.withdrawals)}
            </p>
          </div>
        </div>
      </div>

      {/* TOOLS BAR */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 h-16 pl-16 pr-6 rounded-2xl text-sm font-medium focus:border-blue-500/50 transition-all outline-none"
            />
          </div>

          <div className="flex bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-6 rounded-xl text-[10px] font-black uppercase italic transition-all ${
                activeTab === "pending"
                  ? "bg-white text-black"
                  : "text-zinc-500 hover:text-white"
              }`}>
              <Inbox size={14} /> To Do
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-6 rounded-xl text-[10px] font-black uppercase italic transition-all ${
                activeTab === "history"
                  ? "bg-white text-black"
                  : "text-zinc-500 hover:text-white"
              }`}>
              <History size={14} /> History
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {["all", "deposit", "withdraw"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase italic border transition-all ${
                  filterType === type
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-transparent border-white/10 text-zinc-500 hover:border-white/20"
                }`}>
                {type === "all" ? "Everything" : type + "s"}
              </button>
            ))}
          </div>
          {activeTab === "history" && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 text-[10px] font-black uppercase italic text-zinc-500 hover:text-white transition-colors">
              <Download size={14} /> Download List
            </button>
          )}
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx: any) => (
            <div
              key={tx._id}
              className={`bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 flex items-center justify-between group hover:bg-white/[0.04] transition-all ${
                processingId === tx._id ? "opacity-20 pointer-events-none" : ""
              }`}>
              <div className="flex items-center gap-8">
                {/* EVIDENCE PREVIEW */}
                {tx.evidenceUrl ? (
                  <div
                    className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-black group/img cursor-pointer"
                    onClick={() => setSelectedImage(tx.evidenceUrl)}>
                    <img
                      src={tx.evidenceUrl}
                      className="w-full h-full object-cover opacity-60 transition-transform group-hover/img:scale-110"
                      alt="Receipt"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all">
                      <Eye size={20} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-zinc-700 font-black text-[8px] uppercase">
                    No Proof
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`text-[9px] font-black uppercase italic px-2 py-0.5 rounded ${
                        tx.type === "deposit"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }`}>
                      {tx.type}
                    </span>
                    <p className="font-bold text-lg tracking-tight uppercase italic">
                      {tx.userName}
                    </p>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase mb-3 tracking-tighter italic">
                    {tx.userEmail}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-black uppercase italic flex items-center gap-2">
                    <Wallet size={12} className="text-zinc-600" /> {tx.method} •{" "}
                    <Clock size={12} className="text-zinc-600" />{" "}
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-500 uppercase italic mb-1">
                    Amount
                  </p>
                  <p className="text-4xl font-black italic tracking-tighter">
                    {formatCurrency(tx.amount)}
                  </p>
                </div>

                {activeTab === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleAction(tx.userId, tx._id, "completed")
                      }
                      className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-90">
                      <Check size={24} />
                    </button>
                    <button
                      onClick={() =>
                        handleAction(tx.userId, tx._id, "declined")
                      }
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90">
                      <X size={24} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${
                        tx.status === "completed"
                          ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
                          : "border-red-500/20 text-red-500 bg-red-500/5"
                      }`}>
                      {tx.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-zinc-600 font-black uppercase tracking-[0.3em] italic">
            Everything is up to date
          </div>
        )}
      </div>
    </div>
  );
}
