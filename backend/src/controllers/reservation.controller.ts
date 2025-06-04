import type { Request, Response } from "express"
import { ReservationService } from "../services/reservation.service"
import { asyncHandler } from "../utils/asyncHandler"
import { ExportService } from "../services/export.service"
import type { ReservationStatus, ReservationCategory } from "@prisma/client"

export class ReservationController {
  private reservationService: ReservationService
  private exportService: ExportService

  constructor() {
    this.reservationService = new ReservationService()
    this.exportService = new ExportService()
  }

  /**
   * Get all reservations with filtering and pagination
   */
  getAllReservations = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      status: req.query.status as ReservationStatus | undefined,
      gro: req.query.gro as string | undefined,
      category: req.query.category as ReservationCategory | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
      searchTerm: req.query.searchTerm as string | undefined,
      clientId: req.query.clientId as string | undefined,
    }

    const pagination = {
      page: req.query.page ? Number.parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? Number.parseInt(req.query.limit as string) : 20,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    }

    const result = await this.reservationService.getAllReservations(filters, pagination)

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Reservations retrieved successfully",
    })
  })

  /**
   * Get reservation by ID
   */
  getReservationById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const reservation = await this.reservationService.getReservationById(id)

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Reservation not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: reservation,
      message: "Reservation retrieved successfully",
    })
  })

  /**
   * Create new reservation
   */
  createReservation = asyncHandler(async (req: Request, res: Response) => {
    const reservationData = {
      ...req.body,
      createdBy: req.user?.id,
    }

    // Convert string values to appropriate types
    if (reservationData.checkIn) reservationData.checkIn = new Date(reservationData.checkIn)
    if (reservationData.checkOut) reservationData.checkOut = new Date(reservationData.checkOut)
    if (reservationData.finalPrice) reservationData.finalPrice = Number.parseFloat(reservationData.finalPrice)
    if (reservationData.customerDeposit)
      reservationData.customerDeposit = Number.parseFloat(reservationData.customerDeposit)
    if (reservationData.basePrice) reservationData.basePrice = Number.parseFloat(reservationData.basePrice)

    const newReservation = await this.reservationService.createReservation(reservationData)

    return res.status(201).json({
      success: true,
      data: newReservation,
      message: "Reservation created successfully",
    })
  })

  /**
   * Update reservation
   */
  updateReservation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = {
      ...req.body,
      updatedBy: req.user?.id,
    }

    // Convert string values to appropriate types
    if (updateData.checkIn) updateData.checkIn = new Date(updateData.checkIn)
    if (updateData.checkOut) updateData.checkOut = new Date(updateData.checkOut)
    if (updateData.finalPrice) updateData.finalPrice = Number.parseFloat(updateData.finalPrice)
    if (updateData.customerDeposit) updateData.customerDeposit = Number.parseFloat(updateData.customerDeposit)
    if (updateData.basePrice) updateData.basePrice = Number.parseFloat(updateData.basePrice)

    const updatedReservation = await this.reservationService.updateReservation(id, updateData)

    if (!updatedReservation) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Reservation not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: updatedReservation,
      message: "Reservation updated successfully",
    })
  })

  /**
   * Delete reservation
   */
  deleteReservation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required",
      })
    }

    const deleted = await this.reservationService.deleteReservation(id, req.user.id)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Reservation not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
    })
  })

  /**
   * Update reservation status
   */
  updateReservationStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { status, notes } = req.body

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required",
      })
    }

    const updatedReservation = await this.reservationService.updateReservation(id, {
      status: status as ReservationStatus,
      notes,
      updatedBy: req.user.id,
    })

    if (!updatedReservation) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Reservation not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: updatedReservation,
      message: "Reservation status updated successfully",
    })
  })

  /**
   * Export reservations to Excel/CSV
   */
  exportReservations = asyncHandler(async (req: Request, res: Response) => {
    const format = (req.query.format as string) || "excel"
    const filters = {
      status: req.query.status as ReservationStatus | undefined,
      gro: req.query.gro as string | undefined,
      category: req.query.category as ReservationCategory | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
    }

    const result = await this.reservationService.getAllReservations(filters)
    const buffer = await this.exportService.exportReservations(result.data, format)

    const filename = `reservations_${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : "csv"}`

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.setHeader(
      "Content-Type",
      format === "excel" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv",
    )

    return res.send(buffer)
  })

  /**
   * Get GRO performance summary
   */
  getGroSummary = asyncHandler(async (req: Request, res: Response) => {
    const groSummary = await this.reservationService.getGroSummary()

    return res.status(200).json({
      success: true,
      data: groSummary,
      message: "GRO summary retrieved successfully",
    })
  })

  /**
   * Get dashboard statistics
   */
  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.reservationService.getDashboardStats()

    return res.status(200).json({
      success: true,
      data: stats,
      message: "Dashboard statistics retrieved successfully",
    })
  })
}
