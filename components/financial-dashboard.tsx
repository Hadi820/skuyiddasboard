"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, FileText, Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { getAllInvoices, getInvoiceStats } from "@/services/invoice-service"

export function FinancialDashboard() {
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalOutstanding: 0,
    totalOverdue: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState<any[]>([])

  useEffect(() => {
    // Load financial stats
    setStats(getInvoiceStats())

    // Load recent invoices
    const allInvoices = getAllInvoices()
    const recent = allInvoices
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 3)
    setRecentInvoices(recent)
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { bg: "bg-green-100", text: "text-green-800", label: "Terbayar" },
      sent: { bg: "bg-blue-100", text: "text-blue-800", label: "Terkirim" },
      overdue: { bg: "bg-red-100", text: "text-red-800", label: "Jatuh Tempo" },
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      cancelled: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Dibatalkan" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {stats.totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Dibayar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Rp {stats.totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -5% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jatuh Tempo</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Rp {stats.totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Perlu tindak lanjut segera</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice Terbaru</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/keuangan">Lihat Semua</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada invoice</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-blue-600">
                        <Link href={`/keuangan/invoice/${invoice.id}`} className="hover:underline">
                          {invoice.invoiceNumber}
                        </Link>
                      </h4>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-sm text-gray-600">{invoice.clientName}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(invoice.issueDate), "dd MMM yyyy", { locale: id })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">Rp {invoice.total.toLocaleString()}</p>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/keuangan/invoice/${invoice.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
