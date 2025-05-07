"use client"

import { useState } from "react"
import { CalendarIcon, Edit, Mail, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ClientForm } from "@/components/client-form"
import { reservationsData } from "@/data/reservations"

interface ClientDetailProps {
  client: any
  onClose: () => void
}

export function ClientDetail({ client, onClose }: ClientDetailProps) {
  const [showEditForm, setShowEditForm] = useState(false)

  // Get client reservations
  const clientReservations = reservationsData.filter((res) => res.person?.toLowerCase() === client.name.toLowerCase())

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <p className="text-gray-500">{client.company || "Individu"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={() => setShowEditForm(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium">{client.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="font-medium">{client.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Bergabung Sejak</p>
                <p className="font-medium">01 Januari 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Reservasi</p>
                <p className="text-2xl font-bold">{client.reservations}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Pendapatan</p>
                <p className="text-2xl font-bold">Rp {client.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                    client.status === "aktif"
                      ? "bg-[#dcfce7] text-[#166534]"
                      : client.status === "tidak-aktif"
                        ? "bg-[#fee2e2] text-[#991b1b]"
                        : "bg-[#fef9c3] text-[#854d0e]"
                  }`}
                >
                  {client.status === "aktif" ? "Aktif" : client.status === "tidak-aktif" ? "Tidak Aktif" : "Potensial"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reservasi Terakhir</p>
                <p className="font-medium">{clientReservations.length > 0 ? "05 Mei 2025" : "Belum ada reservasi"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Reservasi</CardTitle>
          <CardDescription>Daftar reservasi yang pernah dibuat oleh klien ini</CardDescription>
        </CardHeader>
        <CardContent>
          {clientReservations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Tim</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clientReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{res.title}</td>
                      <td className="px-4 py-3 text-sm">{res.type}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(res.start).toLocaleDateString("id-ID")} -{" "}
                        {new Date(res.end).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-sm">{res.price}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                            res.status.toLowerCase() === "lunas"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : res.status.toLowerCase() === "dp"
                                ? "bg-[#fef9c3] text-[#854d0e]"
                                : "bg-[#e5e7eb] text-[#374151]"
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Klien ini belum memiliki reservasi</p>
              <Button className="mt-4">Buat Reservasi Baru</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Klien</DialogTitle>
          </DialogHeader>
          <ClientForm
            client={client}
            onSuccess={() => {
              setShowEditForm(false)
              onClose()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
