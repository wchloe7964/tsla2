"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StatusToggle({
  userId,
  isActive,
}: {
  userId: string;
  isActive: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/toggle-status`, {
        method: "PATCH",
        body: JSON.stringify({ userId, status: !isActive }),
      });

      if (res.ok) {
        router.refresh(); // This re-fetches the Server Component data
      }
    } catch (error) {
      console.error("Toggle failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`w-full py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all border flex items-center justify-center gap-2 ${
        isActive
          ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"
          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
      } hover:scale-[1.02] active:scale-95 disabled:opacity-50`}>
      {loading ? (
        <Loader2 className="animate-spin" size={14} />
      ) : isActive ? (
        "Restrict Portfolio"
      ) : (
        "Restore Portfolio"
      )}
    </button>
  );
}
