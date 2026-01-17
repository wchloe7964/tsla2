'use client'

import Link from 'next/link'
import { featuredCars } from '@/lib/constants'
import { Battery, Zap, Gauge, ArrowRight } from 'lucide-react'

const Inventory = () => {
  return (
    <section className="bg-white dark:bg-black py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header - Left Aligned for 2026 Look */}
        <div className="mb-16 animate-tesla-reveal">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black dark:text-white font-tesla mb-4">
            Available Inventory
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-xl">
            Select from our curated fleet, optimized for performance and ready for immediate delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 dark:bg-white/10 border border-gray-100 dark:border-white/10 overflow-hidden rounded-3xl">
          {featuredCars.map((car, index) => (
            <div
              key={car.id}
              className="group relative bg-white dark:bg-black p-6 transition-all duration-500 hover:z-10 animate-tesla-reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Visual */}
              <div className="relative aspect-[16/10] mb-8 overflow-hidden rounded-xl">
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-white/90 dark:bg-black/90 text-black dark:text-white rounded backdrop-blur-md">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Identity */}
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-medium tracking-tight text-black dark:text-white font-tesla">
                  {car.name}
                </h3>
                <p className="text-sm text-gray-400 font-light mt-1 uppercase tracking-widest">
                  {car.description}
                </p>
              </div>

              {/* Clinical Specs Bar */}
              <div className="flex justify-between items-center py-6 border-y border-gray-50 dark:border-white/5 mb-8">
                <div className="text-center flex-1">
                  <div className="text-lg font-medium dark:text-white">{car.specs.range}</div>
                  <div className="text-[10px] uppercase tracking-tighter text-gray-400">Range (EPA)</div>
                </div>
                <div className="w-px h-8 bg-gray-100 dark:bg-white/10" />
                <div className="text-center flex-1">
                  <div className="text-lg font-medium dark:text-white">{car.specs.acceleration}</div>
                  <div className="text-[10px] uppercase tracking-tighter text-gray-400">0-60 mph</div>
                </div>
                <div className="w-px h-8 bg-gray-100 dark:bg-white/10" />
                <div className="text-center flex-1">
                  <div className="text-lg font-medium dark:text-white">{car.specs.topSpeed}</div>
                  <div className="text-[10px] uppercase tracking-tighter text-gray-400">Top Speed</div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex flex-col gap-3">
                <div className="text-center mb-2">
                  <span className="text-xl font-medium dark:text-white">{car.price}</span>
                  <span className="text-xs text-gray-400 block tracking-tight italic opacity-60">
                    Est. net price after savings
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/cars/${car.id}/order`}
                    className="flex-1 tesla-button-dark dark:tesla-button-white text-center py-2 text-xs uppercase tracking-widest"
                  >
                    Order
                  </Link>
                  <Link
                    href={`/cars/${car.id}`}
                    className="flex-1 bg-gray-100 dark:bg-white/5 text-black dark:text-white rounded-full py-2 text-center text-xs uppercase tracking-widest font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Action */}
        <div className="mt-16 text-center">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.3em] dark:text-white hover:opacity-50 transition-opacity"
          >
            Explore All Models <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Inventory