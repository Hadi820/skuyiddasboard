"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Data pendapatan bulanan
const revenueData = [
  { name: "Jan", revenue: 18500000 },
  { name: "Feb", revenue: 22000000 },
  { name: "Mar", revenue: 24500000 },
  { name: "Apr", revenue: 27800000 },
  { name: "Mei", revenue: 30200000 },
  { name: "Jun", revenue: 32800000 },
  { name: "Jul", revenue: 29500000 },
  { name: "Ags", revenue: 28300000 },
  { name: "Sep", revenue: 31200000 },
  { name: "Okt", revenue: 33500000 },
  { name: "Nov", revenue: 35100000 },
  { name: "Des", revenue: 38700000 },
]

// Data pendapatan dan pengeluaran kuartalan
const quarterlyData = [
  { name: "Q1", revenue: 65000000, expenses: 42000000 },
  { name: "Q2", revenue: 90800000, expenses: 58000000 },
  { name: "Q3", revenue: 89000000, expenses: 55000000 },
  { name: "Q4", revenue: 107300000, expenses: 68000000 },
]

export function RevenueChart() {
  const [chartType, setChartType] = useState("bar")
  const [dataType, setDataType] = useState("monthly")

  const formatCurrency = (value) => {
    return `Rp ${(value / 1000000).toFixed(1)}jt`
  }

  const renderChart = () => {
    const data = dataType === "monthly" ? revenueData : quarterlyData

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value) => [`Rp ${value.toLocaleString()}`, dataType === "monthly" ? "Pendapatan" : "Nilai"]}
            />
            <Legend />
            <Bar dataKey="revenue" name="Pendapatan" fill="#4f46e5" />
            {dataType === "quarterly" && <Bar dataKey="expenses" name="Pengeluaran" fill="#ef4444" />}
          </BarChart>
        </ResponsiveContainer>
      )
    } else if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value) => [`Rp ${value.toLocaleString()}`, dataType === "monthly" ? "Pendapatan" : "Nilai"]}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Pendapatan" stroke="#4f46e5" activeDot={{ r: 8 }} />
            {dataType === "quarterly" && (
              <Line type="monotone" dataKey="expenses" name="Pengeluaran" stroke="#ef4444" />
            )}
          </LineChart>
        </ResponsiveContainer>
      )
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value) => [`Rp ${value.toLocaleString()}`, dataType === "monthly" ? "Pendapatan" : "Nilai"]}
            />
            <Legend />
            <Area type="monotone" dataKey="revenue" name="Pendapatan" stroke="#4f46e5" fill="#eef2ff" />
            {dataType === "quarterly" && (
              <Area type="monotone" dataKey="expenses" name="Pengeluaran" stroke="#ef4444" fill="#fee2e2" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500">
          Pendapatan {dataType === "monthly" ? "Bulanan" : "Kuartalan"} (2025)
        </h3>
        <div className="flex gap-2">
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Bulanan</SelectItem>
              <SelectItem value="quarterly">Kuartalan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih jenis grafik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {renderChart()}

      <div className="grid grid-cols-4 gap-4 pt-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Jan-Mar</p>
          <p className="font-medium">Rp 65jt</p>
          <p className="text-xs text-green-600">+12%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Apr-Jun</p>
          <p className="font-medium">Rp 90.8jt</p>
          <p className="text-xs text-green-600">+18%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Jul-Sep</p>
          <p className="font-medium">Rp 89jt</p>
          <p className="text-xs text-red-600">-2%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Okt-Des</p>
          <p className="font-medium">Rp 107.3jt</p>
          <p className="text-xs text-green-600">+21%</p>
        </div>
      </div>
    </div>
  )
}
