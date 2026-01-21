"use client";

import { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Plus,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface AddSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshSlides: () => void;
  initialData?: any;
}

export default function AddSlideModal({
  isOpen,
  onClose,
  refreshSlides,
  initialData,
}: AddSlideModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety Fallback for Cloudinary Preset
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "tesla_app_uploads";

  const defaultState = {
    title: "",
    description: "",
    image: "",
    link: "/",
    order: 0,
    isActive: true,
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...defaultState,
          ...initialData,
        });
      } else {
        setFormData(defaultState);
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      order: Number(formData.order) || 0,
    };

    try {
      const method = initialData?._id ? "PUT" : "POST";
      const url = initialData?._id
        ? `/api/admin/slides?id=${initialData._id}`
        : "/api/admin/slides";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success || res.ok) {
        refreshSlides();
        onClose();
      } else {
        alert(`Registry Error: ${result.error || "Unknown Failure"}`);
      }
    } catch (error) {
      alert("Critical system error connecting to Registry Protocol.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[200] flex justify-center items-center p-4 backdrop-blur-xl">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-all hover:rotate-90">
          <X size={24} />
        </button>

        <h2 className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
          Configure Cinematic
        </h2>
        <h1 className="text-3xl font-light tracking-tighter uppercase text-white font-tesla mb-10">
          {initialData ? "Update Registry" : "New Slide"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* IMAGE SECTION */}
          <div className="space-y-4">
            <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Cinematic Asset
            </label>

            {!formData.image ? (
              <CldUploadWidget
                uploadPreset={uploadPreset}
                onSuccess={(res: any) =>
                  setFormData((p) => ({ ...p, image: res.info.secure_url }))
                }>
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full h-40 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-white/30 transition-all uppercase text-[10px] font-bold">
                    <ImageIcon size={24} className="mb-2" />
                    Sync Visual Asset
                  </button>
                )}
              </CldUploadWidget>
            ) : (
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                <img
                  src={formData.image}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: "" })}
                  className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Trash2 size={24} className="text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                Title
              </label>
              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-600 transition-colors"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                Description
              </label>
              <textarea
                required
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-600 transition-colors resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                Order
              </label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-600 transition-colors"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
              />
            </div>

            <div className="flex items-end pb-1">
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({ ...p, isActive: !p.isActive }))
                }
                className="flex items-center gap-3 group w-full">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${formData.isActive ? "bg-red-600 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]" : "border-white/10 bg-white/5"}`}>
                  {formData.isActive ? (
                    <Check size={20} className="text-white" />
                  ) : (
                    <Plus size={20} className="text-zinc-500" />
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest group-hover:text-white transition-colors">
                  {formData.isActive ? "Active" : "Draft Mode"}
                </span>
              </button>
            </div>
          </div>

          <button
            disabled={isSubmitting || !formData.image}
            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl">
            {isSubmitting ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : initialData ? (
              "Sync Registry"
            ) : (
              "Commit to Registry"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
