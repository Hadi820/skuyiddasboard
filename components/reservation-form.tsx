"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Loader2, LockIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { addReservation, updateReservation } from "@/services/reservation-service"
import { isAdmin } from "@/services/auth-service"
import type { Reservation } from "@/types/reservation"

interface ReservationFormProps {
  reservation?: any
  onSuccess?: () => void
  selectedDate?: Date
}

// Daftar GRO
const GRO_OPTIONS = ["ILPAN", "JAMAL", "BANG NUNG", "DEWI", "SANTI", "RINI", "BUDI", "ANDI"]

// Daftar Kategori
const CATEGORY_OPTIONS = ["Akomodasi", "Transportasi", "Trip", "Kuliner", "Event", "Meeting", "Photoshoot", "Lainnya"]

// Daftar Status
const STATUS_OPTIONS = ["Pending", "Proses", "Selesai", "Batal"]

export function ReservationForm({ reservation, onSuccess, selectedDate }: ReservationFormProps) {
  const { toast } = useToast()
  const [userIsAdmin, setUserIsAdmin] = useState(true) // Default to true until we check
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    bookingCode: "",
    bookingDate: new Date().toISOString().split("T")[0],
    customerName: "",
    phoneNumber: "",
    checkIn: selectedDate || new Date(),
    checkOut: selectedDate
      ? new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    tripSchedule: "",
    orderDetails: "",
    gro: "",
    category: "Akomodasi",
    finalPrice: "",
    customerDeposit: "",
    partnerDeposit: "",
    basePrice: "",
    status: "Pending",
    notes: "",
  })

  useEffect(() => {
    // Check if user is admin
    setUserIsAdmin(isAdmin())
  }, [])

  useEffect(() => {
    if (reservation) {
      // Convert string dates to Date objects for the form
      const checkInDate = new Date(reservation.checkIn)
      const checkOutDate = new Date(reservation.checkOut)

      setFormData({
        bookingCode: reservation.bookingCode || "",
        bookingDate: reservation.bookingDate || new Date().toISOString().split("T")[0],
        customerName: reservation.customerName || "",
        phoneNumber: reservation.phoneNumber || "",
        checkIn: checkInDate,
        checkOut: checkOutDate,
        tripSchedule: reservation.tripSchedule || "",
        orderDetails: reservation.orderDetails || "",
        gro: reservation.gro || "",
        category: reservation.category || "Akomodasi",
        finalPrice: reservation.finalPrice?.toString() || "",
        customerDeposit: reservation.customerDeposit?.toString() || "",
        partnerDeposit: reservation.partnerDeposit?.toString() || "",
        basePrice: reservation.basePrice?.toString() || "",
        status: reservation.status || "Pending",
        notes: reservation.notes || "",
      })
    } else if (selectedDate) {
      // If a date was selected from the calendar, use it for check-in
      setFormData((prev) => ({
        ...prev,
        checkIn: selectedDate,
        checkOut: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Default to next day checkout
      }))
    } else {
      // Generate a new booking code for new reservations
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      setFormData((prev) => ({
        ...prev,
        bookingCode: `BK-${year}${month}${day}-${randomNum}`,
      }))
    }
  }, [reservation, selectedDate])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.customerName || !formData.category || !formData.finalPrice) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua field yang diperlukan.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Calculate derived values
    const finalPrice = Number(formData.finalPrice)
    const customerDeposit = Number(formData.customerDeposit)
    const basePrice = Number(formData.basePrice)
    const profit = finalPrice - basePrice
    const remainingPayment = finalPrice - customerDeposit

    // Format dates to ISO string for storage
    const checkInStr = formData.checkIn.toISOString().split("T")[0]
    const checkOutStr = formData.checkOut.toISOString().split("T")[0]

    // Create reservation data object
    const reservationData = {
      bookingCode: formData.bookingCode,
      bookingDate: formData.bookingDate,
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      tripSchedule: formData.tripSchedule || null,
      orderDetails: formData.orderDetails,
      gro: formData.gro,
      category: formData.category,
      finalPrice,
      customerDeposit,
      partnerDeposit: Number(formData.partnerDeposit),
      remainingPayment,
      basePrice,
      profit,
      status: formData.status as "Pending" | "Proses" | "Selesai" | "Batal",
      notes: formData.notes,
    }

    try {
      // Update or add reservation using service
      if (reservation) {
        updateReservation(reservation.id, reservationData)
        toast({
          title: "Reservasi Diperbarui",
          description: "Reservasi telah berhasil diperbarui.",
        })
      } else {
        addReservation(reservationData as Omit<Reservation, "id">)
        toast({
          title: "Reservasi Dibuat",
          description: "Reservasi baru telah berhasil dibuat.",
        })
      }

      setIsSubmitting(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving reservation:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data reservasi.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Calculate derived values for display
  const finalPrice = Number(formData.finalPrice) || 0
  const customerDeposit = Number(formData.customerDeposit) || 0
  const basePrice = Number(formData.basePrice) || 0
  const profit = finalPrice - basePrice
  const remainingPayment = finalPrice - customerDeposit

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bookingCode">Kode Booking</Label>
          <Input
            id="bookingCode"
            value={formData.bookingCode}
            onChange={(e) => handleChange("bookingCode", e.target.value)}
            placeholder="Contoh: BK-20250501-001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookingDate">Tanggal Booking</Label>
          <Input
            id="bookingDate"
            type="date"
            value={formData.bookingDate}
            onChange={(e) => handleChange("bookingDate", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerName">Nama Pemesan</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            placeholder="Nama lengkap pemesan"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Nomor HP</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Contoh: 081234567890"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Tanggal Check-in</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.checkIn ? (
                  format(formData.checkIn, "dd MMMM yyyy", { locale: id })
                ) : (
                  <span>Pilih tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.checkIn}
                onSelect={(date) => date && handleChange("checkIn", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Tanggal Check-out</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.checkOut ? (
                  format(formData.checkOut, "dd MMMM yyyy", { locale: id })
                ) : (
                  <span>Pilih tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.checkOut}
                onSelect={(date) => date && handleChange("checkOut", date)}
                initialFocus
                disabled={(date) => date < formData.checkIn}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tripSchedule">Jadwal Trip</Label>
          <Input
            id="tripSchedule"
            value={formData.tripSchedule}
            onChange={(e) => handleChange("tripSchedule", e.target.value)}
            placeholder="Contoh: 2025-05-11 (Pantai Kuta)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderDetails">Detail Pesanan</Label>
          <Input
            id="orderDetails"
            value={formData.orderDetails}
            onChange={(e) => handleChange("orderDetails", e.target.value)}
            placeholder="Contoh: Villa Utama - 2 Kamar"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gro">GRO (Penanggung Jawab)</Label>
          <Select value={formData.gro} onValueChange={(value) => handleChange("gro", value)}>
            <SelectTrigger id="gro">
              <SelectValue placeholder="Pilih GRO" />
            </SelectTrigger>
            <SelectContent>
              {GRO_OPTIONS.map((gro) => (
                <SelectItem key={gro} value={gro}>
                  {gro}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Contoh: ILPAN, JAMAL, BANG NUNG</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Contoh: Akomodasi, Transportasi, Trip, Kuliner</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="finalPrice">Harga Jadi (Rp)</Label>
          <Input
            id="finalPrice"
            type="number"
            value={formData.finalPrice}
            onChange={(e) => handleChange("finalPrice", e.target.value)}
            placeholder="Contoh: 5000000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerDeposit">DP &gt; Tamu (Rp)</Label>
          <Input
            id="customerDeposit"
            type="number"
            value={formData.customerDeposit}
            onChange={(e) => handleChange("customerDeposit", e.target.value)}
            placeholder="Contoh: 2500000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerDeposit">DP &gt; Mitra (Rp)</Label>
          <Input
            id="partnerDeposit"
            type="number"
            value={formData.partnerDeposit}
            onChange={(e) => handleChange("partnerDeposit", e.target.value)}
            placeholder="Contoh: 2000000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="remainingPayment">Sisa Pembayaran (Tamu) (Rp)</Label>
          <Input id="remainingPayment" type="number" value={remainingPayment} readOnly className="bg-gray-50" />
        </div>

        <TooltipProvider>
          <div className="space-y-2">
            <Label htmlFor="basePrice" className="flex items-center">
              Harga Stor (Rp)
              {!userIsAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LockIcon className="ml-2 h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hanya admin yang dapat mengakses kolom ini</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </Label>
            <Input
              id="basePrice"
              type="number"
              value={formData.basePrice}
              onChange={(e) => handleChange("basePrice", e.target.value)}
              placeholder="Contoh: 4000000"
              required={userIsAdmin}
              disabled={!userIsAdmin}
              className={!userIsAdmin ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>
        </TooltipProvider>

        <TooltipProvider>
          <div className="space-y-2">
            <Label htmlFor="profit" className="flex items-center">
              Pendapatan (Rp)
              {!userIsAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LockIcon className="ml-2 h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hanya admin yang dapat melihat kolom ini</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </Label>
            <Input
              id="profit"
              type="number"
              value={userIsAdmin ? profit : "********"}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </TooltipProvider>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Contoh: Pending, Proses, Selesai, Batal</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Catatan</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Tambahkan catatan atau informasi tambahan di sini"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {reservation ? "Menyimpan..." : "Menambahkan..."}
            </>
          ) : reservation ? (
            "Simpan Perubahan"
          ) : (
            "Buat Reservasi"
          )}
        </Button>
      </div>
    </form>
  )
}
