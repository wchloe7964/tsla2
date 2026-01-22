"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Wallet,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Settings,
  LayoutDashboard,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: Array<{ name: string; href: string }>;
  user?: any;
  onLogout?: () => void;
}

const MobileMenu = ({
  isOpen,
  onClose,
  navigation = [],
  user,
  onLogout,
}: MobileMenuProps) => {
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling and handle iOS "rubber banding"
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-black animate-in fade-in duration-300">
      {/* 1. Header Area - Uses "safe area" padding for mobile notches */}
      <div className="flex justify-between items-center px-6 pt-[env(safe-area-inset-top,1.5rem)] pb-4">
        <span className="font-sans tracking-[0.2em] text-[10px] opacity-40 uppercase font-bold dark:text-white">
          {isAdmin ? "System Admin" : "Navigation"}
        </span>
        <button
          onClick={onClose}
          className="p-3 -mr-3 text-black dark:text-white rounded-full active:bg-gray-100 dark:active:bg-white/10 transition-colors">
          <X className="w-7 h-7 stroke-[1.5px]" />
        </button>
      </div>

      {/* 2. Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-12">
        <nav className="flex flex-col space-y-1 mt-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between py-5 group border-b border-gray-100 dark:border-white/5 active:opacity-60 transition-all">
              <span className="text-2xl font-light tracking-tight text-black dark:text-white group-hover:translate-x-2 transition-transform duration-300">
                {item.name}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
            </Link>
          ))}
        </nav>

        {/* 3. User & Account Section */}
        <div className="mt-10">
          {user ? (
            <div className="space-y-6">
              {/* Profile Summary Card */}
              <div className="p-5 rounded-3xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold shadow-lg">
                    {isAdmin ? (
                      <LayoutDashboard size={20} />
                    ) : (
                      user.name?.[0] || "U"
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-blue-500 mb-0.5">
                      {isAdmin ? "Administrator" : "Verified Member"}
                    </p>
                    <p className="text-base font-semibold text-black dark:text-white truncate">
                      {user.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href={isAdmin ? "/admin/dashboard" : "/account"}
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all active:scale-[0.98] ${
                      isAdmin
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10"
                    }`}>
                    <span className="flex items-center gap-3">
                      {isAdmin ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <Settings size={14} />
                      )}
                      {isAdmin ? "Admin Dashboard" : "Account Settings"}
                    </span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Utility Links */}
              <div className="px-2 space-y-5">
                {!isAdmin && (
                  <Link
                    href="/wallet"
                    onClick={onClose}
                    className="flex items-center text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 dark:text-gray-400 active:text-blue-500">
                    <Wallet className="w-4 h-4 mr-4" />
                    My Wallet
                  </Link>
                )}

                <button
                  onClick={() => {
                    onLogout?.();
                    onClose();
                  }}
                  className="w-full flex items-center text-[11px] uppercase tracking-[0.2em] font-bold text-red-500/80 active:text-red-500">
                  <LogOut className="w-4 h-4 mr-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-between p-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl active:scale-[0.98] transition-transform">
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold">
                Member Access
              </span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* 4. Sticky Footer with Safe Area */}
      <div className="px-6 pt-4 pb-[calc(env(safe-area-inset-bottom,1.5rem)+1.5rem)] border-t border-gray-100 dark:border-white/5 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 opacity-30">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold dark:text-white">
              End-to-End Encrypted
            </span>
          </div>
          <span className="text-[8px] tracking-[0.3em] opacity-20 uppercase font-medium dark:text-white">
            TSLA • 2026
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
