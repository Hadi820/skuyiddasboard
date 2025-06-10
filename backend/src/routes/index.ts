import { Router } from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
import clientRoutes from "./client.routes"
import reservationRoutes from "./reservation.routes"
import invoiceRoutes from "./invoice.routes"
import expenseRoutes from "./expense.routes"
import groRoutes from "./gro.routes"
import storRoutes from "./stor.routes"
import dashboardRoutes from "./dashboard.routes"
import uploadRoutes from "./upload.routes"
import healthRoutes from "./health.routes"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

// Public routes
router.use("/auth", authRoutes)
router.use("/health", healthRoutes)

// Protected routes
router.use("/users", authMiddleware, userRoutes)
router.use("/clients", authMiddleware, clientRoutes)
router.use("/reservations", authMiddleware, reservationRoutes)
router.use("/invoices", authMiddleware, invoiceRoutes)
router.use("/expenses", authMiddleware, expenseRoutes)
router.use("/gro", authMiddleware, groRoutes)
router.use("/stor", authMiddleware, storRoutes)
router.use("/dashboard", authMiddleware, dashboardRoutes)
router.use("/upload", authMiddleware, uploadRoutes)

export default router
