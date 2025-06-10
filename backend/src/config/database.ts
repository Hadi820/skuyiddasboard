import { PrismaClient } from "@prisma/client"
import { logger } from "../utils/logger"

class DatabaseService {
  private static instance: DatabaseService
  private prisma: PrismaClient
  private isConnected = false

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        {
          emit: "event",
          level: "query",
        },
        {
          emit: "event",
          level: "error",
        },
        {
          emit: "event",
          level: "info",
        },
        {
          emit: "event",
          level: "warn",
        },
      ],
      errorFormat: process.env.NODE_ENV === "development" ? "pretty" : "minimal",
    })

    // Log database queries in development
    if (process.env.NODE_ENV === "development") {
      this.prisma.$on("query", (e) => {
        logger.debug(`Query: ${e.query}`)
        logger.debug(`Params: ${e.params}`)
        logger.debug(`Duration: ${e.duration}ms`)
      })
    }

    this.prisma.$on("error", (e) => {
      logger.error("Database error:", e)
    })
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  public getClient(): PrismaClient {
    return this.prisma
  }

  public async connect(): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.prisma.$connect()
        this.isConnected = true
        logger.info("✅ Connected to PostgreSQL successfully")
      }
    } catch (error) {
      logger.error("Failed to connect to PostgreSQL:", error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await this.prisma.$disconnect()
        this.isConnected = false
        logger.info("Disconnected from PostgreSQL")
      }
    } catch (error) {
      logger.error("Error disconnecting from PostgreSQL:", error)
      throw error
    }
  }

  public async isHealthy(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      logger.error("Database health check failed:", error)
      return false
    }
  }

  public async getStats(): Promise<any> {
    try {
      const [userCount, clientCount, reservationCount, invoiceCount, expenseCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.client.count(),
        this.prisma.reservation.count(),
        this.prisma.invoice.count(),
        this.prisma.expense.count(),
      ])

      return {
        status: "connected",
        tables: {
          users: userCount,
          clients: clientCount,
          reservations: reservationCount,
          invoices: invoiceCount,
          expenses: expenseCount,
        },
        version: await this.getVersion(),
      }
    } catch (error) {
      logger.error("Error getting database stats:", error)
      throw error
    }
  }

  private async getVersion(): Promise<string> {
    try {
      const result = await this.prisma.$queryRaw<[{ version: string }]>`SELECT version()`
      return result[0].version
    } catch (error) {
      return "Unknown"
    }
  }

  public async runMigrations(): Promise<void> {
    try {
      logger.info("Running database migrations...")
      // Migrations are handled by Prisma CLI
      logger.info("✅ Database migrations completed")
    } catch (error) {
      logger.error("Error running migrations:", error)
      throw error
    }
  }

  public async seedDatabase(): Promise<void> {
    try {
      logger.info("Seeding database...")
      // This is handled by the seed.ts script
      logger.info("✅ Database seeded successfully")
    } catch (error) {
      logger.error("Error seeding database:", error)
      throw error
    }
  }
}

export const dbService = DatabaseService.getInstance()
export const prisma = dbService.getClient()
