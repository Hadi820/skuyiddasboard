"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getGroSummaryWithCommission } from "@/services/reservation-service"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

export function GROCommissionDashboard() {
  const [groSummary, setGroSummary] = useState<any[]>([])
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const summary = getGroSummaryWithCommission()
    setGroSummary(summary)
  }

  // Calculate commission based on revenue
  const calculateCommission = (revenue: number) => {
    // Example commission calculation: 5% of revenue
    return revenue * 0.05
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Komisi Admin Staff</h2>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd MMMM yyyy", { locale: id })} -{" "}
                      {format(dateRange.to, "dd MMMM yyyy", { locale: id })}
                    </>
                  ) : (
                    format(dateRange.from, "dd MMMM yyyy", { locale: id })
                  )
                ) : (
                  <span>Pilih rentang tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {groSummary.map((gro) => (
          <Card key={gro.gro}>
            <CardHeader className="pb-2">
              <CardTitle>{gro.gro}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Jumlah Reservasi</span>
                  <span className="font-medium">{gro.count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Pendapatan</span>
                  <span className="font-medium">Rp {gro.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium">Komisi (5%)</span>
                  <span className="font-bold text-green-600">
                    Rp {calculateCommission(gro.revenue).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Komisi Admin Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Staff</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Jumlah Reservasi
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Total Pendapatan
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Komisi (5%)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groSummary.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data komisi yang ditemukan
                    </td>
                  </tr>
                ) : (
                  groSummary.map((gro) => (
                    <tr key={gro.gro} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{gro.gro}</td>
                      <td className="px-4 py-3 text-sm text-center">{gro.count}</td>
                      <td className="px-4 py-3 text-sm text-right">Rp {gro.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-green-600">
                        Rp {calculateCommission(gro.revenue).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-3 text-sm font-bold">Total</td>
                  <td className="px-4 py-3 text-sm font-bold text-center">
                    {groSummary.reduce((sum, gro) => sum + gro.count, 0)}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-right">
                    Rp {groSummary.reduce((sum, gro) => sum + gro.revenue, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-right text-green-600">
                    Rp {groSummary.reduce((sum, gro) => sum + calculateCommission(gro.revenue), 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
