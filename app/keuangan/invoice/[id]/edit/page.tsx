"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { invoicesData } from "@/data/invoices"
import { InvoiceForm } from "@/components/invoice-form"
import Link from "next/link"

export default function EditInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string

  // Find the invoice by ID
  const invoice = invoicesData.find((inv) => inv.id === invoiceId)

  if (!invoice) {
    return (
      <div className="flex min-h-screen bg-[#f9fafb]">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-2xl font-semibold text-[#111827]">Invoice Tidak Ditemukan</h1>
          </div>
          <p>Invoice dengan ID {invoiceId} tidak ditemukan.</p>
          <Button className="mt-4" onClick={() => router.push("/keuangan")}>
            Kembali ke Halaman Keuangan
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-4" asChild>
            <Link href={`/keuangan/invoice/${invoiceId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-[#111827]">Edit Invoice</h1>
        </div>

        <InvoiceForm invoice={invoice} onSuccess={() => router.push(`/keuangan/invoice/${invoiceId}`)} />
      </main>
    </div>
  )
}
