"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import {
  getGroSummaryWithCommission,
  getGroCommissionHistory,
  updateCommissionStatus,
  GRO_COMMISSION_PER_RESERVATION,
} from "@/services/gro-service"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GroCommissionDashboard() {
  const [groSummary, setGroSummary] = useState<
    Array<{
      gro: string
      count: number
      revenue: number
      commission: number
      paidCommission: number
      pendingCommission: number
    }>
  >([])
  const [selectedGro, setSelectedGro] = useState<string | null>(null)
  const [commissionHistory, setCommissionHistory] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    const summary = getGroSummaryWithCommission()
    setGroSummary(summary)
  }, [])

  useEffect(() => {
    if (selectedGro) {
      const history = getGroCommissionHistory(selectedGro)
      setCommissionHistory(history)
    }
  }, [selectedGro])

  const handleStatusChange = (id: string, status: "pending" | "paid" | "cancelled") => {
    updateCommissionStatus(id, status)
    if (selectedGro) {
      const history = getGroCommissionHistory(selectedGro)
      setCommissionHistory(history)
      const summary = getGroSummaryWithCommission()
      setGroSummary(summary)
    }
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

  const filteredHistory =
    filterStatus === "all" ? commissionHistory : commissionHistory.filter((history) => history.status === filterStatus)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Komisi GRO</h2>
        <div className="text-sm text-gray-500">
          Komisi per reservasi:{" "}
          <span className="font-medium">Rp {GRO_COMMISSION_PER_RESERVATION.toLocaleString()}</span>
        </div>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cards">Kartu Komisi</TabsTrigger>
          <TabsTrigger value="list">Daftar Komisi</TabsTrigger>
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
                        <CardDescription>Penanggung Jawab</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{gro.count} Reservasi</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Total Komisi:</span>
                      <span className="font-medium">Rp {gro.commission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Komisi Dibayar:</span>
                      <span className="font-medium text-green-600">Rp {gro.paidCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Komisi Tertunda:</span>
                      <span className="font-medium text-yellow-600">Rp {gro.pendingCommission.toLocaleString()}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-2" onClick={() => setSelectedGro(gro.gro)}>
                      Lihat Riwayat
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
              <CardTitle>Daftar Komisi GRO</CardTitle>
              <CardDescription>Ringkasan komisi untuk semua GRO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">GRO</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Reservasi
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Komisi
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Komisi Dibayar
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Komisi Tertunda
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
                        <td className="px-4 py-3">Rp {gro.commission.toLocaleString()}</td>
                        <td className="px-4 py-3 text-green-600">Rp {gro.paidCommission.toLocaleString()}</td>
                        <td className="px-4 py-3 text-yellow-600">Rp {gro.pendingCommission.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedGro(gro.gro)}>
                            Lihat Riwayat
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

      {/* GRO Commission History Dialog */}
      {selectedGro && (
        <Dialog open={!!selectedGro} onOpenChange={(open) => !open && setSelectedGro(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Riwayat Komisi {selectedGro}</DialogTitle>
            </DialogHeader>

            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-gray-500 mr-4">Total Komisi: </span>
                <span className="font-medium">
                  Rp {groSummary.find((g) => g.gro === selectedGro)?.commission.toLocaleString() || 0}
                </span>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Tertunda</SelectItem>
                  <SelectItem value="paid">Dibayar</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kode Booking
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Pemesan
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((history) => (
                      <tr key={history.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{history.bookingCode}</td>
                        <td className="px-4 py-3">{history.customerName}</td>
                        <td className="px-4 py-3">{format(parseISO(history.date), "dd MMM yyyy", { locale: id })}</td>
                        <td className="px-4 py-3 font-medium">Rp {history.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                              history.status === "paid"
                                ? "bg-[#dcfce7] text-[#166534]"
                                : history.status === "pending"
                                  ? "bg-[#fef9c3] text-[#854d0e]"
                                  : "bg-[#fee2e2] text-[#991b1b]"
                            }`}
                          >
                            {history.status === "paid" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Dibayar
                              </>
                            ) : history.status === "pending" ? (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Tertunda
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Dibatalkan
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {history.status === "pending" ? (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleStatusChange(history.id, "paid")}
                              >
                                Bayar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleStatusChange(history.id, "cancelled")}
                              >
                                Batalkan
                              </Button>
                            </div>
                          ) : history.status === "cancelled" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                              onClick={() => handleStatusChange(history.id, "pending")}
                            >
                              Aktifkan
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-500">Sudah dibayar</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Tidak ada riwayat komisi yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
