"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Filter, Plus, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InvoiceForm } from "@/components/invoice-form"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAllInvoices, getInvoiceStats } from "@/services/invoice-service"

export function InvoiceList() {
  const { toast } = useToast()
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
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

  // Filter invoices based on search term, status, and date
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    const matchesDate =
      !dateFilter || format(new Date(invoice.issueDate), "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd")

    return matchesSearch && matchesStatus && matchesDate
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Terkirim</SelectItem>
                  <SelectItem value="paid">Terbayar</SelectItem>
                  <SelectItem value="overdue">Jatuh Tempo</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "dd MMMM yyyy", { locale: id }) : <span>Filter tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                  {dateFilter && (
                    <div className="p-3 border-t border-gray-100">
                      <Button variant="ghost" size="sm" onClick={() => setDateFilter(undefined)} className="w-full">
                        Reset
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
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
                      <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">
                        <Link href={`/keuangan/invoice/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.clientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {format(new Date(invoice.issueDate), "dd MMM yyyy", { locale: id })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {format(new Date(invoice.dueDate), "dd MMM yyyy", { locale: id })}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">Rp {invoice.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
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
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/keuangan/invoice/${invoice.id}`}>Detail</Link>
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
