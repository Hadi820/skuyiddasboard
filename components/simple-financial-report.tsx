"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, BarChart3, PieChart, TrendingUp } from "lucide-react"
import { invoicesData } from "@/data/invoices"
import { expensesData } from "@/data/expenses"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  Cell,
  Pie,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function SimpleFinancialReport() {
  const [period, setPeriod] = useState("month")
  const [reportType, setReportType] = useState("summary")

  // Calculate summary data
  const totalIncome = invoicesData.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0)

  const totalExpenses = expensesData.reduce((sum, exp) => sum + exp.amount, 0)
  const netProfit = totalIncome - totalExpenses

  // Generate monthly data for charts
  const monthlyData = [
    { name: "Jan", pendapatan: 12500000, pengeluaran: 8200000, profit: 4300000 },
    { name: "Feb", pendapatan: 15800000, pengeluaran: 9100000, profit: 6700000 },
    { name: "Mar", pendapatan: 14200000, pengeluaran: 8700000, profit: 5500000 },
    { name: "Apr", pendapatan: 16500000, pengeluaran: 10200000, profit: 6300000 },
    { name: "Mei", pendapatan: 18900000, pengeluaran: 11500000, profit: 7400000 },
    { name: "Jun", pendapatan: 17300000, pengeluaran: 10800000, profit: 6500000 },
  ]

  // Generate category data for pie chart
  const categoryData = [
    { name: "Akomodasi", value: 45 },
    { name: "Event", value: 25 },
    { name: "Photoshoot", value: 15 },
    { name: "Meeting", value: 10 },
    { name: "Lainnya", value: 5 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Kuartal Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Jenis laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Ringkasan</SelectItem>
              <SelectItem value="income">Pendapatan</SelectItem>
              <SelectItem value="expenses">Pengeluaran</SelectItem>
              <SelectItem value="profit">Laba/Rugi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Ekspor Laporan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+12% dari periode sebelumnya</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp {totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-red-600 mt-1">+5% dari periode sebelumnya</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Laba Bersih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Rp {netProfit.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">+18% dari periode sebelumnya</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="chart" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Grafik Tren
          </TabsTrigger>
          <TabsTrigger value="bar" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Grafik Batang
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            Grafik Kategori
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Tren Keuangan Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    pendapatan: {
                      label: "Pendapatan",
                      color: "hsl(var(--chart-1))",
                    },
                    pengeluaran: {
                      label: "Pengeluaran",
                      color: "hsl(var(--chart-2))",
                    },
                    profit: {
                      label: "Laba Bersih",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="pendapatan" stroke="var(--color-pendapatan)" name="Pendapatan" />
                      <Line
                        type="monotone"
                        dataKey="pengeluaran"
                        stroke="var(--color-pengeluaran)"
                        name="Pengeluaran"
                      />
                      <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" name="Laba Bersih" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Pendapatan dan Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    pendapatan: {
                      label: "Pendapatan",
                      color: "hsl(var(--chart-1))",
                    },
                    pengeluaran: {
                      label: "Pengeluaran",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="pendapatan" fill="var(--color-pendapatan)" name="Pendapatan" />
                      <Bar dataKey="pengeluaran" fill="var(--color-pengeluaran)" name="Pengeluaran" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Pendapatan per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Keuangan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Pendapatan</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pendapatan dari Reservasi</span>
                    <span className="font-medium">Rp 15,800,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendapatan dari Event</span>
                    <span className="font-medium">Rp 8,500,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendapatan Lainnya</span>
                    <span className="font-medium">Rp 1,200,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total Pendapatan</span>
                    <span className="font-medium">Rp 25,500,000</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Pengeluaran</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Biaya Operasional</span>
                    <span className="font-medium">Rp 7,200,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Pemasaran</span>
                    <span className="font-medium">Rp 3,500,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Lainnya</span>
                    <span className="font-medium">Rp 1,800,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total Pengeluaran</span>
                    <span className="font-medium">Rp 12,500,000</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium">Laba Bersih</span>
                <span className="text-lg font-bold text-green-600">Rp 13,000,000</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
