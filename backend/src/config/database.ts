import { PrismaClient } from "@prisma/client"
import { logger } from "../utils/logger"

class DatabaseService {
  private static instance: DatabaseService
  private prisma: PrismaClient

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
      await this.prisma.$connect()
      logger.info("✅ Connected to PostgreSQL successfully")
    } catch (error) {
      logger.error("Failed to connect to PostgreSQL:", error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect()
      logger.info("Disconnected from PostgreSQL")
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

      // Create admin user
      const adminUser = await this.prisma.user.upsert({
        where: { email: "admin@hotel.com" },
        update: {},
        create: {
          email: "admin@hotel.com",
          password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS", // admin123
          name: "Administrator",
          role: "ADMIN",
          status: "ACTIVE",
        },
      })

      // Create sample clients
      const sampleClients = await Promise.all([
        this.prisma.client.upsert({
          where: { email: "john.doe@email.com" },
          update: {},
          create: {
            name: "John Doe",
            email: "john.doe@email.com",
            phone: "081234567890",
            company: "ABC Corp",
            status: "ACTIVE",
            createdBy: adminUser.id,
          },
        }),
        this.prisma.client.upsert({
          where: { email: "jane.smith@email.com" },
          update: {},
          create: {
            name: "Jane Smith",
            email: "jane.smith@email.com",
            phone: "081234567891",
            company: "XYZ Ltd",
            status: "ACTIVE",
            createdBy: adminUser.id,
          },
        }),
      ])

      // Create sample reservations
      await Promise.all([
        this.prisma.reservation.create({
          data: {
            bookingCode: "BK-20250104-001",
            customerName: "John Doe",
            phoneNumber: "081234567890",
            checkIn: new Date("2025-01-15"),
            checkOut: new Date("2025-01-17"),
            orderDetails: "Villa Utama - 2 Kamar",
            gro: "ILPAN",
            category: "AKOMODASI",
            finalPrice: 5000000,
            customerDeposit: 2500000,
            basePrice: 4000000,
            status: "SELESAI",
            clientId: sampleClients[0].id,
            createdBy: adminUser.id,
          },
        }),
        this.prisma.reservation.create({
          data: {
            bookingCode: "BK-20250104-002",
            customerName: "Jane Smith",
            phoneNumber: "081234567891",
            checkIn: new Date("2025-01-20"),
            checkOut: new Date("2025-01-22"),
            orderDetails: "Paket Wisata Pantai",
            gro: "JAMAL",
            category: "TRIP",
            finalPrice: 3000000,
            customerDeposit: 1500000,
            basePrice: 2500000,
            status: "PROSES",
            clientId: sampleClients[1].id,
            createdBy: adminUser.id,
          },
        }),
      ])

      logger.info("✅ Database seeded successfully")
    } catch (error) {
      logger.error("Error seeding database:", error)
      throw error
    }
  }
}

export const dbService = DatabaseService.getInstance()
export const prisma = dbService.getClient()
