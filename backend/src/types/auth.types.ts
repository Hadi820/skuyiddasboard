export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  name: string
  role?: "admin" | "manager" | "staff" | "gro"
  phone?: string
}

export interface ChangePasswordDto {
  userId: string
  currentPassword: string
  newPassword: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
    status: string
    avatar?: string
    phone?: string
    lastLogin?: Date
    createdAt: Date
  }
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface JwtPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  userId: string
  type: "refresh"
  iat?: number
  exp?: number
}
