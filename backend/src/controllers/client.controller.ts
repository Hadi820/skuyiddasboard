import type { Request, Response } from "express"
import { ClientService } from "../services/client.service"
import { ReservationService } from "../services/reservation.service"
import { asyncHandler } from "../utils/asyncHandler"
import type { ClientStatus } from "@prisma/client"

export class ClientController {
  private clientService: ClientService
  private reservationService: ReservationService

  constructor() {
    this.clientService = new ClientService()
    this.reservationService = new ReservationService()
  }

  /**
   * Get all clients with filtering and pagination
   */
  getAllClients = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      status: req.query.status as ClientStatus | undefined,
      searchTerm: req.query.searchTerm as string | undefined,
      company: req.query.company as string | undefined,
    }

    const pagination = {
      page: req.query.page ? Number.parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? Number.parseInt(req.query.limit as string) : 20,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    }

    const result = await this.clientService.getAllClients(filters, pagination)

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Clients retrieved successfully",
    })
  })

  /**
   * Get client by ID
   */
  getClientById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const client = await this.clientService.getClientById(id)

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Client not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: client,
      message: "Client retrieved successfully",
    })
  })

  /**
   * Create new client
   */
  createClient = asyncHandler(async (req: Request, res: Response) => {
    const clientData = {
      ...req.body,
      createdBy: req.user?.id,
    }

    const newClient = await this.clientService.createClient(clientData)

    return res.status(201).json({
      success: true,
      data: newClient,
      message: "Client created successfully",
    })
  })

  /**
   * Update client
   */
  updateClient = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = {
      ...req.body,
      updatedBy: req.user?.id,
    }

    const updatedClient = await this.clientService.updateClient(id, updateData)

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Client not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: updatedClient,
      message: "Client updated successfully",
    })
  })

  /**
   * Delete client
   */
  deleteClient = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required",
      })
    }

    try {
      const deleted = await this.clientService.deleteClient(id, req.user.id)

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Not Found",
          message: "Client not found",
        })
      }

      return res.status(200).json({
        success: true,
        message: "Client deleted successfully",
      })
    } catch (error: any) {
      if (error.message.includes("existing reservations")) {
        return res.status(400).json({
          success: false,
          error: "Bad Request",
          message: "Cannot delete client with existing reservations",
        })
      }
      throw error
    }
  })

  /**
   * Get client reservations
   */
  getClientReservations = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const pagination = {
      page: req.query.page ? Number.parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? Number.parseInt(req.query.limit as string) : 20,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    }

    const result = await this.clientService.getClientReservations(id, pagination)

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Client reservations retrieved successfully",
    })
  })
}
