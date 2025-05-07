"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, MessageSquare, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { clientsData } from "@/data/clients"
import { reservationsData } from "@/data/reservations"

interface WhatsAppGeneratorProps {
  onSuccess?: () => void
}

export function WhatsAppGenerator({ onSuccess }: WhatsAppGeneratorProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("reservation")
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    clientId: "",
    reservationId: "",
    messageType: "confirmation",
    customMessage: "",
    includeGreeting: true,
    includeName: true,
    includeSignature: true,
  })

  const messageTemplates = {
    confirmation:
      "Terima kasih telah melakukan reservasi di Villa Reservasi. Reservasi Anda telah dikonfirmasi untuk tanggal {check_in_date} hingga {check_out_date}. Total biaya reservasi adalah {total_price}. Silakan lakukan pembayaran DP sebesar {dp_amount} untuk mengamankan reservasi Anda.",
    reminder:
      "Mengingatkan bahwa reservasi Anda di Villa Reservasi akan dimulai pada tanggal {check_in_date}. Kami menantikan kedatangan Anda!",
    payment: "Pembayaran Anda sebesar {amount} telah kami terima. Terima kasih atas kerjasamanya.",
    invoice:
      "Invoice untuk reservasi Anda telah dibuat. Total yang harus dibayarkan adalah {total_price}. Silakan lakukan pembayaran sebelum {due_date}.",
    followUp:
      "Halo, kami ingin menindaklanjuti pertanyaan Anda tentang Villa Reservasi. Apakah ada informasi tambahan yang Anda butuhkan?",
    custom: "",
  }

  const selectedClient = clientsData.find((client) => client.id.toString() === formData.clientId)
  const selectedReservation = reservationsData.find((res) => res.id.toString() === formData.reservationId)

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateMessage = () => {
    let message =
      formData.messageType === "custom"
        ? formData.customMessage
        : messageTemplates[formData.messageType as keyof typeof messageTemplates]

    // Replace placeholders with actual data
    if (selectedReservation) {
      message = message.replace("{check_in_date}", new Date(selectedReservation.start).toLocaleDateString("id-ID"))
      message = message.replace("{check_out_date}", new Date(selectedReservation.end).toLocaleDateString("id-ID"))
      message = message.replace("{total_price}", selectedReservation.price)
      message = message.replace("{dp_amount}", selectedReservation.dp || "50% dari total harga")
      message = message.replace(
        "{due_date}",
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID"),
      )
    }

    message = message.replace("{amount}", "Rp 2.500.000")

    // Add greeting
    if (formData.includeGreeting) {
      const greeting = `Halo ${formData.includeName && selectedClient ? selectedClient.name : ""}${formData.includeName && selectedClient ? "," : ""}\n\n`
      message = greeting + message
    }

    // Add signature
    if (formData.includeSignature) {
      message += "\n\nTerima kasih,\nTim Villa Reservasi"
    }

    return message
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMessage())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Pesan disalin!",
      description: "Pesan WhatsApp telah disalin ke clipboard.",
    })
  }

  const sendWhatsApp = () => {
    const message = encodeURIComponent(generateMessage())
    const phone = selectedClient?.phone?.replace(/[^0-9]/g, "") || ""

    if (!phone) {
      toast({
        title: "Nomor telepon tidak ditemukan",
        description: "Klien tidak memiliki nomor telepon yang valid.",
        variant: "destructive",
      })
      return
    }

    window.open(`https://wa.me/${phone.startsWith("0") ? "62" + phone.substring(1) : phone}?text=${message}`, "_blank")

    toast({
      title: "Membuka WhatsApp",
      description: "Pesan telah disiapkan untuk dikirim via WhatsApp.",
    })

    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="reservation">Reservasi</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="custom">Kustom</TabsTrigger>
        </TabsList>

        <TabsContent value="reservation" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Pilih Klien</Label>
            <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
              <SelectTrigger id="clientId">
                <SelectValue placeholder="Pilih klien" />
              </SelectTrigger>
              <SelectContent>
                {clientsData.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.clientId && (
            <div className="space-y-2">
              <Label htmlFor="reservationId">Pilih Reservasi</Label>
              <Select value={formData.reservationId} onValueChange={(value) => handleChange("reservationId", value)}>
                <SelectTrigger id="reservationId">
                  <SelectValue placeholder="Pilih reservasi" />
                </SelectTrigger>
                <SelectContent>
                  {reservationsData
                    .filter((res) => res.person?.toLowerCase() === selectedClient?.name.toLowerCase())
                    .map((res) => (
                      <SelectItem key={res.id} value={res.id.toString()}>
                        {res.title} ({new Date(res.start).toLocaleDateString("id-ID")})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="messageType">Jenis Pesan</Label>
            <Select value={formData.messageType} onValueChange={(value) => handleChange("messageType", value)}>
              <SelectTrigger id="messageType">
                <SelectValue placeholder="Pilih jenis pesan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmation">Konfirmasi Reservasi</SelectItem>
                <SelectItem value="reminder">Pengingat Check-in</SelectItem>
                <SelectItem value="payment">Konfirmasi Pembayaran</SelectItem>
                <SelectItem value="invoice">Pemberitahuan Invoice</SelectItem>
                <SelectItem value="followUp">Follow-up</SelectItem>
                <SelectItem value="custom">Pesan Kustom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.messageType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customMessage">Pesan Kustom</Label>
              <Textarea
                id="customMessage"
                value={formData.customMessage}
                onChange={(e) => handleChange("customMessage", e.target.value)}
                placeholder="Tulis pesan kustom Anda di sini..."
                rows={5}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="marketingClientId">Pilih Klien</Label>
            <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
              <SelectTrigger id="marketingClientId">
                <SelectValue placeholder="Pilih klien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Klien</SelectItem>
                {clientsData.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketingMessageType">Jenis Pesan Marketing</Label>
            <Select value={formData.messageType} onValueChange={(value) => handleChange("messageType", value)}>
              <SelectTrigger id="marketingMessageType">
                <SelectValue placeholder="Pilih jenis pesan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promo">Promosi</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="custom">Pesan Kustom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketingMessage">Pesan Marketing</Label>
            <Textarea
              id="marketingMessage"
              value={formData.customMessage}
              onChange={(e) => handleChange("customMessage", e.target.value)}
              placeholder="Tulis pesan marketing Anda di sini..."
              rows={5}
            />
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customClientId">Pilih Klien (Opsional)</Label>
            <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
              <SelectTrigger id="customClientId">
                <SelectValue placeholder="Pilih klien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak Ada</SelectItem>
                {clientsData.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullCustomMessage">Pesan Kustom</Label>
            <Textarea
              id="fullCustomMessage"
              value={formData.customMessage}
              onChange={(e) => handleChange("customMessage", e.target.value)}
              placeholder="Tulis pesan kustom Anda di sini..."
              rows={8}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-start space-x-2">
        <div className="flex-1">
          <Label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.includeGreeting}
              onChange={(e) => handleChange("includeGreeting", e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Sertakan salam</span>
          </Label>
        </div>
        <div className="flex-1">
          <Label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.includeName}
              onChange={(e) => handleChange("includeName", e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Sertakan nama</span>
          </Label>
        </div>
        <div className="flex-1">
          <Label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.includeSignature}
              onChange={(e) => handleChange("includeSignature", e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Sertakan tanda tangan</span>
          </Label>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="bg-green-50 p-3 rounded-lg flex-1 relative">
              <MessageSquare className="h-5 w-5 text-green-500 absolute top-2 right-2" />
              <div className="whitespace-pre-line">{generateMessage()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={copyToClipboard}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          Salin Pesan
        </Button>
        <Button onClick={sendWhatsApp}>
          <Send className="h-4 w-4 mr-2" />
          Kirim via WhatsApp
        </Button>
      </div>
    </div>
  )
}
