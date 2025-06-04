/**
 * Integrated Reservation Service
 * Connects frontend with backend API
 */

import { reservationApi } from "@/lib/api"
import type { Reservation } from "@/types/reservation"

export class ApiReservationService {
  /**
   * Get all reservations with filters
   */
  static async getReservations(filters?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    gro?: string
    dateFrom?: string
    dateTo?: string
    searchTerm?: string
  }): Promise<{
    data: Reservation[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const response = await reservationApi.getAll(filters)
      return response.data
    } catch (error) {
      console.error("Error fetching reservations:", error)
      throw error
    }
  }

  /**
   * Get reservation by ID
   */
  static async getReservationById(id: number): Promise<Reservation> {
    try {
      const response = await reservationApi.getById(id)
      return response.data
    } catch (error) {
      console.error("Error fetching reservation:", error)
      throw error
    }
  }

  /**
   * Create new reservation
   */
  static async createReservation(data: Omit<Reservation, "id" | "createdAt" | "updatedAt">): Promise<Reservation> {
    try {
      const response = await reservationApi.create(data)
      return response.data
    } catch (error) {
      console.error("Error creating reservation:", error)
      throw error
    }
  }

  /**
   * Update reservation
   */
  static async updateReservation(id: number, data: Partial<Reservation>): Promise<Reservation> {
    try {
      const response = await reservationApi.update(id, data)
      return response.data
    } catch (error) {
      console.error("Error updating reservation:", error)
      throw error
    }
  }

  /**
   * Delete reservation
   */
  static async deleteReservation(id: number): Promise<void> {
    try {
      await reservationApi.delete(id)
    } catch (error) {
      console.error("Error deleting reservation:", error)
      throw error
    }
  }

  /**
   * Get GRO summary
   */
  static async getGroSummary(): Promise<any> {
    try {
      const response = await reservationApi.getGroSummary()
      return response.data
    } catch (error) {
      console.error("Error fetching GRO summary:", error)
      throw error
    }
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<any> {
    try {
      const response = await reservationApi.getDashboardStats()
      return response.data
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      throw error
    }
  }

  /**
   * Export reservations
   */
  static async exportReservations(filters?: any, format: "excel" | "csv" = "excel"): Promise<Blob> {
    try {
      const response = await reservationApi.export({ ...filters, format })
      return response.data
    } catch (error) {
      console.error("Error exporting reservations:", error)
      throw error
    }
  }
}
