"use client";

import { useGlobalAuth } from "@/context/AuthContext";
import Hero from "@/components/Hero";
import Inventory from "@/components/Inventory";
import Markets from "@/components/Markets";
import News from "@/components/News";
import ProductSlider from "@/components/ProductSlider";
import QuickActions from "@/components/QuickActions";
import CTA from "@/components/CTA";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading } = useGlobalAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative bg-[#050505] overflow-hidden">
      <Hero authenticated={isAuthenticated} />
      <Inventory />
      <Markets />
      <News />
      <ProductSlider />
      {isAuthenticated && <QuickActions />}

      <CTA authenticated={isAuthenticated} />
    </main>
  );
}
