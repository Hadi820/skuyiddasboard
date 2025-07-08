export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "staff" | "gro" | "stor"
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock users untuk demo
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@hotel.com",
    name: "Administrator",
    role: "admin",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: "2",
    email: "staff@hotel.com",
    name: "Staff Hotel",
    role: "staff",
    avatar: "/avatars/staff.jpg",
  },
  {
    id: "3",
    email: "gro@hotel.com",
    name: "Guest Relation Officer",
    role: "gro",
    avatar: "/avatars/gro.jpg",
  },
  {
    id: "4",
    email: "stor@hotel.com",
    name: "Store Manager",
    role: "stor",
    avatar: "/avatars/stor.jpg",
  },
]

export const login = async (email: string, password: string): Promise<User> => {
  // Simulasi delay network
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email)
  if (!user || password !== "password") {
    throw new Error("Invalid credentials")
  }

  // Simpan user ke localStorage
  localStorage.setItem("user", JSON.stringify(user))
  localStorage.setItem("token", "mock-jwt-token")

  return user
}

export const logout = async (): Promise<void> => {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}

export const isAdmin = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "admin"
}

export const isStaff = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "staff" || user?.role === "admin"
}

export const getUserRole = (): string | null => {
  const user = getCurrentUser()
  return user?.role || null
}

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export const hasAccess = (requiredRole: string): boolean => {
  const user = getCurrentUser()
  if (!user) return false

  const roleHierarchy = {
    admin: ["admin", "staff", "gro", "stor"],
    staff: ["staff", "gro", "stor"],
    gro: ["gro"],
    stor: ["stor"],
  }

  return roleHierarchy[user.role as keyof typeof roleHierarchy]?.includes(requiredRole) || false
}

export const getUserPermissions = (): string[] => {
  const user = getCurrentUser()
  if (!user) return []

  const permissions = {
    admin: ["read", "write", "delete", "manage_users", "view_reports", "manage_finances"],
    staff: ["read", "write", "view_reports"],
    gro: ["read", "write", "manage_reservations"],
    stor: ["read", "manage_inventory"],
  }

  return permissions[user.role] || []
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    return login(credentials.email, credentials.password)
  },

  async logout(): Promise<void> {
    return logout()
  },

  getCurrentUser(): User | null {
    return getCurrentUser()
  },

  isAuthenticated(): boolean {
    return isAuthenticated()
  },

  isAdmin(): boolean {
    return isAdmin()
  },

  isStaff(): boolean {
    return isStaff()
  },

  getUserRole(): string | null {
    return getUserRole()
  },

  hasAccess(requiredRole: string): boolean {
    return hasAccess(requiredRole)
  },

  getUserPermissions(): string[] {
    return getUserPermissions()
  },
}
