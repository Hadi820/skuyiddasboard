"use client"

import {
  CalendarIcon,
  CreditCardIcon,
  MessageSquareIcon,
  UserPlusIcon,
  FileTextIcon,
  BarChartIcon,
  SettingsIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ReservationForm } from "@/components/reservation-form"
import { InvoiceForm } from "@/components/invoice-form"
import { ClientForm } from "@/components/client-form"
import { WhatsAppGenerator } from "@/components/whatsapp-generator"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const router = useRouter()

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <div className="space-y-4">
      <Dialog open={openDialog === "reservation"} onOpenChange={(open) => setOpenDialog(open ? "reservation" : null)}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Tambah Reservasi
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Tambah Reservasi Baru</DialogTitle>
          </DialogHeader>
          <ReservationForm onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "invoice"} onOpenChange={(open) => setOpenDialog(open ? "invoice" : null)}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <CreditCardIcon className="mr-2 h-4 w-4" />
            Buat Invoice
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Buat Invoice Baru</DialogTitle>
          </DialogHeader>
          <InvoiceForm onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "client"} onOpenChange={(open) => setOpenDialog(open ? "client" : null)}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Tambah Klien
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Klien Baru</DialogTitle>
          </DialogHeader>
          <ClientForm onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "whatsapp"} onOpenChange={(open) => setOpenDialog(open ? "whatsapp" : null)}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            Buat Pesan WhatsApp
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generator Pesan WhatsApp</DialogTitle>
          </DialogHeader>
          <WhatsAppGenerator onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>

      <Button className="w-full justify-start" variant="outline" onClick={() => navigateTo("/reports")}>
        <BarChartIcon className="mr-2 h-4 w-4" />
        Lihat Laporan
      </Button>

      <Button className="w-full justify-start" variant="outline" onClick={() => navigateTo("/keuangan")}>
        <FileTextIcon className="mr-2 h-4 w-4" />
        Kelola Keuangan
      </Button>

      <Button className="w-full justify-start" variant="outline" onClick={() => navigateTo("/settings")}>
        <SettingsIcon className="mr-2 h-4 w-4" />
        Pengaturan
      </Button>
    </div>
  )
}
