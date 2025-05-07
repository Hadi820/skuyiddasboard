"use client"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { reservationsData } from "@/data/reservations"

export function RecentInvoices() {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  // Get reservations with payment status
  const invoices = [...reservationsData]
    .filter((res) => res.status !== "batal")
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Tidak ada invoice terbaru</p>
        </div>
      ) : (
        invoices.map((invoice) => {
          const isPaid = invoice.status === "selesai"
          const isPartiallyPaid = invoice.customerDeposit > 0 && invoice.status === "proses"

          return (
            <div key={invoice.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-[#111827]">{invoice.bookingCode}</h3>
                  <p className="text-sm text-gray-500">{invoice.customerName}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isPaid
                      ? "bg-[#dcfce7] text-[#166534]"
                      : isPartiallyPaid
                        ? "bg-[#fef9c3] text-[#854d0e]"
                        : "bg-[#fee2e2] text-[#991b1b]"
                  }`}
                >
                  {isPaid ? "Lunas" : isPartiallyPaid ? "DP" : "Belum Bayar"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div>
                  <p className="text-gray-500">Tanggal</p>
                  <p>{format(new Date(invoice.bookingDate), "dd MMM yyyy", { locale: id })}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium">{formatCurrency(invoice.finalPrice)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">DP Tamu</p>
                  <p>{formatCurrency(invoice.customerDeposit)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sisa</p>
                  <p>{formatCurrency(invoice.remainingPayment)}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href={`/keuangan/invoice/${invoice.id}`}>
                  <Button variant="ghost" size="sm" className="text-[#4f46e5] hover:text-[#4f46e5] hover:bg-[#eef2ff]">
                    Lihat Detail
                  </Button>
                </Link>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
