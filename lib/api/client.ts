"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
  user?: any;
  investments?: T;
  [key: string]: any;
}

class ApiClient {
  private userPromise: Promise<ApiResponse> | null = null;
  private refreshPromise: Promise<string | null> | null = null;

  // Helper to get auth token
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("tsla_auth_token");
  }

  // Helper to get refresh token
  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("tsla_refresh_token");
  }

  // Helper to set tokens
  private setTokens(authToken?: string, refreshToken?: string): void {
    if (typeof window === "undefined") return;
    if (authToken) localStorage.setItem("tsla_auth_token", authToken);
    if (refreshToken) localStorage.setItem("tsla_refresh_token", refreshToken);
  }

  // Helper to clear tokens
  private clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("tsla_auth_token");
    localStorage.removeItem("tsla_refresh_token");
    localStorage.removeItem("tsla_user_data");
    localStorage.removeItem("tsla_user_ts");
  }

  // Attempt to refresh the token
  private async refreshAuthToken(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return null;

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            this.setTokens(data.token, data.refreshToken);
            return data.token;
          }
        }

        // Refresh failed, clear tokens
        this.clearTokens();
        return null;
      } catch (error) {
        console.error("Token refresh failed:", error);
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // Enhanced request method with token handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0,
  ): Promise<ApiResponse<T>> {
    try {
      const token = this.getAuthToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

      // Add Authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
      });

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && retryCount === 0) {
        const newToken = await this.refreshAuthToken();
        if (newToken) {
          // Retry the request with new token
          return this.request<T>(endpoint, options, retryCount + 1);
        } else {
          // Refresh failed, clear tokens and redirect
          this.clearTokens();
          if (typeof window !== "undefined" && !endpoint.includes("/auth/")) {
            window.location.href = "/login?session=expired";
          }
        }
      }

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `Error: ${response.statusText}`,
          status: response.status,
          ...data,
        };
      }

      // If login response contains token, store it
      if (endpoint === "/auth/login" && data.token) {
        this.setTokens(data.token, data.refreshToken);
      }

      return {
        success: true,
        ...data,
        data: data.data || data.user || data,
      };
    } catch (err: any) {
      console.error(`API request failed for ${endpoint}:`, err);
      return {
        success: false,
        error: err.message || "Network connection failed",
      };
    }
  }

  /**
   * Public method for PATCH requests
   */
  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  // --- Auth Methods ---
  async getCurrentUser(): Promise<ApiResponse> {
    if (this.userPromise) return this.userPromise;

    this.userPromise = this.request("/auth/me");

    // Clear the promise cache after 5 seconds
    this.userPromise.finally(() => {
      setTimeout(() => {
        this.userPromise = null;
      }, 5000);
    });

    return this.userPromise;
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Update user promise if login successful
    if (response.success && response.user) {
      this.userPromise = Promise.resolve(response);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request("/auth/logout", { method: "POST" });
    this.clearTokens();
    this.userPromise = null;
    return response;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<any> {
    return this.request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async postWallet(data: any): Promise<ApiResponse> {
    return this.request("/wallet", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async setup2FA(): Promise<any> {
    return this.request("/auth/2fa/setup", { method: "POST" });
  }

  async verify2FA(token: string): Promise<any> {
    return this.request("/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async revoke2FA(token: string): Promise<any> {
    return this.request("/auth/2fa/revoke", {
      method: "POST",
      body: JSON.stringify({ code: token }),
    });
  }

  async getWallet(): Promise<ApiResponse> {
    return this.request("/wallet");
  }

  async getPortfolio(): Promise<ApiResponse> {
    return this.request("/portfolio");
  }

  async getInvestments(): Promise<ApiResponse> {
    return this.request("/investments");
  }

  async createInvestment(data: any): Promise<ApiResponse> {
    return this.request("/investments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getStocks(params: any = {}): Promise<ApiResponse> {
    const query = new URLSearchParams(params).toString();
    return this.request(`/stocks?${query}`);
  }

  async getStockBySymbol(symbol: string): Promise<ApiResponse> {
    return this.request(`/stocks/${symbol}`);
  }

  async tradeStock(data: any): Promise<ApiResponse> {
    return this.request("/trade", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // New method for authenticated fetch
  async authenticatedFetch(endpoint: string, options: RequestInit = {}) {
    const token = this.getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  }

  // Admin methods
  async getAdminSettings(): Promise<ApiResponse> {
    return this.request("/admin/settings");
  }

  async updateAdminSettings(settings: any): Promise<ApiResponse> {
    return this.request("/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  }
}

export const apiClient = new ApiClient();
