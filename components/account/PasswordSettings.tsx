"use client";

import { useState } from "react";
import {
  Lock,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

export const PasswordSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "idle", msg: "" });
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new !== form.confirm) {
      return setStatus({ type: "error", msg: "Passwords do not match" });
    }

    setLoading(true);
    try {
      const res = await apiClient.changePassword(form.current, form.new);

      if (res.success) {
        setStatus({ type: "success", msg: "Password updated" });
        setTimeout(() => {
          setIsOpen(false);
          setStatus({ type: "idle", msg: "" });
          setForm({ current: "", new: "", confirm: "" }); // Clear form on success
        }, 2000);
      } else {
        setStatus({ type: "error", msg: res.error || "Update failed" });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Connection error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-between group hover:border-black dark:hover:border-white/20 transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
            <Lock size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-black dark:text-white">
              Change Password
            </p>
            <p className="text-xs text-gray-500">
              Update your access credentials.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black dark:group-hover:text-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0A0A0B] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Password</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {status.type === "success" ? (
              <div className="py-8 text-center animate-in zoom-in">
                <CheckCircle2
                  className="mx-auto text-green-500 mb-4"
                  size={48}
                />
                <p className="font-bold text-black dark:text-white">
                  {status.msg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Current Password"
                    required
                    className="w-full bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    onChange={(e) =>
                      setForm({ ...form, current: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-4 text-gray-400">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  className="w-full bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  onChange={(e) => setForm({ ...form, new: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  className="w-full bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                />
                {status.type === "error" && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                    <AlertCircle size={14} />
                    <span>{status.msg}</span>
                  </div>
                )}
                <button
                  disabled={loading}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" size={18} />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
