'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Sidebar } from '@/components/layout/Sidebar'
import { Loader2 } from 'lucide-react'
import Script from 'next/script'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, initialized, loading } = useAuth()

  if (!initialized || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  const isAdmin = user?.role === 'admin'

  return (
    <>
      {/* 1. Global Script Check: Only load if NOT an admin */}
      {initialized && !isAdmin && (
        <Script 
          id="jivoscript"
          src="//code.jivosite.com/widget/svNfhpgyVp" 
          strategy="afterInteractive" // Changed from lazyOnload for better reliability
        />
      )}

      {isAdmin ? (
        /* ADMIN VIEW */
        <div className="flex min-h-screen bg-black">
          <Sidebar />
          <main className="flex-1 h-screen overflow-y-auto bg-[#050505]">
            {children}
          </main>
        </div>
      ) : (
        /* USER/PUBLIC VIEW */
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#050505]">
          <Header />
          <main className="flex-grow pt-20 lg:pt-0">
            {children}
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}