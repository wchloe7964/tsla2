"use client";

import { useState, useEffect } from "react";
import {
  Check,
  X,
  Clock,
  AlertCircle,
  Loader2,
  Eye,
  Maximize2,
  RotateCw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function AdminKYCPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // UI States for Review
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [rejectingUser, setRejectingUser] = useState<any | null>(null);
  const [reason, setReason] = useState("");

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/admin/kyc/pending");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error("Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (
    userId: string,
    action: "LEVEL_2" | "REJECTED",
  ) => {
    setProcessingId(userId);
    try {
      const res = await fetch("/api/admin/kyc/decision", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          status: action,
          reason: action === "REJECTED" ? reason : null,
        }),
      });
      if (res.ok) {
        setRejectingUser(null);
        setReason("");
        fetchPending();
      }
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-red-600" size={40} />
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-600">
            Syncing Identity Queue...
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-10 bg-[#050505] min-h-screen text-white">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <h2 className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">
              Security & Compliance
            </h2>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase">
            ID <span className="text-zinc-800">Verification</span>
          </h1>
        </div>
        <div className="bg-zinc-900/40 px-8 py-5 rounded-[2rem] border border-white/5 text-right backdrop-blur-md">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            Pending Checks
          </p>
          <p className="text-4xl font-light text-white">{users.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8 flex flex-col xl:flex-row items-start xl:items-center gap-10 group hover:border-white/10 transition-all duration-500">
              {/* Document Preview */}
              <div
                onClick={() => {
                  setSelectedImage(user.kycData.documentUrl);
                  setRotation(0);
                }}
                className="relative w-full xl:w-72 aspect-video rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 cursor-zoom-in group/img">
                <img
                  src={user.kycData.documentUrl}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                  alt="Identity Document"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-red-600/10">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-full">
                    <Maximize2 size={20} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {user.name || "Unknown User"}
                  </h3>
                  <span className="px-3 py-1 bg-white/5 text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-white/5">
                    {user.kycData.documentType?.replace("_", " ")}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm font-medium mb-4">
                  {user.email}
                </p>
                <div className="flex items-center gap-2 text-zinc-700">
                  <Clock size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Submitted:{" "}
                    {new Date(user.kycData.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full xl:w-auto border-t xl:border-t-0 border-white/5 pt-6 xl:pt-0">
                <button
                  onClick={() => setRejectingUser(user)}
                  className="flex-1 xl:flex-none px-6 py-5 bg-white/5 text-zinc-500 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest border border-white/5"
                  disabled={!!processingId}>
                  Decline
                </button>
                <button
                  onClick={() => handleAction(user._id, "LEVEL_2")}
                  className="flex-[2] xl:flex-none px-12 py-5 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 border border-white/10 shadow-xl"
                  disabled={!!processingId}>
                  {processingId === user._id ? (
                    <Loader2 className="animate-spin mx-auto" size={18} />
                  ) : (
                    "Approve Member"
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center border border-dashed border-white/5 rounded-[3rem]">
            <UserCheck className="mx-auto text-zinc-800 mb-4" size={48} />
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">
              Queue is currently empty
            </p>
          </div>
        )}
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-10">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-10 right-10 p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white">
            <X size={32} />
          </button>

          <div className="absolute top-10 left-10 flex gap-4">
            <button
              onClick={() => setRotation((r) => r + 90)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-2xl hover:bg-red-600 transition-all text-xs font-bold uppercase tracking-widest">
              <RotateCw size={18} /> Rotate Image
            </button>
          </div>

          <img
            src={selectedImage}
            style={{ transform: `rotate(${rotation}deg)` }}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 border border-white/10"
          />
        </div>
      )}

      {/* --- REJECTION REASON MODAL --- */}
      {rejectingUser && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#0c0c0c] border border-white/10 p-10 rounded-[3rem] max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-black uppercase italic mb-2 text-red-600">
              Decline Access
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">
              REASON FOR REJECTION — {rejectingUser.name}
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Example: Photo is too blurry or ID has expired..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:border-red-600/50 outline-none h-40 mb-8 resize-none transition-all"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setRejectingUser(null)}
                className="flex-1 py-5 bg-white/5 text-zinc-500 rounded-2xl font-bold uppercase text-[9px] tracking-widest hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleAction(rejectingUser._id, "REJECTED")}
                className="flex-[2] py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] hover:bg-red-700 transition-colors">
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
