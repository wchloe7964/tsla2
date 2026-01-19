"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import {
  Menu,
  Wallet,
  User,
  LogOut,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Settings,
  History,
  Info,
} from "lucide-react";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);

    const fetchSettings = async () => {
      // Only fetch if user is admin
      if (!user || user?.role !== "admin") {
        return;
      }

      try {
        // Use apiClient for authenticated request
        const response = await apiClient.getAdminSettings();

        if (response.success && response.settings?.systemNotice) {
          setNotice(response.settings.systemNotice);
        }
      } catch (err) {
        // Silently fail - this is normal for non-admin users
        console.debug("Settings fetch failed (likely not admin):", err);
      }
    };

    fetchSettings();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]); // Re-fetch when user changes

  const navigation = [
    { name: "Inventory", href: "/cars" },
    { name: "Invest", href: "/investments" },
    { name: "Markets", href: "/stocks" },
    { name: "Portfolio", href: "/portfolio" },
  ];

  // Logo handling
  const [logoError, setLogoError] = useState(false);
  const logoPath = "/hhb7Yj6zdj7QzEXWiKRVvkjJznru8eGnB5wKm2Ue.svg";

  if (!mounted) {
    return (
      <div className="h-20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 w-full" />
    );
  }

  return (
    <>
      {/* System Notice Banner - Only show if user is admin and notice exists */}
      {notice && user?.role === "admin" && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-blue-600 to-blue-500 border-b border-white/10 animate-in slide-in-from-top duration-700">
          <div className="max-w-[1400px] mx-auto py-2.5 px-6 flex items-center justify-center gap-3">
            <Info size={12} className="text-white/80" />
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] text-center">
              {notice}
            </p>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          notice && user?.role === "admin" ? "mt-10" : "mt-0"
        } ${
          scrolled
            ? "py-3 bg-white/90 dark:bg-black/95 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 shadow-sm"
            : "py-6 bg-transparent"
        }`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="group flex items-center">
              {logoError ? (
                <div className="h-8 w-32 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-xs font-bold text-white dark:text-black tracking-widest">
                    LOGO
                  </span>
                </div>
              ) : (
                <NextImage
                  src={logoPath}
                  alt="Logo"
                  width={120}
                  height={32}
                  priority
                  className="h-8 w-auto dark:invert transition-transform duration-500 group-hover:scale-105"
                  onError={() => setLogoError(true)}
                />
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center bg-gray-100/50 dark:bg-white/5 rounded-full px-1 py-1 border border-gray-200/50 dark:border-white/10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-6 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all rounded-full hover:bg-white dark:hover:bg-white/10">
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Actions Area */}
            <div className="flex items-center gap-3 sm:gap-6">
              <Link
                href="/wallet"
                className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <Wallet className="w-4 h-4" />
                <span className="hidden xl:inline">My Wallet</span>
              </Link>

              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400 mr-2" />
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">
                    Loading...
                  </span>
                </div>
              ) : user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
                    <span className="text-[10px] uppercase tracking-widest font-bold ml-2 hidden md:block text-black dark:text-white">
                      {user.name?.split(" ")[0] || "Account"}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 flex items-center justify-center relative shadow-lg">
                      <User className="w-4 h-4 text-white dark:text-black" />
                      {user.kycLevel === "LEVEL_2" && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white dark:border-black">
                          <ShieldCheck className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* User Dropdown */}
                  <div className="absolute right-0 top-full mt-4 w-64 bg-white dark:bg-[#0C0C0C] rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-black dark:text-white">
                          {user.kycLevel === "LEVEL_2"
                            ? "Verified Profile"
                            : "Profile"}
                        </p>
                        {user.kycLevel === "LEVEL_2" && (
                          <ShieldCheck className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate lowercase">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-3">
                      <Link
                        href="/account"
                        className="flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 rounded-2xl transition-all">
                        <div className="flex items-center gap-3">
                          <Settings className="w-4 h-4" /> Account Settings
                        </div>
                        <ChevronRight className="w-3 h-3" />
                      </Link>

                      <Link
                        href="/portfolio"
                        className="flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 rounded-2xl transition-all">
                        <div className="flex items-center gap-3">
                          <History className="w-4 h-4" /> History
                        </div>
                        <ChevronRight className="w-3 h-3" />
                      </Link>

                      <div className="h-px bg-gray-100 dark:bg-white/5 my-2 mx-2" />

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md">
                  Sign In
                </Link>
              )}

              <ThemeToggle />

              <button
                className="lg:hidden p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-6 h-6 stroke-1" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
        user={user}
        onLogout={logout}
      />
    </>
  );
};

export default Header;
