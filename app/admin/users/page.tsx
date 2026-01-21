"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Command,
  ArrowUpRight,
  ChevronDown,
  Wallet,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const USERS_PER_PAGE = 10;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchUsers = async (pageNum: number, isNewSearch: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(
        `/api/admin/users?page=${pageNum}&limit=${USERS_PER_PAGE}`,
      );
      const data = await res.json();

      if (data.success) {
        if (isNewSearch) setUsers(data.users);
        else setUsers((prev) => [...prev, ...data.users]);
        setHasMore(data.users.length === USERS_PER_PAGE);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#020202]">
        <Loader2 className="animate-spin text-zinc-800" size={24} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-blue-500/30">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] pointer-events-none" />

      {/* Sticky Header with Title Case */}
      <header className="sticky top-0 z-[100] bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-1">
              Partners
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[11px] font-medium text-zinc-500 italic">
                Administrative vault
              </span>
            </div>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500"
              size={18}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full md:w-80 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl py-3.5 pl-14 pr-14 text-sm outline-none focus:border-blue-500/50 transition-all text-white"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 rounded bg-black/50 border border-white/10 text-[10px] text-zinc-500">
              <Command size={10} /> K
            </kbd>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
        <div className="grid grid-cols-1 gap-4 mb-10">
          {filteredUsers.map((user) => {
            // FINANCIAL LOGIC SYNC
            const walletBalance = user.wallet?.balance ?? 0;
            const currentInvested = user.portfolio?.totalCost ?? 0;
            const currentProfit = user.portfolio?.totalProfitLoss ?? 0;
            const tradingAccountValue =
              walletBalance + currentInvested + currentProfit;

            return (
              <Link
                key={user._id}
                href={`/admin/users/${user._id}`}
                className="group relative">
                <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 md:p-8 transition-all hover:bg-zinc-900/50 hover:border-blue-500/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-[1.5rem] bg-black border border-white/10 flex items-center justify-center text-2xl font-bold text-zinc-800 group-hover:text-blue-500 transition-colors relative overflow-hidden">
                        {user.name.charAt(0)}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-white text-xl font-bold tracking-tight">
                            {user.name}
                          </h3>
                          {user.kycLevel === "LEVEL_2" && (
                            <ShieldCheck size={16} className="text-blue-500" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 font-mono italic">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-12 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1 italic">
                          Total Equity
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-500 tracking-tighter">
                          ${tradingAccountValue.toLocaleString()}
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-500">
                        <ArrowUpRight
                          size={20}
                          className="text-zinc-600 group-hover:text-black transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {hasMore && (
          <div className="flex justify-center pb-20">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-3 px-8 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl text-[11px] font-bold text-zinc-500 hover:text-white transition-all hover:border-white/20">
              {loadingMore ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ChevronDown size={16} />
              )}
              {loadingMore ? "Updating Ledger..." : "Show more partners"}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-6 border-t border-white/5 text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
          <div>Infrastructure v1.0.4</div>
          <div>{filteredUsers.length} Nodes Indexed</div>
        </div>
      </main>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap");
        body {
          font-family: "Plus Jakarta Sans", sans-serif;
          background: #020202;
        }
      `}</style>
    </div>
  );
}
