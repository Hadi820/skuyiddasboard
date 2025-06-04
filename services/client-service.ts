import { clientsData } from "@/data/clients"
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "./storage-service"

// Tipe data untuk klien
export interface Client {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: string
  notes: string
  reservations: number
  revenue: number
}

// Inisialisasi data klien dari localStorage atau data default
let clients = getFromStorage<Client[]>(STORAGE_KEYS.CLIENTS, clientsData)

// Fungsi untuk mendapatkan semua klien
export function getAllClients(): Client[] {
  return clients
}

// Fungsi untuk mendapatkan klien berdasarkan ID
export function getClientById(id: number): Client | undefined {
  return clients.find((client) => client.id === id)
}

// Fungsi untuk menambahkan klien baru
export function addClient(client: Omit<Client, "id" | "reservations" | "revenue">): Client {
  const newId = Math.max(0, ...clients.map((c) => c.id)) + 1
  const newClient = {
    ...client,
    id: newId,
    reservations: 0,
    revenue: 0,
  }

  clients.push(newClient)

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.CLIENTS, clients)

  return newClient
}

// Fungsi untuk memperbarui klien yang ada
export function updateClient(id: number, client: Partial<Client>): Client | null {
  const index = clients.findIndex((c) => c.id === id)
  if (index === -1) return null

  clients[index] = { ...clients[index], ...client }

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.CLIENTS, clients)

  return clients[index]
}

// Fungsi untuk menghapus klien
export function deleteClient(id: number): boolean {
  const index = clients.findIndex((c) => c.id === id)
  if (index === -1) return false

  clients.splice(index, 1)

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.CLIENTS, clients)

  return true
}

// Fungsi untuk mendapatkan klien berdasarkan filter
export function getFilteredClients(filters: {
  status?: string
  searchTerm?: string
}): Client[] {
  return clients.filter((client) => {
    const matchesStatus = !filters.status || filters.status === "all" || client.status === filters.status

    const matchesSearch =
      !filters.searchTerm ||
      client.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(filters.searchTerm.toLowerCase()))

    return matchesStatus && matchesSearch
  })
}

// Fungsi untuk memperbarui statistik klien (jumlah reservasi dan pendapatan)
export function updateClientStats(clientId: number, reservationCount: number, revenue: number): void {
  const client = getClientById(clientId)
  if (client) {
    client.reservations = reservationCount
    client.revenue = revenue

    // Simpan ke localStorage
    saveToStorage(STORAGE_KEYS.CLIENTS, clients)
  }
}

// Fungsi untuk memuat data dari localStorage
export function loadClientsFromStorage(): void {
  clients = getFromStorage<Client[]>(STORAGE_KEYS.CLIENTS, clientsData)
}

// Inisialisasi data
loadClientsFromStorage()
