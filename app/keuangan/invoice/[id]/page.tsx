"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Printer, Download, Mail, MessageCircle } from "lucide-react"
import { type Invoice, invoiceService } from "@/services/invoice-service"
import { downloadInvoicePDF, printInvoice } from "@/utils/pdf-generator"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadInvoice(params.id as string)
    }
  }, [params.id])

  const loadInvoice = async (id: string) => {
    try {
      const data = await invoiceService.getInvoiceById(id)
      setInvoice(data)
    } catch (error) {
      console.error("Failed to load invoice:", error)
      toast({
        title: "Error",
        description: "Gagal memuat invoice",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = () => {
    if (!invoice) return

    const subject = `Invoice ${invoice.number} - ${invoice.clientName}`
    const body = `Halo ${invoice.clientName},

Berikut adalah invoice untuk layanan hotel:

Invoice Number: ${invoice.number}
Tanggal: ${new Date(invoice.date).toLocaleDateString("id-ID")}
Jatuh Tempo: ${new Date(invoice.dueDate).toLocaleDateString("id-ID")}
Total: ${formatCurrency(invoice.total)}

Terima kasih atas kepercayaan Anda.

Best regards,
Hotel Management Team`

    const mailtoLink = `mailto:${invoice.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)

    toast({
      title: "Email Dibuka",
      description: "Aplikasi email telah dibuka dengan template invoice",
    })
  }

  const handleSendWhatsApp = () => {
    if (!invoice) return

    const message = `Halo ${invoice.clientName},

Berikut adalah invoice untuk layanan hotel:

📄 Invoice: ${invoice.number}
📅 Tanggal: ${new Date(invoice.date).toLocaleDateString("id-ID")}
⏰ Jatuh Tempo: ${new Date(invoice.dueDate).toLocaleDateString("id-ID")}
💰 Total: ${formatCurrency(invoice.total)}

Terima kasih atas kepercayaan Anda! 🙏`

    // Format phone number for WhatsApp
    let phoneNumber = invoice.clientPhone.replace(/\D/g, "")
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "62" + phoneNumber.substring(1)
    } else if (!phoneNumber.startsWith("62")) {
      phoneNumber = "62" + phoneNumber
    }

    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, "_blank")

    toast({
      title: "WhatsApp Dibuka",
      description: "WhatsApp telah dibuka dengan pesan invoice",
    })
  }

  const handlePrint = async () => {
    if (!invoice) return

    try {
      await printInvoice(invoice)
      toast({
        title: "Print Dimulai",
        description: "Jendela print telah dibuka",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mencetak invoice",
        variant: "destructive",
      })
    }
  }

  const handleDownloadPDF = async () => {
    if (!invoice) return

    try {
      await downloadInvoicePDF(invoice)
      toast({
        title: "PDF Downloaded",
        description: `Invoice ${invoice.number} berhasil diunduh`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengunduh PDF",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      sent: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
    }

    const labels = {
      paid: "Terbayar",
      sent: "Terkirim",
      overdue: "Jatuh Tempo",
      draft: "Draft",
    }

    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="text-center">Loading invoice...</div>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Tidak Ditemukan</h1>
            <Button asChild>
              <Link href="/keuangan">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Keuangan
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/keuangan">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.number}</h1>
                <p className="text-gray-600">Detail invoice untuk {invoice.clientName}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSendEmail} variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Kirim Email
              </Button>
              <Button onClick={handleSendWhatsApp} variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Kirim WA
              </Button>
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Cetak
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Unduh PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Invoice Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Invoice Details</CardTitle>
                      <CardDescription>Informasi lengkap invoice</CardDescription>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Informasi Invoice</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Nomor:</span> {invoice.number}
                        </div>
                        <div>
                          <span className="text-gray-600">Tanggal:</span>{" "}
                          {new Date(invoice.date).toLocaleDateString("id-ID")}
                        </div>
                        <div>
                          <span className="text-gray-600">Jatuh Tempo:</span>{" "}
                          {new Date(invoice.dueDate).toLocaleDateString("id-ID")}
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span> {invoice.status}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Informasi Klien</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Nama:</span> {invoice.clientName}
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span> {invoice.clientEmail}
                        </div>
                        <div>
                          <span className="text-gray-600">Telepon:</span> {invoice.clientPhone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4">Deskripsi</th>
                          <th className="text-left py-3 px-4">Qty</th>
                          <th className="text-left py-3 px-4">Harga</th>
                          <th className="text-left py-3 px-4">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="py-3 px-4">{item.description}</td>
                            <td className="py-3 px-4">{item.quantity}</td>
                            <td className="py-3 px-4">{formatCurrency(item.rate)}</td>
                            <td className="py-3 px-4 font-medium">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(invoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pajak:</span>
                      <span>{formatCurrency(invoice.tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(invoice.total)}</span>
                    </div>
                  </div>

                  {invoice.notes && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Catatan:</h4>
                      <p className="text-sm text-gray-600">{invoice.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Payment Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  {invoice.status === "paid" && invoice.paymentDate ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-green-800 font-medium">✓ Sudah Dibayar</div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Tanggal Bayar:</span>{" "}
                          {new Date(invoice.paymentDate).toLocaleDateString("id-ID")}
                        </div>
                        <div>
                          <span className="text-gray-600">Metode:</span> {invoice.paymentMethod}
                        </div>
                        <div>
                          <span className="text-gray-600">Jumlah:</span> {formatCurrency(invoice.total)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="text-yellow-800 font-medium">⏳ Belum Dibayar</div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Jatuh Tempo:</span>{" "}
                          {new Date(invoice.dueDate).toLocaleDateString("id-ID")}
                        </div>
                        <div>
                          <span className="text-gray-600">Jumlah:</span> {formatCurrency(invoice.total)}
                        </div>
                      </div>

                      {invoice.status === "overdue" && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="text-red-800 font-medium">⚠️ Terlambat</div>
                          <div className="text-red-600 text-sm mt-1">Invoice sudah melewati tanggal jatuh tempo</div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
