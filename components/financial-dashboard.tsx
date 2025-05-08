"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InvoiceList } from "@/components/invoice-list"
import { InvoiceForm } from "@/components/invoice-form"
import { ExpenseForm } from "@/components/expense-form"
import { ProfitLossReport } from "@/components/profit-loss-report"
import { CashFlowReport } from "@/components/cash-flow-report"
import { SimpleFinancialReport } from "@/components/simple-financial-report"
import { StorFundDashboard } from "@/components/stor-fund-dashboard"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"
import { getAllInvoices, getInvoiceStats } from "@/services/invoice-service"
import { getAllExpenses, getTotalExpenses } from "@/services/expense-service"

export function FinancialDashboard() {
  const { toast } = useToast()
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [invoices, setInvoices] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    profit: 0,
    invoiceStats: {
      totalPaid: 0,
      totalOutstanding: 0,
      totalOverdue: 0,
    },
  })

  // Load financial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allInvoices = getAllInvoices()
    const allExpenses = getAllExpenses()
    const invoiceStats = getInvoiceStats()
    const totalExpenses = getTotalExpenses()

    setInvoices(allInvoices)
    setExpenses(allExpenses)
    setStats({
      totalIncome: invoiceStats.totalPaid,
      totalExpenses: totalExpenses,
      profit: invoiceStats.totalPaid - totalExpenses,
      invoiceStats: invoiceStats,
    })
  }

  const handleFormSuccess = () => {
    setShowInvoiceForm(false)
    setShowExpenseForm(false)
    loadData()
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {stats.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Dari invoice yang telah dibayar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp {stats.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Dari semua kategori pengeluaran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              Rp {stats.profit.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Pendapatan dikurangi pengeluaran</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="invoices">Invoice</TabsTrigger>
            <TabsTrigger value="expenses">Pengeluaran</TabsTrigger>
            <TabsTrigger value="reports">Laporan</TabsTrigger>
            <TabsTrigger value="stor">Harga Stor</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button onClick={() => setShowInvoiceForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Buat Invoice
            </Button>
            <Button onClick={() => setShowExpenseForm(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pengeluaran
            </Button>
          </div>
        </div>

        <TabsContent value="invoices" className="space-y-4">
          <InvoiceList />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                        Jumlah
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metode Pembayaran
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenses.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          Tidak ada pengeluaran yang ditemukan
                        </td>
                      </tr>
                    ) : (
                      expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">{expense.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 capitalize">{expense.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{expense.description}</td>
                          <td className="px-4 py-3 text-sm font-medium text-right text-red-600">
                            Rp {expense.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 capitalize">{expense.status}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 capitalize">{expense.paymentMethod}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <SimpleFinancialReport />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfitLossReport />
            <CashFlowReport />
          </div>
        </TabsContent>

        <TabsContent value="stor" className="space-y-4">
          <StorFundDashboard />
        </TabsContent>
      </Tabs>

      <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Buat Invoice Baru</DialogTitle>
          </DialogHeader>
          <InvoiceForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
          </DialogHeader>
          <ExpenseForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
