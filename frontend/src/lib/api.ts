/**
 * Frontend API Client
 * Centralized API communication with type safety
 */

import { type ApiResponse, type HttpMethod, HttpStatusCode } from "@/shared/types/api.types"

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  /**
   * Remove authentication token
   */
  removeAuthToken() {
    delete this.defaultHeaders["Authorization"]
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    data?: any,
    customHeaders?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const headers = { ...this.defaultHeaders, ...customHeaders }

      const config: RequestInit = {
        method,
        headers,
      }

      if (data && ["POST", "PUT", "PATCH"].includes(method)) {
        config.body = JSON.stringify(data)
      }

      const response = await fetch(url, config)
      const result = await response.json()

      if (!response.ok) {
        throw new ApiError(result.error || "Request failed", response.status, result)
      }

      return result
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError("Network error or server unavailable", HttpStatusCode.SERVICE_UNAVAILABLE, error)
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      url += `?${searchParams.toString()}`
    }

    return this.request<T>(url, "GET")
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "POST", data)
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PUT", data)
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PATCH", data)
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "DELETE")
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const headers = { ...this.defaultHeaders }
    delete headers["Content-Type"] // Let browser set multipart boundary

    return this.request<T>(endpoint, "POST", formData, headers)
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }

  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500
  }

  get isServerError(): boolean {
    return this.statusCode >= 500
  }

  get isNetworkError(): boolean {
    return this.statusCode === HttpStatusCode.SERVICE_UNAVAILABLE
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export specific API methods for different modules
export const reservationApi = {
  getAll: (filters?: any) => apiClient.get("/reservations", filters),
  getById: (id: number) => apiClient.get(`/reservations/${id}`),
  create: (data: any) => apiClient.post("/reservations", data),
  update: (id: number, data: any) => apiClient.put(`/reservations/${id}`, data),
  delete: (id: number) => apiClient.delete(`/reservations/${id}`),
  getGroSummary: () => apiClient.get("/reservations/gro/summary"),
  getByGro: (groName: string) => apiClient.get(`/reservations/gro/${groName}`),
}

export const authApi = {
  login: (credentials: any) => apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
  refresh: (refreshToken: string) => apiClient.post("/auth/refresh", { refreshToken }),
  getProfile: () => apiClient.get("/auth/profile"),
}

export const clientApi = {
  getAll: (filters?: any) => apiClient.get("/clients", filters),
  getById: (id: number) => apiClient.get(`/clients/${id}`),
  create: (data: any) => apiClient.post("/clients", data),
  update: (id: number, data: any) => apiClient.put(`/clients/${id}`, data),
  delete: (id: number) => apiClient.delete(`/clients/${id}`),
}
