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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ChatFormProps {
  onSuccess?: () => void
}

export function ChatForm({ onSuccess }: ChatFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    clientName: "",
    region: "",
    channel: "WhatsApp",
    question: "",
    status: "Tanya Saja",
    responseTime: "",
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
        title: "Data berhasil disimpan",
        description: "Data chat telah ditambahkan ke sistem.",
      })

      // Reset form
      setFormData({
        date: new Date().toISOString().split("T")[0],
        clientName: "",
        region: "",
        channel: "WhatsApp",
        question: "",
        status: "Tanya Saja",
        responseTime: "",
      })

      if (onSuccess) {
        onSuccess()
      }
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Chat Harian</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
              <Label htmlFor="clientName">Nama Klien (Opsional)</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
                placeholder="Masukkan nama klien"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Wilayah Klien</Label>
              <Select value={formData.region} onValueChange={(value) => handleChange("region", value)} required>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Pilih wilayah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jakarta">Jakarta</SelectItem>
                  <SelectItem value="Bandung">Bandung</SelectItem>
                  <SelectItem value="Surabaya">Surabaya</SelectItem>
                  <SelectItem value="Medan">Medan</SelectItem>
                  <SelectItem value="Makassar">Makassar</SelectItem>
                  <SelectItem value="Bali">Bali</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select value={formData.channel} onValueChange={(value) => handleChange("channel", value)} required>
                <SelectTrigger id="channel">
                  <SelectValue placeholder="Pilih channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Telepon">Telepon</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Pertanyaan Klien (Ringkasan)</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => handleChange("question", e.target.value)}
              placeholder="Ringkasan pertanyaan atau kebutuhan klien"
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)} required>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tanya Saja">Tanya Saja</SelectItem>
                  <SelectItem value="Deal">Deal</SelectItem>
                  <SelectItem value="Follow-Up">Follow-Up</SelectItem>
                  <SelectItem value="Tidak Berminat">Tidak Berminat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="responseTime">Waktu Respon (Menit)</Label>
              <Input
                id="responseTime"
                type="number"
                min="1"
                value={formData.responseTime}
                onChange={(e) => handleChange("responseTime", e.target.value)}
                placeholder="Waktu respon dalam menit"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Data"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
