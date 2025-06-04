import type { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"

/**
 * Global error handler middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log error
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: req.user?.id || "anonymous",
  })

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "A record with this data already exists",
        details: err.meta?.target || [],
      })
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Record not found",
      })
    }
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: err.message,
      details: err.errors,
    })
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Invalid or expired token",
    })
  }

  // Default error response
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    error: err.name || "Error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}
