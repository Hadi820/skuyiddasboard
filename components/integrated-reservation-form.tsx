/**
 * Integrated Reservation Form
 * Uses backend API for CRUD operations
 */

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
import { CalendarIcon, Loader2 } from "lucide-react"
import { useReservations } from "@/hooks/use-reservations"
import type { Reservation } from "@/types/reservation"

interface IntegratedReservationFormProps {
  reservation?: Reservation
  onSuccess?: () => void
  selectedDate?: Date
}

const GRO_OPTIONS = ["ILPAN", "JAMAL", "BANG NUNG", "DEWI", "SANTI", "RINI", "BUDI", "ANDI"]
const CATEGORY_OPTIONS = ["AKOMODASI", "TRANSPORTASI", "TRIP", "KULINER", "EVENT", "MEETING", "PHOTOSHOOT", "LAINNYA"]
const STATUS_OPTIONS = ["PENDING", "PROSES", "SELESAI", "BATAL"]

export function IntegratedReservationForm({ reservation, onSuccess, selectedDate }: IntegratedReservationFormProps) {
  const { createReservation, updateReservation } = useReservations({ autoFetch: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    bookingCode: "",
    customerName: "",
    phoneNumber: "",
    checkIn: selectedDate || new Date(),
    checkOut: selectedDate
      ? new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    orderDetails: "",
    gro: "",
    category: "AKOMODASI" as const,
    finalPrice: "",
    customerDeposit: "",
    basePrice: "",
    status: "PENDING" as const,
    notes: "",
  })

  useEffect(() => {
    if (reservation) {
      setFormData({
        bookingCode: reservation.bookingCode || "",
        customerName: reservation.customerName || "",
        phoneNumber: reservation.phoneNumber || "",
        checkIn: new Date(reservation.checkIn),
        checkOut: new Date(reservation.checkOut),
        orderDetails: reservation.orderDetails || "",
        gro: reservation.gro || "",
        category: reservation.category || "AKOMODASI",
        finalPrice: reservation.finalPrice?.toString() || "",
        customerDeposit: reservation.customerDeposit?.toString() || "",
        basePrice: reservation.basePrice?.toString() || "",
        status: reservation.status || "PENDING",
        notes: reservation.notes || "",
      })
    } else {
      // Generate booking code for new reservation
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.customerName || !formData.category || !formData.finalPrice) {
        throw new Error("Please fill in all required fields")
      }

      // Prepare data for API
      const reservationData = {
        bookingCode: formData.bookingCode,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        checkIn: format(formData.checkIn, "yyyy-MM-dd"),
        checkOut: format(formData.checkOut, "yyyy-MM-dd"),
        orderDetails: formData.orderDetails,
        gro: formData.gro,
        category: formData.category,
        finalPrice: Number(formData.finalPrice),
        customerDeposit: Number(formData.customerDeposit) || 0,
        basePrice: Number(formData.basePrice) || 0,
        status: formData.status,
        notes: formData.notes,
      }

      if (reservation) {
        await updateReservation(reservation.id, reservationData)
      } else {
        await createReservation(reservationData as any)
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bookingCode">Booking Code</Label>
          <Input
            id="bookingCode"
            value={formData.bookingCode}
            onChange={(e) => handleChange("bookingCode", e.target.value)}
            placeholder="BK-20250501-001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            placeholder="Full customer name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="081234567890"
          />
        </div>

        <div className="space-y-2">
          <Label>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.checkIn ? format(formData.checkIn, "dd MMMM yyyy", { locale: id }) : <span>Select date</span>}
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
          <Label>Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.checkOut ? (
                  format(formData.checkOut, "dd MMMM yyyy", { locale: id })
                ) : (
                  <span>Select date</span>
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
          <Label htmlFor="orderDetails">Order Details</Label>
          <Input
            id="orderDetails"
            value={formData.orderDetails}
            onChange={(e) => handleChange("orderDetails", e.target.value)}
            placeholder="Villa Utama - 2 Rooms"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gro">GRO (Responsible Person)</Label>
          <Select value={formData.gro} onValueChange={(value) => handleChange("gro", value)}>
            <SelectTrigger id="gro">
              <SelectValue placeholder="Select GRO" />
            </SelectTrigger>
            <SelectContent>
              {GRO_OPTIONS.map((gro) => (
                <SelectItem key={gro} value={gro}>
                  {gro}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="finalPrice">Final Price (Rp)</Label>
          <Input
            id="finalPrice"
            type="number"
            value={formData.finalPrice}
            onChange={(e) => handleChange("finalPrice", e.target.value)}
            placeholder="5000000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerDeposit">Customer Deposit (Rp)</Label>
          <Input
            id="customerDeposit"
            type="number"
            value={formData.customerDeposit}
            onChange={(e) => handleChange("customerDeposit", e.target.value)}
            placeholder="2500000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="basePrice">Base Price (Rp)</Label>
          <Input
            id="basePrice"
            type="number"
            value={formData.basePrice}
            onChange={(e) => handleChange("basePrice", e.target.value)}
            placeholder="4000000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Add notes or additional information here"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {reservation ? "Updating..." : "Creating..."}
            </>
          ) : reservation ? (
            "Update Reservation"
          ) : (
            "Create Reservation"
          )}
        </Button>
      </div>
    </form>
  )
}
