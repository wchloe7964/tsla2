"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

const News = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // High-res fallback for broken external links
  const FALLBACK_IMAGE =
    "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Main-Hero-Desktop-LHD.jpg";

  useEffect(() => {
    const fetchTeslaNews = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.success) setArticles(data.data.slice(0, 3));
      } catch (e) {
        console.error("Tesla feed error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeslaNews();
  }, []);

  const getSentimentStyle = (sentiment: string) => {
    if (sentiment === "positive") return "text-green-500 border-green-500/20";
    if (sentiment === "negative") return "text-tesla-red border-red-500/20";
    return "text-gray-400 border-white/10";
  };

  return (
    <section className="bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 animate-tesla-reveal">
          <div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black dark:text-white font-tesla uppercase">
              TSLA Intelligence
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 font-light max-w-xl">
              Direct telemetry from global markets regarding Tesla ecosystem
              milestones and shifts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-100 dark:bg-white/5 mb-6" />
                  <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 mb-4" />
                  <div className="h-12 w-full bg-gray-100 dark:bg-white/5" />
                </div>
              ))
            : articles.map((article, index) => (
                <NewsCard
                  key={article.id || index}
                  article={article}
                  fallback={FALLBACK_IMAGE}
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
        </div>

        <div className="mt-20 flex justify-center">
          <Link
            href="/terminal/news"
            className="group flex items-center gap-6 px-10 py-4 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500">
            <span className="text-xs font-medium uppercase tracking-[0.4em]">
              View All TSLA Briefs
            </span>
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Sub-component to handle image errors specifically
const NewsCard = ({ article, fallback, style }: any) => {
  const [imgSrc, setImgSrc] = useState(article.image || fallback);

  return (
    <Link
      href={article.url}
      target="_blank"
      className="group flex flex-col animate-tesla-reveal"
      style={style}>
      <div className="relative aspect-video mb-6 overflow-hidden bg-zinc-900 border border-white/5">
        <img
          src={imgSrc}
          alt={article.headline}
          className="h-full w-full object-cover transition-transform duration-1000 grayscale-[0.8] group-hover:grayscale-0 group-hover:scale-105"
          onError={() => setImgSrc(fallback)}
        />
        <div className="absolute top-0 right-0 p-4">
          <div className="text-[9px] uppercase tracking-[0.2em] font-black px-2 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-white">
            {article.source}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-tesla-red">
          {article.source}
        </span>
        <span className="w-1 h-1 bg-gray-300 dark:bg-white/20" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
          {new Date(article.datetime * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <h3 className="text-xl md:text-2xl font-medium tracking-tighter text-black dark:text-white leading-tight mb-6 group-hover:text-tesla-red transition-colors line-clamp-2">
        {article.headline}
      </h3>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
        <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400">
          Analysis Available
        </span>
        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </Link>
  );
};

export default News;
