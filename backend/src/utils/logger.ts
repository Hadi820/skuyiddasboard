import winston from "winston"
import "winston-daily-rotate-file"
import path from "path"
import fs from "fs"

// Create logs directory if it doesn't exist
const logDir = process.env.LOG_DIR || "logs"
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
)

// Create file transports
const fileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "application-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
})

const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "error",
})

// Console transport with colors for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} ${level}: ${message}${Object.keys(meta).length ? " " + JSON.stringify(meta) : ""}`
  }),
)

const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
})

// Create logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: { service: "hotel-management-api" },
  transports: [fileTransport, errorFileTransport, consoleTransport],
  exitOnError: false,
})

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: path.join(logDir, "exceptions.log") }),
  new winston.transports.Console({
    format: consoleFormat,
  }),
)

logger.rejections.handle(
  new winston.transports.File({ filename: path.join(logDir, "rejections.log") }),
  new winston.transports.Console({
    format: consoleFormat,
  }),
)

// Export a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.info(message.trim())
  },
}
