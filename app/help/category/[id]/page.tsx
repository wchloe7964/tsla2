'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Book, Zap, Shield, MessageSquare } from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  'getting-started': Book,
  'investments': Zap,
  'wallet': MessageSquare,
  'security': Shield
}

export default function HelpCategoryPage() {
  const { id } = useParams()
  
  // Simulated category data
  const category = {
    title: id === 'wallet' ? 'Payments & Wallet' : 'Getting Started',
    description: 'Everything you need to know about managing your funds and transactions.',
    icon: ICON_MAP[id as string] || Book,
    articles: [
      { title: 'How to deposit funds', slug: 'funding-wallet', description: 'Step-by-step guide on adding capital to your account.' },
      { title: 'Withdrawal processing times', slug: 'withdrawal-times', description: 'Information on how long it takes to move funds back to your bank.' },
      { title: 'Supported currencies', slug: 'supported-currencies', description: 'A full list of fiat and digital assets we currently accept.' },
      { title: 'Transaction security', slug: 'wallet-security', description: 'How we protect your transfers with multi-signature encryption.' }
    ]
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-20 px-6">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Navigation */}
        <Link href="/help" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Center
        </Link>

        {/* Category Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16">
          <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center">
            <category.icon className="w-10 h-10 text-blue-500" />
          </div>
          <div>
            <h1 className="text-5xl font-light tracking-tighter mb-2">{category.title}</h1>
            <p className="text-gray-500 max-w-xl">{category.description}</p>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.articles.map((article) => (
            <Link
              key={article.slug}
              href={`/help/${article.slug}`}
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-blue-500/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-light tracking-tight group-hover:text-blue-500 transition-colors">
                  {article.title}
                </h3>
                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue-500 transition-all" />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {article.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}