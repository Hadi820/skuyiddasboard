"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Download, Filter, Search } from "lucide-react"
import { clientsData } from "@/data/clients"
import { reservationsData } from "@/data/reservations"
import { invoicesData } from "@/data/invoices"
import Link from "next/link"

export function ClientDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("overview")

  // Filter clients based on search term and status
  const filteredClients = clientsData.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || client.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Get client reservations
  const getClientReservations = (clientName: string) => {
    return reservationsData.filter((res) => res.person?.toLowerCase() === clientName.toLowerCase())
  }

  // Get client invoices
  const getClientInvoices = (clientName: string) => {
    return invoicesData.filter((inv) => inv.clientName.toLowerCase() === clientName.toLowerCase())
  }

  // Calculate client statistics
  const totalClients = clientsData.length
  const activeClients = clientsData.filter((client) => client.status === "aktif").length
  const inactiveClients = clientsData.filter((client) => client.status === "tidak-aktif").length
  const newClients = 0 // We'll set this to 0 for now since we don't have createdAt data

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Klien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-gray-500 mt-1">Semua klien terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Klien Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeClients}</div>
            <p className="text-xs text-gray-500 mt-1">Klien dengan status aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Klien Tidak Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inactiveClients}</div>
            <p className="text-xs text-gray-500 mt-1">Klien dengan status tidak aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Klien Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{newClients}</div>
            <p className="text-xs text-gray-500 mt-1">Klien baru dalam 30 hari terakhir</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Cari klien..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
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
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Ekspor Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="details">Detail Klien</TabsTrigger>
          <TabsTrigger value="reservations">Reservasi</TabsTrigger>
          <TabsTrigger value="invoices">Invoice</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Klien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Grafik distribusi klien akan ditampilkan di sini</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Klien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Perusahaan
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Dibuat
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">
                          <Link href={`/clients/${client.id}`}>{client.name}</Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{client.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{client.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{client.company || "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                              client.status === "aktif" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"
                            }`}
                          >
                            {client.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {/* Display a placeholder since createdAt is not available */}-
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/clients/${client.id}`}>Detail</Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/clients/${client.id}/edit`}>Edit</Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>Reservasi Klien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check Out
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredClients.map((client) => {
                      const clientReservations = getClientReservations(client.name)
                      if (clientReservations.length === 0) return null

                      return clientReservations.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">{client.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{reservation.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {reservation.start
                              ? format(new Date(reservation.start), "dd MMM yyyy", { locale: id })
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {reservation.end ? format(new Date(reservation.end), "dd MMM yyyy", { locale: id }) : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{reservation.type}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                reservation.status === "confirmed"
                                  ? "bg-[#dcfce7] text-[#166534]"
                                  : reservation.status === "pending"
                                    ? "bg-[#fef9c3] text-[#854d0e]"
                                    : "bg-[#fee2e2] text-[#991b1b]"
                              }`}
                            >
                              {reservation.status === "confirmed"
                                ? "Terkonfirmasi"
                                : reservation.status === "pending"
                                  ? "Menunggu"
                                  : "Dibatalkan"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/calendar?id=${reservation.id}`}>Detail</Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Klien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No. Invoice
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jatuh Tempo
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredClients.map((client) => {
                      const clientInvoices = getClientInvoices(client.name)
                      if (clientInvoices.length === 0) return null

                      return clientInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">{client.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{invoice.invoiceNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {invoice.issueDate
                              ? format(new Date(invoice.issueDate), "dd MMM yyyy", { locale: id })
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {invoice.dueDate ? format(new Date(invoice.dueDate), "dd MMM yyyy", { locale: id }) : "-"}
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
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/keuangan/invoice/${invoice.id}`}>Detail</Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
