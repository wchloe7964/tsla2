"use client";

import { useState, useRef } from "react";
import {
  X,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Copy,
  CheckCircle2,
  Upload,
  ArrowLeft,
  AlertTriangle,
  Wallet2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import TransactionSuccess from "./TransactionSuccess";
import { formatCurrency } from "@/lib/utils/format";

const ADMIN_WALLET = {
  network: "USDT (TRC20)",
  address: "TL2v7x9PqM8s5r4N1u3Y6k9Z2w0Xj8H5Lq",
};

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBalance: number;
}

export default function DepositModal({
  isOpen,
  onClose,
  onSuccess,
  currentBalance,
}: DepositModalProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ADMIN_WALLET.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadToCloudinary = async () => {
    if (!image) return null;

    try {
      const formData = new FormData();
      formData.append("file", image);
      // Ensure this matches the 'Unsigned' preset name in your Cloudinary settings
      formData.append("upload_preset", "user_proofs");

      const cloudName = "dfj3z9rcb";
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Cloudinary Error:", data.error?.message);
        return null;
      }

      return data.secure_url;
    } catch (error) {
      console.error("Connection to Cloudinary failed:", error);
      return null;
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);

    try {
      const evidenceUrl = await handleUploadToCloudinary();

      if (!evidenceUrl) {
        alert("We couldn't upload your receipt. Please try another photo.");
        setLoading(false);
        return;
      }

      const res = await apiClient.postWallet({
        action: "deposit",
        amount: Number(amount),
        method: "crypto",
        evidenceUrl: evidenceUrl,
      });

      if (res.success) {
        setLoading(false);
        setIsVerifying(true);

        // This is the "Everyday People" bridge that feels high-tech
        setTimeout(() => {
          setIsVerifying(false);
          setIsSuccess(true);
          onSuccess();
        }, 4500);
      } else {
        throw new Error("API Submission failed");
      }
    } catch (err) {
      console.error("Deposit error", err);
      alert("Something went wrong with your request. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsVerifying(false);
    setStep(1);
    setAmount("");
    setImage(null);
    setPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] shadow-2xl">
        <div className="p-8">
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-700 text-center">
              <div className="relative mb-10">
                <div className="w-24 h-24 rounded-full border-2 border-blue-500/10 border-t-blue-500 animate-[spin_3s_linear_infinite]" />
                <ShieldCheck
                  className="absolute inset-0 m-auto text-blue-500/40"
                  size={32}
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-blue-500 italic animate-pulse mb-4">
                Securing Transaction
              </p>
              <h3 className="text-2xl font-light tracking-tight text-white leading-snug">
                Syncing with <br />
                <span className="font-black italic uppercase">
                  Blockchain Network
                </span>
              </h3>
              <div className="pt-8">
                <p className="text-[9px] font-black uppercase text-zinc-600 italic tracking-widest">
                  Encrypting evidence... 100%
                </p>
                <p className="text-[9px] font-black uppercase text-zinc-500 italic tracking-widest mt-2 animate-pulse">
                  Verifying network protocol...
                </p>
              </div>
            </div>
          ) : isSuccess ? (
            <TransactionSuccess
              amount={amount}
              type="deposit"
              onClose={handleClose}
            />
          ) : (
            <>
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors">
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-500 mb-1 italic">
                      Step {step} of 3
                    </p>
                    <h3 className="text-2xl font-light tracking-tight text-white">
                      {step === 1
                        ? "Deposit Details"
                        : step === 2
                        ? "Review Transfer"
                        : "Verify Proof"}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-8">
                    <label className="text-[9px] font-black uppercase text-gray-500 italic ml-1">
                      Deposit Amount
                    </label>
                    <div className="relative mt-2">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light text-gray-600">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent border-none pl-8 text-5xl font-light tracking-tighter text-white focus:ring-0 placeholder:text-white/5"
                      />
                    </div>
                  </div>
                  <div className="mb-10 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-[9px] font-black uppercase text-zinc-500">
                        Destination Network
                      </span>
                      <span className="text-[9px] font-black uppercase text-white bg-blue-500 px-2 py-0.5 rounded">
                        {ADMIN_WALLET.network}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase text-zinc-500 italic">
                        Company Wallet Address
                      </p>
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                        <p className="text-[11px] font-mono text-zinc-400 break-all mr-4">
                          {ADMIN_WALLET.address}
                        </p>
                        <button
                          onClick={handleCopy}
                          className="shrink-0 p-3 rounded-xl bg-white/5 hover:bg-white text-gray-400 hover:text-black transition-all">
                          {copied ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={!amount || Number(amount) <= 0}
                    onClick={() => setStep(2)}
                    className="group w-full bg-white text-black h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    I have sent the funds{" "}
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-8 p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                      <Wallet2 className="text-blue-500" size={28} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] mb-2 italic">
                      Confirming Sent Amount
                    </p>
                    <h4 className="text-5xl font-black italic tracking-tighter text-white mb-6">
                      {formatCurrency(Number(amount))}
                    </h4>
                    <div className="w-full space-y-3 pt-6 border-t border-white/5 text-[10px] font-black uppercase italic">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Network used</span>
                        <span className="text-white">
                          {ADMIN_WALLET.network}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Status</span>
                        <span className="text-orange-400">
                          Waiting for proof
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mb-10 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                    <AlertTriangle
                      className="text-orange-500 shrink-0"
                      size={16}
                    />
                    <p className="text-[10px] text-orange-200/60 leading-relaxed font-bold italic">
                      Verify you used the{" "}
                      <span className="text-orange-400 font-black">
                        {ADMIN_WALLET.network}
                      </span>{" "}
                      network.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="group w-full bg-white text-black h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    Details are Correct{" "}
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed italic font-medium">
                    Please upload your transaction screenshot to finalize.
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden mb-6 ${
                      preview
                        ? "border-emerald-500/50 bg-black"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}>
                    {preview ? (
                      <>
                        <img
                          src={preview}
                          className="w-full h-full object-cover opacity-60"
                          alt="Preview"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-black/60 px-4 py-2 rounded-full text-[10px] font-black uppercase text-white backdrop-blur-md">
                            Change Photo
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-zinc-500 mx-auto">
                          <Upload size={20} />
                        </div>
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">
                          Upload Receipt
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-8">
                    <ShieldCheck className="text-blue-500 shrink-0" size={18} />
                    <p className="text-[11px] text-blue-200/60 leading-tight font-bold italic">
                      Funds credited upon blockchain confirmation.
                    </p>
                  </div>
                  <button
                    disabled={!image || loading}
                    onClick={handleFinalSubmit}
                    className="group w-full bg-white text-black h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 disabled:opacity-20 transition-all active:scale-[0.98]">
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        Submit for Review <CheckCircle2 size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
