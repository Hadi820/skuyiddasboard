"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface KpiAdminFormProps {
  data?: any
  onSuccess?: () => void
}

export function KpiAdminForm({ data, onSuccess }: KpiAdminFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: data?.name || "",
    phone: data?.phone || "",
    lastMessage: data?.lastMessage || "",
    date: data?.date || new Date().toISOString().split("T")[0],
    reason: data?.reason || "",
    status: data?.status || "Pending",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: data ? "Data KPI berhasil diperbarui" : "Data KPI berhasil ditambahkan",
        description: "Data telah disimpan dalam sistem.",
      })

      if (onSuccess) {
        onSuccess()
      }
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Klien</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Masukkan nama klien"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor WhatsApp</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Contoh: 0812-3456-7890"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastMessage">Pesan Terakhir</Label>
        <Textarea
          id="lastMessage"
          value={formData.lastMessage}
          onChange={(e) => handleChange("lastMessage", e.target.value)}
          placeholder="Masukkan pesan terakhir dari klien"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Tanggal</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Konfirmasi">Konfirmasi</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Batal">Batal</SelectItem>
              <SelectItem value="Reschedule">Reschedule</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Alasan</Label>
        <Input
          id="reason"
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Masukkan alasan (jika ada)"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {data ? "Menyimpan..." : "Menambahkan..."}
            </>
          ) : data ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Data"
          )}
        </Button>
      </div>
    </form>
  )
}
