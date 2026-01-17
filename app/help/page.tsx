'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, Book, MessageSquare, 
  ChevronDown, Zap, Shield, 
  LifeBuoy, ArrowUpRight, BookOpen, X
} from 'lucide-react'
import { HELP_ARTICLES } from '@/lib/data/help-content'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const categories = [
    {
      id: 'getting-started',
      title: 'Basics',
      icon: Book,
      articles: [
        { title: 'Creating Your Account', slug: 'creating-account' },
        { title: 'Funding Your Wallet', slug: 'funding-wallet' },
      ],
    },
    {
      id: 'investments',
      title: 'Growth Plans',
      icon: Zap,
      articles: [
        { title: 'How Plans Work', slug: 'investment-plans' },
        { title: 'Risk Management', slug: 'risk-management' },
      ],
    },
    {
      id: 'wallet',
      title: 'Payments',
      icon: MessageSquare,
      articles: [
        { title: 'Withdrawal & Fees', slug: 'transaction-fees' },
        { title: 'Wallet Security', slug: 'wallet-security' },
      ],
    },
  ]

  const popularArticles = [
    { title: 'How do I deposit funds?', category: 'Wallet', slug: 'funding-wallet' },
    { title: 'Investment minimums explained', category: 'Growth', slug: 'investment-plans' },
    { title: 'Two-factor security setup', category: 'Security', slug: 'wallet-security' },
  ]

  useEffect(() => {
    if (searchQuery.length > 1) {
      const matches = Object.entries(HELP_ARTICLES)
        .filter(([_, article]: any) => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(([slug, article]: any) => ({ slug, ...article }))
      setSuggestions(matches.slice(0, 5))
      setIsSearchOpen(true)
    } else {
      setSuggestions([])
      setIsSearchOpen(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClose = (e: any) => {
      if ((searchRef.current && !searchRef.current.contains(e.target as Node)) || e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClose)
    document.addEventListener('keydown', handleClose)
    return () => {
      document.removeEventListener('mousedown', handleClose)
      document.removeEventListener('keydown', handleClose)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-20 px-6 overflow-x-hidden font-sans selection:bg-blue-500/30 relative">
      
      {/* 1. FIXED OVERLAY - Ensures it covers everything except the z-50 content */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[40] transition-opacity duration-500 pointer-events-none ${
          isSearchOpen ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header Section - Wraps title and search in a high-priority stack */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 relative z-[50]">
          <div className={`transition-all duration-500 ${isSearchOpen ? 'opacity-20 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'}`}>
            <h1 className="text-[10px] uppercase tracking-[0.6em] font-bold text-gray-500 mb-6">Knowledge Base</h1>
            <h2 className="text-6xl md:text-8xl font-tesla tracking-tighter leading-none uppercase text-white">Support.</h2>
          </div>

          {/* 2. SEARCH CONTAINER - High z-index to stay above the blur */}
          <div className="max-w-md w-full relative group z-[60]" ref={searchRef}>
            <div className={`relative transition-all duration-500 ${isSearchOpen ? 'scale-105' : 'scale-100'}`}>
              <Search className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors z-[70] ${isSearchOpen ? 'text-blue-500' : 'text-gray-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setIsSearchOpen(true)}
                placeholder="Search for articles..."
                className={`w-full pl-14 pr-12 py-5 rounded-3xl text-sm transition-all focus:outline-none border relative z-[65]
                  ${isSearchOpen 
                    ? 'bg-[#0d0d0d] border-blue-500/50 ring-4 ring-blue-500/10 text-white shadow-[0_0_40px_rgba(0,0,0,0.7)]' 
                    : 'bg-white/[0.03] border-white/10 text-gray-400'
                  }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors z-[70]"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* 3. SUGGESTIONS DROPDOWN */}
            {isSearchOpen && suggestions.length > 0 && (
              <div className="absolute top-full mt-4 w-full bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.9)] overflow-hidden z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-bold mb-3 ml-4 mt-2">Suggested Results</p>
                  {suggestions.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/help/${item.slug}`}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
                          <BookOpen size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{item.title}</p>
                          <p className="text-[10px] text-gray-600 font-medium lowercase tracking-tight">{item.category}</p>
                        </div>
                      </div>
                      <ArrowUpRight size={14} className="text-gray-700 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  ))}
                </div>
                <div className="bg-white/[0.02] p-4 text-center border-t border-white/5">
                   <p className="text-[8px] uppercase tracking-widest text-gray-700">ESC to close • Click results to view</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. CONTENT GRID - Blurred background */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 transition-all duration-700 ${
          isSearchOpen ? 'blur-xl opacity-20 scale-[0.98] pointer-events-none' : 'blur-0 opacity-100 scale-100'
        }`}>
          {/* ... Rest of the component content remains the same ... */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-8 ml-2">Browse Categories</h3>
              {categories.map((category) => (
                <div key={category.id} className="group">
                  <div className="w-full flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] transition-all relative">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                        <category.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="text-left">
                        <p className="text-xl font-light tracking-tight">{category.title}</p>
                        <Link href={`/help/category/${category.id}`} className="text-[9px] uppercase tracking-widest text-blue-500 font-bold hover:underline underline-offset-4">View All Guides</Link>
                      </div>
                    </div>
                    <button 
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      className="p-4 rounded-full hover:bg-white/5 transition-colors"
                    >
                      <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-500 ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {expandedCategory === category.id && (
                    <div className="px-8 pt-4 pb-8 space-y-2 animate-in fade-in slide-in-from-top-2">
                      {category.articles.map((article) => (
                        <Link
                          key={article.slug}
                          href={`/help/${article.slug}`}
                          className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group/item"
                        >
                          <span className="text-sm text-gray-500 group-hover/item:text-white transition-colors">{article.title}</span>
                          <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover/item:text-blue-500 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Additional content removed for brevity but preserved in your local file */}
          </div>
          {/* ... */}
        </div>
      </div>
    </div>
  )
}