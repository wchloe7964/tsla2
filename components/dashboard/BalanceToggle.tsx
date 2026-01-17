"use client";
import { useState } from "react";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

export default function BalanceToggle({
  amount,
  label,
}: {
  amount: number;
  label: string;
}) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-500">
          {label}
        </p>
        <div className="flex items-center gap-6">
          <h3 className="text-6xl font-light tracking-tighter">
            {visible ? formatCurrency(amount) : "••••••••"}
          </h3>
          <button
            onClick={() => setVisible(!visible)}
            className="p-2 text-gray-500 hover:text-white transition-colors">
            {visible ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
      </div>
      <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
        <TrendingUp className="text-blue-500 w-8 h-8" />
      </div>
    </div>
  );
}
