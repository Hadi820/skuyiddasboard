import { prisma } from "../config/database"
import { logger } from "../utils/logger"
import type { Prisma, ReservationStatus, ReservationCategory } from "@prisma/client"

export interface ReservationFilters {
  status?: ReservationStatus
  gro?: string
  category?: ReservationCategory
  dateFrom?: string
  dateTo?: string
  searchTerm?: string
  clientId?: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export class ReservationService {
  /**
   * Get all reservations with filtering and pagination
   */
  async getAllReservations(filters: ReservationFilters = {}, pagination: PaginationOptions = {}) {
    try {
      const { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" } = pagination

      const skip = (page - 1) * limit
      const where: Prisma.ReservationWhereInput = {}

      // Apply filters
      if (filters.status) {
        where.status = filters.status
      }

      if (filters.gro) {
        where.gro = {
          contains: filters.gro,
          mode: "insensitive",
        }
      }

      if (filters.category) {
        where.category = filters.category
      }

      if (filters.clientId) {
        where.clientId = filters.clientId
      }

      if (filters.dateFrom || filters.dateTo) {
        where.checkIn = {}
        if (filters.dateFrom) {
          where.checkIn.gte = new Date(filters.dateFrom)
        }
        if (filters.dateTo) {
          where.checkIn.lte = new Date(filters.dateTo)
        }
      }

      if (filters.searchTerm) {
        where.OR = [
          { customerName: { contains: filters.searchTerm, mode: "insensitive" } },
          { bookingCode: { contains: filters.searchTerm, mode: "insensitive" } },
          { orderDetails: { contains: filters.searchTerm, mode: "insensitive" } },
          { notes: { contains: filters.searchTerm, mode: "insensitive" } },
        ]
      }

      const [reservations, total] = await Promise.all([
        prisma.reservation.findMany({
          where,
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                company: true,
              },
            },
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.reservation.count({ where }),
      ])

      return {
        data: reservations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      logger.error("Error getting reservations:", error)
      throw new Error(`Failed to get reservations: ${error}`)
    }
  }

  /**
   * Get reservation by ID
   */
  async getReservationById(id: string) {
    try {
      const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          client: true,
          invoices: {
            include: {
              payments: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          updatedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return reservation
    } catch (error) {
      logger.error("Error getting reservation by ID:", error)
      throw new Error(`Failed to get reservation: ${error}`)
    }
  }

  /**
   * Create new reservation
   */
  async createReservation(data: Prisma.ReservationCreateInput) {
    try {
      // Generate booking code if not provided
      if (!data.bookingCode) {
        data.bookingCode = await this.generateBookingCode()
      }

      const reservation = await prisma.reservation.create({
        data,
        include: {
          client: true,
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      // Update client statistics if clientId is provided
      if (reservation.clientId) {
        await this.updateClientStats(reservation.clientId)
      }

      // Log activity
      if (data.createdBy) {
        await this.logActivity("CREATE", "RESERVATION", reservation.id, null, reservation, data.createdBy)
      }

      logger.info(`Reservation created: ${reservation.bookingCode}`)
      return reservation
    } catch (error) {
      logger.error("Error creating reservation:", error)
      throw new Error(`Failed to create reservation: ${error}`)
    }
  }

  /**
   * Update reservation
   */
  async updateReservation(id: string, data: Prisma.ReservationUpdateInput) {
    try {
      const oldReservation = await prisma.reservation.findUnique({ where: { id } })

      const updatedReservation = await prisma.reservation.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          client: true,
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          updatedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      // Update client statistics if clientId exists
      if (updatedReservation.clientId) {
        await this.updateClientStats(updatedReservation.clientId)
      }

      // Log activity
      if (data.updatedBy && typeof data.updatedBy === "string") {
        await this.logActivity("UPDATE", "RESERVATION", id, oldReservation, updatedReservation, data.updatedBy)
      }

      logger.info(`Reservation updated: ${updatedReservation.bookingCode}`)
      return updatedReservation
    } catch (error) {
      logger.error("Error updating reservation:", error)
      throw new Error(`Failed to update reservation: ${error}`)
    }
  }

  /**
   * Delete reservation
   */
  async deleteReservation(id: string, deletedBy: string) {
    try {
      const reservation = await prisma.reservation.findUnique({ where: { id } })
      if (!reservation) {
        return false
      }

      const clientId = reservation.clientId

      await prisma.reservation.delete({ where: { id } })

      // Update client statistics if clientId exists
      if (clientId) {
        await this.updateClientStats(clientId)
      }

      // Log activity
      await this.logActivity("DELETE", "RESERVATION", id, reservation, null, deletedBy)

      logger.info(`Reservation deleted: ${reservation.bookingCode}`)
      return true
    } catch (error) {
      logger.error("Error deleting reservation:", error)
      throw new Error(`Failed to delete reservation: ${error}`)
    }
  }

  /**
   * Get GRO performance summary
   */
  async getGroSummary() {
    try {
      const groStats = await prisma.reservation.groupBy({
        by: ["gro"],
        where: {
          gro: {
            not: null,
          },
        },
        _count: {
          id: true,
        },
        _sum: {
          finalPrice: true,
        },
        _avg: {
          finalPrice: true,
        },
      })

      const groSummary = await Promise.all(
        groStats.map(async (stat) => {
          const [completed, pending, cancelled] = await Promise.all([
            prisma.reservation.count({
              where: { gro: stat.gro, status: "SELESAI" },
            }),
            prisma.reservation.count({
              where: { gro: stat.gro, status: "PENDING" },
            }),
            prisma.reservation.count({
              where: { gro: stat.gro, status: "BATAL" },
            }),
          ])

          return {
            gro: stat.gro,
            totalReservations: stat._count.id,
            totalRevenue: stat._sum.finalPrice || 0,
            averageRevenue: stat._avg.finalPrice || 0,
            completedReservations: completed,
            pendingReservations: pending,
            cancelledReservations: cancelled,
          }
        }),
      )

      return groSummary.sort((a, b) => Number(b.totalRevenue) - Number(a.totalRevenue))
    } catch (error) {
      logger.error("Error getting GRO summary:", error)
      throw new Error(`Failed to get GRO summary: ${error}`)
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const [totalReservations, totalRevenue, pendingReservations, completedReservations, monthlyStats] =
        await Promise.all([
          prisma.reservation.count(),
          prisma.reservation.aggregate({
            _sum: { finalPrice: true },
          }),
          prisma.reservation.count({ where: { status: "PENDING" } }),
          prisma.reservation.count({ where: { status: "SELESAI" } }),
          prisma.reservation.aggregate({
            where: {
              createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              },
            },
            _sum: { finalPrice: true },
            _count: { id: true },
          }),
        ])

      return {
        totalReservations,
        totalRevenue: totalRevenue._sum.finalPrice || 0,
        pendingReservations,
        completedReservations,
        monthlyRevenue: monthlyStats._sum.finalPrice || 0,
        monthlyReservations: monthlyStats._count.id || 0,
      }
    } catch (error) {
      logger.error("Error getting dashboard stats:", error)
      throw new Error(`Failed to get dashboard stats: ${error}`)
    }
  }

  /**
   * Generate unique booking code
   */
  private async generateBookingCode(): Promise<string> {
    const prefix = "BK"
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")

    // Get count of reservations today
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const todayCount = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    const sequence = String(todayCount + 1).padStart(3, "0")
    return `${prefix}-${date}-${sequence}`
  }

  /**
   * Update client statistics
   */
  private async updateClientStats(clientId: string): Promise<void> {
    try {
      const stats = await prisma.reservation.aggregate({
        where: { clientId },
        _count: { id: true },
        _sum: { finalPrice: true },
        _max: { createdAt: true },
      })

      await prisma.client.update({
        where: { id: clientId },
        data: {
          totalReservations: stats._count.id,
          totalRevenue: stats._sum.finalPrice || 0,
          lastReservation: stats._max.createdAt,
        },
      })
    } catch (error) {
      logger.error("Error updating client stats:", error)
    }
  }

  /**
   * Log activity
   */
  private async logActivity(
    action: string,
    entity: string,
    entityId: string,
    oldData: any,
    newData: any,
    userId: string,
  ): Promise<void> {
    try {
      await prisma.activityLog.create({
        data: {
          action,
          entity,
          entityId,
          oldData: oldData || undefined,
          newData: newData || undefined,
          userId,
        },
      })
    } catch (error) {
      logger.error("Error logging activity:", error)
    }
  }
}
