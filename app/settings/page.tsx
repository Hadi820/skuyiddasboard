"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Pengaturan</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Aplikasi</CardTitle>
            <CardDescription>
              Kelola pengaturan aplikasi, notifikasi, integrasi, dan preferensi lainnya.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="general">Umum</TabsTrigger>
                <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
                <TabsTrigger value="integrations">Integrasi</TabsTrigger>
                <TabsTrigger value="users">Pengguna</TabsTrigger>
                <TabsTrigger value="appearance">Tampilan</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Informasi Perusahaan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nama Perusahaan</Label>
                      <Input id="company-name" defaultValue="Villa Reservasi" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-email">Email Perusahaan</Label>
                      <Input id="company-email" defaultValue="info@villareservasi.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Telepon</Label>
                      <Input id="company-phone" defaultValue="0812-3456-7890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-address">Alamat</Label>
                      <Input id="company-address" defaultValue="Jl. Reservasi No. 123, Jakarta" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Pengaturan Reservasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="check-in-time">Waktu Check-in Default</Label>
                      <Input id="check-in-time" type="time" defaultValue="14:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="check-out-time">Waktu Check-out Default</Label>
                      <Input id="check-out-time" type="time" defaultValue="12:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-booking-days">Minimal Hari Pemesanan</Label>
                      <Input id="min-booking-days" type="number" defaultValue="1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dp-percentage">Persentase DP</Label>
                      <Input id="dp-percentage" type="number" defaultValue="50" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Simpan Perubahan</Button>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notifikasi Email</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reservasi Baru</p>
                        <p className="text-sm text-gray-500">Kirim email saat ada reservasi baru</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pembayaran DP</p>
                        <p className="text-sm text-gray-500">Kirim email saat ada pembayaran DP</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pelunasan</p>
                        <p className="text-sm text-gray-500">Kirim email saat ada pelunasan</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pengingat Check-in</p>
                        <p className="text-sm text-gray-500">Kirim email pengingat check-in</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Notifikasi WhatsApp</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reservasi Baru</p>
                        <p className="text-sm text-gray-500">Kirim WhatsApp saat ada reservasi baru</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pembayaran DP</p>
                        <p className="text-sm text-gray-500">Kirim WhatsApp saat ada pembayaran DP</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pelunasan</p>
                        <p className="text-sm text-gray-500">Kirim WhatsApp saat ada pelunasan</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pengingat Check-in</p>
                        <p className="text-sm text-gray-500">Kirim WhatsApp pengingat check-in</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Simpan Perubahan</Button>
                </div>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">WhatsApp API</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Status Integrasi</p>
                        <p className="text-sm text-gray-500">WhatsApp Business API</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Terhubung
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-api-key">API Key</Label>
                      <Input id="whatsapp-api-key" type="password" defaultValue="••••••••••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-phone">Nomor WhatsApp Bisnis</Label>
                      <Input id="whatsapp-phone" defaultValue="62812345678" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Gateway</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-gateway">Provider</Label>
                      <Select defaultValue="midtrans">
                        <SelectTrigger id="payment-gateway">
                          <SelectValue placeholder="Pilih provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="midtrans">Midtrans</SelectItem>
                          <SelectItem value="xendit">Xendit</SelectItem>
                          <SelectItem value="doku">Doku</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-api-key">API Key</Label>
                      <Input id="payment-api-key" type="password" defaultValue="••••••••••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-secret-key">Secret Key</Label>
                      <Input id="payment-secret-key" type="password" defaultValue="••••••••••••••••" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Simpan Perubahan</Button>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Pengguna</h3>
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-left">
                          <tr>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nama
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Peran
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium">BS</span>
                                </div>
                                <div className="font-medium">Budi Santoso</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">budi@example.com</td>
                            <td className="px-4 py-3 text-sm">Admin</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800">
                                Aktif
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium">DS</span>
                                </div>
                                <div className="font-medium">Dewi Sartika</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">dewi@example.com</td>
                            <td className="px-4 py-3 text-sm">Manajer</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800">
                                Aktif
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium">RH</span>
                                </div>
                                <div className="font-medium">Rudi Hartono</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">rudi@example.com</td>
                            <td className="px-4 py-3 text-sm">Staff</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800">
                                Tidak Aktif
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end">
                      <Button>Tambah Pengguna</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Pengaturan Keamanan</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Autentikasi Dua Faktor</p>
                        <p className="text-sm text-gray-500">Aktifkan autentikasi dua faktor untuk semua pengguna</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Masa Berlaku Password</p>
                        <p className="text-sm text-gray-500">Paksa pengguna untuk mengganti password secara berkala</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Masa Berlaku Password (hari)</Label>
                      <Input id="password-expiry" type="number" defaultValue="90" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Simpan Perubahan</Button>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Tema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 cursor-pointer bg-white">
                      <div className="h-20 bg-white border rounded mb-2"></div>
                      <p className="font-medium">Terang</p>
                    </div>
                    <div className="border rounded-lg p-4 cursor-pointer">
                      <div className="h-20 bg-gray-900 border rounded mb-2"></div>
                      <p className="font-medium">Gelap</p>
                    </div>
                    <div className="border rounded-lg p-4 cursor-pointer">
                      <div className="h-20 bg-gradient-to-r from-white to-gray-900 border rounded mb-2"></div>
                      <p className="font-medium">Sistem</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Logo</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-lg font-bold text-[#4f46e5]">logo</span>
                      </div>
                      <Button variant="outline">Ganti Logo</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Warna Utama</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="h-10 rounded-md bg-[#4f46e5]"></div>
                      <p className="text-sm">Indigo (Default)</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 rounded-md bg-[#2563eb]"></div>
                      <p className="text-sm">Biru</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 rounded-md bg-[#16a34a]"></div>
                      <p className="text-sm">Hijau</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 rounded-md bg-[#dc2626]"></div>
                      <p className="text-sm">Merah</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Simpan Perubahan</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
