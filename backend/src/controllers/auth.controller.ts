import type { Request, Response } from "express"
import { AuthService } from "../services/auth.service"
import { asyncHandler } from "../utils/asyncHandler"
import { logger } from "../utils/logger"

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  /**
   * Login user
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Email and password are required",
      })
    }

    try {
      const result = await this.authService.login(email, password)

      // Set refresh token in HTTP-only cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "strict",
      })

      return res.status(200).json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
        message: "Login successful",
      })
    } catch (error: any) {
      logger.error("Login error:", error)
      return res.status(401).json({
        success: false,
        error: "Authentication Failed",
        message: error.message || "Invalid credentials",
      })
    }
  })

  /**
   * Register new user
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body

    try {
      // Check if user is authorized to create users with this role
      if (req.user && req.user.role !== "ADMIN" && role !== "STAFF") {
        return res.status(403).json({
          success: false,
          error: "Forbidden",
          message: "You don't have permission to create users with this role",
        })
      }

      const user = await this.authService.register({
        name,
        email,
        password,
        role: role || "STAFF",
        createdBy: req.user?.id,
      })

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        message: "User registered successfully",
      })
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          error: "Conflict",
          message: "Email already in use",
        })
      }

      logger.error("Registration error:", error)
      return res.status(400).json({
        success: false,
        error: "Registration Failed",
        message: error.message || "Failed to register user",
      })
    }
  })

  /**
   * Refresh access token
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Refresh token is required",
      })
    }

    try {
      const result = await this.authService.refreshToken(refreshToken)

      return res.status(200).json({
        success: true,
        data: {
          token: result.token,
        },
        message: "Token refreshed successfully",
      })
    } catch (error: any) {
      logger.error("Token refresh error:", error)
      return res.status(401).json({
        success: false,
        error: "Authentication Failed",
        message: error.message || "Invalid or expired refresh token",
      })
    }
  })

  /**
   * Logout user
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken

    // Clear refresh token cookie
    res.clearCookie("refreshToken")

    if (refreshToken) {
      try {
        await this.authService.logout(refreshToken)
      } catch (error) {
        logger.error("Logout error:", error)
      }
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  })

  /**
   * Get current user profile
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required",
      })
    }

    try {
      const user = await this.authService.getUserProfile(req.user.id)

      return res.status(200).json({
        success: true,
        data: user,
        message: "User profile retrieved successfully",
      })
    } catch (error: any) {
      logger.error("Get profile error:", error)
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: error.message || "User not found",
      })
    }
  })

  /**
   * Update user password
   */
  updatePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required",
      })
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Current password and new password are required",
      })
    }

    try {
      await this.authService.updatePassword(req.user.id, currentPassword, newPassword)

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      })
    } catch (error: any) {
      logger.error("Update password error:", error)
      return res.status(400).json({
        success: false,
        error: "Update Failed",
        message: error.message || "Failed to update password",
      })
    }
  })
}
