"use client";

import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Search,
  MapPin,
  Gauge,
  Plus,
  Car,
  Loader2,
  Zap,
  DollarSign,
  Layers,
  CheckCircle2,
  Users,
  Compass,
} from "lucide-react";
import AddCarModal from "@/components/admin/AddCarModal";

export default function AdminCarInventory() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  // FIXED: Use admin endpoint
  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cars"); // CHANGED HERE
      const data = await res.json();
      if (data.success) setCars(data.cars);
    } catch (error) {
      console.error("Failed to sync fleet:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // FIXED: Use admin endpoint with query parameter
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Decommission this vehicle? This will purge it from the public registry."
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/cars?id=${id}`, {
        // CHANGED HERE
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCars();
      } else {
        const error = await res.json();
        alert(`Delete failed: ${error.error}`);
      }
    } catch (error) {
      alert("System Overload: Delete failed.");
    }
  };

  const filteredCars = cars.filter(
    (car: any) =>
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black p-8 animate-in fade-in duration-1000">
      {/* Header & Fleet Analytics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">
            Orbital Fleet Command
          </h2>
          <h1 className="text-5xl font-light tracking-tighter uppercase text-white font-tesla">
            Vehicle Registry
          </h1>
          <div className="flex gap-4 mt-4 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            <span>Units: {cars.length}</span>
            <span className="text-zinc-800">|</span>
            <span>
              Est. Inventory Value: $
              {cars
                .reduce((acc: number, c: any) => acc + (c.price || 0), 0)
                .toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              placeholder="Filter by Name, Model, or ID..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-700"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setEditingCar(null);
              setIsModalOpen(true);
            }}
            className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 shadow-lg">
            <Plus size={16} strokeWidth={3} />
            Register Unit
          </button>
        </div>
      </div>

      {/* Registry Items */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-6" />
          <p className="text-zinc-500 text-sm">
            Syncing with fleet database...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCars.map((car: any) => (
            <div
              key={car._id}
              className="group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 flex flex-col xl:flex-row items-start gap-8 hover:border-white/20 transition-all duration-700">
              {/* Media Section */}
              <div className="w-full xl:w-80 shrink-0">
                <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 relative">
                  <img
                    src={car.images?.[0] || "/placeholder-car.jpg"}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                    alt={car.name}
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="text-[8px] bg-red-600 text-white px-3 py-1 rounded-sm font-black uppercase tracking-widest">
                      {car.status}
                    </span>
                    {car.reduction > 0 && (
                      <span className="text-[8px] bg-white text-black px-3 py-1 rounded-sm font-black uppercase tracking-widest">
                        -${car.reduction?.toLocaleString() || 0} Adj
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Data & Config Matrix */}
              <div className="flex-1 w-full space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-tesla text-white uppercase leading-none mb-2">
                      {car.year} {car.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.3em]">
                      {car.model} — ID: {car._id?.slice(-6) || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-white font-light tracking-tighter">
                      ${car.price?.toLocaleString() || "0"}
                    </p>
                    <p className="text-[9px] text-zinc-600 uppercase font-black">
                      MSRP BASE
                    </p>
                  </div>
                </div>

                {/* Technical Payload */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Zap size={10} /> Range
                    </p>
                    <p className="text-zinc-200 text-xs font-bold uppercase">
                      {car.specs?.range || "---"}
                    </p>
                  </div>
                  <div className="space-y-1 border-l border-white/5 pl-4">
                    <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Compass size={10} /> Acceleration
                    </p>
                    <p className="text-zinc-200 text-xs font-bold uppercase">
                      {car.specs?.acceleration || "---"}
                    </p>
                  </div>
                  <div className="space-y-1 border-l border-white/5 pl-4">
                    <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Users size={10} /> Capacity
                    </p>
                    <p className="text-zinc-200 text-xs font-bold uppercase">
                      {car.specs?.seats || 5} Seats
                    </p>
                  </div>
                  <div className="space-y-1 border-l border-white/5 pl-4">
                    <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Gauge size={10} /> Drive
                    </p>
                    <p className="text-zinc-200 text-xs font-bold uppercase truncate">
                      {car.specs?.drive || "AWD"}
                    </p>
                  </div>
                </div>

                {/* Active Modules (Feature Tags) */}
                <div className="flex flex-wrap gap-2">
                  {car.features?.map((f: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">
                        {f.label}
                      </span>
                      {f.isFree && (
                        <CheckCircle2 size={10} className="text-emerald-500" />
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-lg">
                    <MapPin size={10} className="text-red-600" />
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">
                      {car.location || "Location not set"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Array */}
              <div className="flex xl:flex-col gap-2 w-full xl:w-auto self-stretch">
                <button
                  onClick={() => {
                    setEditingCar(car);
                    setIsModalOpen(true);
                  }}
                  className="flex-1 xl:w-16 bg-white/5 hover:bg-white text-zinc-500 hover:text-black rounded-2xl transition-all flex items-center justify-center p-4">
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="flex-1 xl:w-16 bg-white/5 hover:bg-red-600/20 text-zinc-500 hover:text-red-500 rounded-2xl transition-all flex items-center justify-center p-4">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCars.length === 0 && !loading && (
        <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem]">
          <Car className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
          <h3 className="text-2xl font-light tracking-tighter text-white mb-2">
            No vehicles match your search
          </h3>
          <p className="text-zinc-500">
            Try adjusting your filters or add a new vehicle
          </p>
        </div>
      )}

      <AddCarModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCar(null);
        }}
        initialData={editingCar}
        refresh={fetchCars}
      />
    </div>
  );
}
