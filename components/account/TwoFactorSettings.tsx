"use client";

import { useState } from "react";
import {
  Smartphone,
  ChevronRight,
  X,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";

export const TwoFactorSettings = () => {
  const { user, refresh } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<
    "intro" | "qr" | "success" | "disable" | "revoked"
  >("intro");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [qrData, setQrData] = useState({ secret: "", qrCode: "" });
  const [error, setError] = useState("");

  const resetState = () => {
    setIsOpen(false);
    setStep("intro");
    setCode("");
    setError("");
  };

  const init2FA = async () => {
    setLoading(true);
    setError("");
    try {
      // FIX: Use public setup2FA method
      const res = await apiClient.setup2FA();
      if (res.success) {
        setQrData({ secret: res.secret, qrCode: res.qrCode });
        setStep("qr");
      } else {
        setError(res.error || "Could not initialize security protocol.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // FIX: Use public verify2FA method
      const res = await apiClient.verify2FA(code);
      if (res.success) {
        await refresh();
        setStep("success");
        setTimeout(resetState, 3000);
      } else {
        setError("Invalid verification code.");
      }
    } catch {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // FIX: Use public revoke2FA method
      const res = await apiClient.revoke2FA(code);
      if (res.success) {
        await refresh();
        setStep("revoked");
        setTimeout(resetState, 3000);
      } else {
        setError("Invalid code. Access denied.");
      }
    } catch {
      setError("Communication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          if (user?.twoFactorEnabled) setStep("disable");
        }}
        className="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-between group hover:border-black dark:hover:border-white/20 transition-all">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Smartphone size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-black dark:text-white">
                Two-Factor Auth
              </p>
              {user?.twoFactorEnabled && (
                <ShieldCheck size={14} className="text-green-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              Secure your account with an authenticator app.
            </p>
          </div>
        </div>
        <div
          className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
            user?.twoFactorEnabled
              ? "bg-green-500/10 border-green-500/20 text-green-600"
              : "border-gray-200 dark:border-white/10 text-gray-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black"
          }`}>
          {user?.twoFactorEnabled ? "Active" : "Setup"}
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0A0A0B] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {user?.twoFactorEnabled ? "Disable 2FA" : "2FA Security"}
              </h2>
              <button
                onClick={resetState}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {step === "intro" && (
              <div className="space-y-6">
                <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 text-center">
                  <ShieldCheck
                    size={40}
                    className="text-blue-500 mx-auto mb-4"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Two-factor authentication adds an extra layer of protection
                    by requiring a code from your phone whenever you log in.
                  </p>
                </div>
                <button
                  onClick={init2FA}
                  disabled={loading}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Begin Setup"
                  )}
                </button>
              </div>
            )}

            {step === "qr" && (
              <div className="space-y-6 text-center">
                <p className="text-xs text-gray-500 px-4">
                  Scan this QR code with Google Authenticator or Authy.
                </p>
                <div className="bg-white p-4 rounded-3xl inline-block border-4 border-gray-50">
                  <img
                    src={qrData.qrCode}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <form
                  onSubmit={verifyAndEnable}
                  className="space-y-4 text-left">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full mt-2 bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-center text-xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-xs font-bold px-1">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}
                  <button
                    disabled={loading || code.length < 6}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px]">
                    {loading ? (
                      <Loader2 size={18} className="animate-spin mx-auto" />
                    ) : (
                      "Enable 2FA"
                    )}
                  </button>
                </form>
              </div>
            )}

            {step === "disable" && (
              <div className="space-y-6">
                <div className="p-6 bg-red-500/5 rounded-3xl border border-red-500/10 text-center">
                  <AlertCircle
                    size={40}
                    className="text-red-500 mx-auto mb-4"
                  />
                  <p className="text-sm text-red-600 font-medium">
                    Warning: Disabling 2FA reduces account security.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the current code from your app to confirm removal.
                  </p>
                </div>
                <form onSubmit={handleRevoke} className="space-y-4 text-left">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-center text-xl font-mono tracking-[0.5em] outline-none"
                  />
                  {error && (
                    <div className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">
                      {error}
                    </div>
                  )}
                  <button
                    disabled={loading || code.length < 6}
                    className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px]">
                    {loading ? (
                      <Loader2 size={18} className="animate-spin mx-auto" />
                    ) : (
                      "Confirm Deactivation"
                    )}
                  </button>
                </form>
              </div>
            )}

            {(step === "success" || step === "revoked") && (
              <div className="py-8 text-center animate-in zoom-in duration-500">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                    step === "success"
                      ? "bg-green-500 shadow-green-500/20"
                      : "bg-red-500 shadow-red-500/20"
                  }`}>
                  {step === "success" ? (
                    <CheckCircle2 className="text-white" size={40} />
                  ) : (
                    <Trash2 className="text-white" size={40} />
                  )}
                </div>
                <h3 className="text-xl font-bold">
                  {step === "success" ? "Security Active" : "2FA Removed"}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {step === "success"
                    ? "Your account is now protected."
                    : "Protection has been disabled."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
