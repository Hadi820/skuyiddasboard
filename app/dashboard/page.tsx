"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/date-range-picker"
import { RevenueChart } from "@/components/revenue-chart"
import { ReservationTable } from "@/components/reservation-table"
import { UpcomingReservations } from "@/components/upcoming-reservations"
import { RecentInvoices } from "@/components/recent-invoices"
import { NotificationList } from "@/components/notification-list"
import { QuickActions } from "@/components/quick-actions"
import { KpiCards } from "@/components/kpi-cards"
import { GroDashboard } from "@/components/gro-dashboard"
import { getAllReservations, loadReservationsFromLocalStorage } from "@/services/reservation-service"
import { BarChart3, CalendarDays, CreditCard, Users } from "lucide-react"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  })
  const [reservations, setReservations] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Load reservations from localStorage if available
    loadReservationsFromLocalStorage()
    setReservations(getAllReservations())
  }, [])

  // Calculate summary metrics
  const totalRevenue = reservations.reduce((sum, res) => sum + res.finalPrice, 0)
  const totalProfit = reservations.reduce((sum, res) => sum + res.profit, 0)
  const totalDeposit = reservations.reduce((sum, res) => sum + res.customerDeposit, 0)
  const totalReservations = reservations.length
  const completedReservations = reservations.filter((res) => res.status === "Selesai").length
  const pendingReservations = reservations.filter((res) => res.status === "Proses").length
  const cancelledReservations = reservations.filter((res) => res.status === "Batal").length

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-[#111827]">Dashboard</h1>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Ringkasan</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Reservasi</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Staff</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Keuangan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-green-600 mt-1">+12% dari periode sebelumnya</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Keuntungan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
                  <p className="text-xs text-green-600 mt-1">+8% dari periode sebelumnya</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total DP Masuk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalDeposit)}</div>
                  <p className="text-xs text-green-600 mt-1">+15% dari periode sebelumnya</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Jumlah Reservasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReservations}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-xs">{completedReservations} Selesai</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                      <span className="text-xs">{pendingReservations} Proses</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                      <span className="text-xs">{cancelledReservations} Batal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Grafik Pendapatan</CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueChart />
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Aksi Cepat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuickActions />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Notifikasi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NotificationList />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <Tabs defaultValue="reservations">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Aktivitas Terbaru</CardTitle>
                      <TabsList>
                        <TabsTrigger value="reservations">Reservasi</TabsTrigger>
                        <TabsTrigger value="invoices">Invoice</TabsTrigger>
                      </TabsList>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TabsContent value="reservations" className="mt-0">
                      <ReservationTable />
                    </TabsContent>
                    <TabsContent value="invoices" className="mt-0">
                      <RecentInvoices />
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Reservasi Mendatang</CardTitle>
                </CardHeader>
                <CardContent>
                  <UpcomingReservations />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KpiCards />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Reservasi</CardTitle>
              </CardHeader>
              <CardContent>
                <ReservationTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <GroDashboard />
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Keuntungan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total DP Masuk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalDeposit)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Harga Stor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue - totalProfit)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Invoice</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentInvoices />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
