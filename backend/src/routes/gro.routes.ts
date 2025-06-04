import { Router } from "express"
import { GroController } from "../controllers/gro.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { asyncHandler } from "../utils/asyncHandler"

const router = Router()
const groController = new GroController()

router.use(authMiddleware)

/**
 * @swagger
 * /api/gro/summary:
 *   get:
 *     summary: Get GRO performance summary
 *     tags: [GRO]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: GRO performance data
 */
router.get("/summary", asyncHandler(groController.getGroSummary.bind(groController)))

/**
 * @swagger
 * /api/gro/{groName}/reservations:
 *   get:
 *     summary: Get reservations by GRO
 *     tags: [GRO]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservations for specific GRO
 */
router.get("/:groName/reservations", asyncHandler(groController.getReservationsByGro.bind(groController)))

/**
 * @swagger
 * /api/gro/{groName}/commission:
 *   get:
 *     summary: Get GRO commission details
 *     tags: [GRO]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groName
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: GRO commission details
 */
router.get("/:groName/commission", asyncHandler(groController.getGroCommission.bind(groController)))

/**
 * @swagger
 * /api/gro/performance:
 *   get:
 *     summary: Get GRO performance analytics
 *     tags: [GRO]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [monthly, quarterly, yearly]
 *           default: monthly
 *     responses:
 *       200:
 *         description: GRO performance analytics
 */
router.get("/performance", asyncHandler(groController.getGroPerformance.bind(groController)))

export default router
