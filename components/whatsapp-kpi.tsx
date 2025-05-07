"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Filter, MessageSquare, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { WhatsAppGenerator } from "@/components/whatsapp-generator"

export function WhatsappKPI() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [showWhatsAppGenerator, setShowWhatsAppGenerator] = useState(false)
  const [selectedContact, setSelectedContact] = useState<string | null>(null)

  // Sample WhatsApp data
  const whatsappData = [
    {
      id: 1,
      clientName: "Budi Santoso",
      phone: "081234567890",
      lastMessage: "Apakah villa tersedia untuk tanggal 10-12 Mei?",
      messageDate: "2025-05-01",
      reason: "Ketersediaan",
      status: "Konfirmasi",
    },
    {
      id: 2,
      clientName: "Dewi Sartika",
      phone: "081298765432",
      lastMessage: "Berapa harga untuk menginap 3 malam?",
      messageDate: "2025-05-02",
      reason: "Harga",
      status: "Pending",
    },
    {
      id: 3,
      clientName: "Agus Wijaya",
      phone: "081345678901",
      lastMessage: "Saya ingin reschedule photoshoot ke minggu depan",
      messageDate: "2025-05-03",
      reason: "Reschedule",
      status: "Reschedule",
    },
    {
      id: 4,
      clientName: "Siti Rahayu",
      phone: "081456789012",
      lastMessage: "Maaf, kami harus membatalkan reservasi",
      messageDate: "2025-05-04",
      reason: "Pembatalan",
      status: "Batal",
    },
    {
      id: 5,
      clientName: "Maya Indah",
      phone: "081789012345",
      lastMessage: "Apakah ada diskon untuk weekday?",
      messageDate: "2025-05-05",
      reason: "Diskon",
      status: "Konfirmasi",
    },
  ]

  // Filter WhatsApp data based on search term, status, and date
  const filteredWhatsAppData = whatsappData.filter((data) => {
    const matchesSearch =
      data.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || data.status === statusFilter

    const matchesDate =
      !dateFilter || format(new Date(data.messageDate), "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd")

    return matchesSearch && matchesStatus && matchesDate
  })

  // Sort WhatsApp data by message date (newest first)
  const sortedWhatsAppData = [...filteredWhatsAppData].sort(
    (a, b) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime(),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Cari data WhatsApp..."
            className="pl-8"
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
            <SelectItem value="Konfirmasi">Konfirmasi</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Batal">Batal</SelectItem>
            <SelectItem value="Reschedule">Reschedule</SelectItem>
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Klien</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telepon</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pesan Terakhir</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedWhatsAppData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada data WhatsApp yang ditemukan
                </td>
              </tr>
            ) : (
              sortedWhatsAppData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{data.clientName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{data.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{data.lastMessage}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(data.messageDate), "dd MMM yyyy", { locale: id })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{data.reason}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                        data.status === "Konfirmasi"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : data.status === "Pending"
                            ? "bg-[#dbeafe] text-[#1e40af]"
                            : data.status === "Batal"
                              ? "bg-[#fee2e2] text-[#991b1b]"
                              : "bg-[#fef9c3] text-[#854d0e]"
                      }`}
                    >
                      {data.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedContact(data.phone)
                        setShowWhatsAppGenerator(true)
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Balas
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={showWhatsAppGenerator} onOpenChange={setShowWhatsAppGenerator}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generator Pesan WhatsApp</DialogTitle>
          </DialogHeader>
          <WhatsAppGenerator
            onSuccess={() => {
              setShowWhatsAppGenerator(false)
              setSelectedContact(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
