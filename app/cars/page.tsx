"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Grid, List, Loader2 } from "lucide-react";
import CarFilters from "@/components/cars/CarFilters";
import CarCard from "@/components/cars/CarCard";

// ✅ FORCE FRESHNESS: Tell Next.js to never cache this route at build time
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      }>
      <InventoryContent />
    </Suspense>
  );
}

function InventoryContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        setLoading(true);
        // Use the public cars API
        const res = await fetch(`/api/cars?${searchParams.toString()}`);
        const data = await res.json();
        if (data.success) setCars(data.cars);
      } catch (error) {
        console.error("Fleet sync error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-700">
      {/* 2026 Global Nav Extension */}
      <header className="pt-24 pb-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="animate-tesla-reveal">
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter font-tesla leading-none uppercase">
              Inventory
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 font-light tracking-wide max-w-md">
              Available vehicles for immediate delivery. Configured with
              precision.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-24">
        {/* Pass searchParams to filters to show active states */}
        <CarFilters />

        {/* View Toggle & Count */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-xl font-medium tracking-tight">
            Available Vehicles{" "}
            <span className="text-gray-400">({cars.length})</span>
          </h2>
          <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-gray-100 dark:bg-white/10"
                  : "hover:bg-gray-50 dark:hover:bg-white/5"
              }`}>
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-gray-100 dark:bg-white/10"
                  : "hover:bg-gray-50 dark:hover:bg-white/5"
              }`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Grid / Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-gray-100 dark:bg-white/5 rounded-2xl mb-6" />
                <div className="h-8 bg-gray-100 dark:bg-white/5 rounded-lg w-1/2 mb-4" />
                <div className="h-20 bg-gray-100 dark:bg-white/5 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16"
                : "space-y-12"
            }>
            {cars.map((car: any, index: number) => (
              <CarCard
                key={car._id}
                car={car}
                index={index}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && cars.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[3rem]">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-light tracking-tighter">
              No matching configurations found.
            </h3>
            <p className="text-gray-500 mt-2">
              Adjust your filters to see more results.
            </p>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes tesla-reveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-tesla-reveal {
          animation: tesla-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
