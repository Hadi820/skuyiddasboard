import { Router } from "express"
import { DashboardController } from "../controllers/dashboard.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { asyncHandler } from "../utils/asyncHandler"

const router = Router()
const dashboardController = new DashboardController()

router.use(authMiddleware)

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/stats", asyncHandler(dashboardController.getDashboardStats.bind(dashboardController)))

/**
 * @swagger
 * /api/dashboard/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *           default: monthly
 *     responses:
 *       200:
 *         description: Revenue analytics data
 */
router.get("/revenue", asyncHandler(dashboardController.getRevenueAnalytics.bind(dashboardController)))

/**
 * @swagger
 * /api/dashboard/recent-activities:
 *   get:
 *     summary: Get recent activities
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent activities
 */
router.get("/recent-activities", asyncHandler(dashboardController.getRecentActivities.bind(dashboardController)))

export default router
