"use client";

import { useState } from "react";
import { Loader2, Lock, Unlock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  currentStatus: boolean;
}

export default function RestrictionToggle({ userId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/admin/users/${userId}/restrict`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canWithdraw: !currentStatus }),
      });

      if (res.status === 431) {
        alert("Session data too large. Please log out and log back in.");
        return;
      }

      if (res.ok) {
        router.refresh();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to update restriction", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-black uppercase italic text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${
          currentStatus
            ? "bg-white text-black hover:bg-red-500 hover:text-white"
            : "bg-red-600 text-white"
        }`}>
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : currentStatus ? (
          <>
            <Lock size={12} /> Lock Ledger
          </>
        ) : (
          <>
            <Unlock size={12} /> Unlock Ledger
          </>
        )}
      </button>
      {error && (
        <p className="text-[8px] text-red-500 font-black uppercase text-center italic flex items-center justify-center gap-1">
          <AlertCircle size={10} /> Sync Failed - Clear Cookies
        </p>
      )}
    </div>
  );
}
