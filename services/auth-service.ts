// Tipe data untuk user
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "staff"
}

// Data pengguna dummy
const users = [
  {
    id: "1",
    email: "admin@villamanagement.com",
    password: "admin123",
    name: "Administrator",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "staff@villamanagement.com",
    password: "staff123",
    name: "Staff",
    role: "staff" as const,
  },
]

// Fungsi untuk menyimpan cookie
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

// Fungsi untuk mendapatkan cookie
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(";").shift() || "")
  }
  return null
}

// Fungsi untuk menghapus cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
}

// Fungsi untuk login
export function login(email: string, password: string): User | null {
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) return null

  // Jangan sertakan password dalam data yang dikembalikan
  const { password: _, ...userWithoutPassword } = user

  // Simpan user ke cookie
  setCookie("user", JSON.stringify(userWithoutPassword))

  return userWithoutPassword
}

// Fungsi untuk logout
export function logout(): void {
  deleteCookie("user")
}

// Fungsi untuk mendapatkan user saat ini
export function getCurrentUser(): User | null {
  const userJson = getCookie("user")
  if (!userJson) return null

  try {
    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

// Fungsi untuk memeriksa apakah user adalah admin
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}
