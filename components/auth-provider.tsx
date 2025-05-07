"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser, logout as logoutService } from "@/services/auth-service"
import type { User } from "@/services/auth-service"

interface AuthContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  user: User | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Periksa apakah user sudah login
    const checkAuth = () => {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)

      // Redirect ke login jika tidak terotentikasi dan tidak berada di halaman login
      if (!currentUser && pathname !== "/login") {
        router.push("/login")
      }
    }

    checkAuth()

    // Tambahkan event listener untuk perubahan cookie
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [pathname, router])

  const logout = () => {
    logoutService()
    setUser(null)
    router.push("/login")
  }

  const value = {
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    user,
    logout,
  }

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
