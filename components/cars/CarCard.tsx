"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Gauge,
  Battery,
  Zap,
  ChevronRight,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";

export default function CarCard({ car, index, viewMode }: any) {
  const isList = viewMode === "list";

  // Logic from Code A for dynamic UI elements
  const monthlyEst = car.monthlyPayment || Math.round(car.price / 72);
  const hasReduction = car.reduction && car.reduction > 0;

  return (
    <div
      className={`group flex flex-col animate-tesla-reveal ${
        isList
          ? "md:flex-row gap-8 items-start border-b border-gray-100 dark:border-white/5 pb-12"
          : ""
      }`}
      style={{ animationDelay: `${index * 100}ms` }}>
      {/* Media Container - Exact Code A Style */}
      <div
        className={`relative bg-gray-100 dark:bg-white/5 overflow-hidden mb-6 ${
          isList
            ? "w-full md:w-64 flex-shrink-0 aspect-video"
            : "aspect-[16/10]"
        }`}>
        <Image
          src={car.images?.[0] || car.image}
          alt={car.name}
          fill
          className="object-cover transition-transform duration-[2000ms] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
        />

        {/* Status Badges - From Code A */}
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="text-[9px] uppercase tracking-widest font-black bg-white/90 dark:bg-black/90 px-3 py-1 rounded-sm border border-gray-200 dark:border-white/10 text-black dark:text-white w-fit">
            {car.status || "New"}
          </span>
          {hasReduction && (
            <span className="text-[9px] uppercase tracking-widest font-black bg-red-600 text-white px-3 py-1 rounded-sm w-fit">
              -${car.reduction.toLocaleString()} Adjustment
            </span>
          )}
        </div>
      </div>

      {/* Data Readout - Detailed Code A Structure */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-medium tracking-tighter leading-none mb-1 uppercase font-tesla">
              {car.name}
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-light">
              {car.year} • {car.location || "Inventory Pool"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-md line-clamp-1">
              {car.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-light tracking-tighter font-tesla">
              ${car.price?.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              ${monthlyEst}/MO
            </p>
          </div>
        </div>

        {/* Technical Specs Bar - Precise Symbols & Bordering */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100 dark:border-white/5 mb-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-mono font-bold uppercase">
              {(car.mileage || 0).toLocaleString()} mi
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-gray-100 dark:border-white/5 text-center">
            <Battery className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-mono font-bold uppercase">
              {car.specs?.range || car.range || "---"} mi
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-mono font-bold uppercase">
              {car.specs?.acceleration || "---"}
            </span>
          </div>
        </div>

        {/* Features Tags - Included from Code A */}
        {car.features && car.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {car.features.slice(0, 3).map((feature: any, i: number) => (
              <span
                key={i}
                className="text-[10px] uppercase tracking-tighter px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-sm">
                {typeof feature === "string" ? feature : feature.label}
              </span>
            ))}
          </div>
        )}

        {/* Action Array - Dual Button Style */}
        <div className="flex gap-2">
          <Link
            href={`/cars/${car._id}`}
            className="flex-1 bg-black text-white dark:bg-white dark:text-black py-4 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-center hover:opacity-90 transition-all shadow-lg shadow-black/5">
            Order Now
          </Link>
          <Link
            href={`/cars/${car._id}`}
            className="w-14 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500 border border-transparent hover:border-white/10">
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
