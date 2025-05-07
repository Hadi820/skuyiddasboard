"use client"

import { useState } from "react"
import { CalendarIcon, Download, Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { ChatForm } from "@/components/chat-form"

export default function KpiClientPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("daily")
  const [showAddForm, setShowAddForm] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [filterChannel, setFilterChannel] = useState("all")

  // Sample data for daily chats
  const dailyChats = [
    {
      id: 1,
      date: "2025-05-04",
      clientName: "Budi Santoso",
      region: "Jakarta",
      channel: "WhatsApp",
      question: "Menanyakan ketersediaan untuk tanggal 15 Mei",
      status: "Deal",
      responseTime: 4,
    },
    {
      id: 2,
      date: "2025-05-04",
      clientName: "Siti Rahayu",
      region: "Bandung",
      channel: "Instagram",
      question: "Bertanya tentang harga paket pernikahan",
      status: "Follow-Up",
      responseTime: 7,
    },
    {
      id: 3,
      date: "2025-05-04",
      clientName: "Ahmad Hidayat",
      region: "Jakarta",
      channel: "WhatsApp",
      question: "Ingin tahu fasilitas yang tersedia",
      status: "Tanya Saja",
      responseTime: 3,
    },
    {
      id: 4,
      date: "2025-05-04",
      clientName: "-",
      region: "Surabaya",
      channel: "Website",
      question: "Menanyakan kapasitas maksimal tamu",
      status: "Tidak Berminat",
      responseTime: 10,
    },
    {
      id: 5,
      date: "2025-05-04",
      clientName: "Dewi Lestari",
      region: "Jakarta",
      channel: "WhatsApp",
      question: "Bertanya tentang menu catering",
      status: "Deal",
      responseTime: 5,
    },
  ]

  // Sample data for daily summary
  const dailySummary = [
    {
      date: "2025-05-04",
      totalChats: 12,
      totalDeals: 5,
      topRegion: "Jakarta",
      topChannel: "WhatsApp",
      avgResponseTime: 4,
      notes: "-",
    },
    {
      date: "2025-05-03",
      totalChats: 8,
      totalDeals: 3,
      topRegion: "Bandung",
      topChannel: "WhatsApp",
      avgResponseTime: 6,
      notes: "Banyak pertanyaan tentang paket pernikahan",
    },
    {
      date: "2025-05-02",
      totalChats: 15,
      totalDeals: 7,
      topRegion: "Jakarta",
      topChannel: "Instagram",
      avgResponseTime: 5,
      notes: "Promosi di Instagram berhasil menarik perhatian",
    },
    {
      date: "2025-05-01",
      totalChats: 10,
      totalDeals: 4,
      topRegion: "Jakarta",
      topChannel: "WhatsApp",
      avgResponseTime: 3,
      notes: "-",
    },
    {
      date: "2025-04-30",
      totalChats: 7,
      totalDeals: 2,
      topRegion: "Surabaya",
      topChannel: "Website",
      avgResponseTime: 8,
      notes: "Perlu meningkatkan waktu respon",
    },
  ]

  // Filter chats based on search term and channel
  const filteredChats = dailyChats.filter((chat) => {
    // Apply search filter
    if (
      searchTerm &&
      !chat.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !chat.question.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Apply channel filter
    if (filterChannel !== "all" && chat.channel !== filterChannel) {
      return false
    }

    return true
  })

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Data KPI Client</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 w-64"
              />
            </div>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Tambah Data Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tambah Data Chat Baru</DialogTitle>
                </DialogHeader>
                <ChatForm
                  onSuccess={() => {
                    setShowAddForm(false)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <ChatForm />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Tabel Evaluasi Harian – Data KPI Client</CardTitle>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Select value={filterChannel} onValueChange={setFilterChannel}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Channel</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Telepon">Telepon</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="daily">Data Harian</TabsTrigger>
                <TabsTrigger value="summary">Ringkasan</TabsTrigger>
              </TabsList>

              <TabsContent value="daily">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Klien
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Wilayah
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Channel
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pertanyaan
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waktu Respon
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredChats.map((chat) => (
                        <tr key={chat.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {format(new Date(chat.date), "dd/MM/yyyy")}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{chat.clientName}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{chat.region}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{chat.channel}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{chat.question}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                chat.status === "Deal"
                                  ? "bg-[#dcfce7] text-[#166534]"
                                  : chat.status === "Follow-Up"
                                    ? "bg-[#dbeafe] text-[#1e40af]"
                                    : chat.status === "Tidak Berminat"
                                      ? "bg-[#fee2e2] text-[#991b1b]"
                                      : "bg-[#e5e7eb] text-[#374151]"
                              }`}
                            >
                              {chat.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{chat.responseTime} menit</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah yang Chat
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah Deal
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Wilayah Terbanyak
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Channel Terbanyak
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Respon Rata-rata
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catatan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dailySummary.map((summary, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {format(new Date(summary.date), "dd/MM/yyyy")}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{summary.totalChats}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{summary.totalDeals}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{summary.topRegion}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{summary.topChannel}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{summary.avgResponseTime} menit</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{summary.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
