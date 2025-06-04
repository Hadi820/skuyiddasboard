import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../config/database"
import { logger } from "../utils/logger"

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
        name: string
      }
    }
  }
}

/**
 * Authentication middleware to verify JWT token
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication token is required",
      })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret") as any

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        status: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User not found",
      })
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "User account is not active",
      })
    }

    // Set user in request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }

    next()
  } catch (error) {
    logger.error("Authentication error:", error)
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Invalid or expired token",
    })
  }
}

/**
 * Role-based authorization middleware
 * @param roles Array of allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required",
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You don't have permission to access this resource",
      })
    }

    next()
  }
}
