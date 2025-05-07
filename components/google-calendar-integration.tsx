"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, CheckCircle, RefreshCw } from "lucide-react"

export function GoogleCalendarIntegration() {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    syncReservations: true,
    syncInvoices: false,
    syncReminders: true,
    autoSync: false,
  })

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsConnected(true)
      setLastSync(new Date().toISOString())

      toast({
        title: "Berhasil terhubung",
        description: "Akun Google Calendar Anda berhasil terhubung",
      })
    } catch (error) {
      toast({
        title: "Gagal terhubung",
        description: "Terjadi kesalahan saat menghubungkan ke Google Calendar",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsConnected(false)
      setLastSync(null)

      toast({
        title: "Berhasil terputus",
        description: "Akun Google Calendar Anda berhasil diputuskan",
      })
    } catch (error) {
      toast({
        title: "Gagal memutuskan",
        description: "Terjadi kesalahan saat memutuskan dari Google Calendar",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setLastSync(new Date().toISOString())

      toast({
        title: "Sinkronisasi berhasil",
        description: "Data berhasil disinkronkan dengan Google Calendar",
      })
    } catch (error) {
      toast({
        title: "Sinkronisasi gagal",
        description: "Terjadi kesalahan saat menyinkronkan data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))
  }

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Integrasi Google Calendar
        </CardTitle>
        <CardDescription>Sinkronkan reservasi dan jadwal pembayaran dengan Google Calendar Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="font-medium">Terhubung dengan Google Calendar</p>
                  <p className="text-sm text-gray-500">
                    {lastSync ? `Terakhir disinkronkan: ${formatLastSync(lastSync)}` : "Belum pernah disinkronkan"}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sinkronkan
              </Button>
            </div>

            <div className="space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-reservations" className="flex items-center">
                  Sinkronkan Reservasi
                </Label>
                <Switch
                  id="sync-reservations"
                  checked={settings.syncReservations}
                  onCheckedChange={() => handleSettingChange("syncReservations")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sync-invoices" className="flex items-center">
                  Sinkronkan Jadwal Pembayaran
                </Label>
                <Switch
                  id="sync-invoices"
                  checked={settings.syncInvoices}
                  onCheckedChange={() => handleSettingChange("syncInvoices")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sync-reminders" className="flex items-center">
                  Aktifkan Pengingat
                </Label>
                <Switch
                  id="sync-reminders"
                  checked={settings.syncReminders}
                  onCheckedChange={() => handleSettingChange("syncReminders")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-sync" className="flex items-center">
                  Sinkronisasi Otomatis
                </Label>
                <Switch
                  id="auto-sync"
                  checked={settings.autoSync}
                  onCheckedChange={() => handleSettingChange("autoSync")}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum terhubung dengan Google Calendar</h3>
            <p className="text-gray-500 mb-4">
              Hubungkan akun Google Calendar Anda untuk menyinkronkan reservasi dan jadwal pembayaran
            </p>
            <Button onClick={handleConnect} disabled={isLoading}>
              {isLoading ? "Menghubungkan..." : "Hubungkan Google Calendar"}
            </Button>
          </div>
        )}
      </CardContent>
      {isConnected && (
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={handleDisconnect} disabled={isLoading}>
            Putuskan Koneksi
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
