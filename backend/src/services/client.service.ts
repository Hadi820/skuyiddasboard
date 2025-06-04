import { prisma } from "../config/database"
import { logger } from "../utils/logger"
import type { Prisma, ClientStatus } from "@prisma/client"

export interface ClientFilters {
  status?: ClientStatus
  searchTerm?: string
  company?: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export class ClientService {
  /**
   * Get all clients with filtering and pagination
   */
  async getAllClients(filters: ClientFilters = {}, pagination: PaginationOptions = {}) {
    try {
      const { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" } = pagination

      const skip = (page - 1) * limit
      const where: Prisma.ClientWhereInput = {}

      // Apply filters
      if (filters.status) {
        where.status = filters.status
      }

      if (filters.company) {
        where.company = {
          contains: filters.company,
          mode: "insensitive",
        }
      }

      if (filters.searchTerm) {
        where.OR = [
          { name: { contains: filters.searchTerm, mode: "insensitive" } },
          { email: { contains: filters.searchTerm, mode: "insensitive" } },
          { phone: { contains: filters.searchTerm, mode: "insensitive" } },
          { company: { contains: filters.searchTerm, mode: "insensitive" } },
        ]
      }

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          include: {
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                reservations: true,
                invoices: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.client.count({ where }),
      ])

      return {
        data: clients,
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
      logger.error("Error getting clients:", error)
      throw new Error(`Failed to get clients: ${error}`)
    }
  }

  /**
   * Get client by ID
   */
  async getClientById(id: string) {
    try {
      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          reservations: {
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
              createdByUser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          invoices: {
            orderBy: { createdAt: "desc" },
            take: 10,
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

      return client
    } catch (error) {
      logger.error("Error getting client by ID:", error)
      throw new Error(`Failed to get client: ${error}`)
    }
  }

  /**
   * Create new client
   */
  async createClient(data: Prisma.ClientCreateInput) {
    try {
      const client = await prisma.client.create({
        data,
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      // Log activity
      if (data.createdBy) {
        await this.logActivity("CREATE", "CLIENT", client.id, null, client, data.createdBy)
      }

      logger.info(`Client created: ${client.name}`)
      return client
    } catch (error) {
      logger.error("Error creating client:", error)
      throw new Error(`Failed to create client: ${error}`)
    }
  }

  /**
   * Update client
   */
  async updateClient(id: string, data: Prisma.ClientUpdateInput) {
    try {
      const oldClient = await prisma.client.findUnique({ where: { id } })

      const updatedClient = await prisma.client.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
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

      // Log activity
      if (data.updatedBy && typeof data.updatedBy === "string") {
        await this.logActivity("UPDATE", "CLIENT", id, oldClient, updatedClient, data.updatedBy)
      }

      logger.info(`Client updated: ${updatedClient.name}`)
      return updatedClient
    } catch (error) {
      logger.error("Error updating client:", error)
      throw new Error(`Failed to update client: ${error}`)
    }
  }

  /**
   * Delete client
   */
  async deleteClient(id: string, deletedBy: string) {
    try {
      const client = await prisma.client.findUnique({ where: { id } })
      if (!client) {
        return false
      }

      // Check if client has reservations
      const reservationCount = await prisma.reservation.count({
        where: { clientId: id },
      })

      if (reservationCount > 0) {
        throw new Error("Cannot delete client with existing reservations")
      }

      await prisma.client.delete({ where: { id } })

      // Log activity
      await this.logActivity("DELETE", "CLIENT", id, client, null, deletedBy)

      logger.info(`Client deleted: ${client.name}`)
      return true
    } catch (error) {
      logger.error("Error deleting client:", error)
      throw new Error(`Failed to delete client: ${error}`)
    }
  }

  /**
   * Get client reservations
   */
  async getClientReservations(clientId: string, pagination: PaginationOptions = {}) {
    try {
      const { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" } = pagination

      const skip = (page - 1) * limit

      const [reservations, total] = await Promise.all([
        prisma.reservation.findMany({
          where: { clientId },
          include: {
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
        prisma.reservation.count({ where: { clientId } }),
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
      logger.error("Error getting client reservations:", error)
      throw new Error(`Failed to get client reservations: ${error}`)
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
