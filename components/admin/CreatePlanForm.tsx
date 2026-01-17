// components/admin/CreatePlanForm.tsx
"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function CreatePlanForm({
  cloudinaryImages,
}: {
  cloudinaryImages: any[];
}) {
  const [selectedImage, setSelectedImage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    planType: "daily",
    roi: "",
    minAmount: 100,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/admin/investments", {
      method: "POST",
      body: JSON.stringify({ ...formData, image: selectedImage }),
    });
    if (response.ok) alert("Plan Created!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
      <div className="grid md:grid-cols-2 gap-6">
        <input
          placeholder="Plan Title (e.g. Model 3 Performance)"
          className="bg-black border border-white/10 p-3 rounded-xl"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <select
          className="bg-black border border-white/10 p-3 rounded-xl"
          onChange={(e) =>
            setFormData({ ...formData, planType: e.target.value })
          }>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
        Select Vehicle Image
      </p>
      <div className="grid grid-cols-4 gap-3 h-48 overflow-y-auto p-2 bg-black/50 rounded-xl">
        {cloudinaryImages.map((img) => (
          <div
            key={img.publicId}
            onClick={() => setSelectedImage(img.url)}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition ${
              selectedImage === img.url
                ? "border-blue-600"
                : "border-transparent"
            }`}>
            <img src={img.thumbnail} className="w-full h-20 object-cover" />
            {selectedImage === img.url && (
              <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                <CheckCircle2 className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition">
        Deploy Growth Plan
      </button>
    </form>
  );
}
