"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ClientForm } from "@/components/client-form"
import { ClientDetail } from "@/components/client-detail"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Filter } from "lucide-react"
import { getFilteredClients } from "@/services/client-service"

export function ClientDashboard() {
  const { toast } = useToast()
  const [showClientForm, setShowClientForm] = useState(false)
  const [showClientDetail, setShowClientDetail] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [clients, setClients] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<any>(null)

  // Load clients
  useEffect(() => {
    loadClients()
  }, [statusFilter, searchTerm])

  const loadClients = () => {
    const filteredClients = getFilteredClients({
      status: statusFilter === "all" ? undefined : statusFilter,
      searchTerm: searchTerm,
    })
    setClients(filteredClients)
  }

  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    setShowClientDetail(true)
  }

  const handleEditClient = (client: any) => {
    setSelectedClient(client)
    setShowClientForm(true)
  }

  const handleFormSuccess = () => {
    setShowClientForm(false)
    setSelectedClient(null)
    loadClients()
  }

  const handleDetailClose = () => {
    setShowClientDetail(false)
    setSelectedClient(null)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Klien</CardTitle>
          <Button onClick={() => setShowClientForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Klien
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Cari klien..."
                className="pl-8 w-full md:w-[250px]"
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reservasi</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pendapatan</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada klien yang ditemukan
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">{client.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{client.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{client.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{client.company}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 capitalize">{client.status}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{client.reservations}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">Rp {client.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)}>
                            Detail
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}>
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

      <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedClient ? "Edit Klien" : "Tambah Klien Baru"}</DialogTitle>
          </DialogHeader>
          <ClientForm client={selectedClient} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={showClientDetail} onOpenChange={setShowClientDetail}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Klien</DialogTitle>
          </DialogHeader>
          {selectedClient && <ClientDetail client={selectedClient} onClose={handleDetailClose} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
