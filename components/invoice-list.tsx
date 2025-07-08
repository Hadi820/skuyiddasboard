"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Plus, Search, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InvoiceForm } from "@/components/invoice-form"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getAllInvoices, getInvoiceStats } from "@/services/invoice-service"

export function InvoiceList() {
  const { toast } = useToast()
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [invoices, setInvoices] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalOutstanding: 0,
    totalOverdue: 0,
  })
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  // Load invoices
  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = () => {
    const allInvoices = getAllInvoices()
    setInvoices(allInvoices)
    setStats(getInvoiceStats())
  }

  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Sort invoices by issue date (newest first)
  const sortedInvoices = [...filteredInvoices].sort(
    (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
  )

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowInvoiceForm(true)
  }

  const handleFormSuccess = () => {
    setShowInvoiceForm(false)
    setSelectedInvoice(null)
    loadInvoices()
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { bg: "bg-green-100", text: "text-green-800", label: "Terbayar" },
      sent: { bg: "bg-blue-100", text: "text-blue-800", label: "Terkirim" },
      overdue: { bg: "bg-red-100", text: "text-red-800", label: "Jatuh Tempo" },
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      cancelled: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Dibatalkan" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Terbayar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {stats.totalPaid.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Jumlah pembayaran diterima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Belum Dibayar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Rp {stats.totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Jumlah yang belum dibayar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Jatuh Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp {stats.totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Jumlah yang telah jatuh tempo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Invoice</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setSelectedInvoice(null)
                setShowInvoiceForm(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Cari invoice..."
                className="pl-8 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Terkirim</option>
                <option value="paid">Terbayar</option>
                <option value="overdue">Jatuh Tempo</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">No. Invoice</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada invoice yang ditemukan
                    </td>
                  </tr>
                ) : (
                  sortedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        <Link href={`/keuangan/invoice/${invoice.id}`} className="hover:underline">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.clientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {format(new Date(invoice.issueDate), "dd MMM yyyy", { locale: id })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {format(new Date(invoice.dueDate), "dd MMM yyyy", { locale: id })}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">Rp {invoice.total.toLocaleString()}</td>
                      <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/keuangan/invoice/${invoice.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Detail
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditInvoice(invoice)}>
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedInvoice ? "Edit Invoice" : "Buat Invoice Baru"}</DialogTitle>
          </DialogHeader>
          <InvoiceForm invoice={selectedInvoice} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
