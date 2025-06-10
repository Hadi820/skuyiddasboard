/**
 * Enhanced API Client with improved error handling and retry logic
 */

import { type ApiResponse, type HttpMethod, HttpStatusCode } from "@/shared/types/api.types"

interface RetryConfig {
  maxRetries: number
  retryDelay: number
  retryCondition: (error: ApiError) => boolean
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private retryConfig: RetryConfig

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryCondition: (error: ApiError) => {
        // Retry on network errors or 5xx server errors
        return error.isNetworkError || error.isServerError
      },
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
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Generic request method with retry logic
   */
  private async request<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    data?: any,
    customHeaders?: Record<string, string>,
    retryCount = 0,
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const headers = { ...this.defaultHeaders, ...customHeaders }

      const config: RequestInit = {
        method,
        headers,
      }

      if (data && ["POST", "PUT", "PATCH"].includes(method)) {
        if (data instanceof FormData) {
          // Remove Content-Type for FormData to let browser set boundary
          delete headers["Content-Type"]
          config.body = data
        } else {
          config.body = JSON.stringify(data)
        }
      }

      const response = await fetch(url, config)

      // Check if response is ok
      if (!response.ok) {
        let errorData: any
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: response.statusText }
        }

        const error = new ApiError(errorData.message || errorData.error || "Request failed", response.status, errorData)

        // Retry logic
        if (retryCount < this.retryConfig.maxRetries && this.retryConfig.retryCondition(error)) {
          await this.sleep(this.retryConfig.retryDelay * Math.pow(2, retryCount)) // Exponential backoff
          return this.request<T>(endpoint, method, data, customHeaders, retryCount + 1)
        }

        throw error
      }

      // Parse response
      let result: ApiResponse<T>
      try {
        result = await response.json()
      } catch {
        // If response is not JSON, create a generic success response
        result = {
          success: true,
          data: null as any,
          message: "Request completed successfully",
        }
      }

      return result
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      // Network error
      const networkError = new ApiError(
        "Network error or server unavailable",
        HttpStatusCode.SERVICE_UNAVAILABLE,
        error,
      )

      // Retry on network errors
      if (retryCount < this.retryConfig.maxRetries) {
        await this.sleep(this.retryConfig.retryDelay * Math.pow(2, retryCount))
        return this.request<T>(endpoint, method, data, customHeaders, retryCount + 1)
      }

      throw networkError
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
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
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
   * Upload file with progress tracking
   */
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void,
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append("file", file)

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
      }

      const xhr = new XMLHttpRequest()

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText)
            resolve(result)
          } catch {
            resolve({
              success: true,
              data: null as any,
              message: "Upload completed successfully",
            })
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText)
            reject(new ApiError(errorData.message || "Upload failed", xhr.status, errorData))
          } catch {
            reject(new ApiError("Upload failed", xhr.status))
          }
        }
      })

      xhr.addEventListener("error", () => {
        reject(new ApiError("Network error during upload", HttpStatusCode.SERVICE_UNAVAILABLE))
      })

      xhr.open("POST", `${this.baseURL}${endpoint}`)

      // Set authorization header if available
      if (this.defaultHeaders["Authorization"]) {
        xhr.setRequestHeader("Authorization", this.defaultHeaders["Authorization"])
      }

      xhr.send(formData)
    })
  }

  /**
   * Check if client is online
   */
  isOnline(): boolean {
    return navigator.onLine
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await fetch(`${this.baseURL.replace("/api", "")}/health`)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Enhanced API Error class
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

  get isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403
  }

  get isValidationError(): boolean {
    return this.statusCode === 400 && this.details?.details
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Enhanced API methods with better error handling
export const reservationApi = {
  getAll: (filters?: any) => apiClient.get("/reservations", filters),
  getById: (id: string) => apiClient.get(`/reservations/${id}`),
  create: (data: any) => apiClient.post("/reservations", data),
  update: (id: string, data: any) => apiClient.put(`/reservations/${id}`, data),
  delete: (id: string) => apiClient.delete(`/reservations/${id}`),
  updateStatus: (id: string, status: string, notes?: string) =>
    apiClient.patch(`/reservations/${id}/status`, { status, notes }),
  getGroSummary: () => apiClient.get("/reservations/gro-summary"),
  getDashboardStats: () => apiClient.get("/reservations/dashboard-stats"),
  export: (filters?: any) => apiClient.get("/reservations/export", filters),
}

export const authApi = {
  login: (credentials: any) => apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
  refresh: (refreshToken: string) => apiClient.post("/auth/refresh", { refreshToken }),
  getProfile: () => apiClient.get("/auth/profile"),
  changePassword: (data: any) => apiClient.post("/auth/change-password", data),
}

export const clientApi = {
  getAll: (filters?: any) => apiClient.get("/clients", filters),
  getById: (id: string) => apiClient.get(`/clients/${id}`),
  create: (data: any) => apiClient.post("/clients", data),
  update: (id: string, data: any) => apiClient.put(`/clients/${id}`, data),
  delete: (id: string) => apiClient.delete(`/clients/${id}`),
  getReservations: (id: string, params?: any) => apiClient.get(`/clients/${id}/reservations`, params),
}

export const invoiceApi = {
  getAll: (filters?: any) => apiClient.get("/invoices", filters),
  getById: (id: string) => apiClient.get(`/invoices/${id}`),
  create: (data: any) => apiClient.post("/invoices", data),
  update: (id: string, data: any) => apiClient.put(`/invoices/${id}`, data),
  delete: (id: string) => apiClient.delete(`/invoices/${id}`),
  markAsPaid: (id: string, paymentData: any) => apiClient.patch(`/invoices/${id}/mark-paid`, paymentData),
}

export const dashboardApi = {
  getStats: () => apiClient.get("/dashboard/stats"),
  getRevenueChart: (period?: string) => apiClient.get("/dashboard/revenue-chart", { period }),
  getRecentActivity: () => apiClient.get("/dashboard/recent-activity"),
}
