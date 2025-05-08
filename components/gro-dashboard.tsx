"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getGroSummary, getReservationsByGro } from "@/services/reservation-service"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReservationDetail } from "@/components/reservation-detail"

export function GroDashboard() {
  const [groSummary, setGroSummary] = useState<Array<{ gro: string; count: number; revenue: number }>>([])
  const [selectedGro, setSelectedGro] = useState<string | null>(null)
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null)
  const [dataVersion, setDataVersion] = useState(0)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isListOpen, setIsListOpen] = useState(false)

  useEffect(() => {
    const summary = getGroSummary()
    setGroSummary(summary)
  }, [dataVersion])

  const getGroReservations = (gro: string) => {
    return getReservationsByGro(gro)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRandomColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const handleOpenReservationList = (gro: string) => {
    setSelectedGro(gro)
    setIsListOpen(true)
  }

  const handleOpenReservationDetail = (reservation: any) => {
    setSelectedReservation(reservation)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cards">Kartu Admin Staff</TabsTrigger>
          <TabsTrigger value="list">Daftar Admin Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groSummary.map((gro) => (
              <Card key={gro.gro} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className={`${getRandomColor(gro.gro)} text-white`}>
                        <AvatarFallback>{getInitials(gro.gro)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{gro.gro}</CardTitle>
                        <CardDescription>Admin Staff</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{gro.count} Reservasi</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Total Pendapatan:</span>
                      <span className="font-medium">Rp {gro.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Rata-rata per Reservasi:</span>
                      <span className="font-medium">
                        Rp {(gro.revenue / gro.count).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => handleOpenReservationList(gro.gro)}
                    >
                      Lihat Reservasi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Admin Staff</CardTitle>
              <CardDescription>Ringkasan kinerja semua Admin Staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin Staff
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Reservasi
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Pendapatan
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rata-rata per Reservasi
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {groSummary.map((gro) => (
                      <tr key={gro.gro} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className={`h-8 w-8 ${getRandomColor(gro.gro)} text-white`}>
                              <AvatarFallback>{getInitials(gro.gro)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{gro.gro}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{gro.count}</td>
                        <td className="px-4 py-3">Rp {gro.revenue.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          Rp {(gro.revenue / gro.count).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenReservationList(gro.gro)}>
                            Lihat Reservasi
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Admin Staff Reservations Dialog */}
      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Reservasi {selectedGro}</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Booking</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pemesan</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Check-in
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detail Pesanan
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedGro &&
                  getGroReservations(selectedGro).map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{reservation.bookingCode}</td>
                      <td className="px-4 py-3">{reservation.customerName}</td>
                      <td className="px-4 py-3">
                        {format(parseISO(reservation.checkIn), "dd MMM yyyy", { locale: id })}
                      </td>
                      <td className="px-4 py-3">{reservation.orderDetails}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                            reservation.status === "Selesai"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : reservation.status === "Proses"
                                ? "bg-[#fef9c3] text-[#854d0e]"
                                : reservation.status === "Pending"
                                  ? "bg-[#dbeafe] text-[#1e40af]"
                                  : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenReservationDetail(reservation)}>
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsListOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reservation Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Reservasi</DialogTitle>
          </DialogHeader>
          {selectedReservation && <ReservationDetail reservation={selectedReservation} />}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
