"use client"

import type React from "react"
import type { Reservation } from "@/types/reservation"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { addReservation, updateReservation } from "@/services/reservation-service"
import { getAllClients } from "@/services/client-service"

interface ReservationFormProps {
  reservation?: Reservation
  onSuccess?: () => void
}

export function ReservationForm({ reservation, onSuccess }: ReservationFormProps) {
  const { toast } = useToast()
  const [clients, setClients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    checkIn: new Date(),
    checkOut: addDays(new Date(), 1),
    orderDetails: "",
    category: "villa",
    status: "confirmed",
    gro: "Admin Staff 1",
    bookingCode: "",
    paymentStatus: "unpaid",
    paymentMethod: "",
    basePrice: 0,
    additionalFees: 0,
    discount: 0,
    finalPrice: 0,
    notes: "",
  })

  // Load clients
  useEffect(() => {
    setClients(getAllClients())
  }, [])

  useEffect(() => {
    if (reservation) {
      setFormData({
        customerName: reservation.customerName || "",
        phoneNumber: reservation.phoneNumber || "",
        email: reservation.email || "",
        checkIn: new Date(reservation.checkIn) || new Date(),
        checkOut: new Date(reservation.checkOut) || addDays(new Date(), 1),
        orderDetails: reservation.orderDetails || "",
        category: reservation.category || "villa",
        status: reservation.status || "confirmed",
        gro: reservation.gro || "Admin Staff 1",
        bookingCode: reservation.bookingCode || "",
        paymentStatus: reservation.paymentStatus || "unpaid",
        paymentMethod: reservation.paymentMethod || "",
        basePrice: reservation.basePrice || 0,
        additionalFees: reservation.additionalFees || 0,
        discount: reservation.discount || 0,
        finalPrice: reservation.finalPrice || 0,
        notes: reservation.notes || "",
      })
    } else {
      // Generate a new booking code
      const prefix = "BK"
      const date = format(new Date(), "yyyyMMdd")
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      setFormData((prev) => ({
        ...prev,
        bookingCode: `${prefix}${date}${random}`,
      }))
    }
  }, [reservation])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Recalculate final price if price-related fields change
    if (["basePrice", "additionalFees", "discount"].includes(field)) {
      calculateFinalPrice({
        ...formData,
        [field]: value,
      })
    }
  }

  const calculateFinalPrice = (data: any) => {
    const total = data.basePrice + data.additionalFees - data.discount
    setFormData((prev) => ({
      ...prev,
      finalPrice: total,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.customerName || !formData.phoneNumber) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi nama pelanggan dan nomor telepon.",
        variant: "destructive",
      })
      return
    }

    try {
      // Prepare reservation data
      const reservationData = {
        ...formData,
        checkIn: format(formData.checkIn, "yyyy-MM-dd'T'HH:mm:ss"),
        checkOut: format(formData.checkOut, "yyyy-MM-dd'T'HH:mm:ss"),
      }

      // Save data using service
      if (reservation) {
        updateReservation(reservation.id, reservationData)
        toast({
          title: "Reservasi Diperbarui",
          description: "Data reservasi telah berhasil diperbarui.",
        })
      } else {
        addReservation(reservationData)
        toast({
          title: "Reservasi Dibuat",
          description: "Reservasi baru telah berhasil dibuat.",
        })
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving reservation:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan reservasi.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="customerName">Nama Pelanggan</Label>
          <Select value={formData.customerName} onValueChange={(value) => handleChange("customerName", value)}>
            <SelectTrigger id="customerName">
              <SelectValue placeholder="Pilih pelanggan" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.name}>
                  {client.name}
                </SelectItem>
              ))}
              <SelectItem value="custom">Pelanggan Baru</SelectItem>
            </SelectContent>
          </Select>
          {formData.customerName === "custom" && (
            <Input
              className="mt-2"
              placeholder="Masukkan nama pelanggan baru"
              value=""
              onChange={(e) => handleChange("customerName", e.target.value)}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Nomor Telepon</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Contoh: 081234567890"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookingCode">Kode Booking</Label>
          <Input
            id="bookingCode"
            value={formData.bookingCode}
            onChange={(e) => handleChange("bookingCode", e.target.value)}
            placeholder="Kode booking otomatis"
            readOnly
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
                onSelect={(date) => handleChange("checkIn", date)}
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
                onSelect={(date) => handleChange("checkOut", date)}
                initialFocus
                disabled={(date) => date < formData.checkIn}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="tour">Tour</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status Reservasi</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Terkonfirmasi</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gro">Admin Staff</Label>
          <Select value={formData.gro} onValueChange={(value) => handleChange("gro", value)}>
            <SelectTrigger id="gro">
              <SelectValue placeholder="Pilih Admin Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin Staff 1">Admin Staff 1</SelectItem>
              <SelectItem value="Admin Staff 2">Admin Staff 2</SelectItem>
              <SelectItem value="Admin Staff 3">Admin Staff 3</SelectItem>
              <SelectItem value="Admin Staff 4">Admin Staff 4</SelectItem>
              <SelectItem value="Admin Staff 5">Admin Staff 5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentStatus">Status Pembayaran</Label>
          <Select value={formData.paymentStatus} onValueChange={(value) => handleChange("paymentStatus", value)}>
            <SelectTrigger id="paymentStatus">
              <SelectValue placeholder="Pilih status pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Lunas</SelectItem>
              <SelectItem value="partial">Sebagian</SelectItem>
              <SelectItem value="unpaid">Belum Dibayar</SelectItem>
              <SelectItem value="refunded">Dikembalikan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => handleChange("paymentMethod", value)}
            disabled={formData.paymentStatus === "unpaid"}
          >
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Pilih metode pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transfer">Transfer Bank</SelectItem>
              <SelectItem value="cash">Tunai</SelectItem>
              <SelectItem value="credit_card">Kartu Kredit</SelectItem>
              <SelectItem value="debit_card">Kartu Debit</SelectItem>
              <SelectItem value="ewallet">E-Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="orderDetails">Detail Pesanan</Label>
        <Textarea
          id="orderDetails"
          value={formData.orderDetails}
          onChange={(e) => handleChange("orderDetails", e.target.value)}
          placeholder="Masukkan detail pesanan"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="basePrice">Harga Dasar</Label>
          <Input
            id="basePrice"
            type="number"
            value={formData.basePrice}
            onChange={(e) => handleChange("basePrice", Number.parseFloat(e.target.value))}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalFees">Biaya Tambahan</Label>
          <Input
            id="additionalFees"
            type="number"
            value={formData.additionalFees}
            onChange={(e) => handleChange("additionalFees", Number.parseFloat(e.target.value))}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Diskon</Label>
          <Input
            id="discount"
            type="number"
            value={formData.discount}
            onChange={(e) => handleChange("discount", Number.parseFloat(e.target.value))}
            placeholder="0"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Harga</span>
          <span className="font-bold text-lg">Rp {formData.finalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Catatan</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Tambahkan catatan atau informasi tambahan di sini"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Batal
        </Button>
        <Button type="submit">{reservation ? "Perbarui Reservasi" : "Tambah Reservasi"}</Button>
      </div>
    </form>
  )
}
