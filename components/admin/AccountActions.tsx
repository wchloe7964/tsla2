"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AccountActions({
  userId,
  isActive,
  type,
}: {
  userId: string;
  isActive?: boolean;
  type: "status" | "kyc-approve" | "kyc-decline" | "terminate";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users/actions", {
        method: "POST",
        body: JSON.stringify({ userId, action: type }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Styling based on the button type
  const getStyles = () => {
    switch (type) {
      case "status":
        return isActive
          ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-600 hover:text-white"
          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-600 hover:text-white";
      case "kyc-approve":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-600 hover:text-white";
      case "kyc-decline":
        return "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white";
      case "terminate":
        return "bg-white/5 text-white border border-white/10 hover:bg-white/10";
    }
  };

  const getLabel = () => {
    if (type === "status")
      return isActive ? "Restrict Portfolio" : "Restore Portfolio";
    if (type === "kyc-approve") return "Approve KYC";
    if (type === "kyc-decline") return "Decline KYC";
    return "Terminate Session";
  };

  return (
    <button
      onClick={handleAction}
      disabled={loading}
      className={`flex-1 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all border flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 ${getStyles()}`}>
      {loading ? <Loader2 className="animate-spin" size={14} /> : getLabel()}
    </button>
  );
}
