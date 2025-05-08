"use client"

import { useRouter } from "next/navigation"
import { PlusCircle, FileText, UserPlus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const router = useRouter()

  const handleAddReservation = () => {
    router.push("/calendar?action=add-reservation")
  }

  const handleCreateInvoice = () => {
    router.push("/keuangan?action=create-invoice")
  }

  const handleAddClient = () => {
    router.push("/clients?action=add-client")
  }

  const handleCreateWhatsApp = () => {
    router.push("/kpi-admin?action=create-whatsapp")
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      <Button variant="outline" className="justify-start" onClick={handleAddReservation}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Tambah Reservasi
      </Button>
      <Button variant="outline" className="justify-start" onClick={handleCreateInvoice}>
        <FileText className="h-4 w-4 mr-2" />
        Buat Invoice
      </Button>
      <Button variant="outline" className="justify-start" onClick={handleAddClient}>
        <UserPlus className="h-4 w-4 mr-2" />
        Tambah Klien
      </Button>
      <Button variant="outline" className="justify-start" onClick={handleCreateWhatsApp}>
        <MessageSquare className="h-4 w-4 mr-2" />
        Buat Pesan WhatsApp
      </Button>
    </div>
  )
}
