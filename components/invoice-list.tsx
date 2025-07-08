"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Search, Plus } from "lucide-react"
import { type Invoice, invoiceService } from "@/services/invoice-service"
import { formatCurrency } from "@/lib/utils"

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const data = await invoiceService.getAllInvoices()
      setInvoices(data)
    } catch (error) {
      console.error("Failed to load invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
        <CardContent className="p-6">
          <div className="text-center">Loading invoices...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Daftar Invoice</CardTitle>
            <CardDescription>Kelola semua invoice hotel</CardDescription>
          </div>
          <Button asChild>
            <Link href="/keuangan/invoice/new">
              <Plus className="h-4 w-4 mr-2" />
              Buat Invoice
            </Link>
          </Button>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari invoice atau klien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Terkirim</option>
            <option value="paid">Terbayar</option>
            <option value="overdue">Jatuh Tempo</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">No. Invoice</th>
                <th className="text-left py-3 px-4">Klien</th>
                <th className="text-left py-3 px-4">Tanggal</th>
                <th className="text-left py-3 px-4">Jatuh Tempo</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link
                      href={`/keuangan/invoice/${invoice.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{invoice.clientName}</td>
                  <td className="py-3 px-4">{new Date(invoice.date).toLocaleDateString("id-ID")}</td>
                  <td className="py-3 px-4">{new Date(invoice.dueDate).toLocaleDateString("id-ID")}</td>
                  <td className="py-3 px-4 font-medium">{formatCurrency(invoice.total)}</td>
                  <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/keuangan/invoice/${invoice.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Tidak ada invoice yang sesuai dengan filter"
                : "Belum ada invoice"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
