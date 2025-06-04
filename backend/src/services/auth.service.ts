import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../config/database"
import { logger } from "../utils/logger"
import type { UserRole } from "@prisma/client"

export class AuthService {
  /**
   * Login user
   */
  async login(email: string, password: string) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      throw new Error("User account is not active")
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    // Generate tokens
    const token = this.generateToken(user.id)
    const refreshToken = this.generateRefreshToken(user.id)

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Log activity
    await this.logActivity("LOGIN", user.id, user.id)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    }
  }

  /**
   * Register new user
   */
  async register(userData: {
    name: string
    email: string
    password: string
    role?: UserRole
    createdBy?: string
  }) {
    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 12)
    const hashedPassword = await bcrypt.hash(userData.password, salt)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "STAFF",
        status: "ACTIVE",
        createdBy: userData.createdBy,
      },
    })

    // Log activity
    if (userData.createdBy) {
      await this.logActivity("REGISTER", user.id, userData.createdBy)
    }

    return user
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "default-refresh-secret") as any

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          status: true,
        },
      })

      if (!user) {
        throw new Error("User not found")
      }

      if (user.status !== "ACTIVE") {
        throw new Error("User account is not active")
      }

      // Generate new access token
      const token = this.generateToken(user.id)

      return { token }
    } catch (error) {
      throw new Error("Invalid or expired refresh token")
    }
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "default-refresh-secret") as any

      // Log activity
      await this.logActivity("LOGOUT", decoded.id, decoded.id)

      return true
    } catch (error) {
      logger.error("Logout error:", error)
      return false
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        phone: true,
        lastLogin: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect")
    }

    // Hash new password
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 12)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    // Log activity
    await this.logActivity("PASSWORD_CHANGE", userId, userId)

    return true
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || "default-secret", {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || "default-refresh-secret", {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    })
  }

  /**
   * Log user activity
   */
  private async logActivity(action: string, entityId: string, userId: string): Promise<void> {
    try {
      await prisma.activityLog.create({
        data: {
          action,
          entity: "USER",
          entityId,
          userId,
        },
      })
    } catch (error) {
      logger.error("Error logging activity:", error)
    }
  }
}
