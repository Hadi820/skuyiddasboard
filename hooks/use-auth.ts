"use client"

/**
 * React Hook for Authentication
 * Integrates with backend API
 */

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ApiAuthService, type User, type LoginCredentials } from "@/services/api-auth-service"
import { useToast } from "@/components/ui/use-toast"

export function useAuth() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        ApiAuthService.initializeAuth()
        const currentUser = ApiAuthService.getCurrentUser()

        if (currentUser && ApiAuthService.isAuthenticated()) {
          setUser(currentUser)
          setIsAuthenticated(true)

          // Verify token with backend
          try {
            const profile = await ApiAuthService.getProfile()
            setUser(profile)
          } catch (error) {
            // Token might be expired, try to refresh
            const newToken = await ApiAuthService.refreshToken()
            if (!newToken) {
              // Refresh failed, logout
              await logout()
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true)
      try {
        const authResponse = await ApiAuthService.login(credentials)
        setUser(authResponse.user)
        setIsAuthenticated(true)

        toast({
          title: "Login Successful",
          description: `Welcome back, ${authResponse.user.name}!`,
        })

        router.push("/dashboard")
        return authResponse
      } catch (error: any) {
        const errorMessage = error.message || "Login failed"
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [router, toast],
  )

  const logout = useCallback(async () => {
    try {
      await ApiAuthService.logout()
      setUser(null)
      setIsAuthenticated(false)

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })

      router.push("/login")
    } catch (error: any) {
      console.error("Logout error:", error)
      // Force logout even if API call fails
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    }
  }, [router, toast])

  const changePassword = useCallback(
    async (data: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }) => {
      try {
        await ApiAuthService.changePassword(data)
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully.",
        })
      } catch (error: any) {
        const errorMessage = error.message || "Failed to change password"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw error
      }
    },
    [toast],
  )

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await ApiAuthService.getProfile()
      setUser(profile)
      return profile
    } catch (error: any) {
      console.error("Failed to refresh profile:", error)
      throw error
    }
  }, [])

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === "ADMIN",
    login,
    logout,
    changePassword,
    refreshProfile,
  }
}
