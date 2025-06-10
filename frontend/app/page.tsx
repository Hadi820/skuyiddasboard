import { ArrowUpIcon, SearchIcon } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { RevenueCard } from "@/components/revenue-card"
import { RevenueChart } from "@/components/revenue-chart"
import { ReservationList } from "@/components/reservation-list"
import { ReservationTable } from "@/components/reservation-table"
import { KpiCards } from "@/components/kpi-cards"
import { BookingSchedule } from "@/components/booking-schedule"
import { WhatsappKPI } from "@/components/whatsapp-kpi"
import { ExportButton } from "@/components/export-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ReservationForm } from "@/components/reservation-form"
import { Toaster } from "@/components/toaster"

export default function Dashboard() {
  // Sample data for export
  const reservationData = [
    {
      id: 1,
      name: "Rombongan Keluarga Wijaya",
      person: "Agus Wijaya",
      category: "Pernikahan",
      date: "05-07 Mei 2025",
      price: "Rp 4.500.000",
      dp: "Rp 4.500.000",
      remaining: "Rp 0",
      status: "Lunas",
    },
    {
      id: 2,
      name: "PT Maju Bersama",
      person: "Dewi Sartika",
      category: "Akomodasi",
      date: "10-12 Mei 2025",
      price: "Rp 7.200.000",
      dp: "Rp 3.600.000",
      remaining: "Rp 3.600.000",
      status: "DP",
    },
    // More data...
  ]

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent text-sm"
              />
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">D</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-[#111827]">Pendapatan</h2>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-200 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent">
                    <option>Bulan Ini</option>
                    <option>Bulan Lalu</option>
                    <option>3 Bulan Terakhir</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RevenueCard />
                <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Orderan</h3>
                      <div className="mt-1 flex items-baseline">
                        <p className="text-2xl font-semibold">42</p>
                        <span className="ml-2 flex items-center text-xs font-medium text-green-600">
                          <ArrowUpIcon className="h-3 w-3 mr-1" />
                          8% dari bulan lalu
                        </span>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                          stroke="#4f46e5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
                          stroke="#4f46e5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 12H15"
                          stroke="#4f46e5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 16H15"
                          stroke="#4f46e5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-[#111827] mb-4">Grafik Pendapatan</h2>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <RevenueChart />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-[#111827]">Detail Reservasi</h2>
                <div className="flex items-center gap-2">
                  <Button
                    className="px-3 py-1.5 border border-gray-200 rounded-md text-sm flex items-center gap-1 hover:bg-gray-50"
                    variant="outline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 6H21M3 12H21M3 18H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Filter
                  </Button>
                  <ExportButton data={reservationData} filename="detail-reservasi" />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="px-3 py-1.5 bg-[#4f46e5] text-white rounded-md text-sm flex items-center gap-1 hover:bg-[#4338ca]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 5V19M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Tambah Baru
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Tambah Reservasi Baru</DialogTitle>
                      </DialogHeader>
                      <ReservationForm />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ReservationTable />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-[#111827]">Data KPI Admin</h2>
                <Link
                  href="/calendar"
                  className="text-[#4f46e5] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  Lihat Kalender
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 5L16 12L9 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KpiCards />
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <BookingSchedule />
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <WhatsappKPI />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-[#111827]">Reservasi</h2>
                <Link
                  href="/calendar"
                  className="text-[#4f46e5] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  Lihat Kalender
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 5L16 12L9 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
              <div className="space-y-4">
                <ReservationList />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
