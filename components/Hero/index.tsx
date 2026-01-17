"use client";

import { Zap, Battery, Cpu } from "lucide-react";
import Link from "next/link";

// FIX: Define props interface
interface HeroProps {
  authenticated: boolean;
}

const Hero = ({ authenticated }: HeroProps) => {
  const stats = [
    { label: "Live Stocks", value: "Realtime", icon: Zap },
    { label: "Wallet", value: "Crypto", icon: Battery },
    { label: "EV Inventory", value: "Premium", icon: Cpu },
  ];

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-between py-24 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-70">
          <source
            src="https://digitalassets.tesla.com/tesla-contents/video/upload/f_auto,q_auto/Homepage-Model-Y-Desktop-NA.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
      </div>

      <div className="relative z-10 text-center px-4 animate-tesla-reveal pt-12">
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-4 font-tesla">
          Invest. Trade. Drive.
        </h1>
        <p className="text-lg md:text-xl text-white/80 font-light tracking-wide max-w-2xl mx-auto">
          The all-in-one platform for automated investments, live stocks, and
          premium EV inventory.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center gap-12 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-tesla-reveal [animation-delay:400ms]">
          {/* FIX: Link logic based on auth status */}
          <Link
            href={authenticated ? "/dashboard" : "/investments"}
            className="tesla-button-white text-center flex-1">
            {authenticated ? "Open Dashboard" : "Start Investing"}
          </Link>
          <Link href="/cars" className="tesla-button-dark text-center flex-1">
            View Inventory
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full animate-tesla-reveal [animation-delay:600ms]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-tesla-red" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {stat.label}
                </span>
              </div>
              <span className="text-2xl font-medium text-white tracking-tight">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center animate-bounce opacity-30">
        <div className="w-[1px] h-12 bg-white" />
      </div>
    </section>
  );
};

export default Hero;
