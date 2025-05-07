"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleFinancialReport } from "@/components/simple-financial-report"
import { InvoiceList } from "@/components/invoice-list"
import { StorFundDashboard } from "@/components/stor-fund-dashboard"

export default function KeuanganPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-[#111827]">Keuangan</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="invoices">Invoice</TabsTrigger>
            <TabsTrigger value="stor">Harga Stor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SimpleFinancialReport />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <InvoiceList />
          </TabsContent>

          <TabsContent value="stor" className="space-y-6">
            <StorFundDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
