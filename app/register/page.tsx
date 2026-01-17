"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getCurrencyForCountry } from "@/lib/constants/countryCurrency";

// --- Sub-Components for cleaner rendering ---

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex gap-2 mb-8 px-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
          currentStep >= i
            ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            : "bg-white/10"
        }`}
      />
    ))}
  </div>
);

const InputWrapper = ({ label, children, icon: Icon }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      )}
      {children}
    </div>
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, initialized } = useAuth();

  // --- State ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    currency: "USD",
  });

  const [metadata, setMetadata] = useState({
    countries: [] as any[],
    currencies: [] as any[],
  });

  // --- Auth Redirect ---
  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, initialized, router]);

  // --- Load Metadata ---
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoadingData(true);
        const [cRes, currRes] = await Promise.all([
          fetch("/api/countries").then((res) => res.json()),
          fetch("/api/currency/supported").then((res) => res.json()),
        ]);
        setMetadata({
          countries: cRes.success ? cRes.countries : [],
          currencies: currRes.success ? currRes.currencies : [],
        });
      } catch (err) {
        console.error("Data load failed", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadMetadata();
  }, []);

  // --- Password Strength Calculation ---
  const passwordStrength = useMemo(() => {
    let strength = 0;
    const { password } = formData;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  }, [formData.password]);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "country") {
        newData.currency = getCurrencyForCountry(value) || "USD";
      }
      return newData;
    });
  };

  const validate = () => {
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    if (!termsAccepted)
      return "You must accept the Terms of Service and Privacy Policy";
    if (passwordStrength < 75)
      return "Password is too weak. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          country: formData.country,
          currency: formData.currency,
        }),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || `Error: ${response.status}`);

      if (result.success) {
        setSuccess("✓ Account created successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        setError(`✗ ${result.error || "Registration failed."}`);
      }
    } catch (err: any) {
      setError(
        `⚠️ ${err.message || "Network error. Please check connection."}`
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Guard Renders ---
  if (!initialized || (isAuthenticated && step === 1)) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[480px] z-10">
        <StepIndicator currentStep={step} />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold">
              {error}
            </p>
          </div>
        )}

        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="px-8 pt-10 pb-4">
            <h1 className="text-3xl font-tesla uppercase tracking-tighter text-white">
              {step === 1
                ? "Create Profile"
                : step === 2
                ? "Set Security"
                : "Location"}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-2">
              Step {step} of 3
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 pt-4 space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <InputWrapper label="Full Name" icon={User}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition-all text-sm"
                    placeholder="John Doe"
                  />
                </InputWrapper>
                <InputWrapper label="Email Address" icon={Mail}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition-all text-sm"
                    placeholder="name@email.com"
                  />
                </InputWrapper>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <InputWrapper label="Password" icon={Lock}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className="h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        passwordStrength >= 75
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </InputWrapper>
                <InputWrapper label="Confirm Password">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </InputWrapper>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <InputWrapper label="Your Country">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-4 text-white outline-none appearance-none cursor-pointer text-sm">
                    <option value="" className="bg-black">
                      Select Country
                    </option>
                    {metadata.countries.map((c) => (
                      <option key={c.code} value={c.code} className="bg-black">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </InputWrapper>
                <InputWrapper label="Preferred Currency">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-4 text-white outline-none appearance-none text-sm">
                    {metadata.currencies.map((c) => (
                      <option key={c.code} value={c.code} className="bg-black">
                        {c.name} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </InputWrapper>
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500"
                  />
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold cursor-pointer">
                    I agree to the Terms of Service and Privacy Policy.
                  </label>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 py-4 border border-white/10 rounded-2xl text-[10px] uppercase font-bold text-gray-500 hover:text-white transition-all">
                  Back
                </button>
              )}
              <button
                type={step < 3 ? "button" : "submit"}
                onClick={step < 3 ? () => setStep((s) => s + 1) : undefined}
                disabled={loading || (step === 3 && !termsAccepted)}
                className="flex-[2] bg-white text-black py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white disabled:opacity-50 transition-all flex items-center justify-center">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : step < 3 ? (
                  "Continue"
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-bold">
            Already have an account?
            <Link
              href="/login"
              className="ml-2 text-white hover:text-blue-400 transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
