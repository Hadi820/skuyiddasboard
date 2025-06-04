import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import compression from "compression"
import rateLimit from "express-rate-limit"
import { config } from "dotenv"
import { dbService } from "./config/database"
import { logger } from "./utils/logger"
import { errorHandler } from "./middleware/error.middleware"
import { notFoundHandler } from "./middleware/notFound.middleware"

// Import routes
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import reservationRoutes from "./routes/reservation.routes"
import clientRoutes from "./routes/client.routes"
import invoiceRoutes from "./routes/invoice.routes"
import expenseRoutes from "./routes/expense.routes"
import dashboardRoutes from "./routes/dashboard.routes"
import groRoutes from "./routes/gro.routes"
import storRoutes from "./routes/stor.routes"
import uploadRoutes from "./routes/upload.routes"
import healthRoutes from "./routes/health.routes"

// Load environment variables
config()

const app = express()
const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(compression())
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }))
app.use(limiter)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Static files
app.use("/uploads", express.static("uploads"))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/reservations", reservationRoutes)
app.use("/api/clients", clientRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/gro", groRoutes)
app.use("/api/stor", storRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/health", healthRoutes)

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Hotel Management System API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  })
})

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
async function startServer() {
  try {
    // Connect to database
    await dbService.connect()

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📱 Frontend URL: ${process.env.FRONTEND_URL}`)
      logger.info(`🗄️  Database: PostgreSQL`)
      logger.info(`📊 Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully")
  await dbService.disconnect()
  process.exit(0)
})

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully")
  await dbService.disconnect()
  process.exit(0)
})

startServer()
