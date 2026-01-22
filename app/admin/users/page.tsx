"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  ArrowUpRight,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Command,
  ChevronDown,
  UserPlus,
  Activity,
  Zap,
  Car,
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
    fetchUsers(1, true);
  }, []);

  const fetchUsers = async (pageNum: number, isNewSearch: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(
        `/api/admin/users?page=${pageNum}&limit=${USERS_PER_PAGE}&q=${searchTerm}`,
      );
      const data = await res.json();

      if (data.success) {
        setUsers((prev) =>
          isNewSearch ? data.users : [...prev, ...data.users],
        );
        setHasMore(data.users.length === USERS_PER_PAGE);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <Zap className="animate-pulse text-red-600" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30">
      {/* Tesla Glow Effect */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-tighter">
                Live
              </div>
              <span className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">
                Fleet Operations
              </span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              User <span className="text-zinc-800">Directory</span>
            </h1>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600"
              size={18}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 bg-zinc-900/40 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-sm outline-none focus:border-red-600/50 transition-all"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 rounded bg-black border border-white/10 text-[10px] text-zinc-600">
              <Command size={10} /> K
            </kbd>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 relative z-10">
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => {
            const totalVal =
              (user.wallet?.balance || 0) + (user.portfolio?.totalCost || 0);

            return (
              <Link
                key={user._id}
                href={`/admin/users/${user._id}`}
                className="group">
                <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-8 hover:bg-zinc-900/40 hover:border-red-600/20 transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-black border border-white/10 flex items-center justify-center text-2xl font-black text-zinc-800 group-hover:text-red-600 transition-colors">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold tracking-tight text-white">
                          {user.name}
                        </h3>
                        {user.kycStatus === "verified" ? (
                          <ShieldCheck size={16} className="text-emerald-500" />
                        ) : (
                          <ShieldAlert size={16} className="text-amber-500" />
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Operational Data */}
                  <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                        Portfolio Value
                      </p>
                      <p className="text-2xl font-light tracking-tighter text-white">
                        ${totalVal.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                        Verification
                      </p>
                      <p
                        className={`text-xs font-bold uppercase ${user.kycStatus === "verified" ? "text-emerald-500" : "text-amber-500"}`}>
                        {user.kycStatus || "Pending"}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                      <ArrowUpRight
                        size={20}
                        className="text-zinc-600 group-hover:text-white"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-12 pb-20">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-10 py-4 bg-zinc-900/50 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:border-red-600/40 transition-all flex items-center gap-3">
              {loadingMore ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ChevronDown size={14} />
              )}
              {loadingMore ? "Syncing..." : "Load More Users"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
