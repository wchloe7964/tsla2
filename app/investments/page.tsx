"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { Loader2, TrendingUp, Car, Sparkles, ChevronRight } from "lucide-react";
import InvestmentCard from "@/components/investments/InvestmentCard";
import { formatCurrency } from "@/lib/utils/format";

export default function InvestmentsPage() {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [activeInvestments, setActiveInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [productsRes, portfolioRes] = await Promise.all([
          apiClient.getInvestments(),
          apiClient.getPortfolio(),
        ]);

        if (productsRes.success) {
          setAvailableProducts(
            productsRes.investments || productsRes.data || []
          );
        }

        if (portfolioRes.success) {
          setActiveInvestments(portfolioRes.data.portfolio.investments || []);
        }
      } catch (err) {
        console.error("Data loading error:", err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* ACTIVE PLANS */}
        {activeInvestments.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-emerald-500 italic">
                Growing right now
              </span>
            </div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-12">
              My <span className="text-zinc-800">Growth</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeInvestments.map((inv: any) => (
                <div
                  key={inv._id}
                  className="relative group bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 overflow-hidden backdrop-blur-3xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-all">
                    <Car size={40} className="text-emerald-500" />
                  </div>

                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-1 italic">
                    {inv.planType} Plan
                  </p>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-8">
                    How I'm Doing
                  </h3>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">
                          What it's worth
                        </p>
                        <p className="text-4xl font-light tracking-tighter text-white">
                          {formatCurrency(inv.amount + (inv.returns || 0))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-500 italic">
                          +{formatCurrency(inv.returns || 0)} made
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full animate-pulse shadow-[0_0_15px_#10b981]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SHOPPING */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-blue-600 shadow-[0_0_10px_#2563eb]" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-blue-500 italic">
              New ways to grow
            </span>
          </div>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-12">
            Pick a <span className="text-zinc-800">Plan</span>
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableProducts.length > 0 ? (
              availableProducts.map((product: any) => (
                <div key={product._id} className="group cursor-pointer">
                  <InvestmentCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 border-2 border-dashed border-white/5 rounded-[3rem] text-center bg-white/[0.01]">
                <Sparkles size={32} className="mx-auto mb-4 text-zinc-800" />
                <p className="text-zinc-600 text-xs uppercase tracking-widest font-black italic">
                  No new plans right now. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
