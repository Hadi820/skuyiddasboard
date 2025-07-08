"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceList } from "@/components/invoice-list"
import { DollarSign, FileText, TrendingUp, AlertCircle } from "lucide-react"
import { invoiceService } from "@/services/invoice-service"
import { formatCurrency } from "@/lib/utils"

export default function KeuanganPage() {
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    count: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await invoiceService.getInvoiceStats()
      setStats(data)
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.total),
      description: "Total semua invoice",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Terbayar",
      value: formatCurrency(stats.paid),
      description: "Invoice yang sudah dibayar",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: formatCurrency(stats.pending),
      description: "Invoice yang belum dibayar",
      icon: FileText,
      color: "text-yellow-600",
    },
    {
      title: "Jatuh Tempo",
      value: formatCurrency(stats.overdue),
      description: "Invoice yang terlambat",
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Keuangan</h1>
            <p className="text-gray-600">Kelola invoice dan keuangan hotel</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Invoice List */}
          <InvoiceList />
        </div>
      </div>
    </div>
  )
}
