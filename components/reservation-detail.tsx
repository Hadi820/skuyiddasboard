"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { LockIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"

interface ReservationDetailProps {
  reservation: any
}

export function ReservationDetail({ reservation }: ReservationDetailProps) {
  const [isAdmin, setIsAdmin] = useState(true) // Default to true until we check

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{reservation.orderDetails}</h3>
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-md mt-2 ${
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
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Kode Booking</p>
          <p className="font-medium">{reservation.bookingCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500">Tanggal Booking</p>
          <p className="font-medium">{format(new Date(reservation.bookingDate), "dd MMM yyyy", { locale: id })}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Nama Pemesan</p>
          <p className="font-medium">{reservation.customerName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Nomor HP</p>
          <p className="font-medium">{reservation.phoneNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Admin Staff</p>
          <p className="font-medium">{reservation.gro}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500">Check-in</p>
          <p className="font-medium">{format(new Date(reservation.checkIn), "dd MMM yyyy", { locale: id })}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Check-out</p>
          <p className="font-medium">{format(new Date(reservation.checkOut), "dd MMM yyyy", { locale: id })}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Jadwal Trip</p>
          <p className="font-medium">{reservation.tripSchedule || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Kategori</p>
          <p className="font-medium">{reservation.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Harga Jadi</p>
          <p className="font-medium">{formatCurrency(reservation.finalPrice)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">DP &gt; Tamu</p>
          <p className="font-medium">{formatCurrency(reservation.customerDeposit)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Sisa Pembayaran (Tamu)</p>
          <p className="font-medium">{formatCurrency(reservation.remainingPayment)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <TooltipProvider>
          <div>
            <p className="text-sm text-gray-500 flex items-center">
              Harga Stor
              {!isAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LockIcon className="ml-2 h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hanya admin yang dapat melihat kolom ini</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </p>
            <p className="font-medium">{isAdmin ? formatCurrency(reservation.basePrice) : "********"}</p>
          </div>
        </TooltipProvider>

        <div>
          <p className="text-sm text-gray-500">DP &gt; Mitra</p>
          <p className="font-medium">{formatCurrency(reservation.partnerDeposit)}</p>
        </div>

        <TooltipProvider>
          <div>
            <p className="text-sm text-gray-500 flex items-center">
              Pendapatan
              {!isAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LockIcon className="ml-2 h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hanya admin yang dapat melihat kolom ini</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </p>
            <p className="font-medium">{isAdmin ? formatCurrency(reservation.profit) : "********"}</p>
          </div>
        </TooltipProvider>
      </div>

      {reservation.notes && (
        <div>
          <p className="text-sm text-gray-500">Catatan</p>
          <p className="mt-1 p-3 bg-gray-50 rounded-md">{reservation.notes}</p>
        </div>
      )}
    </div>
  )
}
