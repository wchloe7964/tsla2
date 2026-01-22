"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Command,
  ChevronDown,
  Zap,
  UserPlus,
  Trash2,
  X,
  Shield,
} from "lucide-react";

export default function AdminUsersPage() {
  // --- States ---
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });

  // --- Actions ---

  const fetchUsers = useCallback(
    async (pageNum: number, isNewSearch: boolean = false) => {
      try {
        if (pageNum === 1 && isNewSearch) setLoading(true);
        else setLoadingMore(true);

        const res = await fetch(
          `/api/admin/users?page=${pageNum}&limit=10&q=${searchTerm}`,
        );
        const data = await res.json();

        if (data.success) {
          setUsers((prev) =>
            isNewSearch ? data.users : [...prev, ...data.users],
          );
          setHasMore(data.users.length === 10);
        }
      } catch (err) {
        setNotification({ msg: "Failed to sync directory", type: "error" });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchTerm],
  );

  // Handle Search Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchUsers(1, true);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchUsers]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();

      if (res.ok) {
        setNotification({
          msg: "New partner deployed to fleet",
          type: "success",
        });
        setIsModalOpen(false);
        setNewUser({ name: "", email: "", role: "user" });
        fetchUsers(1, true);
      } else {
        setNotification({
          msg: data.error || "Deployment failed",
          type: "error",
        });
      }
    } catch (err) {
      setNotification({ msg: "Network communication error", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (e: React.MouseEvent, userId: string) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (!confirm("Confirm permanent removal from infrastructure?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setNotification({
          msg: "Identity purged successfully",
          type: "success",
        });
      } else {
        setNotification({ msg: "Purge authorization denied", type: "error" });
      }
    } catch (err) {
      setNotification({ msg: "Critical sync error", type: "error" });
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <Zap className="animate-pulse text-red-600" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 pb-20">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="sticky top-0 z-[50] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-tighter">
                Live
              </div>
              <span className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">
                Fleet Infrastructure
              </span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              Tesla <span className="text-zinc-800">Partners</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 bg-zinc-900/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm outline-none focus:border-red-600/50 transition-all"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95">
              <UserPlus size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md relative shadow-2xl shadow-red-600/10">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-3xl font-black italic uppercase mb-2">
              Deploy <span className="text-red-600">Partner</span>
            </h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-8">
              Manual Entry Protocol
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                required
                className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm outline-none focus:border-red-600/40"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
              <input
                required
                type="email"
                className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm outline-none focus:border-red-600/40"
                placeholder="Email Address"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <select
                className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm text-zinc-400 outline-none focus:border-red-600/40 appearance-none"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }>
                <option value="user">Operator (Standard)</option>
                <option value="admin">Administrator (CMD)</option>
              </select>

              <button
                disabled={isSubmitting}
                className="w-full bg-red-600 py-4 mt-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex justify-center items-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50">
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Confirm Deployment"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* USER LIST */}
      <main className="max-w-7xl mx-auto p-8 relative z-10">
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => {
            const isAdmin = user.role === "admin";
            return (
              <div key={user._id} className="relative group">
                <Link href={`/admin/users/${user._id}`}>
                  <div
                    className={`bg-zinc-900/20 border ${isAdmin ? "border-red-600/30" : "border-white/5"} rounded-[2.5rem] p-8 hover:bg-zinc-900/40 hover:border-red-600/20 transition-all flex flex-col md:flex-row items-center justify-between gap-6`}>
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="relative">
                        {user.image ? (
                          <img
                            src={user.image}
                            className={`w-16 h-16 rounded-[1.5rem] object-cover border ${isAdmin ? "border-red-600" : "border-white/10"}`}
                            alt=""
                          />
                        ) : (
                          <div
                            className={`w-16 h-16 rounded-[1.5rem] bg-black border ${isAdmin ? "border-red-600/50" : "border-white/10"} flex items-center justify-center text-2xl font-black ${isAdmin ? "text-red-600" : "text-zinc-800"} transition-colors`}>
                            {user.name.charAt(0)}
                          </div>
                        )}
                        {isAdmin && (
                          <Shield
                            className="absolute -bottom-1 -right-1 text-red-600 bg-black rounded-full p-1 border border-red-600/20"
                            size={18}
                          />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold tracking-tight">
                            {user.name}
                          </h3>
                          {user.kycStatus === "verified" ? (
                            <ShieldCheck
                              size={14}
                              className="text-emerald-500"
                            />
                          ) : (
                            <ShieldAlert size={14} className="text-amber-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                            {user.email}
                          </p>
                          <span
                            className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${isAdmin ? "bg-red-600/10 text-red-600" : "bg-zinc-800 text-zinc-500"}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                        <ArrowUpRight
                          size={20}
                          className="text-zinc-600 group-hover:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* DELETE ACTION: Prevent admin self-deletion visually */}
                {!isAdmin && (
                  <button
                    onClick={(e) => handleDeleteUser(e, user._id)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-zinc-950 border border-white/10 p-3 rounded-full text-zinc-600 hover:text-red-500 hover:border-red-600/50 transition-all z-20 shadow-2xl">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => {
                setPage((p) => p + 1);
                fetchUsers(page + 1);
              }}
              disabled={loadingMore}
              className="px-10 py-4 bg-zinc-900/50 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-red-600/40 transition-all flex items-center gap-3 disabled:opacity-50">
              {loadingMore ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ChevronDown size={14} />
              )}
              Sync More Data
            </button>
          </div>
        )}
      </main>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-full border backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          } text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3`}>
          <div
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${notification.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
          />
          {notification.msg}
        </div>
      )}
    </div>
  );
}
