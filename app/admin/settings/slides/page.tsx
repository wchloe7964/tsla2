"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import AddSlideModal from "@/components/admin/AddSlideModal";

export default function AdminSliderManager() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/slides");
      const data = await res.json();
      if (data.success) setSlides(data.slides);
    } catch (error) {
      console.error("Orbital Link Failure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently purge this cinematic asset?")) return;
    try {
      const res = await fetch(`/api/admin/slides?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchSlides();
      } else {
        const error = await res.json();
        alert(`Purge failed: ${error.error}`);
      }
    } catch (error) {
      alert("System Overload: Purge sequence interrupted.");
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <h2 className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">
            Visual Matrix Control
          </h2>
          <h1 className="text-5xl font-light tracking-tighter uppercase text-white font-tesla">
            Home Cinema
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-4">
            Active Sequences: {slides.filter((s: any) => s.isActive).length} /{" "}
            {slides.length}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSlide(null);
            setIsModalOpen(true);
          }}
          className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <Plus size={16} strokeWidth={3} />
          Initialize New Slide
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="animate-spin text-red-600 w-12 h-12 mb-4" />
          <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">
            Synchronizing Registry...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {slides.map((slide: any, index: number) => (
            <div
              key={slide._id}
              className={`group relative bg-[#0a0a0a] border ${
                slide.isActive ? "border-white/5" : "border-red-900/20"
              } rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all duration-700`}>
              {/* Image Preview Area */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={slide.image}
                  className={`w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100 ${
                    slide.isActive
                      ? "grayscale-[0.5] group-hover:grayscale-0"
                      : "grayscale opacity-30"
                  }`}
                  alt={slide.title}
                />

                {/* Overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Sequence Badge */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                    <Layers size={10} className="text-red-600" />
                    <span className="text-[10px] text-white font-black uppercase tracking-tighter">
                      Pos: {slide.order}
                    </span>
                  </div>
                  {!slide.isActive && (
                    <div className="bg-red-600/20 backdrop-blur-md border border-red-600/50 px-3 py-1 rounded-full flex items-center gap-2">
                      <EyeOff size={10} className="text-red-500" />
                      <span className="text-[10px] text-red-500 font-black uppercase tracking-tighter">
                        Offline
                      </span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-6 left-8 right-8">
                  <h3 className="text-2xl font-tesla text-white uppercase leading-none mb-2">
                    {slide.title}
                  </h3>
                  <p className="text-zinc-400 text-xs font-light line-clamp-1 tracking-wide">
                    {slide.description}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-6 flex items-center justify-between bg-zinc-900/30 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-zinc-800" />
                  ID: {slide._id.slice(-6)}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingSlide(slide);
                      setIsModalOpen(true);
                    }}
                    className="p-4 bg-white/5 hover:bg-white hover:text-black text-zinc-400 rounded-2xl transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="p-4 bg-white/5 hover:bg-red-600/20 hover:text-red-500 text-zinc-400 rounded-2xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {slides.length === 0 && !loading && (
        <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem]">
          <Layers className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.4em]">
            Matrix Empty. Awaiting Input.
          </p>
        </div>
      )}

      <AddSlideModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSlide(null);
        }}
        refreshSlides={fetchSlides}
        initialData={editingSlide}
      />
    </div>
  );
}
