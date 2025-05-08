"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { addExpense, updateExpense } from "@/services/expense-service"

interface ExpenseFormProps {
  expense?: any
  onSuccess?: () => void
}

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    date: new Date(),
    category: "operational",
    description: "",
    amount: "",
    paymentMethod: "cash",
    status: "completed",
    notes: "",
    attachmentUrl: "",
    createdBy: "admin",
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        date: new Date(expense.date) || new Date(),
        category: expense.category || "operational",
        description: expense.description || "",
        amount: expense.amount?.toString() || "",
        paymentMethod: expense.paymentMethod || "cash",
        status: expense.status || "completed",
        notes: expense.notes || "",
        attachmentUrl: expense.attachmentUrl || "",
        createdBy: expense.createdBy || "admin",
      })
    }
  }, [expense])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.description || !formData.amount) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi deskripsi dan jumlah pengeluaran.",
        variant: "destructive",
      })
      return
    }

    try {
      // Prepare expense data
      const expenseData = {
        ...formData,
        date: format(formData.date, "yyyy-MM-dd'T'HH:mm:ss"),
        amount: Number.parseFloat(formData.amount),
      }

      // Save data using service
      if (expense) {
        updateExpense(expense.id, expenseData)
        toast({
          title: "Pengeluaran Diperbarui",
          description: "Data pengeluaran telah berhasil diperbarui.",
        })
      } else {
        addExpense(expenseData)
        toast({
          title: "Pengeluaran Dibuat",
          description: "Pengeluaran baru telah berhasil dibuat.",
        })
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving expense:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan pengeluaran.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operational">Operasional</SelectItem>
              <SelectItem value="salary">Gaji</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="maintenance">Pemeliharaan</SelectItem>
              <SelectItem value="utilities">Utilitas</SelectItem>
              <SelectItem value="rent">Sewa</SelectItem>
              <SelectItem value="tax">Pajak</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Deskripsi pengeluaran"
            required
          />
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
          <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => handleChange("paymentMethod", value)}>
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Pilih metode pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Tunai</SelectItem>
              <SelectItem value="transfer">Transfer Bank</SelectItem>
              <SelectItem value="credit_card">Kartu Kredit</SelectItem>
              <SelectItem value="debit_card">Kartu Debit</SelectItem>
              <SelectItem value="ewallet">E-Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Catatan</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Tambahkan catatan atau informasi tambahan di sini"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachmentUrl">URL Lampiran (Opsional)</Label>
        <Input
          id="attachmentUrl"
          value={formData.attachmentUrl}
          onChange={(e) => handleChange("attachmentUrl", e.target.value)}
          placeholder="https://example.com/attachment.pdf"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Batal
        </Button>
        <Button type="submit">{expense ? "Perbarui Pengeluaran" : "Tambah Pengeluaran"}</Button>
      </div>
    </form>
  )
}
