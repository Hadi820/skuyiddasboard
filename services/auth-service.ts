/**
 * Legacy Authentication Service (Updated for Security)
 * Maintains backward compatibility while improving security
 */

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff" | "gro"
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// Hardcoded storage keys for security
const STORAGE_KEYS = {
  TOKEN: "hotel_auth_token",
  REFRESH_TOKEN: "hotel_refresh_token",
  USER: "hotel_user_data",
} as const

// Mock users for development (in production, this would come from API)
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@hotel.com",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@hotel.com",
    role: "manager",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Staff User",
    email: "staff@hotel.com",
    role: "staff",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "GRO User",
    email: "gro@hotel.com",
    role: "gro",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function login(credentials: LoginCredentials): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === credentials.email)

      if (user && credentials.password === "password") {
        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
        localStorage.setItem(STORAGE_KEYS.TOKEN, "mock-jwt-token")
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, "mock-refresh-token")

        resolve(user)
      } else {
        reject(new Error("Invalid credentials"))
      }
    }, 1000)
  })
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  const user = getCurrentUser()
  return !!(token && user)
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}

export function isManager(): boolean {
  const user = getCurrentUser()
  return user?.role === "manager"
}

export function isStaff(): boolean {
  const user = getCurrentUser()
  return user?.role === "staff"
}

export function isGro(): boolean {
  const user = getCurrentUser()
  return user?.role === "gro"
}

export function hasAccess(route: string): boolean {
  const user = getCurrentUser()
  if (!user) return false

  // Admin memiliki akses ke semua rute
  if (user.role === "admin") return true

  // Manager memiliki akses ke sebagian besar rute
  if (user.role === "manager") {
    const managerRoutes = ["/dashboard", "/clients", "/kpi-admin", "/kpi-client", "/keuangan", "/calendar", "/reports"]
    return managerRoutes.some((allowedRoute) => route.startsWith(allowedRoute))
  }

  // Staff memiliki akses terbatas
  if (user.role === "staff") {
    const staffRoutes = ["/clients", "/kpi-client", "/calendar"]
    return staffRoutes.some((allowedRoute) => route.startsWith(allowedRoute))
  }

  // GRO memiliki akses ke dashboard dan client
  if (user.role === "gro") {
    const groRoutes = ["/dashboard", "/clients", "/kpi-client"]
    return groRoutes.some((allowedRoute) => route.startsWith(allowedRoute))
  }

  return false
}

export function getUserRole(): string | null {
  const user = getCurrentUser()
  return user?.role || null
}

export function getUserPermissions(): string[] {
  const user = getCurrentUser()
  if (!user) return []

  switch (user.role) {
    case "admin":
      return ["read", "write", "delete", "manage_users", "manage_settings", "view_reports", "manage_finances"]
    case "manager":
      return ["read", "write", "view_reports", "manage_finances"]
    case "staff":
      return ["read", "write"]
    case "gro":
      return ["read", "write", "manage_clients"]
    default:
      return ["read"]
  }
}
