"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Eye, FileText } from "lucide-react"
import Link from "next/link"
import { getAllInvoices } from "@/services/invoice-service"

export function RecentInvoices() {
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    // Get recent invoices (last 5)
    const allInvoices = getAllInvoices()
    const recentInvoices = allInvoices
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 5)
    setInvoices(recentInvoices)
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Invoice Terbaru</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/keuangan">
            <FileText className="h-4 w-4 mr-2" />
            Lihat Semua
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada invoice</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
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
  )
}
