"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  Wallet,
  Activity,
  Edit3,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <div className="text-center">
          <Loader2
            className="animate-spin text-blue-500 mb-4 mx-auto"
            size={40}
          />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Opening Member List...
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-10 bg-[#050505] min-h-screen text-white font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div>
          <h2 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3">
            Management Panel
          </h2>
          <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none">
            Our <span className="text-zinc-800">Members</span>
          </h1>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/[0.05] transition-all text-sm font-medium placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">
                Member
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                ID Status
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Cash on Hand
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Active Plans
              </th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">
                Settings
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-white/[0.03] transition-colors group">
                <td className="p-8">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-xl font-bold italic text-blue-500">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-base tracking-tight">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 w-fit rounded-full text-[9px] font-black tracking-widest uppercase border ${
                      user.kycLevel === "LEVEL_2"
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                        : "border-orange-500/20 bg-orange-500/5 text-orange-500"
                    }`}>
                    {user.kycLevel === "LEVEL_2" ? (
                      <>
                        {" "}
                        <CheckCircle size={10} /> Verified{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <AlertCircle size={10} /> Basic{" "}
                      </>
                    )}
                  </div>
                </td>
                <td className="p-8 font-mono font-bold text-white text-sm">
                  ${user.wallet?.balance?.toLocaleString() || "0"}
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-blue-500" />
                    <span className="font-mono text-sm">
                      {user.investments?.filter(
                        (i: any) => i.status === "active"
                      ).length || 0}
                    </span>
                  </div>
                </td>
                <td className="p-8 text-right">
                  <Link href={`/admin/users/${user._id}`}>
                    <button className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-xl transition-all font-black text-[10px] uppercase tracking-widest">
                      View Profile <ChevronRight size={14} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500 uppercase font-black text-xs tracking-widest">
              No people found with that name.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
