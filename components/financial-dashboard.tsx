"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"
import { invoicesData } from "@/data/invoices"
import { expensesData } from "@/data/expenses"
import Link from "next/link"

export function FinancialDashboard() {
  const [period, setPeriod] = useState("month")

  // Calculate financial metrics
  const totalIncome = invoicesData.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0)

  const totalExpenses = expensesData
    .filter((exp) => exp.status === "completed")
    .reduce((sum, exp) => sum + exp.amount, 0)

  const netProfit = totalIncome - totalExpenses
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

  const pendingInvoices = invoicesData.filter((inv) => inv.status !== "paid" && inv.status !== "cancelled").length
  const pendingPayments = invoicesData
    .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
    .reduce((sum, inv) => sum + inv.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dashboard Keuangan</h2>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Kuartal Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
              <SelectItem value="custom">Kustom</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Ekspor Laporan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/keuangan?tab=invoices" className="block">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600 mr-3 p-1.5 bg-green-100 rounded-md" />
                <div>
                  <div className="text-2xl font-bold">Rp {totalIncome.toLocaleString()}</div>
                  <p className="text-xs flex items-center text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    12% dari periode sebelumnya
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/keuangan?tab=expenses" className="block">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-red-600 mr-3 p-1.5 bg-red-100 rounded-md" />
                <div>
                  <div className="text-2xl font-bold">Rp {totalExpenses.toLocaleString()}</div>
                  <p className="text-xs flex items-center text-red-600 mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    5% dari periode sebelumnya
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/keuangan?tab=profit-loss" className="block">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Laba Bersih</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-3 p-1.5 bg-blue-100 rounded-md" />
                <div>
                  <div className="text-2xl font-bold">Rp {netProfit.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Margin: {profitMargin.toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/keuangan?tab=invoices" className="block">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Menunggu Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-yellow-600 mr-3 p-1.5 bg-yellow-100 rounded-md" />
                <div>
                  <div className="text-2xl font-bold">Rp {pendingPayments.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">{pendingInvoices} invoice belum dibayar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Tabs defaultValue="income">
        <TabsList className="mb-4">
          <TabsTrigger value="income">Pendapatan</TabsTrigger>
          <TabsTrigger value="expenses">Pengeluaran</TabsTrigger>
          <TabsTrigger value="cash-flow">Arus Kas</TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Tren Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Grafik tren pendapatan akan ditampilkan di sini</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Tren Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Grafik tren pengeluaran akan ditampilkan di sini</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow">
          <Card>
            <CardHeader>
              <CardTitle>Tren Arus Kas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Grafik tren arus kas akan ditampilkan di sini</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. Invoice
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoicesData.slice(0, 5).map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">
                        <Link href={`/keuangan/invoice/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.clientName}</td>
                      <td className="px-4 py-3 text-sm font-medium">Rp {invoice.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                            invoice.status === "paid"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : invoice.status === "sent"
                                ? "bg-[#dbeafe] text-[#1e40af]"
                                : invoice.status === "overdue"
                                  ? "bg-[#fee2e2] text-[#991b1b]"
                                  : invoice.status === "draft"
                                    ? "bg-[#e5e7eb] text-[#374151]"
                                    : "bg-[#fef9c3] text-[#854d0e]"
                          }`}
                        >
                          {invoice.status === "paid"
                            ? "Terbayar"
                            : invoice.status === "sent"
                              ? "Terkirim"
                              : invoice.status === "overdue"
                                ? "Jatuh Tempo"
                                : invoice.status === "draft"
                                  ? "Draft"
                                  : "Dibatalkan"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/keuangan?tab=invoices">Lihat Semua Invoice</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expensesData.slice(0, 5).map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{expense.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{expense.category}</td>
                      <td className="px-4 py-3 text-sm font-medium">Rp {expense.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                            expense.status === "completed"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : expense.status === "pending"
                                ? "bg-[#fef9c3] text-[#854d0e]"
                                : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                        >
                          {expense.status === "completed"
                            ? "Selesai"
                            : expense.status === "pending"
                              ? "Menunggu"
                              : "Dibatalkan"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/keuangan?tab=expenses">Lihat Semua Pengeluaran</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
