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
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { clientsData } from "@/data/clients"
import { reservationsData } from "@/data/reservations"
import { useToast } from "@/components/ui/use-toast"

interface InvoiceFormProps {
  invoice?: any
  onSuccess?: () => void
}

export function InvoiceForm({ invoice, onSuccess }: InvoiceFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    clientId: "",
    reservationId: "",
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default to 14 days from now
    items: [{ description: "", quantity: 1, unitPrice: "", amount: "" }],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    notes: "",
    status: "draft",
    paymentMethod: "",
    paymentDate: null as Date | null,
  })

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber || "",
        clientId: invoice.clientId?.toString() || "",
        reservationId: invoice.reservationId?.toString() || "",
        issueDate: new Date(invoice.issueDate) || new Date(),
        dueDate: new Date(invoice.dueDate) || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        items: invoice.items || [{ description: "", quantity: 1, unitPrice: "", amount: "" }],
        subtotal: invoice.subtotal || 0,
        tax: invoice.tax || 0,
        discount: invoice.discount || 0,
        total: invoice.total || 0,
        notes: invoice.notes || "",
        status: invoice.status || "draft",
        paymentMethod: invoice.paymentMethod || "",
        paymentDate: invoice.paymentDate ? new Date(invoice.paymentDate) : null,
      })
    } else {
      // Generate a new invoice number
      const prefix = "INV"
      const date = format(new Date(), "yyyyMMdd")
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      setFormData((prev) => ({
        ...prev,
        invoiceNumber: `${prefix}/${date}/${random}`,
      }))
    }
  }, [invoice])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Calculate amount if quantity or unitPrice changes
    if (field === "quantity" || field === "unitPrice") {
      const quantity = field === "quantity" ? value : newItems[index].quantity
      const unitPrice = field === "unitPrice" ? value : newItems[index].unitPrice
      newItems[index].amount = quantity * unitPrice
    }

    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }))

    // Recalculate totals
    calculateTotals(newItems)
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: "", amount: "" }],
    }))
  }

  const removeItem = (index: number) => {
    const newItems = [...formData.items]
    newItems.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }))

    // Recalculate totals
    calculateTotals(newItems)
  }

  const calculateTotals = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0)
    const taxAmount = (subtotal * formData.tax) / 100
    const discountAmount = (subtotal * formData.discount) / 100
    const total = subtotal + taxAmount - discountAmount

    setFormData((prev) => ({
      ...prev,
      subtotal,
      total,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.invoiceNumber || !formData.clientId) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua field yang diperlukan.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send the data to your API
    console.log("Form data:", formData)

    toast({
      title: invoice ? "Invoice Diperbarui" : "Invoice Dibuat",
      description: invoice ? "Invoice telah berhasil diperbarui." : "Invoice baru telah berhasil dibuat.",
    })

    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Nomor Invoice</Label>
          <Input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => handleChange("invoiceNumber", e.target.value)}
            placeholder="Contoh: INV/20250506/001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientId">Klien</Label>
          <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
            <SelectTrigger id="clientId">
              <SelectValue placeholder="Pilih klien" />
            </SelectTrigger>
            <SelectContent>
              {clientsData.map((client) => (
                <SelectItem key={client.id} value={client.id.toString() || " "}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reservationId">Reservasi (Opsional)</Label>
          <Select value={formData.reservationId} onValueChange={(value) => handleChange("reservationId", value)}>
            <SelectTrigger id="reservationId">
              <SelectValue placeholder="Pilih reservasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Tidak Ada</SelectItem>
              {reservationsData
                .filter((res) => {
                  const client = clientsData.find((c) => c.id.toString() === formData.clientId)
                  return client && res.person?.toLowerCase() === client.name.toLowerCase()
                })
                .map((res) => (
                  <SelectItem key={res.id} value={res.id.toString() || " "}>
                    {res.title} ({format(new Date(res.start), "dd MMM yyyy", { locale: id })})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tanggal Invoice</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.issueDate ? (
                  format(formData.issueDate, "dd MMMM yyyy", { locale: id })
                ) : (
                  <span>Pilih tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.issueDate}
                onSelect={(date) => handleChange("issueDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Tanggal Jatuh Tempo</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? (
                  format(formData.dueDate, "dd MMMM yyyy", { locale: id })
                ) : (
                  <span>Pilih tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => handleChange("dueDate", date)}
                initialFocus
                disabled={(date) => date < formData.issueDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Terkirim</SelectItem>
              <SelectItem value="paid">Terbayar</SelectItem>
              <SelectItem value="overdue">Jatuh Tempo</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Item Invoice</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" /> Tambah Item
          </Button>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-6">
                <Label htmlFor={`item-${index}-description`}>Deskripsi</Label>
                <Input
                  id={`item-${index}-description`}
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  placeholder="Deskripsi item"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor={`item-${index}-quantity`}>Jumlah</Label>
                <Input
                  id={`item-${index}-quantity`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor={`item-${index}-unitPrice`}>Harga Satuan</Label>
                <Input
                  id={`item-${index}-unitPrice`}
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, "unitPrice", Number.parseFloat(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="col-span-1">
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Tambahkan catatan atau informasi tambahan di sini"
                rows={4}
              />
            </div>

            {formData.status === "paid" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleChange("paymentMethod", value)}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">Transfer Bank</SelectItem>
                      <SelectItem value="cash">Tunai</SelectItem>
                      <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                      <SelectItem value="debit_card">Kartu Debit</SelectItem>
                      <SelectItem value="ewallet">E-Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tanggal Pembayaran</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.paymentDate ? (
                          format(formData.paymentDate, "dd MMMM yyyy", { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.paymentDate || undefined}
                        onSelect={(date) => handleChange("paymentDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span>Rp {formData.subtotal.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tax" className="text-gray-600">
                  Pajak (%)
                </Label>
                <div className="w-24">
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.tax}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      handleChange("tax", value)
                      calculateTotals(formData.items)
                    }}
                    className="text-right"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Jumlah Pajak</span>
                <span>Rp {((formData.subtotal * formData.tax) / 100).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="discount" className="text-gray-600">
                  Diskon (%)
                </Label>
                <div className="w-24">
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      handleChange("discount", value)
                      calculateTotals(formData.items)
                    }}
                    className="text-right"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Jumlah Diskon</span>
                <span>Rp {((formData.subtotal * formData.discount) / 100).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">Rp {formData.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Batal
        </Button>
        <Button type="submit">{invoice ? "Perbarui Invoice" : "Buat Invoice"}</Button>
      </div>
    </form>
  )
}
