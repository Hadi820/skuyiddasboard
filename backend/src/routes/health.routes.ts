import { Router } from "express"
import { dbService } from "../services/database.service"
import { asyncHandler } from "../utils/asyncHandler"

const router = Router()

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is unhealthy
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      database: {
        status: "unknown",
        connected: false,
      },
      memory: process.memoryUsage(),
    }

    try {
      // Check database connection
      if (dbService.isHealthy()) {
        health.database.status = "connected"
        health.database.connected = true
      } else {
        health.database.status = "disconnected"
        health.database.connected = false
        health.status = "degraded"
      }

      const statusCode = health.status === "ok" ? 200 : 503
      res.status(statusCode).json(health)
    } catch (error) {
      health.status = "error"
      health.database.status = "error"
      res.status(503).json(health)
    }
  }),
)

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check with database stats
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 */
router.get(
  "/detailed",
  asyncHandler(async (req, res) => {
    try {
      const dbStats = await dbService.getStats()

      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: process.env.npm_package_version || "1.0.0",
        database: dbStats,
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      })
    } catch (error) {
      res.status(503).json({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })
    }
  }),
)

export default router
