"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

// 1. Move Fallbacks outside or into a separate config file
const HARDCODED_FALLBACK_SLIDES = [
  {
    id: "default-1",
    title: "Solar Roof",
    description: "Transform your roof into a clean energy power plant.",
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=80",
    link: "/investments",
  },
  {
    id: "default-2",
    title: "Model S Plaid",
    description: "0-60 mph in 1.99s. The future of performance.",
    image: "https://teslaevpartners.com/images/tesla-hero.jpg",
    link: "/cars",
  },
];

const ProductSlider = () => {
  // 2. ALL HOOKS MUST BE INSIDE HERE
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const res = await fetch("/api/admin/slides");
        const data = await res.json();
        if (data.success && data.slides.length > 0) {
          setSlides(data.slides);
        } else {
          setSlides(HARDCODED_FALLBACK_SLIDES);
        }
      } catch (err) {
        setSlides(HARDCODED_FALLBACK_SLIDES);
      } finally {
        setLoading(false);
      }
    };
    loadSlides();
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, slides.length]);

  // Handle Loading State
  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-tesla-red animate-spin" />
      </div>
    );
  }

  return (
    <section
      className="relative h-screen w-full bg-black overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}>
      {/* Background Layer */}
      {slides.map((slide, index) => (
        <div
          key={slide._id || slide.id}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}>
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover scale-105 animate-tesla-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl animate-tesla-reveal">
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white font-tesla mb-6">
            {slides[currentSlide]?.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide mb-10 opacity-90">
            {slides[currentSlide]?.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={slides[currentSlide]?.link || "/"}
              className="tesla-button-white px-12 py-3 text-sm">
              Order Now
            </Link>
            <Link
              href={`${slides[currentSlide]?.link}/learn`}
              className="flex items-center justify-center gap-2 text-white text-xs uppercase tracking-[0.3em] font-bold hover:opacity-60 transition-opacity">
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-12 left-0 right-0 z-30 flex flex-col items-center gap-8">
        <div className="flex gap-4 items-center">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative h-12 w-1 overflow-hidden">
              <div className="absolute inset-0 bg-white/20" />
              <div
                className={`absolute inset-0 bg-white transition-transform duration-500 ${index === currentSlide ? "translate-y-0" : "translate-y-full"}`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-12 text-white/50">
          <button
            onClick={prevSlide}
            className="hover:text-white transition-colors">
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="hover:text-white transition-colors">
            <ChevronRight />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes tesla-zoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
        .animate-tesla-zoom {
          animation: tesla-zoom 20s linear infinite alternate;
        }
      `}</style>
    </section>
  );
};

export default ProductSlider;
