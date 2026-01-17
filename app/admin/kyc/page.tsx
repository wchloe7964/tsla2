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
    action: "LEVEL_2" | "REJECTED"
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
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  return (
    <div className="p-10 bg-[#050505] min-h-screen text-white">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            Compliance & Risk
          </h2>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase">
            KYC Vault
          </h1>
        </div>
        <div className="bg-white/5 px-8 py-5 rounded-[2rem] border border-white/5 text-right backdrop-blur-md">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            Queue Depth
          </p>
          <p className="text-4xl font-tesla text-white">{users.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 flex items-center gap-10 group hover:bg-white/[0.04] transition-all duration-500">
            {/* Document Preview with Zoom Trigger */}
            <div
              onClick={() => {
                setSelectedImage(user.kycData.documentUrl);
                setRotation(0);
              }}
              className="relative w-64 aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black cursor-zoom-in group/img">
              <img
                src={user.kycData.documentUrl}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-700"
                alt="KYC Document"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-blue-600/20">
                <Maximize2 size={24} className="text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-2xl font-bold tracking-tight">
                  {user.name}
                </h3>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                  {user.kycData.documentType?.replace("_", " ")}
                </span>
              </div>
              <p className="text-zinc-500 font-medium mb-4">{user.email}</p>
              <div className="flex items-center gap-2 text-zinc-600">
                <Clock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Received {new Date(user.kycData.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setRejectingUser(user)}
                className="p-5 bg-white/5 text-zinc-500 hover:bg-red-500/10 hover:text-red-500 rounded-3xl transition-all"
                disabled={!!processingId}>
                <X size={24} />
              </button>
              <button
                onClick={() => handleAction(user._id, "LEVEL_2")}
                className="px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-3xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                disabled={!!processingId}>
                {processingId === user._id ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Approve Member"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-10">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-10 right-10 p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <X size={32} />
          </button>

          <div className="absolute top-10 left-10 flex gap-4">
            <button
              onClick={() => setRotation((r) => r + 90)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-2xl hover:bg-blue-600 transition-all text-xs font-bold uppercase tracking-widest">
              <RotateCw size={18} /> Rotate
            </button>
          </div>

          <img
            src={selectedImage}
            style={{ transform: `rotate(${rotation}deg)` }}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
          />
        </div>
      )}

      {/* --- REJECTION REASON MODAL --- */}
      {rejectingUser && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[3rem] max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-black uppercase italic mb-2 text-red-500">
              Reject Application
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              Specify why {rejectingUser.name}'s documents were declined.
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Document expired or blurry image..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-red-500/40 outline-none h-32 mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setRejectingUser(null)}
                className="flex-1 py-4 bg-white/5 text-zinc-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/10">
                Cancel
              </button>
              <button
                onClick={() => handleAction(rejectingUser._id, "REJECTED")}
                className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-700">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
