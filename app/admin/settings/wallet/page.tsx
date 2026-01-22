"use client";

import { useState, useEffect } from "react";
import { Save, Wallet, Loader2, CheckCircle, ShieldAlert } from "lucide-react";

export default function AdminWalletSettings() {
  const [data, setData] = useState({ walletAddress: "", network: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/wallet")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.settings) {
          setData({
            walletAddress: json.settings.walletAddress,
            network: json.settings.network,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) alert("Payment Method Updated");
    } catch (err) {
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
            Wallet Config
          </h1>
          <p className="text-zinc-500 text-sm">
            Set the global destination for all member deposits.
          </p>
        </header>

        <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl">
          <div className="flex items-center gap-4 text-blue-500 mb-10">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Wallet size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              Primary Payment Method
            </p>
          </div>

          <div className="space-y-8">
            <div className="group">
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">
                Network Type
              </label>
              <input
                value={data.network}
                onChange={(e) => setData({ ...data, network: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 mt-2 focus:border-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-800"
                placeholder="e.g. USDT (TRC20)"
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">
                Recipient Address
              </label>
              <input
                value={data.walletAddress}
                onChange={(e) =>
                  setData({ ...data, walletAddress: e.target.value })
                }
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 mt-2 font-mono focus:border-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-800"
                placeholder="Enter long-form address..."
              />
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl mb-8">
            <ShieldAlert size={18} className="text-orange-500 shrink-0" />
            <p className="text-[10px] text-orange-200/50 font-medium italic leading-relaxed">
              Ensure the network matches the address perfectly to avoid loss of
              member funds.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-white text-black h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50">
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
}
