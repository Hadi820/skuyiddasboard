/**
 * Integrated Authentication Service
 * Connects frontend with backend API
 */

import { authApi, apiClient } from "@/lib/api"

export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "MANAGER" | "STAFF" | "GRO"
  status: "ACTIVE" | "INACTIVE"
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export class ApiAuthService {
  // Hardcoded storage keys for security (not exposed as env vars)
  private static readonly TOKEN_KEY = "hotel_auth_token"
  private static readonly REFRESH_TOKEN_KEY = "hotel_refresh_token"
  private static readonly USER_KEY = "hotel_user_data"

  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authApi.login(credentials)
      const { user, accessToken, refreshToken } = response.data

      // Store tokens and user data
      this.setTokens(accessToken, refreshToken)
      this.setUser(user)

      // Set auth token for future requests
      apiClient.setAuthToken(accessToken)

      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage regardless of API call result
      this.clearAuth()
      apiClient.removeAuthToken()
    }
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userStr = localStorage.getItem(this.USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false

    const token = localStorage.getItem(this.TOKEN_KEY)
    const user = this.getCurrentUser()
    return !!(token && user)
  }

  /**
   * Check if user is admin
   */
  static isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === "ADMIN"
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY)
      if (!refreshToken) return null

      const response = await authApi.refresh(refreshToken)
      const { accessToken, refreshToken: newRefreshToken } = response.data

      this.setTokens(accessToken, newRefreshToken)
      apiClient.setAuthToken(accessToken)

      return accessToken
    } catch (error) {
      console.error("Token refresh error:", error)
      this.clearAuth()
      return null
    }
  }

  /**
   * Initialize auth on app start
   */
  static initializeAuth(): void {
    const token = this.getAccessToken()
    if (token) {
      apiClient.setAuthToken(token)
    }
  }

  /**
   * Change password
   */
  static async changePassword(data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<void> {
    try {
      await authApi.changePassword(data)
    } catch (error) {
      console.error("Change password error:", error)
      throw error
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<User> {
    try {
      const response = await authApi.getProfile()
      const user = response.data
      this.setUser(user)
      return user
    } catch (error) {
      console.error("Get profile error:", error)
      throw error
    }
  }

  // Private helper methods
  private static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
  }

  private static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  private static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }
}
