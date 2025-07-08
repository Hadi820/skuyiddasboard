"use client"

import { Sidebar } from "@/components/sidebar"
import { InvoiceList } from "@/components/invoice-list"

export default function KeuanganPage() {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Keuangan</h1>
          <p className="text-gray-600">Kelola invoice dan keuangan villa</p>
        </div>
        <InvoiceList />
      </main>
    </div>
  )
}
