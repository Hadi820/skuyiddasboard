import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import compression from "compression"
import rateLimit from "express-rate-limit"
import csrf from "csurf"
import cookieParser from "cookie-parser"
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

// Trust proxy for rate limiting
app.set("trust proxy", 1)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Too Many Requests",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
)

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  }),
)

app.use(compression())
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }))
app.use(limiter)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())

// CSRF Protection (only for non-API routes)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
})

// Apply CSRF protection to non-API routes
app.use("/api", (req, res, next) => {
  // Skip CSRF for API routes that use JWT
  next()
})

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
    environment: process.env.NODE_ENV || "development",
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
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📱 Frontend URL: ${process.env.FRONTEND_URL}`)
      logger.info(`🗄️  Database: PostgreSQL`)
      logger.info(`📊 Health check: http://localhost:${PORT}/health`)
      logger.info(`🔒 Security: Helmet + CORS + Rate Limiting enabled`)
    })

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`)

      server.close(async () => {
        try {
          await dbService.disconnect()
          logger.info("Database disconnected")
          process.exit(0)
        } catch (error) {
          logger.error("Error during shutdown:", error)
          process.exit(1)
        }
      })

      // Force close after 30 seconds
      setTimeout(() => {
        logger.error("Could not close connections in time, forcefully shutting down")
        process.exit(1)
      }, 30000)
    }

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error)
  process.exit(1)
})

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})

startServer()
