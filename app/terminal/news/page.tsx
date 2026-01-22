"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";

// We can extract the NewsCard to a shared component folder later
// For now, I've included the logic needed for the full page
export default function FullNewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(9); // Initial load count
  const FALLBACK_IMAGE =
    "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Main-Hero-Desktop-LHD.jpg";

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.success) {
          setArticles(data.data);
        }
      } catch (e) {
        console.error("News feed error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAllNews();
  }, []);

  const loadMore = () => setDisplayCount((prev) => prev + 6);

  return (
    <main className="min-h-screen bg-white dark:bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Navigation */}
        <div className="mb-16">
          <Link
            href="/"
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-black dark:hover:text-white transition-colors mb-8">
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-black dark:text-white font-tesla uppercase italic">
            Intelligence <span className="text-zinc-500">Archive</span>
          </h1>
          <p className="mt-6 text-zinc-500 max-w-2xl text-lg font-light leading-relaxed">
            A chronological ledger of all global telemetry, market shifts, and
            ecosystem milestones affecting the TSLA asset class.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {loading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-video bg-zinc-100 dark:bg-zinc-900" />
                  <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-900" />
                  <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-900" />
                </div>
              ))
            : articles
                .slice(0, displayCount)
                .map((article, index) => (
                  <NewsCard
                    key={article.id || index}
                    article={article}
                    fallback={FALLBACK_IMAGE}
                  />
                ))}
        </div>

        {/* Load More Button */}
        {!loading && articles.length > displayCount && (
          <div className="mt-24 flex justify-center border-t border-zinc-100 dark:border-white/5 pt-12">
            <button
              onClick={loadMore}
              className="flex items-center gap-4 px-12 py-5 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity rounded-full shadow-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Load More Briefs
              </span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// Re-using the NewsCard component with the same Tesla styling
function NewsCard({ article, fallback }: any) {
  const [imgSrc, setImgSrc] = useState(article.image || fallback);

  return (
    <Link href={article.url} target="_blank" className="group flex flex-col">
      <div className="relative aspect-video mb-6 overflow-hidden bg-zinc-900 border border-white/5">
        <img
          src={imgSrc}
          alt={article.headline}
          className="h-full w-full object-cover transition-transform duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105"
          onError={() => setImgSrc(fallback)}
        />
        <div className="absolute bottom-0 left-0 p-4">
          <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-white text-black dark:bg-black dark:text-white">
            {article.source}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          <span>{new Date(article.datetime * 1000).toLocaleDateString()}</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>
            {new Date(article.datetime * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <h3 className="text-2xl font-medium tracking-tighter text-black dark:text-white leading-[1.1] group-hover:text-red-600 transition-colors line-clamp-3 italic">
          {article.headline}
        </h3>
        <p className="text-sm text-zinc-500 line-clamp-2 font-light">
          {article.summary ||
            "No summary available for this intelligence node."}
        </p>
      </div>
    </Link>
  );
}
