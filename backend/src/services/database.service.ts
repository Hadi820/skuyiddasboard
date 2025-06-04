import mongoose from "mongoose"
import { logger } from "../utils/logger"

class DatabaseService {
  private isConnected = false

  /**
   * Connect to MongoDB
   */
  async connect(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0,
      })

      this.isConnected = true
      logger.info("✅ Connected to MongoDB successfully")

      // Handle connection events
      mongoose.connection.on("error", (error) => {
        logger.error("MongoDB connection error:", error)
        this.isConnected = false
      })

      mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected")
        this.isConnected = false
      })

      mongoose.connection.on("reconnected", () => {
        logger.info("MongoDB reconnected")
        this.isConnected = true
      })
    } catch (error) {
      logger.error("Failed to connect to MongoDB:", error)
      this.isConnected = false
      throw error
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect()
      this.isConnected = false
      logger.info("Disconnected from MongoDB")
    } catch (error) {
      logger.error("Error disconnecting from MongoDB:", error)
      throw error
    }
  }

  /**
   * Check if database is healthy
   */
  isHealthy(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<any> {
    try {
      if (!this.isHealthy()) {
        return {
          status: "disconnected",
          connected: false,
        }
      }

      const admin = mongoose.connection.db.admin()
      const stats = await admin.serverStatus()

      return {
        status: "connected",
        connected: true,
        host: stats.host,
        version: stats.version,
        uptime: stats.uptime,
        connections: stats.connections,
        memory: stats.mem,
        network: stats.network,
      }
    } catch (error) {
      logger.error("Error getting database stats:", error)
      return {
        status: "error",
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Create database indexes for performance
   */
  async createIndexes(): Promise<void> {
    try {
      logger.info("Creating database indexes...")

      // User indexes
      await mongoose.connection.collection("users").createIndex({ email: 1 }, { unique: true })
      await mongoose.connection.collection("users").createIndex({ role: 1 })
      await mongoose.connection.collection("users").createIndex({ status: 1 })

      // Reservation indexes
      await mongoose.connection.collection("reservations").createIndex({ bookingCode: 1 }, { unique: true })
      await mongoose.connection.collection("reservations").createIndex({ customerName: 1 })
      await mongoose.connection.collection("reservations").createIndex({ gro: 1 })
      await mongoose.connection.collection("reservations").createIndex({ status: 1 })
      await mongoose.connection.collection("reservations").createIndex({ checkIn: 1 })
      await mongoose.connection.collection("reservations").createIndex({ checkOut: 1 })
      await mongoose.connection.collection("reservations").createIndex({ category: 1 })
      await mongoose.connection.collection("reservations").createIndex({ createdAt: -1 })

      // Client indexes
      await mongoose.connection.collection("clients").createIndex({ email: 1 }, { unique: true, sparse: true })
      await mongoose.connection.collection("clients").createIndex({ name: 1 })
      await mongoose.connection.collection("clients").createIndex({ status: 1 })

      // Compound indexes for common queries
      await mongoose.connection.collection("reservations").createIndex({ gro: 1, status: 1 })
      await mongoose.connection.collection("reservations").createIndex({ checkIn: 1, checkOut: 1 })
      await mongoose.connection.collection("reservations").createIndex({ createdAt: -1, status: 1 })

      logger.info("✅ Database indexes created successfully")
    } catch (error) {
      logger.error("Error creating database indexes:", error)
      // Don't throw error, just log it
    }
  }

  /**
   * Backup database
   */
  async backup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const backupName = `backup-${timestamp}`

      // This would typically use mongodump or a similar tool
      logger.info(`Creating database backup: ${backupName}`)

      // Implementation would depend on your backup strategy
      // For now, just return the backup name
      return backupName
    } catch (error) {
      logger.error("Error creating database backup:", error)
      throw error
    }
  }

  /**
   * Get connection info
   */
  getConnectionInfo(): any {
    return {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    }
  }
}

export const dbService = new DatabaseService()
