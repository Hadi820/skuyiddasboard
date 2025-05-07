"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { invoicesData } from "@/data/invoices"
import { expensesData } from "@/data/expenses"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function CashFlowReport() {
  const [period, setPeriod] = useState("month")

  // Group transactions by date
  const transactions = [
    ...invoicesData
      .filter((inv) => inv.status === "paid")
      .map((inv) => ({
        date: inv.paymentDate || inv.issueDate,
        type: "income",
        description: `Pembayaran Invoice #${inv.invoiceNumber}`,
        amount: inv.total,
      })),
    ...expensesData
      .filter((exp) => exp.status === "completed")
      .map((exp) => ({
        date: exp.date,
        type: "expense",
        description: exp.description,
        amount: exp.amount,
      })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calculate opening balance (assume 0 for simplicity)
  const openingBalance = 0

  // Calculate closing balance
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const closingBalance = openingBalance + totalIncome - totalExpenses

  // Calculate running balance for each transaction
  let runningBalance = openingBalance
  const transactionsWithBalance = transactions.map((t, i) => {
    if (i === 0) {
      runningBalance = openingBalance + (t.type === "income" ? t.amount : -t.amount)
    } else {
      runningBalance += t.type === "income" ? t.amount : -t.amount
    }
    return { ...t, balance: runningBalance }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Laporan Arus Kas</h2>
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
            <CardTitle className="text-sm font-medium text-gray-500">Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp {totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saldo Akhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Rp {closingBalance.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Pemasukan
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Pengeluaran
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-3 text-sm font-medium">
                    Saldo Awal
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-right">Rp {openingBalance.toLocaleString()}</td>
                </tr>
                {transactionsWithBalance.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {format(new Date(transaction.date), "dd MMM yyyy", { locale: id })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-4 py-3 text-sm font-medium text-right text-green-600">
                      {transaction.type === "income" ? `Rp ${transaction.amount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-right text-red-600">
                      {transaction.type === "expense" ? `Rp ${transaction.amount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-right">
                      Rp {transaction.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-3 text-sm font-bold">
                    Saldo Akhir
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-right">Rp {closingBalance.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
