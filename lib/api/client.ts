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

  // Keep this private to protect internal headers/logic
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `Error: ${response.status}`,
          ...data,
        };
      }

      return { success: true, data, ...data };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Network connection failed",
      };
    }
  }

  /**
   * FIX: This public method allows other files to send updates
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
    this.userPromise = this.request("/auth/me").finally(() => {
      setTimeout(() => {
        this.userPromise = null;
      }, 2000);
    });
    return this.userPromise;
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request("/auth/logout", { method: "POST" });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
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
}

export const apiClient = new ApiClient();
