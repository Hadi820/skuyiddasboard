import { Router } from "express"
import { ReservationController } from "../controllers/reservation.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import {
  validateCreateReservation,
  validateUpdateReservation,
  validateIdParam,
  validatePagination,
} from "../middleware/validation.middleware"
import asyncHandler from "express-async-handler"

const router = Router()
const reservationController = new ReservationController()

// Apply authentication middleware to all routes
router.use(authMiddleware)

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations with filtering
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PROSES, SELESAI, BATAL]
 *         description: Filter by status
 *       - in: query
 *         name: gro
 *         schema:
 *           type: string
 *         description: Filter by GRO name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [AKOMODASI, TRANSPORTASI, TRIP, EVENT, MEETING, LAINNYA]
 *         description: Filter by category
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date (YYYY-MM-DD)
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search in customer name, booking code, order details
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get("/", validatePagination, asyncHandler(reservationController.getAllReservations.bind(reservationController)))

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 */
router.get("/:id", validateIdParam, asyncHandler(reservationController.getReservationById.bind(reservationController)))

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservationDto'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  validateCreateReservation,
  asyncHandler(reservationController.createReservation.bind(reservationController)),
)

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReservationDto'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       404:
 *         description: Reservation not found
 */
router.put(
  "/:id",
  validateIdParam,
  validateUpdateReservation,
  asyncHandler(reservationController.updateReservation.bind(reservationController)),
)

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Delete reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 */
router.delete(
  "/:id",
  validateIdParam,
  asyncHandler(reservationController.deleteReservation.bind(reservationController)),
)

/**
 * @swagger
 * /api/reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PROSES, SELESAI, BATAL]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch(
  "/:id/status",
  validateIdParam,
  asyncHandler(reservationController.updateReservationStatus.bind(reservationController)),
)

/**
 * @swagger
 * /api/reservations/export:
 *   get:
 *     summary: Export reservations to Excel/CSV
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [excel, csv]
 *           default: excel
 *         description: Export format
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Export from date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Export to date
 *     responses:
 *       200:
 *         description: File exported successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export", asyncHandler(reservationController.exportReservations.bind(reservationController)))

export default router
