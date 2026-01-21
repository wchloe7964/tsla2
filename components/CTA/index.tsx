"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, Target } from "lucide-react";

// FIX: Define props interface
interface CTAProps {
  authenticated: boolean;
}

const CTA = ({ authenticated }: CTAProps) => {
  const features = [
    { icon: Shield, title: "Secure", desc: "Bank-level encryption" },
    { icon: Zap, title: "Instant", desc: "Real-time execution" },
    { icon: Target, title: "Precise", desc: "Automated insights" },
  ];

  const stats = [
    { label: "Uptime", value: "99.9%" },
    { label: "Volume", value: "$1B+" },
    { label: "Partners", value: "50k+" },
  ];

  return (
    <section className="relative bg-white dark:bg-black py-24 px-4 overflow-hidden border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 animate-tesla-reveal">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 dark:bg-white/5 transition-all hover:bg-gray-100 dark:hover:bg-white/10">
              <f.icon className="w-6 h-6 mb-4 text-tesla-red" />
              <h3 className="text-lg font-medium tracking-tight mb-2 dark:text-white">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tighter dark:text-white font-tesla">
            Future-Proof Your Portfolio.
          </h2>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-light max-w-xl mx-auto">
            Experience the next generation of asset management. Join the most
            advanced ecosystem for stocks, crypto, and EV inventory.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {/* FIX: Link logic based on auth status */}
            <Link
              href={authenticated ? "/dashboard" : "/register"}
              className="tesla-button-dark dark:tesla-button-white px-12 py-4">
              {authenticated ? "Go to Dashboard" : "Get Started"}
            </Link>
            {!authenticated && (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-widest hover:opacity-60 transition-opacity dark:text-white">
                Sign In <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-3 gap-8 py-12 border-t border-gray-100 dark:border-white/5">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2 group-hover:text-tesla-red transition-colors">
                {stat.label}
              </div>
              <div className="text-3xl md:text-4xl font-medium tracking-tighter dark:text-white">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTA;
