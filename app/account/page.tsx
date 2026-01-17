"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import {
  User,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  Mail,
} from "lucide-react";

export default function AccountPage() {
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    currency: "USD",
    country: "US",
  });

  // Sync with AuthContext when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        currency: user.preferences?.currency || "USD",
        country: user.preferences?.country || "US",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // FIX: Using the public .patch method now
      const res = await apiClient.patch("/auth/update-profile", formData);

      if (res.success) {
        setSuccess("Profile updated successfully");
        await refresh();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Connection interrupted. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            General Profile
          </h1>
          <p className="text-sm text-gray-500">
            Manage your public name and regional preferences.
          </p>
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-white/5 w-full mb-10" />

      <form onSubmit={handleUpdateProfile} className="space-y-8">
        {/* Email Field (Read Only) */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1 flex items-center gap-2">
            <Mail size={12} /> Email Address
          </label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full bg-gray-100 dark:bg-white/[0.01] border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-4 text-gray-400 cursor-not-allowed text-sm"
          />
          <p className="text-[10px] text-gray-500 ml-1 italic">
            Email cannot be changed manually for security reasons.
          </p>
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your full name"
            className="w-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/20 transition-all text-sm"
          />
        </div>

        {/* Regional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">
              Preferred Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="w-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-black dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-black dark:focus:ring-white/20 text-sm">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1 flex items-center gap-2">
              <Globe size={12} /> Home Region
            </label>
            <input
              type="text"
              value={formData.country}
              readOnly
              className="w-full bg-gray-100 dark:bg-white/[0.01] border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-4 text-gray-400 cursor-not-allowed text-sm"
            />
          </div>
        </div>

        {/* Success/Error Notifications */}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-600 dark:text-green-400 text-xs font-bold">
            <CheckCircle className="w-4 h-4" /> {success}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-all flex items-center justify-center gap-3 mt-4">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Update Profile
        </button>
      </form>
    </div>
  );
}
