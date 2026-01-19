"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { apiClient } from "@/lib/api/client";

// --- Interfaces ---
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  preferences: any;
  wallet: { balance: number; currency: string };
  portfolio: any;
  kycLevel: "LEVEL_1" | "PENDING" | "LEVEL_2" | "REJECTED";
  kycData?: {
    documentType: string;
    documentUrl?: string;
    rejectionReason?: string;
    submittedAt?: string;
  };
  twoFactorEnabled: boolean;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  token: string | null;
}

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
    token?: string;
  }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CACHE_KEY = "tsla_user_data";
const CACHE_TS = "tsla_user_ts";
const CACHE_TOKEN = "tsla_auth_token";
const CACHE_DURATION = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    initialized: false,
    token: null,
  });

  const isInitialMount = useRef(true);
  const fetchLock = useRef(false);

  const getCachedData = useCallback((): {
    user: User | null;
    token: string | null;
  } => {
    if (typeof window === "undefined") return { user: null, token: null };
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const ts = localStorage.getItem(CACHE_TS);
      const token = localStorage.getItem(CACHE_TOKEN);

      if (!cached || !ts) return { user: null, token: token || null };

      if (Date.now() - parseInt(ts, 10) > CACHE_DURATION) {
        return { user: null, token: token || null };
      }

      return { user: JSON.parse(cached), token: token || null };
    } catch {
      return { user: null, token: null };
    }
  }, []);

  const setToken = useCallback((token: string) => {
    localStorage.setItem(CACHE_TOKEN, token);
    setState((prev) => ({ ...prev, token }));
  }, []);

  const clearToken = useCallback(() => {
    localStorage.removeItem(CACHE_TOKEN);
    setState((prev) => ({ ...prev, token: null }));
  }, []);

  const checkAuth = useCallback(async (force = false) => {
    if (fetchLock.current && !force) return;
    fetchLock.current = true;

    try {
      const response = await apiClient.getCurrentUser();

      if (response.success && response.user) {
        const user = response.user;

        // Also try to get token if available in response
        const token =
          response.token || localStorage.getItem(CACHE_TOKEN) || null;

        localStorage.setItem(CACHE_KEY, JSON.stringify(user));
        localStorage.setItem(CACHE_TS, Date.now().toString());
        if (token) {
          localStorage.setItem(CACHE_TOKEN, token);
        }

        setState({
          user,
          loading: false,
          error: null,
          initialized: true,
          token,
        });
      } else {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TS);
        // Don't clear token here - might still be valid
        setState((prev) => ({
          ...prev,
          user: null,
          loading: false,
          initialized: true,
        }));
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setState((prev) => ({ ...prev, loading: false, initialized: true }));
    } finally {
      fetchLock.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const cached = getCachedData();
    if (cached.user) {
      setState({
        user: cached.user,
        token: cached.token,
        loading: false,
        error: null,
        initialized: true,
      });
      // Refresh in background
      checkAuth(false).catch(() => {});
    } else {
      checkAuth(true);
    }
  }, [checkAuth, getCachedData]);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const res = await apiClient.login(email, password);

    if (res.success && res.user) {
      const user = res.user;
      const token = res.token || null;

      localStorage.setItem(CACHE_KEY, JSON.stringify(user));
      localStorage.setItem(CACHE_TS, Date.now().toString());
      if (token) {
        localStorage.setItem(CACHE_TOKEN, token);
      }

      setState({ user, loading: false, error: null, initialized: true, token });
      return { success: true, user, token };
    }

    setState((prev) => ({
      ...prev,
      loading: false,
      error: res.error || "Login failed",
    }));
    return { success: false, error: res.error };
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TS);
      localStorage.removeItem(CACHE_TOKEN);
      setState({
        user: null,
        loading: false,
        error: null,
        initialized: true,
        token: null,
      });
      window.location.href = "/login";
    }
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      isAuthenticated: !!state.user,
      isAdmin: state.user?.role === "admin",
      login,
      logout,
      refresh: () => checkAuth(true),
      setToken,
      clearToken,
    }),
    [state, checkAuth, setToken, clearToken],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export const useGlobalAuth = useAuth;
