// lib/api.ts

import { ApiResponse } from "@/lib/validations";

interface FetchOptions extends RequestInit {
  retry?: number;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || "";
  }

  /**
   * Fetch genérico con manejo de errores
   */
  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { retry = 3, timeout = 10000, ...fetchOptions } = options;
    
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}`,
          response.status,
          await response.text()
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (retry > 0 && this.isRetryableError(error)) {
        await this.delay(1000 * (4 - retry));
        return this.request<T>(endpoint, { ...options, retry: retry - 1 });
      }

      throw this.handleError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  /**
   * Verificar si es error reutilizable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.status >= 500 || error.status === 408;
    }
    return error instanceof TypeError; // Network error
  }

  /**
   * Manejar errores
   */
  private handleError(error: unknown): never {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError("Network error", 0, error.message);
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408, "Request took too long");
    }

    throw new ApiError("Unknown error", 0, String(error));
  }

  /**
   * Delay helper
   */
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Set auth token
   */
  setAuthToken(token: string) {
    // Se usa en headers cuando sea necesario
    localStorage.setItem("authToken", token);
  }

  /**
   * Get auth token
   */
  getAuthToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }
}

/**
 * Custom error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}

// Exportar instancia singleton
export const api = new ApiClient();

/**
 * Hook para usar API client (para componentes)
 */
export function useApi() {
  return api;
}

/**
 * Helper para manejo de errores en componentes
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}