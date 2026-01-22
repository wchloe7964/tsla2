"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Loader2,
  Zap,
  Search,
  DollarSign,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

// --- CONFIGURATION ---

const TICKER_OPTIONS = [
  { value: "AAPL", label: "AAPL - Apple Inc." },
  { value: "TSLA", label: "TSLA - Tesla Inc." },
  { value: "MSFT", label: "MSFT - Microsoft" },
  { value: "NVDA", label: "NVDA - NVIDIA" },
  { value: "GOOGL", label: "GOOGL - Alphabet Inc." },
  { value: "AMZN", label: "AMZN - Amazon" },
  { value: "META", label: "META - Meta Platforms" },
  { value: "NFLX", label: "NFLX - Netflix" },
  { value: "BTC-USD", label: "BTC - Bitcoin" },
  { value: "ETH-USD", label: "ETH - Ethereum" },
];

// --- STYLING ---

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: state.isFocused ? "#2563eb" : "rgba(255, 255, 255, 0.1)",
    borderRadius: "1rem",
    padding: "0.5rem",
    boxShadow: "none",
    minHeight: "3.5rem",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: state.isFocused ? "#2563eb" : "rgba(255, 255, 255, 0.2)",
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#0a0a0a",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "1rem",
    padding: "0.5rem",
    zIndex: 100,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "rgba(37, 99, 235, 0.1)"
      : state.isSelected
        ? "rgba(37, 99, 235, 0.2)"
        : "transparent",
    color: state.isFocused || state.isSelected ? "#fff" : "#71717a",
    cursor: "pointer",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    margin: "0.125rem 0",
    "&:active": {
      backgroundColor: "rgba(37, 99, 235, 0.3)",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "white",
    fontWeight: "bold",
  }),
  input: (base: any) => ({
    ...base,
    color: "white",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "rgba(255, 255, 255, 0.3)",
  }),
};

// --- COMPONENT ---

export default function AssignStockForm({ users }: { users: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingPrice, setIsSearchingPrice] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedTicker, setSelectedTicker] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [formData, setFormData] = useState({
    shares: "",
    entryPrice: "",
  });

  // Fetch real-time price from Finnhub
  const fetchPrice = async (ticker: string) => {
    setIsSearchingPrice(true);
    setIsVerified(false);
    setValidationErrors({});

    try {
      const apiKey =
        process.env
          .NEXT_PUBLIC_NEXT_PUBLIC_NEXT_PUBLIC_NEXT_PUBLIC_NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY;
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`,
      );
      const data = await res.json();

      if (data.c && data.c > 0) {
        setFormData((prev) => ({ ...prev, entryPrice: data.c.toString() }));
        setIsVerified(true);
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          ticker: "Market data unavailable for this ticker.",
        }));
      }
    } catch (err) {
      setValidationErrors((prev) => ({
        ...prev,
        ticker: "Pricing API connection failed.",
      }));
    } finally {
      setIsSearchingPrice(false);
    }
  };

  const handleTickerChange = (selected: any) => {
    setSelectedTicker(selected);
    if (selected) {
      fetchPrice(selected.value);
    } else {
      setIsVerified(false);
      setFormData((prev) => ({ ...prev, entryPrice: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedTicker || !isVerified) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/admin/assign-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.value,
          symbol: selectedTicker.value,
          shares: Number(formData.shares),
          priceAtAllocation: Number(formData.entryPrice),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitStatus({
          type: "success",
          message: "Registry Updated Successfully.",
        });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error(result.error || "Failed to commit allocation.");
      }
    } catch (error: any) {
      setSubmitStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const userOptions = users.map((u) => ({
    value: u._id,
    label: `${u.name} (${u.email})`,
  }));

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#121212] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />

      {submitStatus.type && (
        <div
          className={`mb-8 p-4 rounded-2xl border ${
            submitStatus.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          } flex items-center gap-3 animate-in fade-in slide-in-from-top-2`}>
          {submitStatus.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <p className="text-xs font-bold uppercase tracking-widest">
            {submitStatus.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <header className="flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-1">
              Asset Allocation Node
            </h3>
            <p className="text-xs text-zinc-500">
              Registry input via verified market tickers
            </p>
          </div>
          <BarChart3
            className={isVerified ? "text-blue-500" : "text-zinc-800"}
            size={20}
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* USER SELECTION */}
          <div className="space-y-4">
            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] flex items-center gap-2">
              <Search size={12} /> Holder Identity
            </label>
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              styles={customSelectStyles}
              placeholder="Search Partners..."
              isSearchable
            />
          </div>

          {/* TICKER SELECTION */}
          <div className="space-y-4">
            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] flex justify-between">
              Asset Ticker
              {isVerified && (
                <span className="text-emerald-500 flex items-center gap-1 font-black text-[9px] animate-pulse">
                  <ShieldCheck size={10} /> MARKET VERIFIED
                </span>
              )}
            </label>
            <Select
              options={TICKER_OPTIONS}
              value={selectedTicker}
              onChange={handleTickerChange}
              styles={customSelectStyles}
              placeholder="Select Asset..."
              isLoading={isSearchingPrice}
              isSearchable
            />
            {validationErrors.ticker && (
              <p className="text-rose-500 text-[10px] font-bold uppercase tracking-tight">
                {validationErrors.ticker}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* VOLUME */}
          <div className="space-y-4">
            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em]">
              Volume (Shares)
            </label>
            <input
              required
              type="text"
              value={formData.shares}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shares: e.target.value }))
              }
              placeholder="0.00"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-mono outline-none focus:border-blue-500 transition-all placeholder:text-zinc-800"
            />
          </div>

          {/* PRICE */}
          <div className="space-y-4">
            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em]">
              Entry USD (Verified)
            </label>
            <div className="relative">
              <input
                required
                readOnly={isVerified}
                value={formData.entryPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    entryPrice: e.target.value,
                  }))
                }
                className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-mono outline-none transition-all ${
                  isVerified
                    ? "text-emerald-400 border-emerald-500/20"
                    : "focus:border-blue-500"
                }`}
              />
              <DollarSign
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting || !isVerified || !selectedUser || !formData.shares
          }
          className={`w-full py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.5em] transition-all flex items-center justify-center gap-3 ${
            isVerified && selectedUser && formData.shares
              ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:scale-[1.01] active:scale-[0.98]"
              : "bg-zinc-900 text-zinc-700 cursor-not-allowed border border-white/5"
          }`}>
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Zap size={18} />
          )}
          {isVerified ? "Execute Allocation" : "Select & Verify Asset"}
        </button>
      </form>
    </div>
  );
}
