"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { getAllStorTransactions, getStorBalance, addStorTransaction } from "@/services/stor-service"

export function StorFundDashboard() {
  const { toast } = useToast()
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [balance, setBalance] = useState(0)
  const [formData, setFormData] = useState({
    type: "deposit",
    amount: "",
    description: "",
    date: new Date(),
    createdBy: "admin",
  })

  // Load transactions and balance
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setTransactions(getAllStorTransactions())
    setBalance(getStorBalance())
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.amount || !formData.description) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi jumlah dan deskripsi transaksi.",
        variant: "destructive",
      })
      return
    }

    try {
      // Prepare transaction data
      const transactionData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        date: format(formData.date, "yyyy-MM-dd'T'HH:mm:ss"),
      }

      // Save data using service
      addStorTransaction(transactionData)
      toast({
        title: "Transaksi Berhasil",
        description: "Transaksi harga stor telah berhasil dicatat.",
      })

      // Reset form and reload data
      setFormData({
        type: "deposit",
        amount: "",
        description: "",
        date: new Date(),
        createdBy: "admin",
      })
      setShowTransactionForm(false)
      loadData()
    } catch (error) {
      console.error("Error saving transaction:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan transaksi.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saldo Harga Stor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {balance.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Saldo saat ini</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaksi Harga Stor</CardTitle>
          <Button onClick={() => setShowTransactionForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Transaksi
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Oleh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Tidak ada transaksi yang ditemukan
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-[#4f46e5]">{transaction.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {format(new Date(transaction.date), "dd MMM yyyy", { locale: id })}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                            transaction.type === "deposit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type === "deposit" ? "Setoran" : "Penarikan"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-4 py-3 text-sm font-medium text-right">
                        <span className={transaction.type === "deposit" ? "text-green-600" : "text-red-600"}>
                          {transaction.type === "deposit" ? "+" : "-"} Rp {transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{transaction.createdBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showTransactionForm} onOpenChange={setShowTransactionForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Transaksi Harga Stor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipe Transaksi</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Pilih tipe transaksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">Setoran</SelectItem>
                  <SelectItem value="withdrawal">Penarikan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Deskripsi transaksi"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "dd MMMM yyyy", { locale: id }) : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => handleChange("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowTransactionForm(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan Transaksi</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
