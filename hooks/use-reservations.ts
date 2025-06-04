"use client"

/**
 * React Hook for Reservations
 * Integrates with backend API
 */

import { useState, useEffect, useCallback } from "react"
import { ApiReservationService } from "@/services/api-reservation-service"
import type { Reservation } from "@/types/reservation"
import { useToast } from "@/components/ui/use-toast"

interface UseReservationsOptions {
  page?: number
  limit?: number
  status?: string
  category?: string
  gro?: string
  dateFrom?: string
  dateTo?: string
  searchTerm?: string
  autoFetch?: boolean
}

export function useReservations(options: UseReservationsOptions = {}) {
  const { toast } = useToast()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
  })

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await ApiReservationService.getReservations(options)
      setReservations(result.data)
      setPagination({
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      })
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch reservations"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [options, toast])

  const createReservation = useCallback(
    async (data: Omit<Reservation, "id" | "createdAt" | "updatedAt">) => {
      try {
        const newReservation = await ApiReservationService.createReservation(data)
        setReservations((prev) => [newReservation, ...prev])
        toast({
          title: "Success",
          description: "Reservation created successfully",
        })
        return newReservation
      } catch (err: any) {
        const errorMessage = err.message || "Failed to create reservation"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw err
      }
    },
    [toast],
  )

  const updateReservation = useCallback(
    async (id: number, data: Partial<Reservation>) => {
      try {
        const updatedReservation = await ApiReservationService.updateReservation(id, data)
        setReservations((prev) => prev.map((res) => (res.id === id ? updatedReservation : res)))
        toast({
          title: "Success",
          description: "Reservation updated successfully",
        })
        return updatedReservation
      } catch (err: any) {
        const errorMessage = err.message || "Failed to update reservation"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw err
      }
    },
    [toast],
  )

  const deleteReservation = useCallback(
    async (id: number) => {
      try {
        await ApiReservationService.deleteReservation(id)
        setReservations((prev) => prev.filter((res) => res.id !== id))
        toast({
          title: "Success",
          description: "Reservation deleted successfully",
        })
      } catch (err: any) {
        const errorMessage = err.message || "Failed to delete reservation"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw err
      }
    },
    [toast],
  )

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchReservations()
    }
  }, [fetchReservations, options.autoFetch])

  return {
    reservations,
    loading,
    error,
    pagination,
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    refetch: fetchReservations,
  }
}
