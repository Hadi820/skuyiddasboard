"use client"

import { useState } from "react"
import { Bell, Calendar, CreditCard, MessageSquare, User, AlertTriangle, CheckCircle } from "lucide-react"
import { format, isToday, isYesterday, isSameWeek } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Notification = {
  id: number
  title: string
  message: string
  type: "reservation" | "payment" | "client" | "whatsapp" | "system" | "alert" | "success"
  isRead: boolean
  createdAt: Date
  link?: string
}

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Reservasi Baru",
      message: "Keluarga Besar Suharto telah membuat reservasi baru",
      type: "reservation",
      isRead: false,
      createdAt: new Date(2025, 4, 25),
      link: "/calendar",
    },
    {
      id: 2,
      title: "Pembayaran Diterima",
      message: "Pembayaran sebesar Rp 4.500.000 dari Agus Wijaya telah diterima",
      type: "payment",
      isRead: false,
      createdAt: new Date(2025, 4, 5),
      link: "/keuangan",
    },
    {
      id: 3,
      title: "Klien Baru",
      message: "Komunitas Fotografer Jakarta telah mendaftar sebagai klien baru",
      type: "client",
      isRead: true,
      createdAt: new Date(2025, 4, 20),
      link: "/clients",
    },
    {
      id: 4,
      title: "Pesan WhatsApp",
      message: "Dewi Sartika mengirim pesan WhatsApp baru",
      type: "whatsapp",
      isRead: true,
      createdAt: new Date(2025, 4, 5),
      link: "/kpi-client",
    },
    {
      id: 5,
      title: "Invoice Jatuh Tempo",
      message: "Invoice INV/2025/04/004 akan jatuh tempo dalam 2 hari",
      type: "alert",
      isRead: false,
      createdAt: new Date(2025, 5, 2),
      link: "/keuangan",
    },
    {
      id: 6,
      title: "DP Belum Dibayar",
      message: "Reservasi untuk PT Maju Jaya belum melakukan pembayaran DP",
      type: "alert",
      isRead: false,
      createdAt: new Date(),
      link: "/keuangan",
    },
    {
      id: 7,
      title: "Sinkronisasi Kalender Berhasil",
      message: "Kalender Google berhasil disinkronkan dengan sistem",
      type: "success",
      isRead: false,
      createdAt: new Date(),
      link: "/calendar",
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case "reservation":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-green-500" />
      case "client":
        return <User className="h-5 w-5 text-purple-500" />
      case "whatsapp":
        return <MessageSquare className="h-5 w-5 text-green-600" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-yellow-500" />
    }
  }

  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return "Hari ini"
    } else if (isYesterday(date)) {
      return "Kemarin"
    } else if (isSameWeek(date, new Date())) {
      return format(date, "EEEE", { locale: id })
    } else {
      return format(date, "dd MMM", { locale: id })
    }
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua notifikasi telah dibaca"}
        </div>
        <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
          Tandai Semua Dibaca
        </Button>
      </div>
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Tidak ada notifikasi</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <Link href={notification.link || "#"} key={notification.id}>
              <div
                className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  notification.isRead ? "bg-white" : "bg-blue-50"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="mr-3 mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className={`font-medium ${notification.isRead ? "" : "text-blue-700"}`}>{notification.title}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
