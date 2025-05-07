"use client"

import { useState } from "react"
import { Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExportButton } from "@/components/export-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KpiAdminForm } from "@/components/kpi-admin-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function KpiAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("whatsapp")
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

  // Sample WhatsApp data
  const whatsappData = [
    {
      id: 1,
      name: "Budi Santoso",
      phone: "0812-3456-7890",
      lastMessage: "Maaf, kami sudah menemukan tempat lain",
      date: "2 Mei 2025",
      reason: "Harga terlalu mahal",
      status: "Batal",
    },
    {
      id: 2,
      name: "Siti Rahayu",
      phone: "0878-9012-3456",
      lastMessage: "Apakah ada diskon untuk weekday?",
      date: "3 Mei 2025",
      reason: "Menunggu konfirmasi",
      status: "Pending",
    },
    {
      id: 3,
      name: "Agus Wijaya",
      phone: "0856-7890-1234",
      lastMessage: "Terima kasih, kami akan datang sesuai jadwal",
      date: "4 Mei 2025",
      reason: "-",
      status: "Konfirmasi",
    },
    {
      id: 4,
      name: "Dewi Sartika",
      phone: "0821-3456-7890",
      lastMessage: "Kami perlu reschedule karena ada acara mendadak",
      date: "5 Mei 2025",
      reason: "Jadwal bentrok",
      status: "Reschedule",
    },
    {
      id: 5,
      name: "Rudi Hartono",
      phone: "0812-9876-5432",
      lastMessage: "Fasilitas yang ditawarkan kurang sesuai kebutuhan",
      date: "6 Mei 2025",
      reason: "Fasilitas tidak sesuai",
      status: "Batal",
    },
  ]

  // Sample KPI data
  const kpiData = [
    {
      id: 1,
      title: "Reservasi Bulan Ini",
      value: "18",
      target: "20",
      achievement: "90%",
      status: "On Track",
    },
    {
      id: 2,
      title: "Pembayaran Lunas",
      value: "8",
      target: "10",
      achievement: "80%",
      status: "On Track",
    },
    {
      id: 3,
      title: "Menunggu Pelunasan",
      value: "7",
      target: "5",
      achievement: "140%",
      status: "Exceeded",
    },
    {
      id: 4,
      title: "Reservasi Baru",
      value: "3",
      target: "5",
      achievement: "60%",
      status: "Below Target",
    },
  ]

  // Filter WhatsApp data
  const filteredWhatsappData = whatsappData.filter((item) => {
    // Apply search filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Apply status filter
    if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false
    }

    return true
  })

  const handleEditItem = (item: any) => {
    setSelectedItem(item)
    setShowAddForm(true)
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Data KPI Admin</h1>
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
                  Tambah Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedItem ? "Edit Data" : "Tambah Data Baru"}</DialogTitle>
                </DialogHeader>
                <KpiAdminForm
                  data={selectedItem}
                  onSuccess={() => {
                    setShowAddForm(false)
                    setSelectedItem(null)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Data KPI Admin</CardTitle>
              <div className="flex items-center gap-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="whatsapp">Data WhatsApp</TabsTrigger>
                    <TabsTrigger value="kpi">Indikator KPI</TabsTrigger>
                  </TabsList>
                  <TabsContent value="whatsapp" className="mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-left">
                          <tr>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nama
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              No. WhatsApp
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pesan Terakhir
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Alasan
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredWhatsappData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.phone}</td>
                              <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                                {item.lastMessage}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.reason}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                    item.status === "Konfirmasi"
                                      ? "bg-[#dcfce7] text-[#166534]"
                                      : item.status === "Pending"
                                        ? "bg-[#fef9c3] text-[#854d0e]"
                                        : item.status === "Batal"
                                          ? "bg-[#fee2e2] text-[#991b1b]"
                                          : "bg-[#e5e7eb] text-[#374151]"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
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

                  <TabsContent value="kpi" className="mt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-left">
                          <tr>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Indikator
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nilai Aktual
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Target
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pencapaian
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {kpiData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.value}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.target}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.achievement}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                    item.status === "Exceeded"
                                      ? "bg-[#dcfce7] text-[#166534]"
                                      : item.status === "On Track"
                                        ? "bg-[#dbeafe] text-[#1e40af]"
                                        : "bg-[#fee2e2] text-[#991b1b]"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
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
                </Tabs>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="konfirmasi">Konfirmasi</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="batal">Batal</SelectItem>
                    <SelectItem value="reschedule">Reschedule</SelectItem>
                  </SelectContent>
                </Select>
                <ExportButton
                  data={activeTab === "whatsapp" ? filteredWhatsappData : kpiData}
                  filename={`data-${activeTab}`}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </main>
    </div>
  )
}
