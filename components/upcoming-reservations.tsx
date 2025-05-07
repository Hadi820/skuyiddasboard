"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReservationForm } from "@/components/reservation-form"
import Link from "next/link"
import { reservationsData } from "@/data/reservations"

export function UpcomingReservations() {
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  // Sort reservations by check-in date and take the next 5
  const upcomingReservations = [...reservationsData]
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
    .filter((res) => new Date(res.checkIn) >= new Date())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {upcomingReservations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Tidak ada reservasi mendatang</p>
          <Button className="mt-4">Tambah Reservasi</Button>
        </div>
      ) : (
        upcomingReservations.map((reservation) => (
          <div key={reservation.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-[#111827]">{reservation.orderDetails}</h3>
                <p className="text-sm text-gray-500">{reservation.category}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  reservation.status === "selesai"
                    ? "bg-[#dcfce7] text-[#166534]"
                    : reservation.status === "proses"
                      ? "bg-[#fef9c3] text-[#854d0e]"
                      : "bg-[#fee2e2] text-[#991b1b]"
                }`}
              >
                {reservation.status === "selesai" ? "Selesai" : reservation.status === "proses" ? "Proses" : "Batal"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div>
                <p className="text-gray-500">Check-in</p>
                <p>{format(new Date(reservation.checkIn), "dd MMM yyyy", { locale: id })}</p>
              </div>
              <div>
                <p className="text-gray-500">Check-out</p>
                <p>{format(new Date(reservation.checkOut), "dd MMM yyyy", { locale: id })}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <p className="text-gray-500">Pemesan</p>
                <p>{reservation.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Harga</p>
                <p>{formatCurrency(reservation.finalPrice)}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#4f46e5] hover:text-[#4f46e5] hover:bg-[#eef2ff]"
                onClick={() => {
                  setSelectedReservation(reservation)
                  setShowEditForm(true)
                }}
              >
                Edit
              </Button>
              <Link href={`/calendar?date=${format(new Date(reservation.checkIn), "yyyy-MM-dd")}`}>
                <Button variant="ghost" size="sm" className="text-[#4f46e5] hover:text-[#4f46e5] hover:bg-[#eef2ff]">
                  Lihat Detail
                </Button>
              </Link>
            </div>
          </div>
        ))
      )}

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
