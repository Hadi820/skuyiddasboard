"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  parseISO,
} from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sidebar } from "@/components/sidebar"
import { ReservationForm } from "@/components/reservation-form"
import { ExportButton } from "@/components/export-button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ReservationDetail } from "@/components/reservation-detail"
import { InvoiceGenerator } from "@/components/invoice-generator"
import { useSearchParams } from "next/navigation"
import {
  getAllReservations,
  getFilteredReservations,
  deleteReservation,
  getReservationById,
  loadReservationsFromLocalStorage,
} from "@/services/reservation-service"
import type { Reservation } from "@/types/reservation"

export default function CalendarPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false)
  const [view, setView] = useState("month")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterGro, setFilterGro] = useState("all")
  const [activeTab, setActiveTab] = useState("details")
  const [dataVersion, setDataVersion] = useState(0)
  const [reservations, setReservations] = useState<Reservation[]>([])

  // Load reservations data from localStorage on initial load
  useEffect(() => {
    loadReservationsFromLocalStorage()
    setReservations(getAllReservations())
  }, [])

  // Refresh reservations when dataVersion changes
  useEffect(() => {
    setReservations(getAllReservations())
  }, [dataVersion])

  // Check if there's an ID in the URL
  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      const reservation = getReservationById(Number.parseInt(id))
      if (reservation) {
        setSelectedReservation(reservation)
      }
    }
  }, [searchParams, dataVersion])

  // Filter reservations based on status and GRO
  const filteredReservations = getFilteredReservations({
    status: filterStatus === "all" ? undefined : filterStatus,
    gro: filterGro === "all" ? undefined : filterGro,
  })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add days from previous and next month to complete weeks
  const startDay = monthStart.getDay() // 0 = Sunday, 1 = Monday, etc.
  const endDay = monthEnd.getDay()

  const prevMonthDays =
    startDay > 0
      ? eachDayOfInterval({
          start: new Date(subMonths(monthStart, 1).getTime()),
          end: new Date(monthStart.getTime() - 86400000),
        })
      : []

  const nextMonthDays =
    endDay < 6
      ? eachDayOfInterval({
          start: new Date(monthEnd.getTime() + 86400000),
          end: new Date(monthEnd.getTime() + (6 - endDay) * 86400000),
        })
      : []

  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays]

  const getReservationsForDay = (day: Date) => {
    return filteredReservations.filter((reservation) => {
      const checkIn = parseISO(reservation.checkIn)
      const checkOut = parseISO(reservation.checkOut)
      return day >= checkIn && day <= checkOut
    })
  }

  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setActiveTab("details")
  }

  const handleAddReservation = (date?: Date) => {
    setSelectedDate(date || null)
    setShowReservationForm(true)
  }

  const handleEditReservation = () => {
    setShowEditForm(true)
  }

  const handleDeleteReservation = () => {
    if (selectedReservation) {
      const success = deleteReservation(selectedReservation.id)
      if (success) {
        toast({
          title: "Reservasi berhasil dihapus",
          description: "Data reservasi telah dihapus dari sistem.",
        })
        setSelectedReservation(null)
        setDataVersion((prev) => prev + 1) // Force re-render
      } else {
        toast({
          title: "Gagal menghapus reservasi",
          description: "Terjadi kesalahan saat menghapus data reservasi.",
          variant: "destructive",
        })
      }
    }
  }

  // Generate week view data
  const weekViewDays = Array(7)
    .fill(null)
    .map((_, i) => addDays(currentDate, i - currentDate.getDay()))

  // Get unique GRO options from reservations
  const groOptions = Array.from(new Set(getAllReservations().map((res) => res.gro))).filter(Boolean)

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Kalender</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Proses">Proses</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Batal">Batal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterGro} onValueChange={setFilterGro}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter GRO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua GRO</SelectItem>
                  {groOptions.map((gro) => (
                    <SelectItem key={gro} value={gro}>
                      {gro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ExportButton data={filteredReservations} filename="reservasi-kalender" label="Export Kalender" />
            <Button className="flex items-center gap-1" onClick={() => handleAddReservation()}>
              <Plus className="h-4 w-4" />
              Tambah Reservasi
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-medium">{format(currentDate, "MMMM yyyy", { locale: id })}</h2>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Tabs defaultValue="month" value={view} onValueChange={setView} className="mr-4">
                  <TabsList>
                    <TabsTrigger value="month">Bulan</TabsTrigger>
                    <TabsTrigger value="week">Minggu</TabsTrigger>
                    <TabsTrigger value="day">Hari</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Hari Ini
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === "month" && (
              <div className="grid grid-cols-7 gap-1">
                {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day) => (
                  <div key={day} className="text-center py-2 font-medium text-sm text-gray-500">
                    {day}
                  </div>
                ))}

                {allDays.map((day, i) => {
                  const dayReservations = getReservationsForDay(day)
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
                  const isTodayDate = isToday(day)

                  return (
                    <div
                      key={i}
                      className={`min-h-[100px] border p-1 ${isCurrentMonth ? "bg-white" : "bg-gray-50"} ${
                        isSelected ? "ring-2 ring-[#4f46e5]" : ""
                      } ${isTodayDate ? "border-[#4f46e5]" : "border-gray-200"}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-sm font-medium p-1 rounded-full w-7 h-7 flex items-center justify-center ${
                            isTodayDate ? "bg-[#4f46e5] text-white" : ""
                          } ${!isCurrentMonth ? "text-gray-400" : ""}`}
                        >
                          {format(day, "d")}
                        </span>
                        <div className="flex gap-1">
                          {dayReservations.length > 0 && (
                            <span className="text-xs bg-gray-100 rounded-full px-1.5 py-0.5">
                              {dayReservations.length}
                            </span>
                          )}
                          {isCurrentMonth && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddReservation(day)
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayReservations.slice(0, 2).map((reservation) => (
                          <div
                            key={reservation.id}
                            className={`text-xs p-1 rounded truncate cursor-pointer ${
                              reservation.status === "Selesai"
                                ? "bg-[#dcfce7] text-[#166534]"
                                : reservation.status === "Proses"
                                  ? "bg-[#fef9c3] text-[#854d0e]"
                                  : reservation.status === "Pending"
                                    ? "bg-[#dbeafe] text-[#1e40af]"
                                    : "bg-[#fee2e2] text-[#991b1b]"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReservationClick(reservation)
                            }}
                          >
                            {reservation.orderDetails}
                          </div>
                        ))}
                        {dayReservations.length > 2 && (
                          <div className="text-xs text-gray-500 pl-1">+{dayReservations.length - 2} lainnya</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {view === "week" && (
              <div className="flex flex-col">
                <div className="grid grid-cols-7 gap-1">
                  {weekViewDays.map((day, i) => (
                    <div key={i} className="text-center py-2">
                      <div className="text-sm font-medium">{format(day, "EEE", { locale: id })}</div>
                      <div
                        className={`text-lg font-semibold rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                          isToday(day) ? "bg-[#4f46e5] text-white" : ""
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 mt-2">
                  {weekViewDays.map((day, i) => {
                    const dayReservations = getReservationsForDay(day)
                    return (
                      <div key={i} className="min-h-[400px] border border-gray-200 p-2 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 absolute top-1 right-1 rounded-full"
                          onClick={() => handleAddReservation(day)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {dayReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className={`text-sm p-2 mb-2 rounded cursor-pointer ${
                              reservation.status === "Selesai"
                                ? "bg-[#dcfce7] text-[#166534]"
                                : reservation.status === "Proses"
                                  ? "bg-[#fef9c3] text-[#854d0e]"
                                  : reservation.status === "Pending"
                                    ? "bg-[#dbeafe] text-[#1e40af]"
                                    : "bg-[#fee2e2] text-[#991b1b]"
                            }`}
                            onClick={() => handleReservationClick(reservation)}
                          >
                            <div className="font-medium">{reservation.orderDetails}</div>
                            <div className="text-xs mt-1">
                              {format(parseISO(reservation.checkIn), "HH:mm")} -{" "}
                              {format(parseISO(reservation.checkOut), "HH:mm")}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {view === "day" && (
              <div className="flex flex-col">
                <div className="text-center py-4">
                  <div className="text-xl font-medium">{format(currentDate, "EEEE", { locale: id })}</div>
                  <div className="text-3xl font-bold">{format(currentDate, "d MMMM yyyy", { locale: id })}</div>
                  <Button className="mt-2" onClick={() => handleAddReservation(currentDate)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Reservasi
                  </Button>
                </div>
                <div className="border border-gray-200 rounded-md mt-4">
                  {Array.from({ length: 24 }).map((_, hour) => {
                    const hourReservations = filteredReservations.filter((res) => {
                      const startHour = parseISO(res.checkIn).getHours()
                      return startHour === hour && isSameDay(parseISO(res.checkIn), currentDate)
                    })

                    return (
                      <div key={hour} className="flex border-b border-gray-200 last:border-b-0">
                        <div className="w-16 py-2 px-2 text-right text-sm text-gray-500 border-r border-gray-200">
                          {hour}:00
                        </div>
                        <div className="flex-1 min-h-[60px] p-1 relative">
                          {hourReservations.map((reservation) => (
                            <div
                              key={reservation.id}
                              className={`text-sm p-2 mb-1 rounded cursor-pointer ${
                                reservation.status === "Selesai"
                                  ? "bg-[#dcfce7] text-[#166534]"
                                  : reservation.status === "Proses"
                                    ? "bg-[#fef9c3] text-[#854d0e]"
                                    : reservation.status === "Pending"
                                      ? "bg-[#dbeafe] text-[#1e40af]"
                                      : "bg-[#fee2e2] text-[#991b1b]"
                              }`}
                              onClick={() => handleReservationClick(reservation)}
                            >
                              <div className="font-medium">{reservation.orderDetails}</div>
                              <div className="text-xs mt-1">
                                {format(parseISO(reservation.checkIn), "HH:mm")} -{" "}
                                {format(parseISO(reservation.checkOut), "HH:mm")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Reservation Dialog */}
        <Dialog open={showReservationForm} onOpenChange={setShowReservationForm}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Tambah Reservasi Baru</DialogTitle>
            </DialogHeader>
            <ReservationForm
              selectedDate={selectedDate || undefined}
              onSuccess={() => {
                setShowReservationForm(false)
                setDataVersion((prev) => prev + 1) // Force re-render
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Reservation Detail Dialog */}
        {selectedReservation && (
          <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Detail Reservasi</DialogTitle>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Detail</TabsTrigger>
                  <TabsTrigger value="invoice">Invoice</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <ReservationDetail reservation={selectedReservation} />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="destructive" onClick={handleDeleteReservation}>
                      Hapus
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedReservation(null)}>
                      Tutup
                    </Button>
                    <Button onClick={handleEditReservation}>Edit Reservasi</Button>
                  </div>
                </TabsContent>

                <TabsContent value="invoice">
                  <InvoiceGenerator reservation={selectedReservation} onSuccess={() => setSelectedReservation(null)} />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Reservation Dialog */}
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
                setDataVersion((prev) => prev + 1) // Force re-render
              }}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
