'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { 
  X, 
  Wallet, 
  User, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  Settings, 
  LayoutDashboard 
} from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigation: Array<{ name: string; href: string; icon?: any }>
  user?: any
  onLogout?: () => void
}

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  navigation = [], 
  user,
  onLogout 
}: MobileMenuProps) => {
  
  const isAdmin = user?.role === 'admin'

  // Prevent background scrolling when menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-[#050505]/95 backdrop-blur-3xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
      
      {/* 1. Header Area */}
      <div className="flex justify-between items-center p-8">
        <span className="font-sans tracking-[0.2em] text-[10px] opacity-40 uppercase font-bold dark:text-white">
          {isAdmin ? 'Administrator' : 'Menu'}
        </span>
        <button 
          onClick={onClose}
          className="p-2 text-black dark:text-white hover:scale-110 active:scale-90 transition-all"
        >
          <X className="w-8 h-8 stroke-[1px]" />
        </button>
      </div>

      {/* 2. Primary Navigation */}
      <nav className="flex-1 px-10 pt-4 overflow-y-auto">
        <div className="flex flex-col space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between py-6 group border-b border-gray-100 dark:border-white/5"
            >
              <span className="text-3xl font-light tracking-tight text-black dark:text-white group-hover:translate-x-3 transition-transform duration-500">
                {item.name}
              </span>
              <ChevronRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500" />
            </Link>
          ))}
        </div>

        {/* 3. User & Account Section */}
        <div className="mt-12 pt-10 pb-20">
          {user ? (
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold shadow-xl overflow-hidden">
                     {isAdmin ? (
                        <LayoutDashboard className="w-6 h-6" />
                     ) : (
                        user.name?.[0]?.toUpperCase()
                     )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-blue-500">
                        {isAdmin ? 'Admin Account' : 'Verified Member'}
                    </p>
                    <p className="text-lg font-medium text-black dark:text-white truncate">{user.name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {isAdmin ? (
                    <Link
                        href="/admin/dashboard"
                        onClick={onClose}
                        className="flex items-center justify-between px-4 py-4 bg-emerald-500 text-black rounded-2xl text-[10px] uppercase tracking-widest font-black"
                    >
                        <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                        </div>
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <Link
                        href="/account"
                        onClick={onClose}
                        className="flex items-center justify-between px-4 py-3 bg-white dark:bg-white/5 rounded-xl text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-300"
                    >
                        <div className="flex items-center gap-3">
                        <Settings className="w-3.5 h-3.5" /> Account Settings
                        </div>
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>

              <div className="px-4 space-y-6">
                {!isAdmin && (
                    <Link
                    href="/wallet"
                    onClick={onClose}
                    className="flex items-center text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-blue-500 transition-colors"
                    >
                    <Wallet className="w-4 h-4 mr-4" />
                    My Wallet
                    </Link>
                )}
                
                <button
                  onClick={() => { onLogout?.(); onClose(); }}
                  className="flex items-center text-[11px] uppercase tracking-[0.2em] font-bold text-red-500/80 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 px-4">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-between p-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl shadow-lg"
              >
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Sign In</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* 4. Simple Footer */}
      <div className="p-10 border-t border-gray-100 dark:border-white/5 flex flex-col items-center gap-4 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2 opacity-40">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold dark:text-white">
            Secure Connection
          </span>
        </div>
        <span className="text-[9px] tracking-[0.3em] opacity-20 uppercase font-medium dark:text-white text-center">
          TSLA • 2026
        </span>
      </div>
    </div>
  )
}

export default MobileMenu