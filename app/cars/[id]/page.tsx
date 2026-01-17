"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Battery,
  Zap,
  Gauge,
  Users,
  CheckCircle,
  Shield,
  Share2,
  Heart,
  Loader2,
  MapPin,
  Tag,
  ChevronRight,
  Maximize2,
  Eye,
  Info,
  Truck,
  Calendar,
  CreditCard,
  Star,
  Clock,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CarColor {
  name: string;
  hexCode: string;
  priceAdjustment: number;
}

interface Car {
  _id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  description: string;
  available: boolean;
  featured: boolean;
  specs: {
    range?: string;
    acceleration?: string;
    topSpeed?: string;
    batteryCapacity?: string;
    chargingTime?: string;
    seats?: number;
    drive?: string;
  };
  features: string[];
  colors: CarColor[];
}

interface RelatedCar {
  _id: string;
  name: string;
  model: string;
  year: number;
  price: number;
  image: string;
}

export default function CarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [relatedCars, setRelatedCars] = useState<RelatedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<CarColor | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        // Fetching from the API route we just created
        const res = await fetch(`/api/admin/cars/${id}`);
        const data = await res.json();

        if (data.success) {
          setCar(data.car);
          // Set default color from the DB data
          if (data.car.colors?.[0]) setSelectedColor(data.car.colors[0]);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("System Link Failure");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCarDetails();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotalPrice = () => {
    if (!car || !selectedColor) return car?.price || 0;
    return car.price + (selectedColor.priceAdjustment || 0);
  };

  const handleOrder = () => {
    router.push(`/cars/${id}/order?color=${selectedColor?.name || "default"}`);
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`${car?.name} added to cart!`);
    } catch (error) {
      alert("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white opacity-20" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-4">
            {error || "Car not found"}
          </h2>
          <Link
            href="/cars"
            className="inline-flex items-center text-tesla-red hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const monthlyPayment = Math.round((totalPrice * 1.08) / 60);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-1000">
      {/* 2026 Cinematic Header Layer */}
      <div className="relative h-[70vh] w-full overflow-hidden bg-gray-50 dark:bg-white/[0.02]">
        <Image
          src={car.images[selectedImage]}
          alt={car.name}
          fill
          className="object-cover transition-transform duration-[3000ms] ease-out scale-105 hover:scale-100"
          priority
        />

        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-20">
          <Link
            href="/cars"
            className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex gap-4">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all">
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "fill-tesla-red text-tesla-red" : "text-white"
                }`}
              />
            </button>
            <button className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Image Thumbnails */}
        {car.images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {car.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedImage === index
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Dynamic Spec HUD Overlay */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 px-12 py-6 bg-black/20 backdrop-blur-3xl rounded-3xl border border-white/10 z-20">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">
              Acceleration
            </p>
            <p className="text-2xl font-light tracking-tighter text-white">
              {car.specs.acceleration}
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">
              Range (EPA)
            </p>
            <p className="text-2xl font-light tracking-tighter text-white">
              {car.specs.range}
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">
              Drive
            </p>
            <p className="text-2xl font-light tracking-tighter text-white">
              {car.specs.drive}
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">
              Seats
            </p>
            <p className="text-2xl font-light tracking-tighter text-white">
              {car.specs.seats}
            </p>
          </div>
        </div>
      </div>

      {/* Configuration & Details Section */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visuals & Tech Info */}
          <div className="lg:col-span-7 py-12">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-[10px] uppercase tracking-[0.4em] font-black px-3 py-1 rounded-full ${
                  car.available
                    ? "text-tesla-red bg-tesla-red/10"
                    : "text-yellow-500 bg-yellow-500/10"
                }`}>
                {car.available ? "Ready for Delivery" : "Custom Build"}
              </span>
              {car.featured && (
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-tesla-red flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
              )}
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">
                VIN: TSLA-{car.year}-{car.model.replace(/\s+/g, "")}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter mb-4 leading-none">
              {car.name}
            </h1>

            <div className="flex items-center gap-2 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.8 • 124 reviews)</span>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-12">
              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                {car.description}
              </p>
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {car.specs.range && (
                <div className="p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center group hover:bg-white dark:hover:bg-white/5 transition-all">
                  <Battery className="w-6 h-6 text-gray-400 mb-3 group-hover:text-tesla-red transition-colors" />
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">
                    Range
                  </span>
                  <p className="text-2xl font-light tracking-tighter">
                    {car.specs.range}
                  </p>
                </div>
              )}
              {car.specs.acceleration && (
                <div className="p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center group hover:bg-white dark:hover:bg-white/5 transition-all">
                  <Zap className="w-6 h-6 text-gray-400 mb-3 group-hover:text-tesla-red transition-colors" />
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">
                    0-60 mph
                  </span>
                  <p className="text-2xl font-light tracking-tighter">
                    {car.specs.acceleration}
                  </p>
                </div>
              )}
              {car.specs.topSpeed && (
                <div className="p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center group hover:bg-white dark:hover:bg-white/5 transition-all">
                  <Gauge className="w-6 h-6 text-gray-400 mb-3 group-hover:text-tesla-red transition-colors" />
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">
                    Top Speed
                  </span>
                  <p className="text-2xl font-light tracking-tighter">
                    {car.specs.topSpeed}
                  </p>
                </div>
              )}
              {car.specs.seats && (
                <div className="p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center group hover:bg-white dark:hover:bg-white/5 transition-all">
                  <Users className="w-6 h-6 text-gray-400 mb-3 group-hover:text-tesla-red transition-colors" />
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">
                    Seats
                  </span>
                  <p className="text-2xl font-light tracking-tighter">
                    {car.specs.seats}
                  </p>
                </div>
              )}
            </div>

            {/* Feature Cards */}
            <div className="mb-12">
              <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {car.features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white dark:hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Configurator Sidebar */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-24 p-8 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                    Purchase Price
                  </p>
                  <h2 className="text-4xl font-light tracking-tighter">
                    {formatPrice(totalPrice)}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Base price: {formatPrice(car.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">
                    Est. Payment
                  </p>
                  <p className="text-xl font-light tracking-tighter text-tesla-red">
                    ${monthlyPayment}
                    <span className="text-xs">/mo</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    for 60 months at 5.99% APR
                  </p>
                </div>
              </div>

              {/* Savings Badge */}
              <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-500">
                      Save {formatPrice(5000)} vs new
                    </p>
                    <p className="text-xs text-green-500/70">
                      Price includes government incentives
                    </p>
                  </div>
                </div>
              </div>

              {/* Tonal Color Selector */}
              <div className="mb-10">
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 text-gray-900 dark:text-white">
                  Exterior Color
                </p>
                <div className="flex gap-4 mb-4">
                  {car.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all p-1 ${
                        selectedColor?.name === color.name
                          ? "border-tesla-red scale-110"
                          : "border-transparent hover:scale-105"
                      }`}>
                      <div
                        className="w-full h-full rounded-full shadow-inner border border-gray-200 dark:border-white/10"
                        style={{ backgroundColor: color.hexCode }}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedColor?.name} •{" "}
                  {selectedColor?.priceAdjustment
                    ? `+${formatPrice(selectedColor.priceAdjustment)}`
                    : "Included"}
                </p>
              </div>

              {/* Tactical Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleOrder}
                  className="w-full tesla-button-black py-5 text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Proceed to Checkout
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="py-4 border border-gray-200 dark:border-white/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {addingToCart ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button className="py-4 border border-gray-200 dark:border-white/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4" />
                    Test Drive
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-500">5-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-500">Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-500">30-Day Return</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-tesla-red" />
                  <span className="text-xs text-gray-500">Home Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Specifications */}
        <section className="mt-24">
          <h2 className="text-3xl font-medium tracking-tighter mb-8 text-gray-900 dark:text-white">
            Technical Specifications
          </h2>
          <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-white/5">
              {Object.entries(car.specs).map(([key, value], index) => (
                <div key={index} className="p-8">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="text-2xl font-light tracking-tighter text-gray-900 dark:text-white">
                    {value as string}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <section className="mt-24">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-medium tracking-tighter text-gray-900 dark:text-white">
                You May Also Like
              </h2>
              <Link
                href="/cars"
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCars.map((relatedCar) => (
                <Link
                  key={relatedCar._id}
                  href={`/cars/${relatedCar._id}`}
                  className="group bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={relatedCar.image}
                      alt={relatedCar.name}
                      fill
                      className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium tracking-tighter mb-2 text-gray-900 dark:text-white">
                      {relatedCar.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {relatedCar.year} • {relatedCar.model}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-light tracking-tighter">
                        {formatPrice(relatedCar.price)}
                      </p>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-tesla-red transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Battery & Tech Deep Dive Diagram Section */}
      <section className="bg-gray-50 dark:bg-white/[0.01] py-24 px-6 lg:px-12 mt-24 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-24">
          <div>
            <h2 className="text-[12px] uppercase tracking-[0.5em] font-black text-tesla-red mb-4">
              Structural Analysis
            </h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tighter mb-8 leading-tight text-gray-900 dark:text-white">
              Engineered for Maximum Safety and Rigidity.
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light mb-8">
              The {car.year} {car.model} features a structural battery pack that
              acts as the vehicle's floor, significantly lowering the center of
              gravity and improving side-impact protection.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-white/5">
                  <Battery className="w-6 h-6 text-tesla-red" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                    Next-Gen Cells
                  </h4>
                  <p className="text-xs text-gray-400">
                    {car.specs.batteryCapacity} High-Density cell architecture.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-white/5">
                  <Zap className="w-6 h-6 text-tesla-red" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                    Supercharging
                  </h4>
                  <p className="text-xs text-gray-400">
                    {car.specs.chargingTime} at Supercharger V4 stations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl bg-gradient-to-br from-gray-900 to-black">
            {/* Battery diagram visualization could be added here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Battery className="w-24 h-24 text-tesla-red/30 mx-auto mb-6" />
                <p className="text-gray-400 text-sm">
                  Structural Battery Pack Visualization
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .tesla-button-black {
          background: black;
          color: white;
          border-radius: 1rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tesla-button-black:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        @media (prefers-color-scheme: dark) {
          .tesla-button-black {
            background: white;
            color: black;
          }
        }
      `}</style>
    </div>
  );
}

// Add missing icon component
const ShoppingBag = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);
