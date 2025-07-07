export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "staff" | "gro" | "stor"
  permissions: string[]
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@hotel.com",
    name: "Admin User",
    role: "admin",
    permissions: ["all"],
  },
  {
    id: "2",
    email: "staff@hotel.com",
    name: "Staff User",
    role: "staff",
    permissions: ["reservations", "clients"],
  },
  {
    id: "3",
    email: "gro@hotel.com",
    name: "GRO User",
    role: "gro",
    permissions: ["reservations", "clients", "reports"],
  },
  {
    id: "4",
    email: "stor@hotel.com",
    name: "STOR User",
    role: "stor",
    permissions: ["finance", "reports"],
  },
]

export const login = async (email: string, password: string): Promise<User | null> => {
  // Mock authentication - in real app, this would call an API
  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password") {
    localStorage.setItem("auth_token", "mock_token_" + user.id)
    localStorage.setItem("current_user", JSON.stringify(user))
    return user
  }
  return null
}

export const logout = (): void => {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("current_user")
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("current_user")
  return userStr ? JSON.parse(userStr) : null
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("auth_token")
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token")
}

export const getUserRole = (): string | null => {
  const user = getCurrentUser()
  return user?.role || null
}

export const isAdmin = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "admin"
}

export const isStaff = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "staff"
}

export const hasAccess = (permission: string): boolean => {
  const user = getCurrentUser()
  if (!user) return false
  if (user.role === "admin") return true
  return user.permissions.includes(permission)
}

export const getUserPermissions = (): string[] => {
  const user = getCurrentUser()
  return user?.permissions || []
}
