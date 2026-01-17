'use client'

import { useParams, useRouter } from 'next/navigation'
import { HELP_ARTICLES } from '@/lib/data/help-content' // Import the registry
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Clock, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react'

export default function HelpArticlePage() {
  const { slug } = useParams()
  const router = useRouter()

  // Dynamic Lookup
  const article = HELP_ARTICLES[slug as string]

  // Fallback if article doesn't exist
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4">Article Not Found</h2>
          <button onClick={() => router.push('/help')} className="text-blue-500 uppercase text-[10px] tracking-widest font-bold">
            Return to Help Center
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-[800px] mx-auto relative z-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 mb-12 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
          <Link href="/help" className="hover:text-blue-500 transition-colors">Support</Link>
          <ChevronRight size={10} />
          <span>{article.category}</span>
          <ChevronRight size={10} />
          <span className="text-white">{article.title}</span>
        </div>

        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-tesla tracking-tighter mb-8 uppercase">
            {article.title}.
          </h1>
          <div className="flex items-center gap-8 py-6 border-y border-white/5">
             <div className="flex items-center gap-2">
                <Clock size={14} className="text-blue-500" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">{article.readTime}</span>
             </div>
             <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-blue-500" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Update {article.lastUpdated}</span>
             </div>
          </div>
        </header>

        {/* Dynamic Content Rendering */}
        <div className="space-y-12">
          {article.content.map((block: any, i: number) => (
            <div key={i}>
              {block.type === 'text' ? (
                <p className="text-lg font-light leading-relaxed text-gray-400">{block.body}</p>
              ) : (
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-blue-500 mb-4">{block.title}</h3>
                  <p className="text-lg font-light leading-relaxed text-white/90">{block.body}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className="mt-20 p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center">
            <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-6">Was this helpful?</p>
            <div className="flex justify-center gap-4">
                <button className="px-8 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest">Yes</button>
                <button className="px-8 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest">No</button>
            </div>
        </div>
      </div>
    </div>
  )
}