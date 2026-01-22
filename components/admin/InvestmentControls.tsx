"use client";

import { useState } from "react";
import { Zap, Square, Check, Clock, AlertOctagon } from "lucide-react";

export default function InvestmentControls({
  inv,
  onRefresh,
}: {
  inv: any;
  onRefresh: () => void;
}) {
  const [unit, setUnit] = useState("days");
  const [value, setValue] = useState(inv.durationDays || 1);
  const [loading, setLoading] = useState(false);

  // HANDLE APPROVAL (With Flexible Timing)
  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/investments/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investmentId: inv._id,
          unit,
          value: Number(value),
        }),
      });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Activation failed");
    } finally {
      setLoading(false);
    }
  };

  // HANDLE KILL SWITCH (Manual Stop)
  const handleStop = async () => {
    if (
      !confirm(
        "TERMINATE NODE? This will stop all profit generation immediately.",
      )
    )
      return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/investments/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investmentId: inv._id }),
      });
      if (res.ok) onRefresh();
    } catch (err) {
      alert("Stop command failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 space-y-4">
      {inv.status === "pending" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={12} className="text-zinc-500" />
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest italic">
              Set Deployment Period
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-20 bg-black border border-white/10 p-3 rounded-xl text-center font-mono font-bold text-sm outline-none focus:border-emerald-500 transition-colors"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="flex-1 bg-black border border-white/10 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer">
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>

          <button
            onClick={handleApprove}
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20">
            {loading ? (
              <Clock className="animate-spin" size={14} />
            ) : (
              <>
                <Check size={14} /> Activate Node
              </>
            )}
          </button>
        </div>
      ) : inv.status === "active" ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[9px] font-black uppercase text-emerald-500 italic px-2">
            <span>Node Online</span>
            <span className="animate-pulse">● Live</span>
          </div>

          <button
            onClick={handleStop}
            disabled={loading}
            className="w-full py-4 bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 transition-all group">
            <Square size={14} className="group-hover:fill-current" />
            Terminate Deployment
          </button>
        </div>
      ) : (
        <div className="py-2 text-center border border-white/5 rounded-xl bg-black/40">
          <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest italic">
            Node {inv.status}
          </span>
        </div>
      )}
    </div>
  );
}
