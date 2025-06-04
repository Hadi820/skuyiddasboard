/**
 * Shared API Types
 * Common types used across frontend and backend
 */

// HTTP Methods
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// HTTP Status Codes
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: any
  pagination?: PaginationInfo
}

// Pagination
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
}

// Error Response
export interface ApiError {
  success: false
  error: string
  message: string
  details?: any
  statusCode?: number
}

// Request/Response Types for different entities

// User Types
export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = "admin",
  STAFF = "staff",
  GRO = "gro",
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
  expiresIn: number
}

// Reservation Types
export interface Reservation {
  id: number
  clientId: number
  bookingCode: string
  checkIn: string
  checkOut: string
  roomType: string
  totalAmount: number
  depositAmount: number
  remainingAmount: number
  basePrice: number
  profit: number
  status: ReservationStatus
  gro: string
  category: string
  tripSchedule?: string
  orderDetails: string
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  // Joined fields
  customerName?: string
  customerPhone?: string
}

export enum ReservationStatus {
  PENDING = "Pending",
  PROCESSING = "Proses",
  COMPLETED = "Selesai",
  CANCELLED = "Dibatalkan",
}

export interface CreateReservationDto {
  clientId: number
  bookingCode?: string
  checkIn: string
  checkOut: string
  roomType: string
  totalAmount: number
  depositAmount?: number
  basePrice?: number
  status?: ReservationStatus
  gro: string
  category?: string
  tripSchedule?: string
  orderDetails: string
  notes?: string
}

export interface UpdateReservationDto {
  checkIn?: string
  checkOut?: string
  roomType?: string
  totalAmount?: number
  depositAmount?: number
  basePrice?: number
  status?: ReservationStatus
  gro?: string
  category?: string
  tripSchedule?: string
  orderDetails?: string
  notes?: string
}

export interface ReservationFilters {
  status?: string
  gro?: string
  category?: string
  dateFrom?: string
  dateTo?: string
  searchTerm?: string
}

// Client Types
export interface Client {
  id: number
  name: string
  email?: string
  phone: string
  address?: string
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateClientDto {
  name: string
  email?: string
  phone: string
  address?: string
  notes?: string
}

export interface UpdateClientDto {
  name?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  isActive?: boolean
}

// GRO Analytics Types
export interface GroSummary {
  gro: string
  totalReservations: number
  totalRevenue: number
  averageRevenue: number
  completedReservations: number
  pendingReservations: number
  processingReservations: number
  cancelledReservations: number
  totalCommission: number
  earnedCommission: number
  pendingCommission: number
  completionRate: number
  reservationsLast30Days: number
  reservationsLast7Days: number
}

export interface GroMonthlyPerformance {
  gro: string
  month: string
  monthlyReservations: number
  monthlyRevenue: number
  monthlyProfit: number
  monthlyCommission: number
  avgReservationValue: number
}

// Commission Types
export interface Commission {
  id: string
  gro: string
  reservationId: number
  bookingCode: string
  customerName: string
  amount: number
  date: string
  status: CommissionStatus
  paidAt?: string
  notes?: string
}

export enum CommissionStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
}

// Financial Types
export interface FinancialSummary {
  totalRevenue: number
  totalProfit: number
  totalCommissions: number
  totalExpenses: number
  netIncome: number
  period: string
}

// Export/Import Types
export interface ExportOptions {
  format: "csv" | "excel" | "pdf"
  dateRange?: {
    from: string
    to: string
  }
  filters?: Record<string, any>
}

// Validation Types
export interface ValidationError {
  field: string
  message: string
  value?: any
}

// File Upload Types
export interface FileUploadResponse {
  filename: string
  originalName: string
  size: number
  mimetype: string
  url: string
}

// Search Types
export interface SearchParams {
  query: string
  filters?: Record<string, any>
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// Dashboard Types
export interface DashboardStats {
  totalReservations: number
  totalRevenue: number
  totalClients: number
  totalGros: number
  recentReservations: Reservation[]
  topPerformingGros: GroSummary[]
  monthlyRevenue: Array<{
    month: string
    revenue: number
    reservations: number
  }>
}

// Notification Types
export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

// Settings Types
export interface SystemSettings {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  currency: string
  timezone: string
  defaultCommissionRate: number
  emailNotifications: boolean
  smsNotifications: boolean
}
