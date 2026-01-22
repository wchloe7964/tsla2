"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ShieldCheck,
  Settings,
  TrendingUp,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Lock,
  Bell,
  CreditCard,
  Package,
  Activity,
  Sliders,
  HardDrive,
  ChevronDown,
  // Add any icons you need for children items
} from "lucide-react";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [kycCount, setKycCount] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

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

  // Section 1: Operations
  const mainLinks = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { href: "/admin/users", label: "Partners", icon: <Users size={18} /> },
  ];

  // Section 2: Financials & Products
  const businessLinks = [
    {
      href: "/admin/inventory",
      label: "Shop Inventory",
      icon: <Package size={18} />,
    },
    {
      href: "/admin/investments",
      label: "Investment Plans",
      icon: <HardDrive size={18} />,
    },
    {
      href: "/admin/stocks",
      label: "Stock Market",
      icon: <TrendingUp size={18} />,
    },
    {
      href: "/admin/transactions",
      label: "Transactions",
      icon: <CreditCard size={18} />,
    },
  ];

  // Section 3: System & Safety
  const securityLinks = [
    {
      href: "/admin/kyc",
      label: "ID Verification",
      icon: <ShieldCheck size={18} />,
      badge: kycCount > 0 ? kycCount : null,
    },
    {
      href: "/admin/notifications",
      label: "System Alerts",
      icon: <Bell size={18} />,
    },
    // Settings with children
    {
      href: "/admin/settings",
      label: "Settings",
      icon: <Settings size={18} />,
      children: [
        {
          href: "/admin/settings/general",
          label: "General",
          icon: <Settings size={16} />,
        },
        {
          href: "/admin/settings/slides",
          label: "Slides",
          icon: <Sliders size={16} />,
        },
        {
          href: "/admin/settings/wallet",
          label: "Payment Methods",
          icon: <Wallet size={18} />,
        },
      ],
    },
  ];

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-[#050505] border-b border-white/5 flex items-center justify-between px-6 z-[60] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white text-xs">
            T
          </div>
          <span className="font-bold text-[10px] tracking-[0.2em] text-white uppercase">
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
        {/* BRANDING */}
        <div className="p-10 hidden lg:block">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <span className="font-black italic text-xl">T</span>
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tighter text-white uppercase leading-none italic">
                Tesla
              </h1>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-1 text-zinc-600">
                Admin Hub
              </p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-6 space-y-8 pt-24 lg:pt-0 overflow-y-auto custom-scrollbar pb-10">
          <NavGroup
            label="Management"
            links={mainLinks}
            pathname={pathname}
            setOpen={setIsMobileMenuOpen}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
          />
          <NavGroup
            label="Commerce"
            links={businessLinks}
            pathname={pathname}
            setOpen={setIsMobileMenuOpen}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
          />
          <NavGroup
            label="Security"
            links={securityLinks}
            pathname={pathname}
            setOpen={setIsMobileMenuOpen}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
          />
        </nav>

        {/* FOOTER / USER PROFILE */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/10">
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 uppercase">
              {user?.email?.[0] || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-bold text-zinc-200 truncate uppercase tracking-widest">
                Admin Access
              </p>
              <p className="text-[9px] text-zinc-600 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-4 py-2 w-full text-zinc-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
              Public View <ChevronRight size={10} />
            </Link>
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 w-full text-zinc-600 hover:text-red-500 transition-all text-[9px] font-black uppercase tracking-widest italic">
              <LogOut size={14} /> Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

function NavGroup({
  label,
  links,
  pathname,
  setOpen,
  expandedItems,
  toggleExpand,
}: any) {
  const isLinkActive = (href: string, children?: any[]) => {
    if (href === pathname) return true;
    if (children) {
      return children.some((child) => child.href === pathname);
    }
    return false;
  };

  return (
    <div>
      <p className="text-[8px] uppercase tracking-[0.4em] text-zinc-700 font-black mb-4 px-4">
        {label}
      </p>
      <div className="space-y-1">
        {links.map((link: any) => {
          const hasChildren = link.children && link.children.length > 0;
          const isActive = isLinkActive(link.href, link.children);
          const isExpanded = expandedItems[link.label] || false;

          return (
            <div key={link.label}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleExpand(link.label)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all group ${
                      isActive
                        ? "bg-white text-black font-bold scale-[1.02]"
                        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                    }`}>
                    <div className="flex items-center gap-3">
                      <span
                        className={`${isActive ? "text-black" : "group-hover:text-red-600"} transition-colors`}>
                        {link.icon}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        {link.label}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      } ${isActive ? "text-black" : "text-zinc-500"}`}
                    />
                  </button>

                  {/* Children Links */}
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {link.children.map((child: any) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                              isChildActive
                                ? "bg-red-600/20 text-red-400 font-bold border-l-2 border-red-500"
                                : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                            }`}>
                            <span
                              className={`${isChildActive ? "text-red-400" : ""}`}>
                              {child.icon}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                              {child.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                // Regular link without children
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? "bg-white text-black font-bold scale-[1.02]"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`${isActive ? "text-black" : "group-hover:text-red-600"} transition-colors`}>
                      {link.icon}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {link.label}
                    </span>
                  </div>
                  {link.badge && (
                    <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
