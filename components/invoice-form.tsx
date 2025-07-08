"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Invoice } from "@/services/invoice-service"

interface InvoiceFormProps {
  invoice?: Invoice
  onSuccess?: () => void
}

export function InvoiceForm({ invoice, onSuccess }: InvoiceFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    invoiceNumber: invoice?.invoiceNumber || "",
    clientName: invoice?.clientName || "",
    issueDate: invoice?.issueDate ? invoice.issueDate.split("T")[0] : "",
    dueDate: invoice?.dueDate ? invoice.dueDate.split("T")[0] : "",
    notes: invoice?.notes || "",
    items: invoice?.items || [{ description: "", quantity: 1, unitPrice: "", amount: "" }],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Invoice Disimpan",
      description: "Invoice telah berhasil disimpan.",
    })

    if (onSuccess) {
      onSuccess()
    }
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: "", amount: "" }],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">Nomor Invoice</Label>
          <Input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientName">Nama Klien</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issueDate">Tanggal Invoice</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Tanggal Jatuh Tempo</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
            required
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Label>Deskripsi</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Deskripsi item"
                />
              </div>
              <div className="col-span-2">
                <Label>Jumlah</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>
              <div className="col-span-2">
                <Label>Harga Satuan</Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="col-span-2">
                <Label>Total</Label>
                <Input
                  type="number"
                  value={item.amount}
                  onChange={(e) => updateItem(index, "amount", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length === 1}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addItem}>
            Tambah Item
          </Button>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="notes">Catatan</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Catatan tambahan..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Batal
        </Button>
        <Button type="submit">Simpan Invoice</Button>
      </div>
    </form>
  )
}
