"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

export default function AdminApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const res = await fetch("/api/user/investments?status=pending");
    const data = await res.json();
    if (data.success) setRequests(data.investments);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Confirm balance deduction and node activation?")) return;

    const res = await fetch("/api/admin/investments/approve", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ investmentId: id }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Node Activated successfully.");
      fetchRequests();
    } else {
      alert(data.error);
    }
  };

  const handleDecline = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to decline this request? The user will not be charged.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/investments/decline?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        alert("Request Declined.");
        fetchRequests(); // Refresh list
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Network error occurred.");
    }
  };

  if (loading)
    return <div className="p-20 text-center text-white">Loading Ledger...</div>;

  return (
    <div className="p-10 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-black uppercase italic mb-10">
        Pending Authorizations
      </h1>

      <div className="grid gap-4">
        {requests.length === 0 && (
          <p className="text-zinc-500">No pending deployments.</p>
        )}
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                User ID: {req.userId}
              </p>
              <h3 className="text-xl font-bold uppercase">
                {req.planId?.name}
              </h3>
              <p className="text-2xl font-mono text-white">
                {formatCurrency(req.amount)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(req._id)}
                className="bg-emerald-600 hover:bg-emerald-500 p-4 rounded-xl transition-all">
                <Check size={20} />
              </button>
              <button className="bg-zinc-800 hover:bg-red-900 p-4 rounded-xl transition-all">
                <X size={20} />
              </button>

              <button
                onClick={() => handleDecline(req._id)}
                className="bg-zinc-800 hover:bg-red-600 p-4 rounded-xl transition-all group"
                title="Decline Request">
                <X
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
