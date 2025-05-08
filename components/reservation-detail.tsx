"use client"

import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WhatsappGenerator } from "@/components/whatsapp-generator"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { InvoiceGenerator } from "@/components/invoice-generator"
import { deleteReservation } from "@/services/reservation-service"

interface ReservationDetailProps {
  reservation: any
  onClose: () => void
}

export function ReservationDetail({ reservation, onClose }: ReservationDetailProps) {
  const { toast } = useToast()
  const [showWhatsappGenerator, setShowWhatsappGenerator] = useState(false)
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false)

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

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus reservasi ini?")) {
      try {
        deleteReservation(reservation.id)
        toast({
          title: "Reservasi Dihapus",
          description: "Reservasi telah berhasil dihapus.",
        })
        onClose()
      } catch (error) {
        console.error("Error deleting reservation:", error)
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat menghapus reservasi.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Informasi Reservasi</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Kode Booking</span>
                <span className="font-medium">{reservation.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span>{getStatusBadge(reservation.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kategori</span>
                <span className="capitalize">{reservation.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-in</span>
                <span>{format(new Date(reservation.checkIn), "dd MMMM yyyy", { locale: id })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-out</span>
                <span>{format(new Date(reservation.checkOut), "dd MMMM yyyy", { locale: id })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Admin Staff</span>
                <span>{reservation.gro}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Informasi Pelanggan</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium">{reservation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Telepon</span>
                <span>{reservation.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span>{reservation.email || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Detail Pesanan</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="whitespace-pre-line">{reservation.orderDetails}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Informasi Pembayaran</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Status Pembayaran</span>
              <span>{getPaymentStatusBadge(reservation.paymentStatus)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Metode Pembayaran</span>
              <span className="capitalize">{reservation.paymentMethod || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Harga Dasar</span>
              <span>Rp {reservation.basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Biaya Tambahan</span>
              <span>Rp {reservation.additionalFees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Diskon</span>
              <span>Rp {reservation.discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-medium">Total</span>
              <span className="font-bold">Rp {reservation.finalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {reservation.notes && (
          <div>
            <h3 className="text-lg font-medium mb-4">Catatan</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{reservation.notes}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-200">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setShowWhatsappGenerator(true)}>
                  Kirim WhatsApp
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Buat pesan WhatsApp untuk pelanggan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setShowInvoiceGenerator(true)}>
                  Buat Invoice
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Buat invoice untuk reservasi ini</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="destructive" onClick={handleDelete}>
            Hapus Reservasi
          </Button>

          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>

      <Dialog open={showWhatsappGenerator} onOpenChange={setShowWhatsappGenerator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generator Pesan WhatsApp</DialogTitle>
          </DialogHeader>
          <WhatsappGenerator
            customerName={reservation.customerName}
            phoneNumber={reservation.phoneNumber}
            bookingCode={reservation.bookingCode}
            checkIn={format(new Date(reservation.checkIn), "dd MMMM yyyy", { locale: id })}
            checkOut={format(new Date(reservation.checkOut), "dd MMMM yyyy", { locale: id })}
            orderDetails={reservation.orderDetails}
            totalPrice={reservation.finalPrice}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showInvoiceGenerator} onOpenChange={setShowInvoiceGenerator}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Generator Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceGenerator
            customerName={reservation.customerName}
            reservationId={reservation.id}
            checkIn={new Date(reservation.checkIn)}
            checkOut={new Date(reservation.checkOut)}
            orderDetails={reservation.orderDetails}
            basePrice={reservation.basePrice}
            additionalFees={reservation.additionalFees}
            discount={reservation.discount}
            totalPrice={reservation.finalPrice}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
