/**
 * Integrated Reservation Table
 * Uses backend API for data fetching and operations
 */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Filter, Search, LockIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IntegratedReservationForm } from "@/components/integrated-reservation-form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useReservations } from "@/hooks/use-reservations"
import { useAuth } from "@/hooks/use-auth"
import type { Reservation } from "@/types/reservation"

const STATUS_OPTIONS = ["all", "PENDING", "PROSES", "SELESAI", "BATAL"]
const CATEGORY_OPTIONS = [
  "all",
  "AKOMODASI",
  "TRANSPORTASI",
  "TRIP",
  "KULINER",
  "EVENT",
  "MEETING",
  "PHOTOSHOOT",
  "LAINNYA",
]

export function IntegratedReservationTable() {
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)

  // Use integrated reservations hook
  const { reservations, loading, pagination, fetchReservations, deleteReservation } = useReservations({
    page: currentPage,
    limit: pageSize,
    status: statusFilter !== "all" ? statusFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    dateFrom: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
    searchTerm: searchTerm || undefined,
  })

  // Refetch when filters change
  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
  }, [statusFilter, categoryFilter, dateFilter, searchTerm])

  useEffect(() => {
    fetchReservations()
  }, [currentPage, fetchReservations])

  const handleDeleteReservation = async (reservation: Reservation) => {
    if (window.confirm(`Are you sure you want to delete reservation ${reservation.bookingCode}?`)) {
      try {
        await deleteReservation(reservation.id)
      } catch (error) {
        console.error("Failed to delete reservation:", error)
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search reservations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All Status" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "dd MMMM yyyy", { locale: id }) : <span>Filter date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
            {dateFilter && (
              <div className="p-3 border-t border-gray-100">
                <Button variant="ghost" size="sm" onClick={() => setDateFilter(undefined)} className="w-full">
                  Reset
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Code</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">GRO</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
              <TooltipProvider>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Base Price
                    {!isAdmin && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <LockIcon className="ml-1 h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Only admin can view this column</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </th>
              </TooltipProvider>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  No reservations found
                </td>
              </tr>
            ) : (
              reservations.map((reservation, index) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">{reservation.bookingCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(reservation.checkIn), "dd MMM yyyy", { locale: id })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(reservation.checkOut), "dd MMM yyyy", { locale: id })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.orderDetails}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.gro}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.category}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(reservation.finalPrice)}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {isAdmin ? formatCurrency(reservation.basePrice || 0) : "********"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                        reservation.status === "SELESAI"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : reservation.status === "PROSES"
                            ? "bg-[#fef9c3] text-[#854d0e]"
                            : reservation.status === "PENDING"
                              ? "bg-[#dbeafe] text-[#1e40af]"
                              : "bg-[#fee2e2] text-[#991b1b]"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setShowEditForm(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReservation(reservation)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, pagination.total)} of{" "}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Form Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
          </DialogHeader>
          <IntegratedReservationForm
            reservation={selectedReservation || undefined}
            onSuccess={() => {
              setShowEditForm(false)
              setSelectedReservation(null)
              fetchReservations() // Refresh data
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
