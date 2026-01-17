'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    title: 'Solar Roof',
    description: 'Transform your roof into a clean energy power plant.',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=80',
    link: '/investments',
  },
  {
    id: 2,
    title: 'Powerwall 3',
    description: 'Energy independence. Optimized for the 2026 grid.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
    link: '/stocks',
  },
  {
    id: 3,
    title: 'Model S Plaid',
    description: '0-60 mph in 1.99s. The future of performance.',
    image: 'https://teslaevpartners.com/images/tesla-hero.jpg',
    link: '/wallet',
  },
  {
    id: 4,
    title: 'Cybervessel',
    description: 'Reinforced durability. Built for the modern explorer.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1600&q=80',
    link: '/cars',
  }
]

const ProductSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <section 
      className="relative h-screen w-full bg-black overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Layer */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img 
            src={slide.image} 
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover scale-105 animate-tesla-zoom"
          />
          {/* Subtle Technical Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>
      ))}

      {/* Content Overlay - Cinematic Centering */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl animate-tesla-reveal">
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white font-tesla mb-6">
            {slides[currentSlide].title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide mb-10 opacity-90">
            {slides[currentSlide].description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={slides[currentSlide].link}
              className="tesla-button-white px-12 py-3 text-sm"
            >
              Order Now
            </Link>
            <Link
              href={`${slides[currentSlide].link}/learn`}
              className="flex items-center justify-center gap-2 text-white text-xs uppercase tracking-[0.3em] font-bold hover:opacity-60 transition-opacity"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation UI - Technical & Minimal */}
      <div className="absolute bottom-12 left-0 right-0 z-30 flex flex-col items-center gap-8">
        {/* Modern Progress Indicators */}
        <div className="flex gap-4 items-center">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative h-12 w-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20" />
              <div 
                className={`absolute inset-0 bg-white transition-transform duration-500 ${
                  index === currentSlide ? 'translate-y-0' : 'translate-y-full'
                }`} 
              />
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>

        {/* Minimal Arrows */}
        <div className="flex gap-12 text-white/50">
          <button onClick={prevSlide} className="hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6 stroke-1" />
          </button>
          <button onClick={nextSlide} className="hover:text-white transition-colors">
            <ChevronRight className="w-6 h-6 stroke-1" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes tesla-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-tesla-zoom {
          animation: tesla-zoom 20s linear infinite alternate;
        }
      `}</style>
    </section>
  )
}

export default ProductSlider