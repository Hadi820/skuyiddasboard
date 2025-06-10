"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DataSeeder } from "@/utils/data-seeder"
import { Database, Upload, Trash2, Download, AlertTriangle } from "lucide-react"

export function AdminDataManager() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")

  const showMessage = (msg: string, type: "success" | "error" | "info" = "info") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 5000)
  }

  const handleSeedData = async () => {
    setIsLoading(true)
    try {
      await DataSeeder.seedAll()
      showMessage("✅ Sample data berhasil ditambahkan!", "success")
    } catch (error) {
      showMessage("❌ Gagal menambahkan sample data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearData = async () => {
    if (!confirm("⚠️ Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan!")) {
      return
    }

    setIsLoading(true)
    try {
      await DataSeeder.clearAll()
      showMessage("✅ Semua data berhasil dihapus!", "success")
    } catch (error) {
      showMessage("❌ Gagal menghapus data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    showMessage("📁 Fitur export akan segera tersedia", "info")
  }

  const handleImportData = () => {
    showMessage("📁 Fitur import akan segera tersedia", "info")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Data Management</h2>
        <Badge variant="outline">Admin Only</Badge>
      </div>

      {message && (
        <Alert
          className={messageType === "error" ? "border-red-500" : messageType === "success" ? "border-green-500" : ""}
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="manage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">Manage Data</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Populate Sample Data
                </CardTitle>
                <CardDescription>Tambahkan data contoh untuk testing dan development</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleSeedData} disabled={isLoading} className="w-full">
                  {isLoading ? "Menambahkan..." : "Tambah Sample Data"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  Clear All Data
                </CardTitle>
                <CardDescription>Hapus semua data dari sistem (tidak dapat dibatalkan)</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleClearData} disabled={isLoading} variant="destructive" className="w-full">
                  {isLoading ? "Menghapus..." : "Hapus Semua Data"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Data
                </CardTitle>
                <CardDescription>Export semua data ke file JSON atau Excel</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleExportData} disabled={isLoading} className="w-full">
                  Export Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Data
                </CardTitle>
                <CardDescription>Import data dari file JSON atau Excel</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleImportData} disabled={isLoading} className="w-full">
                  Import Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Total reservations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Total clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Total invoices</p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Sistem saat ini menggunakan data kosong. Gunakan fitur "Populate Sample Data" untuk menambahkan data
              contoh atau mulai menambahkan data secara manual.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
