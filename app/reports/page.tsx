"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportButton } from "@/components/export-button"
import { RevenueChart } from "@/components/revenue-chart"
import { reservationsData } from "@/data/reservations"
import { clientsData } from "@/data/clients"

export default function ReportsPage() {
  const [period, setPeriod] = useState("month")
  const [reportType, setReportType] = useState("revenue")

  // Ensure reservationsData exists and is an array
  const safeReservationsData = Array.isArray(reservationsData) ? reservationsData : []

  // Calculate summary metrics with safety checks
  const totalRevenue = safeReservationsData.reduce((sum, res) => {
    if (!res || !res.price) return sum
    // Extract numeric value from price string (e.g., "Rp 5.000.000" -> 5000000)
    const priceString = String(res.price)
    const price = priceString ? Number.parseInt(priceString.replace(/\D/g, "")) || 0 : 0
    return sum + price
  }, 0)

  const totalReservations = safeReservationsData.length
  const completedReservations = safeReservationsData.filter((res) => res?.status?.toLowerCase() === "lunas").length
  const pendingReservations = safeReservationsData.filter((res) => res?.status?.toLowerCase() === "dp").length
  const newReservations = safeReservationsData.filter((res) => res?.status?.toLowerCase() === "baru").length

  // Prevent division by zero
  const occupancyRate = totalReservations > 0 ? Math.round((completedReservations / totalReservations) * 100) : 0
  const averageRevenue = totalReservations > 0 ? Math.round(totalRevenue / totalReservations) : 0

  // Safe percentage calculation function
  const safePercentage = (part, total) => {
    if (!total || total === 0) return 0
    return Math.round((part / total) * 100)
  }

  // Ensure clientsData exists and is an array
  const safeClientsData = Array.isArray(clientsData) ? clientsData : []

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Laporan</h1>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="quarter">Kuartal Ini</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
            <ExportButton data={safeReservationsData} filename={`laporan-${reportType}`} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+12% dari periode sebelumnya</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Jumlah Reservasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReservations}</div>
              <p className="text-xs text-green-600 mt-1">+8% dari periode sebelumnya</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Tingkat Okupansi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-green-600 mt-1">+5% dari periode sebelumnya</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Rata-rata Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {averageRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+3% dari periode sebelumnya</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Status Reservasi</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Lunas</span>
                  </div>
                  <span className="font-medium">
                    {completedReservations} ({safePercentage(completedReservations, totalReservations)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${safePercentage(completedReservations, totalReservations)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mb-2 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>DP</span>
                  </div>
                  <span className="font-medium">
                    {pendingReservations} ({safePercentage(pendingReservations, totalReservations)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: `${safePercentage(pendingReservations, totalReservations)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mb-2 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                    <span>Baru</span>
                  </div>
                  <span className="font-medium">
                    {newReservations} ({safePercentage(newReservations, totalReservations)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gray-500 h-2.5 rounded-full"
                    style={{ width: `${safePercentage(newReservations, totalReservations)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detail Laporan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={reportType} onValueChange={setReportType}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
                  <TabsTrigger value="reservations">Reservasi</TabsTrigger>
                  <TabsTrigger value="clients">Klien</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="revenue" className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pendapatan
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah Reservasi
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rata-rata
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Perubahan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {["Januari", "Februari", "Maret", "April", "Mei"].map((month, i) => {
                        const monthlyRevenue = 5000000 + i * 1500000
                        const monthlyReservations = 8 + i
                        const monthlyAverage =
                          monthlyReservations > 0 ? Math.round(monthlyRevenue / monthlyReservations) : 0

                        return (
                          <tr key={month} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">{month} 2025</td>
                            <td className="px-4 py-3 text-sm">Rp {monthlyRevenue.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm">{monthlyReservations}</td>
                            <td className="px-4 py-3 text-sm">
                              Rp {monthlyAverage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                            <td className="px-4 py-3 text-sm text-green-600">+{5 + i}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="reservations" className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pendapatan
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rata-rata Durasi
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % dari Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { category: "Pernikahan", count: 12, revenue: 24000000, duration: 2.5 },
                        { category: "Perusahaan", count: 8, revenue: 16000000, duration: 2 },
                        { category: "Perlombaan", count: 5, revenue: 7500000, duration: 1.5 },
                        { category: "Akomodasi", count: 15, revenue: 22500000, duration: 3 },
                        { category: "Lainnya", count: 2, revenue: 3000000, duration: 1 },
                      ].map((item) => (
                        <tr key={item.category} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{item.category}</td>
                          <td className="px-4 py-3 text-sm">{item.count}</td>
                          <td className="px-4 py-3 text-sm">Rp {item.revenue.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">{item.duration} hari</td>
                          <td className="px-4 py-3 text-sm">{safePercentage(item.count, 42)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="clients" className="mt-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Klien
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Reservasi
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Pendapatan
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reservasi Terakhir
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {safeClientsData.slice(0, 5).map((client) => {
                        // Ensure client has all required properties
                        if (!client) return null

                        // Add default values for missing properties
                        const safeClient = {
                          id: client.id || 0,
                          name: client.name || "Tanpa Nama",
                          reservations: client.reservations || 0,
                          revenue: client.revenue || 0,
                          status: client.status || "tidak-aktif",
                        }

                        return (
                          <tr key={safeClient.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium">{safeClient.name.charAt(0)}</span>
                                </div>
                                <div className="font-medium">{safeClient.name}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">{safeClient.reservations}</td>
                            <td className="px-4 py-3 text-sm">Rp {safeClient.revenue.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm">05 Mei 2025</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                  safeClient.status === "aktif"
                                    ? "bg-[#dcfce7] text-[#166534]"
                                    : safeClient.status === "tidak-aktif"
                                      ? "bg-[#fee2e2] text-[#991b1b]"
                                      : "bg-[#fef9c3] text-[#854d0e]"
                                }`}
                              >
                                {safeClient.status === "aktif"
                                  ? "Aktif"
                                  : safeClient.status === "tidak-aktif"
                                    ? "Tidak Aktif"
                                    : "Potensial"}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
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
