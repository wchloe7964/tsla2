"use client";

import { useState } from "react";
import { Save, Shield, Globe, Mail } from "lucide-react";

export default function GeneralSettings() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 lg:p-16 font-sans antialiased">
      {/* Header Area */}
      <div className="max-w-5xl mx-auto mb-20">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-red-600">
            System Core
          </span>
        </div>
        <h1 className="text-5xl font-medium tracking-tighter italic font-tesla">
          GENERAL <span className="text-zinc-600">PREFERENCES</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto space-y-32">
        {/* Identity Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <Globe size={16} className="text-zinc-500" />
              <h2 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-300">
                Identity
              </h2>
            </div>
            <p className="text-sm text-zinc-500 font-light leading-relaxed">
              Global branding telemetry. These values propagate across all
              public-facing terminal nodes.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-12">
            <div className="group border-b border-white/5 pb-8 focus-within:border-red-600 transition-colors">
              <label className="block text-[9px] uppercase tracking-widest text-zinc-500 mb-4 font-bold">
                Terminal Name
              </label>
              <input
                type="text"
                placeholder="NEURAL DASHBOARD"
                className="w-full bg-transparent text-3xl font-light tracking-tighter outline-none placeholder:text-zinc-800 italic font-tesla"
              />
            </div>

            <div className="group border-b border-white/5 pb-8 focus-within:border-red-600 transition-colors">
              <label className="block text-[9px] uppercase tracking-widest text-zinc-500 mb-4 font-bold">
                Global Description
              </label>
              <textarea
                rows={2}
                placeholder="Advanced Equity Monitoring Ecosystem..."
                className="w-full bg-transparent text-lg font-light leading-relaxed outline-none placeholder:text-zinc-800"
              />
            </div>
          </div>
        </section>

        {/* Security / Maintenance Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={16} className="text-zinc-500" />
              <h2 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-300">
                Status
              </h2>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="p-10 bg-zinc-900/30 border border-white/5 rounded-[2rem] flex items-center justify-between hover:border-white/10 transition-all">
              <div>
                <h3 className="text-sm font-medium mb-1">Maintenance Mode</h3>
                <p className="text-xs text-zinc-500 font-light">
                  Deactivate all public terminal endpoints for system updates.
                </p>
              </div>
              <button className="w-16 h-8 bg-zinc-800 rounded-full relative p-1 group">
                <div className="h-6 w-6 bg-zinc-500 rounded-full transition-all group-hover:scale-90" />
              </button>
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="pt-12 border-t border-white/5 flex justify-end items-center gap-8">
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold italic">
            Changes are live across all nodes instantly
          </span>
          <button className="bg-white text-black px-12 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all">
            Commit Changes
          </button>
        </div>
      </div>
    </div>
  );
}
