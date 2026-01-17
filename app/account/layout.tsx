'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Shield, Fingerprint, Bell, CreditCard } from 'lucide-react'

const navItems = [
  { name: 'Profile', href: '/account', icon: User },
  { name: 'Security', href: '/account/security', icon: Shield },
  { name: 'Identity', href: '/account/identity', icon: Fingerprint },
  { name: 'Notifications', href: '/account/notifications', icon: Bell },
  { name: 'Billing', href: '/account/billing', icon: CreditCard },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 space-y-2">
            <h2 className="px-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-6">
              Account Settings
            </h2>
            <nav>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Dynamic Content Area */}
          <main className="flex-1 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 lg:p-12">
            {children}
          </main>
          
        </div>
      </div>
    </div>
  )
}