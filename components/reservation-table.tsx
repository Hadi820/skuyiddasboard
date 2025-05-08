"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Filter, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReservationForm } from "@/components/reservation-form"
import { ReservationDetail } from "@/components/reservation-detail"
import { useToast } from "@/components/ui/use-toast"
import { getFilteredReservations } from "@/services/reservation-service"

export function ReservationTable() {
  const { toast } = useToast()
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showReservationDetail, setShowReservationDetail] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [groFilter, setGroFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [reservations, setReservations] = useState<any[]>([])
  const [selectedReservation, setSelectedReservation] = useState<any>(null)

  // Load reservations
  useEffect(() => {
    loadReservations()
  }, [statusFilter, categoryFilter, dateFilter, groFilter, searchTerm])

  const loadReservations = () => {
    const filteredReservations = getFilteredReservations({
      status: statusFilter === "all" ? undefined : statusFilter,
      category: categoryFilter === "all" ? undefined : categoryFilter,
      date: dateFilter,
      searchTerm: searchTerm,
      gro: groFilter === "all" ? undefined : groFilter,
    })
    setReservations(filteredReservations)
  }

  const handleViewReservation = (reservation: any) => {
    setSelectedReservation(reservation)
    setShowReservationDetail(true)
  }

  const handleEditReservation = (reservation: any) => {
    setSelectedReservation(reservation)
    setShowReservationForm(true)
  }

  const handleFormSuccess = () => {
    setShowReservationForm(false)
    setSelectedReservation(null)
    loadReservations()
  }

  const handleDetailClose = () => {
    setShowReservationDetail(false)
    setSelectedReservation(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Terkonfirmasi</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Dibatalkan</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Selesai</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Lunas</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Sebagian</Badge>
      case "unpaid":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Belum Dibayar</Badge>
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Dikembalikan</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Cari reservasi..."
            className="pl-8 w-full md:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="confirmed">Terkonfirmasi</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="tour">Tour</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groFilter} onValueChange={setGroFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Admin Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Admin Staff</SelectItem>
              <SelectItem value="Admin Staff 1">Admin Staff 1</SelectItem>
              <SelectItem value="Admin Staff 2">Admin Staff 2</SelectItem>
              <SelectItem value="Admin Staff 3">Admin Staff 3</SelectItem>
              <SelectItem value="Admin Staff 4">Admin Staff 4</SelectItem>
              <SelectItem value="Admin Staff 5">Admin Staff 5</SelectItem>
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
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Booking</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pembayaran</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Staff</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada reservasi yang ditemukan
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">{reservation.bookingCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{reservation.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(reservation.checkIn), "dd MMM yyyy", { locale: id })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(reservation.checkOut), "dd MMM yyyy", { locale: id })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 capitalize">{reservation.category}</td>
                  <td className="px-4 py-3">{getStatusBadge(reservation.status)}</td>
                  <td className="px-4 py-3">{getPaymentStatusBadge(reservation.paymentStatus)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{reservation.gro}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewReservation(reservation)}>
                        Detail
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditReservation(reservation)}>
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={showReservationForm} onOpenChange={setShowReservationForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedReservation ? "Edit Reservasi" : "Buat Reservasi Baru"}</DialogTitle>
          </DialogHeader>
          <ReservationForm reservation={selectedReservation} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={showReservationDetail} onOpenChange={setShowReservationDetail}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Reservasi</DialogTitle>
          </DialogHeader>
          {selectedReservation && <ReservationDetail reservation={selectedReservation} onClose={handleDetailClose} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
