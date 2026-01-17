'use client'

import Link from 'next/link'
import { Wallet, TrendingUp, BarChart3, PieChart, ChevronRight } from 'lucide-react'

const QuickActions = () => {
  const actions = [
    {
      title: 'Wallet',
      description: 'Manage Liquidity',
      icon: Wallet,
      href: '/wallet',
    },
    {
      title: 'Investments',
      description: 'Capital Growth',
      icon: TrendingUp,
      href: '/investments',
    },
    {
      title: 'Equity',
      description: 'Market Assets',
      icon: BarChart3,
      href: '/stocks',
    },
    {
      title: 'Portfolio',
      description: 'Asset Allocation',
      icon: PieChart,
      href: '/portfolio',
    },
  ]

  return (
    <section className="bg-white dark:bg-black py-12 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-8 ml-1">
          Quick Access
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Link
              key={action.title}
              href={action.href}
              className="group relative flex flex-col justify-between p-6 bg-gray-50 dark:bg-white/[0.03] rounded-3xl border border-gray-100 dark:border-white/5 transition-all duration-500 hover:bg-white dark:hover:bg-white/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Interaction Indicator */}
              <div className="absolute top-6 right-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ChevronRight className="w-4 h-4 text-tesla-red" />
              </div>

              <div className="mb-12">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-white/10 shadow-sm group-hover:border-tesla-red/30 transition-colors duration-500">
                  <action.icon className="h-5 w-5 text-black dark:text-white group-hover:text-tesla-red transition-colors" aria-hidden="true" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400 font-light tracking-wide">
                  {action.description}
                </p>
              </div>

              {/* Subtle Bottom Progress Accent */}
              <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-tesla-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-50" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default QuickActions