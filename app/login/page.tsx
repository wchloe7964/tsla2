"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  Fingerprint,
  ArrowRight,
  Loader2,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getHomePath = (role?: string) => {
    return role === "admin" ? "/admin/dashboard" : "/dashboard";
  };

  const redirectPath = searchParams.get("callbackUrl");

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const destination = redirectPath || getHomePath(user.role);
      router.replace(destination);
    }
  }, [isAuthenticated, authLoading, router, redirectPath, user]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await login(email, password);

      if (result.success) {
        setSuccess("Identity Verified. Loading your account...");

        if (rememberMe) {
          localStorage.setItem("rememberEmail", email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        const destination = redirectPath || getHomePath(result.user?.role);
        setTimeout(() => router.push(destination), 500);
      } else {
        setError(
          result.error || "Login failed. Please check your credentials."
        );
      }
    } catch (err: any) {
      setError("Connection interrupted. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[420px] z-10 transition-all duration-500">
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 mb-6 group hover:scale-105 transition-all duration-500">
              <Lock className="w-7 h-7 text-white group-hover:text-blue-400 transition-colors" />
            </div>
            <h1 className="text-3xl font-tesla tracking-tighter text-white mb-2 uppercase">
              Welcome Back
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">
              Secure Sign-In
            </p>
          </div>

          <div className="px-8">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold">
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                  {success}
                </p>
              </div>
            )}
          </div>

          <div className="px-8 pb-10 pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-sm"
                  placeholder="name@email.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
                    Password
                  </label>
                  {/* FIX: Removed invalid size="sm" prop */}
                  <Link
                    href="/forgot-password"
                    className="text-[9px] uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-colors font-bold">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center px-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-blue-500 focus:ring-offset-0 focus:ring-blue-500/50"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-[10px] text-gray-500 uppercase tracking-[0.2em] cursor-pointer select-none font-bold">
                  Keep me signed in
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-white text-black py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all duration-500 active:scale-[0.98] disabled:opacity-50">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                    {!loading && (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center gap-4 mb-6">
                <div className="h-px bg-white/5 flex-1" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-black">
                  Fast Access
                </span>
                <div className="h-px bg-white/5 flex-1" />
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group">
                <Fingerprint className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">
                  Biometric Login
                </span>
              </button>
            </div>
          </div>

          <div className="py-6 bg-white/[0.02] border-t border-white/5 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-bold">
              Don't have an account?
              <Link
                href="/register"
                className="ml-2 text-white hover:text-blue-400 transition-all">
                Create One
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
