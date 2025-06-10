"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy, Download, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Reservation } from "@/data/reservations"
import { format } from "date-fns"
import { id } from "date-fns/locale"
// Tambahkan import untuk PDF generator
import { downloadInvoicePDF } from "@/utils/pdf-generator"

interface InvoiceGeneratorProps {
  reservation: Reservation
  onSuccess?: () => void
}

export function InvoiceGenerator({ reservation, onSuccess }: InvoiceGeneratorProps) {
  const { toast } = useToast()
  const [invoiceType, setInvoiceType] = useState<"tagihan" | "lunas" | "dp">("tagihan")
  const [copied, setCopied] = useState(false)
  const [customMessage, setCustomMessage] = useState("")
  const [includeCustomMessage, setIncludeCustomMessage] = useState(false)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const prefix = "INV"
    const date = format(new Date(), "yyyyMMdd")
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}/${date}/${random}`
  }

  const invoiceNumber = generateInvoiceNumber()
  const invoiceDate = format(new Date(), "dd MMMM yyyy", { locale: id })
  const dueDate = format(new Date(new Date().setDate(new Date().getDate() + 7)), "dd MMMM yyyy", { locale: id })

  // Generate invoice content
  const generateInvoiceContent = () => {
    let content = ""

    // Header
    content += `*INVOICE ${invoiceType === "tagihan" ? "TAGIHAN" : invoiceType === "lunas" ? "LUNAS" : "DP"}*\n\n`
    content += `Nomor: ${invoiceNumber}\n`
    content += `Tanggal: ${invoiceDate}\n`
    content += invoiceType === "tagihan" ? `Jatuh Tempo: ${dueDate}\n\n` : "\n"

    // Customer details
    content += `*Kepada:*\n`
    content += `${reservation.customerName}\n`
    content += `${reservation.phoneNumber}\n\n`

    // Reservation details
    content += `*Detail Pemesanan:*\n`
    content += `Kode Booking: ${reservation.bookingCode}\n`
    content += `${reservation.orderDetails}\n`
    content += `Check-in: ${format(new Date(reservation.checkIn), "dd MMM yyyy", { locale: id })}\n`
    content += `Check-out: ${format(new Date(reservation.checkOut), "dd MMM yyyy", { locale: id })}\n\n`

    // Payment details
    content += `*Rincian Pembayaran:*\n`
    content += `Harga Total: ${formatCurrency(reservation.finalPrice)}\n`

    if (invoiceType === "tagihan") {
      content += `DP Terbayar: ${formatCurrency(reservation.customerDeposit)}\n`
      content += `*Sisa Pembayaran: ${formatCurrency(reservation.remainingPayment)}*\n\n`
    } else if (invoiceType === "dp") {
      content += `*DP: ${formatCurrency(reservation.customerDeposit)}*\n`
      content += `Sisa Pembayaran: ${formatCurrency(reservation.remainingPayment)}*\n\n`
    } else {
      content += `*Jumlah Terbayar: ${formatCurrency(reservation.finalPrice)}*\n\n`
    }

    // Payment instructions
    content += `*Metode Pembayaran:*\n`
    content += `Bank BCA\n`
    content += `No. Rekening: 1234567890\n`
    content += `Atas Nama: PT Villa Management\n\n`

    // Custom message
    if (includeCustomMessage && customMessage) {
      content += `*Catatan:*\n${customMessage}\n\n`
    }

    // Footer
    content += `Terima kasih atas kepercayaan Anda menggunakan layanan kami.\n`
    content += `Untuk informasi lebih lanjut, silakan hubungi kami di 0812-3456-7890.\n\n`
    content += `Hormat kami,\n`
    content += `Tim Villa Management`

    return content
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateInvoiceContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Invoice disalin!",
      description: "Invoice telah disalin ke clipboard.",
    })
  }

  const sendWhatsApp = () => {
    const message = encodeURIComponent(generateInvoiceContent())
    const phone = reservation.phoneNumber.replace(/[^0-9]/g, "")

    if (!phone) {
      toast({
        title: "Nomor telepon tidak ditemukan",
        description: "Pelanggan tidak memiliki nomor telepon yang valid.",
        variant: "destructive",
      })
      return
    }

    window.open(`https://wa.me/${phone.startsWith("0") ? "62" + phone.substring(1) : phone}?text=${message}`, "_blank")

    toast({
      title: "Membuka WhatsApp",
      description: "Invoice telah disiapkan untuk dikirim via WhatsApp.",
    })

    // Update status if needed
    if (invoiceType === "lunas" && reservation.status !== "Selesai") {
      // In a real app, you would update the status in the database
      toast({
        title: "Status Diperbarui",
        description: "Status reservasi telah diubah menjadi Selesai.",
      })
    } else if (invoiceType === "dp" && reservation.status === "Pending") {
      // In a real app, you would update the status in the database
      toast({
        title: "Status Diperbarui",
        description: "Status reservasi telah diubah menjadi Proses.",
      })
    }

    if (onSuccess) {
      onSuccess()
    }
  }

  // Ubah fungsi downloadPDF
  const downloadPDF = () => {
    // Generate dummy invoice object dari data reservasi
    const invoiceData = {
      id: invoiceNumber,
      invoiceNumber: invoiceNumber,
      clientId: reservation.customerId || "client-1",
      clientName: reservation.customerName,
      reservationId: reservation.id,
      issueDate: new Date().toISOString(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      subtotal: reservation.finalPrice,
      tax: 0,
      discount: 0,
      total:
        invoiceType === "dp"
          ? reservation.customerDeposit
          : invoiceType === "tagihan"
            ? reservation.remainingPayment
            : reservation.finalPrice,
      notes: includeCustomMessage ? customMessage : "",
      status: invoiceType === "lunas" ? "paid" : "sent",
      paymentMethod: invoiceType === "lunas" ? "transfer" : undefined,
      paymentDate: invoiceType === "lunas" ? new Date().toISOString() : undefined,
      items: [
        {
          description: `${reservation.orderDetails} (${format(new Date(reservation.checkIn), "dd MMM yyyy", { locale: id })} - ${format(new Date(reservation.checkOut), "dd MMM yyyy", { locale: id })})`,
          quantity: 1,
          unitPrice:
            invoiceType === "dp"
              ? reservation.customerDeposit.toString()
              : invoiceType === "tagihan"
                ? reservation.remainingPayment.toString()
                : reservation.finalPrice.toString(),
          amount:
            invoiceType === "dp"
              ? reservation.customerDeposit.toString()
              : invoiceType === "tagihan"
                ? reservation.remainingPayment.toString()
                : reservation.finalPrice.toString(),
        },
      ],
    }

    // Download PDF
    downloadInvoicePDF(invoiceData, reservation.customerName)

    toast({
      title: "Invoice diunduh",
      description: "Invoice telah berhasil diunduh sebagai PDF.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceType">Jenis Invoice</Label>
            <Select value={invoiceType} onValueChange={(value: "tagihan" | "lunas" | "dp") => setInvoiceType(value)}>
              <SelectTrigger id="invoiceType">
                <SelectValue placeholder="Pilih jenis invoice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tagihan">Tagihan (Sisa Pembayaran)</SelectItem>
                <SelectItem value="lunas">Lunas (Full Paid)</SelectItem>
                <SelectItem value="dp">DP Masuk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeCustomMessage"
                checked={includeCustomMessage}
                onChange={(e) => setIncludeCustomMessage(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="includeCustomMessage">Tambahkan pesan kustom</Label>
            </div>
            {includeCustomMessage && (
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Tulis pesan kustom Anda di sini..."
                rows={3}
              />
            )}
          </div>

          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="whitespace-pre-line">{generateInvoiceContent()}</div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Salin Invoice
            </Button>
            <Button variant="outline" onClick={downloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={sendWhatsApp}>
              <Send className="h-4 w-4 mr-2" />
              Kirim via WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
