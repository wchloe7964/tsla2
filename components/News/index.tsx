'use client'

import Link from 'next/link'
import { Calendar, ArrowUpRight, TrendingUp } from 'lucide-react'
import { newsArticles } from '@/lib/constants'

const News = () => {
  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Bullish Signal'
      case 'negative': return 'Bearish Signal'
      default: return 'Neutral'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500'
      case 'negative': return 'text-tesla-red'
      default: return 'text-gray-400'
    }
  }

  return (
    <section className="bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header - Clinical & Left-Aligned */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 animate-tesla-reveal">
          <div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black dark:text-white font-tesla">
              Insights
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 font-light max-w-xl">
              Real-time intelligence on market shifts, technological milestones, and ecosystem updates.
            </p>
          </div>
        </div>

        {/* News Grid - No Containers, Border-Top Separation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {newsArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group flex flex-col animate-tesla-reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image - Stark, No Rounded Corners, Sharp Edges */}
              <div className="relative aspect-video mb-6 overflow-hidden bg-gray-100 dark:bg-white/5">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute top-0 right-0 p-4">
                  <div className={`text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-gray-100 dark:border-white/10 ${getSentimentColor(article.sentiment)}`}>
                    {getSentimentLabel(article.sentiment)}
                  </div>
                </div>
              </div>

              {/* Metadata - Tiny and Spaced */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-tesla-red">
                  {article.source}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                  {article.time}
                </span>
              </div>

              {/* Title - Large, Tight Tracking */}
              <h3 className="text-xl md:text-2xl font-medium tracking-tighter text-black dark:text-white leading-snug mb-4 group-hover:underline underline-offset-4 decoration-1">
                {article.title}
              </h3>

              {/* Action - Simple Text with Arrow */}
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50 dark:border-white/5">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                  Full Report
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-tesla-red transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Global Action - Floating Label Style */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/news"
            className="group flex items-center gap-6 px-10 py-4 border border-gray-100 dark:border-white/10 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500"
          >
            <span className="text-xs font-medium uppercase tracking-[0.4em]">Archive Feed</span>
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default News