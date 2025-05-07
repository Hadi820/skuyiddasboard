"use client"

import { useState } from "react"
import { Plus, Search, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ClientForm } from "@/components/client-form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clientsData } from "@/data/clients"
import { ClientDetail } from "@/components/client-detail"
import { GroDashboard } from "@/components/gro-dashboard"
import { toast } from "sonner"

export default function ClientsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedClient, setSelectedClient] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState("clients")

  // Filter clients based on search term and status
  const filteredClients = clientsData.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || client.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Manajemen Klien</h1>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Tambah Klien
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="clients">Klien</TabsTrigger>
            <TabsTrigger value="gro">GRO (Penanggung Jawab)</TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
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
                    <SelectItem value="tidak-aktif">Tidak Aktif</SelectItem>
                    <SelectItem value="potensial">Potensial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredClients.map((client) => (
                  <Card
                    key={client.id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedClient(client)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                            client.status === "aktif"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : client.status === "tidak-aktif"
                                ? "bg-[#fee2e2] text-[#991b1b]"
                                : "bg-[#fef9c3] text-[#854d0e]"
                          }`}
                        >
                          {client.status === "aktif"
                            ? "Aktif"
                            : client.status === "tidak-aktif"
                              ? "Tidak Aktif"
                              : "Potensial"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{client.company || "Individu"}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Email:</span>
                          <span className="text-sm">{client.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Telepon:</span>
                          <span className="text-sm">{client.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Reservasi:</span>
                          <span className="text-sm">{client.reservations}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Pendapatan:</span>
                          <span className="text-sm font-medium">Rp {client.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-left">
                        <tr>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Perusahaan
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Telepon
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reservasi
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pendapatan
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredClients.map((client) => (
                          <tr key={client.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{client.name}</td>
                            <td className="px-4 py-3 text-sm">{client.company || "Individu"}</td>
                            <td className="px-4 py-3 text-sm">{client.email}</td>
                            <td className="px-4 py-3 text-sm">{client.phone}</td>
                            <td className="px-4 py-3 text-sm">{client.reservations}</td>
                            <td className="px-4 py-3 text-sm font-medium">Rp {client.revenue.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                  client.status === "aktif"
                                    ? "bg-[#dcfce7] text-[#166534]"
                                    : client.status === "tidak-aktif"
                                      ? "bg-[#fee2e2] text-[#991b1b]"
                                      : "bg-[#fef9c3] text-[#854d0e]"
                                }`}
                              >
                                {client.status === "aktif"
                                  ? "Aktif"
                                  : client.status === "tidak-aktif"
                                    ? "Tidak Aktif"
                                    : "Potensial"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedClient(client)}>
                                Detail
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="gro">
            <GroDashboard />
          </TabsContent>
        </Tabs>

        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Klien Baru</DialogTitle>
            </DialogHeader>
            <ClientForm
              onSuccess={() => {
                setShowAddForm(false)
                toast({
                  title: "Klien Ditambahkan",
                  description: "Data klien baru telah berhasil ditambahkan.",
                })
              }}
            />
          </DialogContent>
        </Dialog>

        {selectedClient && (
          <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
            <DialogContent className="max-w-4xl">
              <ClientDetail client={selectedClient} onClose={() => setSelectedClient(null)} />
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}
