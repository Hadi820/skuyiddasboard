"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText } from "lucide-react"
import { type Invoice, invoiceService } from "@/services/invoice-service"
import { formatCurrency } from "@/lib/utils"

export function RecentInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentInvoices()
  }, [])

  const loadRecentInvoices = async () => {
    try {
      const allInvoices = await invoiceService.getAllInvoices()
      // Get 5 most recent invoices
      const recent = allInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
      setInvoices(recent)
    } catch (error) {
      console.error("Failed to load recent invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-100 text-green-800",
      sent: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
    }

    const labels = {
      paid: "Terbayar",
      sent: "Terkirim",
      overdue: "Jatuh Tempo",
      draft: "Draft",
    }

    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Invoice Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Invoice Terbaru
        </CardTitle>
        <CardDescription>5 invoice terbaru yang dibuat</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/keuangan/invoice/${invoice.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {invoice.number}
                  </Link>
                  {getStatusBadge(invoice.status)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{invoice.clientName}</p>
                <p className="text-sm font-medium">{formatCurrency(invoice.total)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString("id-ID")}</p>
                <Button variant="outline" size="sm" asChild className="mt-2 bg-transparent">
                  <Link href={`/keuangan/invoice/${invoice.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Link>
                </Button>
              </div>
            </div>
          ))}

          {invoices.length === 0 && <div className="text-center py-8 text-gray-500">Belum ada invoice</div>}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/keuangan">Lihat Semua Invoice</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
