"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Loader2,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
  Activity,
  ChevronRight,
  Database,
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, initialized, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialized && (!user || user.role !== "admin")) {
      router.push("/dashboard"); // Redirect non-admins to their dashboard
    }
  }, [user, initialized, router]);

  if (loading || !initialized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (user?.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 flex flex-col p-8 sticky top-0 h-screen bg-[#050505] z-50">
        {/* Branding */}
        <div className="flex items-center gap-4 mb-16 group">
          <div className="w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
            <Database size={20} />
          </div>
          <div>
            <span className="block font-black uppercase tracking-[0.2em] text-sm italic leading-none">
              Terminal
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold italic">
              Admin v2.0
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-black mb-6 px-4 italic">
            Core Command
          </p>

          <AdminNavLink
            href="/admin/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Overview"
            active={pathname === "/admin/dashboard"}
          />
          <AdminNavLink
            href="/admin/kyc"
            icon={<ShieldCheck size={18} />}
            label="KYC Verification"
            active={pathname === "/admin/kyc"}
          />
          <AdminNavLink
            href="/admin/users"
            icon={<Users size={18} />}
            label="User Management"
            active={pathname.startsWith("/admin/users")}
          />
          <AdminNavLink
            href="/admin/settings"
            icon={<Settings size={18} />}
            label="Security Nodes"
            active={pathname === "/admin/settings"}
          />
        </nav>

        {/* System Health Card */}
        <div className="mb-8 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
              Ledger Sync: Active
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 font-medium uppercase leading-relaxed">
            All withdrawal locks and KYC protocols are operational.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/5 space-y-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-between px-6 py-4 rounded-2xl text-zinc-500 hover:bg-white/5 hover:text-white transition-all w-full font-black uppercase text-[10px] tracking-widest italic group">
            User View{" "}
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-6 py-4 text-zinc-500 hover:text-red-500 transition-colors w-full font-black uppercase text-[10px] tracking-widest italic">
            <LogOut size={16} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#050505] relative">
        {/* Global Grainy Overlay for texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none" />

        <div className="relative p-12 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, label, active = false }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative ${
        active
          ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
      }`}>
      <div className="flex items-center gap-4 relative z-10">
        <span
          className={`${
            active ? "text-black" : "group-hover:text-blue-500"
          } transition-colors duration-300`}>
          {icon}
        </span>
        <span className="uppercase text-[10px] tracking-[0.2em] font-black italic">
          {label}
        </span>
      </div>

      {active && (
        <div className="w-1.5 h-1.5 rounded-full bg-black animate-in fade-in zoom-in duration-500" />
      )}
    </Link>
  );
}
