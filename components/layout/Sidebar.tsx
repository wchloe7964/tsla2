"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ShieldCheck,
  Users,
  Settings,
  ShoppingBag,
  TrendingUp,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Lock,
  Bell,
  CreditCard,
  UserCircle,
  ShieldHalf,
  Package,
} from "lucide-react";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [kycCount, setKycCount] = useState(0);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/admin/stats")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setKycCount(data.stats.pendingKyc);
        })
        .catch(() => {});
    }
  }, [isAdmin]);

  // Section 1: Core Management
  const mainLinks = [
    {
      href: "/admin/dashboard",
      label: "Admin Overview",
      icon: <LayoutDashboard size={18} />,
    },
    { href: "/admin/users", label: "User Registry", icon: <Users size={18} /> },
  ];

  // Section 2: Business & Finance
  const businessLinks = [
    {
      href: "/admin/inventory",
      label: "Shop Inventory",
      icon: <Package size={18} />,
    },
    {
      href: "/admin/stocks",
      label: "Stock Portfolio",
      icon: <TrendingUp size={18} />,
    },
    {
      href: "/admin/wallet",
      label: "Global Wallet",
      icon: <Wallet size={18} />,
    },
    {
      href: "/admin/billing",
      label: "Billing & Tax",
      icon: <CreditCard size={18} />,
    },
  ];

  // Section 3: Security & Verification
  const securityLinks = [
    {
      href: "/admin/kyc",
      label: "Identity Checks",
      icon: <ShieldCheck size={18} />,
      badge: kycCount > 0 ? kycCount : null,
    },
    {
      href: "/admin/security",
      label: "Security & Locks",
      icon: <Lock size={18} />,
    },
    {
      href: "/admin/notifications",
      label: "System Alerts",
      icon: <Bell size={18} />,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-[#050505] border-b border-white/5 flex items-center justify-between px-6 z-[60] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded-sm flex items-center justify-center font-bold text-white text-[10px]">
            T
          </div>
          <span className="font-bold text-xs tracking-widest text-white uppercase">
            Tesla Admin
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside
        className={`
        fixed inset-y-0 left-0 w-72 bg-[#050505] border-r border-white/5 z-[100] transition-transform duration-500 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Branding */}
        <div className="p-10 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <ShieldHalf size={22} />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-widest text-white uppercase leading-none text-red-600">
                Tesla
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] mt-1 text-zinc-500">
                Hub Manager
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-6 space-y-8 pt-24 lg:pt-0 overflow-y-auto custom-scrollbar">
          <NavGroup
            label="Main"
            links={mainLinks}
            pathname={pathname}
            setOpen={setIsMobileMenuOpen}
          />
          <NavGroup
            label="Commerce"
            links={businessLinks}
            pathname={pathname}
            setOpen={setIsMobileMenuOpen}
          />
          <NavGroup
            label="Protection"
            links={securityLinks}
            pathname={pathname}
            setOpen={setIsMobileMenuOpen}
          />
        </nav>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center justify-between px-5 py-3 w-full text-zinc-500 bg-white/5 rounded-xl text-[10px] font-bold uppercase hover:text-white transition-all">
            Customer View <ChevronRight size={12} />
          </Link>
          <button
            onClick={() => {
              logout();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 px-5 py-3 w-full text-zinc-600 hover:text-red-500 transition-all text-[10px] font-bold uppercase italic">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

function NavGroup({ label, links, pathname, setOpen }: any) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold mb-3 px-4">
        {label}
      </p>
      <div className="space-y-1">
        {links.map((link: any) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-white text-black font-bold"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}>
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    isActive ? "text-black" : "group-hover:text-red-500"
                  } transition-colors`}>
                  {link.icon}
                </span>
                <span className="text-[10px] uppercase tracking-wider">
                  {link.label}
                </span>
              </div>
              {link.badge && (
                <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
