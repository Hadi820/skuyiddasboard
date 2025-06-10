"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ArrowLeft, Download, Edit, Printer, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InvoiceForm } from "@/components/invoice-form"
import { invoicesData } from "@/data/invoices"
import { clientsData } from "@/data/clients"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
// Tambahkan import untuk PDF generator
import { downloadInvoicePDF } from "@/utils/pdf-generator"

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<any | null>(null)
  const [client, setClient] = useState<any | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get invoice data
    const fetchInvoice = () => {
      setIsLoading(true)
      setTimeout(() => {
        const foundInvoice = invoicesData.find((inv) => inv.id === params.id)
        if (foundInvoice) {
          setInvoice(foundInvoice)
          const foundClient = clientsData.find((client) => client.id.toString() === foundInvoice.clientId)
          setClient(foundClient || null)
        }
        setIsLoading(false)
      }, 500)
    }

    if (params.id) {
      fetchInvoice()
    }
  }, [params.id])

  const handleSendInvoice = () => {
    toast({
      title: "Invoice Terkirim",
      description: "Invoice telah berhasil dikirim ke email klien.",
    })
  }

  const handlePrintInvoice = () => {
    window.print()
  }

  // Ubah fungsi handleDownloadInvoice
  const handleDownloadInvoice = () => {
    if (invoice && client) {
      downloadInvoicePDF(invoice, client.name)

      toast({
        title: "Invoice Diunduh",
        description: "Invoice telah berhasil diunduh sebagai PDF.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#f9fafb]">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-[600px] bg-gray-100 rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen bg-[#f9fafb]">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-2xl font-semibold mb-4">Invoice Tidak Ditemukan</h1>
            <p className="text-gray-500 mb-6">Invoice yang Anda cari tidak ditemukan atau telah dihapus.</p>
            <Button asChild>
              <Link href="/keuangan">Kembali ke Daftar Invoice</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold text-[#111827]">Detail Invoice</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSendInvoice}>
              <Send className="h-4 w-4 mr-2" />
              Kirim
            </Button>
            <Button variant="outline" onClick={handlePrintInvoice}>
              <Printer className="h-4 w-4 mr-2" />
              Cetak
            </Button>
            <Button variant="outline" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Unduh PDF
            </Button>
            <Button onClick={() => setShowEditForm(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <Card className="mb-6 print:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-xl">Invoice #{invoice.invoiceNumber}</CardTitle>
              <p className="text-sm text-gray-500">
                Dibuat pada {format(new Date(invoice.issueDate), "dd MMMM yyyy", { locale: id })}
              </p>
            </div>
            <div>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-md ${
                  invoice.status === "paid"
                    ? "bg-[#dcfce7] text-[#166534]"
                    : invoice.status === "sent"
                      ? "bg-[#dbeafe] text-[#1e40af]"
                      : invoice.status === "overdue"
                        ? "bg-[#fee2e2] text-[#991b1b]"
                        : invoice.status === "draft"
                          ? "bg-[#e5e7eb] text-[#374151]"
                          : "bg-[#fef9c3] text-[#854d0e]"
                }`}
              >
                {invoice.status === "paid"
                  ? "Terbayar"
                  : invoice.status === "sent"
                    ? "Terkirim"
                    : invoice.status === "overdue"
                      ? "Jatuh Tempo"
                      : invoice.status === "draft"
                        ? "Draft"
                        : "Dibatalkan"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Dari</h3>
                <p className="font-medium">Villa Reservasi</p>
                <p>Jl. Reservasi No. 123, Jakarta</p>
                <p>Indonesia</p>
                <p>info@villareservasi.com</p>
                <p>0812-3456-7890</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Untuk</h3>
                {client && (
                  <>
                    <p className="font-medium">{client.name}</p>
                    {client.company && <p>{client.company}</p>}
                    {client.email && <p>{client.email}</p>}
                    {client.phone && <p>{client.phone}</p>}
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Nomor Invoice</h3>
                <p>{invoice.invoiceNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tanggal Invoice</h3>
                <p>{format(new Date(invoice.issueDate), "dd MMMM yyyy", { locale: id })}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tanggal Jatuh Tempo</h3>
                <p>{format(new Date(invoice.dueDate), "dd MMMM yyyy", { locale: id })}</p>
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Harga Satuan
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-4">{item.description}</td>
                      <td className="px-4 py-4 text-right">{item.quantity}</td>
                      <td className="px-4 py-4 text-right">Rp {Number.parseInt(item.unitPrice).toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">Rp {Number.parseInt(item.amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-full md:w-1/3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rp {invoice.subtotal.toLocaleString()}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Pajak ({invoice.tax}%)</span>
                    <span>Rp {((invoice.subtotal * invoice.tax) / 100).toLocaleString()}</span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Diskon ({invoice.discount}%)</span>
                    <span>- Rp {((invoice.subtotal * invoice.discount) / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
                  <span>Total</span>
                  <span>Rp {invoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Catatan</h3>
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            )}

            {invoice.status === "paid" && (
              <div className="mt-8 p-4 bg-green-50 rounded-lg">
                <h3 className="text-sm font-medium text-green-700 mb-2">Informasi Pembayaran</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Metode Pembayaran</p>
                    <p className="font-medium">
                      {invoice.paymentMethod === "transfer"
                        ? "Transfer Bank"
                        : invoice.paymentMethod === "cash"
                          ? "Tunai"
                          : invoice.paymentMethod === "credit_card"
                            ? "Kartu Kredit"
                            : invoice.paymentMethod === "debit_card"
                              ? "Kartu Debit"
                              : "E-Wallet"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Pembayaran</p>
                    <p className="font-medium">
                      {invoice.paymentDate
                        ? format(new Date(invoice.paymentDate), "dd MMMM yyyy", { locale: id })
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jumlah Dibayar</p>
                    <p className="font-medium">Rp {invoice.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm
              invoice={invoice}
              onSuccess={() => {
                setShowEditForm(false)
                toast({
                  title: "Invoice Diperbarui",
                  description: "Invoice telah berhasil diperbarui.",
                })
              }}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
