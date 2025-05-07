"use client"

import { Sidebar } from "@/components/sidebar"
import { GoogleCalendarIntegration } from "@/components/google-calendar-integration"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MessageSquare, CreditCard, Bell } from "lucide-react"

export default function IntegrationsPage() {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Integrasi</h1>
        </div>

        <Tabs defaultValue="calendar" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
            <TabsTrigger value="messaging">Pesan</TabsTrigger>
            <TabsTrigger value="payment">Pembayaran</TabsTrigger>
            <TabsTrigger value="notification">Notifikasi</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <GoogleCalendarIntegration />
          </TabsContent>

          <TabsContent value="messaging">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Integrasi WhatsApp
                </CardTitle>
                <CardDescription>Hubungkan dengan WhatsApp Business API untuk mengirim pesan otomatis</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-6">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Belum terhubung dengan WhatsApp</h3>
                <p className="text-gray-500 mb-4">
                  Hubungkan akun WhatsApp Business Anda untuk mengirim pesan otomatis
                </p>
                <Button>Hubungkan WhatsApp</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Integrasi Pembayaran
                </CardTitle>
                <CardDescription>Hubungkan dengan gateway pembayaran untuk menerima pembayaran online</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-6">
                <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Belum terhubung dengan gateway pembayaran</h3>
                <p className="text-gray-500 mb-4">
                  Hubungkan dengan gateway pembayaran untuk menerima pembayaran online
                </p>
                <Button>Hubungkan Pembayaran</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notification">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Integrasi Notifikasi
                </CardTitle>
                <CardDescription>Atur notifikasi email dan push untuk peringatan penting</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-6">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Belum mengatur notifikasi</h3>
                <p className="text-gray-500 mb-4">Atur notifikasi email dan push untuk peringatan penting</p>
                <Button>Atur Notifikasi</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
