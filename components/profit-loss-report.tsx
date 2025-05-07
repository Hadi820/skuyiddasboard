"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { invoicesData } from "@/data/invoices"
import { expensesData } from "@/data/expenses"

export function ProfitLossReport() {
  const [period, setPeriod] = useState("month")

  // Calculate total income
  const totalIncome = invoicesData.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0)

  // Calculate total expenses
  const totalExpenses = expensesData
    .filter((exp) => exp.status === "completed")
    .reduce((sum, exp) => sum + exp.amount, 0)

  // Calculate net profit
  const netProfit = totalIncome - totalExpenses

  // Calculate profit margin
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Laporan Laba Rugi</h2>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Kuartal Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Ekspor PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp {totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Laba Bersih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Rp {netProfit.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Margin: {profitMargin.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Laba Rugi</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                  Jumlah (Rp)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Pendapatan</td>
                <td className="px-4 py-3 text-sm font-medium text-right text-green-600">
                  {totalIncome.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Pengeluaran</td>
                <td className="px-4 py-3 text-sm font-medium text-right text-red-600">
                  ({totalExpenses.toLocaleString()})
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm font-bold">Laba Bersih</td>
                <td className="px-4 py-3 text-sm font-bold text-right text-blue-600">{netProfit.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
