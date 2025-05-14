"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Filter, Search, LockIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReservationForm } from "@/components/reservation-form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getFilteredReservations } from "@/services/reservation-service"

// Daftar Status
const STATUS_OPTIONS = ["all", "Pending", "Proses", "Selesai", "Batal"]

// Daftar Kategori
const CATEGORY_OPTIONS = [
  "all",
  "Akomodasi",
  "Transportasi",
  "Trip",
  "Kuliner",
  "Event",
  "Meeting",
  "Photoshoot",
  "Lainnya",
]

export function ReservationTable() {
  const [isAdmin, setIsAdmin] = useState(true) // Default to true until we check
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [reservations, setReservations] = useState<any[]>([])

  useEffect(() => {
    // Check if user is admin from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        setIsAdmin(userData.role === "admin")
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  // Load and filter reservations
  useEffect(() => {
    setReservations(
      getFilteredReservations({
        status: statusFilter !== "all" ? statusFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        date: dateFilter,
        searchTerm: searchTerm,
      }),
    )
  }, [statusFilter, categoryFilter, dateFilter, searchTerm])

  // Filter reservations based on search term, status, category, and date
  // const filteredReservations = reservationsData.filter((reservation) => {
  //   const matchesSearch =
  //     reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     reservation.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     reservation.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     reservation.orderDetails.toLowerCase().includes(searchTerm.toLowerCase())

  //   const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

  //   const matchesCategory = categoryFilter === "all" || reservation.category === categoryFilter

  //   const matchesDate =
  //     !dateFilter || (new Date(reservation.checkIn) <= dateFilter && new Date(reservation.checkOut) >= dateFilter)

  //   return matchesSearch && matchesStatus && matchesCategory && matchesDate
  // })

  // Sort reservations by booking date (newest first)
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
  )

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Cari reservasi..."
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
                {status === "all" ? "Semua Status" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter kategori" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "Semua Kategori" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "dd MMMM yyyy", { locale: id }) : <span>Filter tanggal</span>}
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Booking</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Booking</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pemesan</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Detail Pesanan</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">GRO</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Jadi</th>
              <TooltipProvider>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Harga Stor
                    {!isAdmin && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <LockIcon className="ml-1 h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hanya admin yang dapat melihat kolom ini</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </th>
              </TooltipProvider>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedReservations.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada reservasi yang ditemukan
                </td>
              </tr>
            ) : (
              sortedReservations.map((reservation, index) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">
                    <Link href={`/calendar?id=${reservation.id}`}>{reservation.bookingCode}</Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {format(new Date(reservation.bookingDate), "dd MMM yyyy", { locale: id })}
                  </td>
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
                    {isAdmin ? formatCurrency(reservation.basePrice) : "********"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                        reservation.status === "Selesai"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : reservation.status === "Proses"
                            ? "bg-[#fef9c3] text-[#854d0e]"
                            : reservation.status === "Pending"
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/calendar?id=${reservation.id}`}>Detail</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Reservasi</DialogTitle>
          </DialogHeader>
          <ReservationForm
            reservation={selectedReservation}
            onSuccess={() => {
              setShowEditForm(false)
              setSelectedReservation(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
