"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2, Trash2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

const VEHICLE_MODELS = [
  "Model S",
  "Model 3",
  "Model X",
  "Model Y",
  "Cybertruck",
];

export default function AddCarModal({
  isOpen,
  onClose,
  refresh,
  initialData,
}: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultState = {
    name: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    reduction: 0,
    status: "New",
    mileage: 0,
    location: "",
    delivery: "",
    images: [] as string[],
    description: "",
    specs: {
      range: "",
      acceleration: "",
      topSpeed: "",
      seats: 5,
      drive: "Dual Motor AWD",
    },
    features: [] as { label: string; isFree: boolean }[],
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...defaultState,
          ...initialData,
          reduction: initialData.reduction ?? 0,
          description: initialData.description ?? "",
          location: initialData.location ?? "",
          delivery: initialData.delivery ?? "",
          mileage: initialData.mileage ?? 0,
          specs: {
            ...defaultState.specs,
            ...initialData.specs,
            seats: initialData.specs?.seats ?? 5,
          },
          features: initialData.features ?? [],
        });
      } else {
        setFormData(defaultState);
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Final payload verification
    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      reduction: Number(formData.reduction) || 0,
      mileage: Number(formData.mileage) || 0,
      year: Number(formData.year),
      specs: {
        ...formData.specs,
        seats: Number(formData.specs.seats) || 5,
      },
    };

    try {
      const res = await fetch("/api/admin/cars", {
        method: initialData?._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          initialData?._id ? { ...payload, _id: initialData._id } : payload
        ),
      });

      const result = await res.json();

      if (result.success) {
        refresh();
        onClose();
      } else {
        alert(`Error: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      alert("Critical error connecting to the Registry Protocol.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-6xl rounded-[2.5rem] my-8 shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center text-white">
          <h2 className="text-xl font-tesla uppercase tracking-widest text-red-600">
            Registry Protocol
          </h2>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: Core Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                Name
              </label>
              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-600 transition-colors"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                  Model
                </label>
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }>
                  <option value="">Select</option>
                  {VEHICLE_MODELS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                  Year
                </label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                  value={formData.year}
                  onChange={(e) =>
                    // FIX: Convert string input to number for TypeScript
                    setFormData({ ...formData, year: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                  Price ($)
                </label>
                <input
                  type="number"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                  value={formData.price}
                  onChange={(e) =>
                    // FIX: Convert string input to number
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                  Discount ($)
                </label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                  value={formData.reduction}
                  onChange={(e) =>
                    // FIX: Convert string input to number
                    setFormData({
                      ...formData,
                      reduction: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                Delivery Estimate
              </label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-600 transition-colors"
                value={formData.delivery}
                onChange={(e) =>
                  setFormData({ ...formData, delivery: e.target.value })
                }
              />
            </div>
          </div>

          {/* MIDDLE COLUMN: Specs & Description */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <input
                placeholder="Range (mi)"
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-xs outline-none focus:border-red-600 transition-colors"
                value={formData.specs.range}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specs: { ...formData.specs, range: e.target.value },
                  })
                }
              />
              <input
                placeholder="0-60 (s)"
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-xs outline-none focus:border-red-600 transition-colors"
                value={formData.specs.acceleration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specs: { ...formData.specs, acceleration: e.target.value },
                  })
                }
              />
              <input
                placeholder="Location (e.g. Austin, TX)"
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-xs outline-none focus:border-red-600 transition-colors"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                Description
              </label>
              <textarea
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none resize-none text-xs focus:border-red-600 transition-colors"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Images & Actions */}
          <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
              onSuccess={(res: any) =>
                setFormData((p) => ({
                  ...p,
                  images: [...p.images, res.info.secure_url],
                }))
              }>
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-full h-32 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-white/30 transition-all uppercase text-[10px] font-bold">
                  <Upload size={24} className="mb-2" />
                  Sync Assets
                </button>
              )}
            </CldUploadWidget>

            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {formData.images.map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden group border border-white/5">
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt="vehicle"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images: formData.images.filter((u) => u !== url),
                      })
                    }
                    className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Trash2 size={16} color="white" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <button
                disabled={isSubmitting || formData.images.length === 0}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none">
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Commit to Registry"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
