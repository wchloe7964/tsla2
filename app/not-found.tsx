'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Car, TrendingUp, BarChart3, ChevronLeft, Search } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-2xl bg-gray-50 dark:bg-white/5 mb-6 animate-in fade-in zoom-in duration-700">
            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500 stroke-1" />
          </div>
          
          <h1 className="text-sm uppercase tracking-[0.5em] font-bold text-gray-400 dark:text-gray-500 mb-4 block">
            Error 404 // Connection Lost
          </h1>
          
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-black dark:text-white mb-6">
            Off Route.
          </h2>
          
          <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400 font-light leading-relaxed">
            The requested resource is currently unavailable or has been relocated within the network.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          <Link
            href="/"
            className="group p-6 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-[2rem] transition-all duration-500"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5 text-black dark:text-white stroke-1" />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest font-bold text-black dark:text-white">Command Center</p>
                <p className="text-xs text-gray-500 mt-1">Return to overview</p>
              </div>
            </div>
          </Link>

          <Link
            href="/cars"
            className="group p-6 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-[2rem] transition-all duration-500"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Car className="w-5 h-5 text-black dark:text-white stroke-1" />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest font-bold text-black dark:text-white">Inventory</p>
                <p className="text-xs text-gray-500 mt-1">Deploy new vehicle</p>
              </div>
            </div>
          </Link>

          <Link
            href="/investments"
            className="group p-6 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-[2rem] transition-all duration-500"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-black dark:text-white stroke-1" />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest font-bold text-black dark:text-white">Invest</p>
                <p className="text-xs text-gray-500 mt-1">Manage neural assets</p>
              </div>
            </div>
          </Link>

          <Link
            href="/stocks"
            className="group p-6 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-[2rem] transition-all duration-500"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 text-black dark:text-white stroke-1" />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest font-bold text-black dark:text-white">Markets</p>
                <p className="text-xs text-gray-500 mt-1">Live exchange feed</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous State
          </button>
          <Link 
            href="/contact"
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            Support Interface
          </Link>
        </div>
      </div>

      {/* Tesla Mark - Subtle Background Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-[0.03] dark:opacity-[0.05] select-none pointer-events-none">
         <span className="text-[12vw] font-tesla uppercase tracking-[0.1em]">Tesla</span>
      </div>
    </div>
  )
}