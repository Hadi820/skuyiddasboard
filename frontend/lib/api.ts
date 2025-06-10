import axios from "axios"
import { toast } from "@/components/ui/use-toast"

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        })

        const { token } = response.data
        localStorage.setItem("token", token)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        // Redirect to login page if in browser
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }

        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || "An unexpected error occurred"

    // Show toast notification for errors
    if (typeof window !== "undefined") {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }

    return Promise.reject(error)
  },
)

// API endpoints
export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  refreshToken: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.post("/auth/change-password", data),
}

export const userApi = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
}

export const clientApi = {
  getAll: (params) => api.get("/clients", { params }),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post("/clients", data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  getReservations: (id) => api.get(`/clients/${id}/reservations`),
  getInvoices: (id) => api.get(`/clients/${id}/invoices`),
}

export const reservationApi = {
  getAll: (params) => api.get("/reservations", { params }),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post("/reservations", data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  delete: (id) => api.delete(`/reservations/${id}`),
  getGroSummary: () => api.get("/reservations/gro-summary"),
  getDashboardStats: () => api.get("/reservations/dashboard-stats"),
  export: (params) => api.get("/reservations/export", { params, responseType: "blob" }),
}

export const invoiceApi = {
  getAll: (params) => api.get("/invoices", { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post("/invoices", data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  addPayment: (id, data) => api.post(`/invoices/${id}/payments`, data),
  generatePdf: (id) => api.get(`/invoices/${id}/pdf`, { responseType: "blob" }),
  sendByEmail: (id, data) => api.post(`/invoices/${id}/send`, data),
}

export const expenseApi = {
  getAll: (params) => api.get("/expenses", { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post("/expenses", data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getCategories: () => api.get("/expenses/categories"),
  getMonthlyReport: (year, month) => api.get(`/expenses/report/${year}/${month}`),
}

export const groApi = {
  getCommissions: (params) => api.get("/gro/commissions", { params }),
  updateCommission: (id, data) => api.put(`/gro/commissions/${id}`, data),
  getPerformance: (groName, year) => api.get(`/gro/performance/${groName}/${year}`),
  markAsPaid: (id) => api.patch(`/gro/commissions/${id}/paid`),
}

export const storApi = {
  getFunds: (params) => api.get("/stor/funds", { params }),
  createFund: (data) => api.post("/stor/funds", data),
  updateFund: (id, data) => api.put(`/stor/funds/${id}`, data),
  deleteFund: (id) => api.delete(`/stor/funds/${id}`),
}

export const dashboardApi = {
  getSummary: () => api.get("/dashboard/summary"),
  getRevenueStats: (period) => api.get(`/dashboard/revenue/${period}`),
  getReservationStats: (period) => api.get(`/dashboard/reservations/${period}`),
  getTopGro: () => api.get("/dashboard/top-gro"),
  getUpcomingReservations: () => api.get("/dashboard/upcoming-reservations"),
  getRecentInvoices: () => api.get("/dashboard/recent-invoices"),
}

export const uploadApi = {
  uploadFile: (file, type) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  deleteFile: (fileId) => api.delete(`/upload/${fileId}`),
}

export const healthApi = {
  check: () => api.get("/health"),
  checkDatabase: () => api.get("/health/database"),
  checkStorage: () => api.get("/health/storage"),
}

export default api
