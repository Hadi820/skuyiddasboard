import { invoicesData } from "@/data/invoices"
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "./storage-service"

// Tipe data untuk invoice
export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  reservationId?: string
  issueDate: string
  dueDate: string
  subtotal: number
  tax: number
  discount: number
  total: number
  notes?: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  paymentMethod?: string
  paymentDate?: string
  items: InvoiceItem[]
}

// Tipe data untuk item invoice
export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: string
  amount: string
}

// Inisialisasi data invoice dari localStorage atau data default
let invoices = getFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, invoicesData)

// Fungsi untuk mendapatkan semua invoice
export function getAllInvoices(): Invoice[] {
  return invoices
}

// Fungsi untuk mendapatkan invoice berdasarkan ID
export function getInvoiceById(id: string): Invoice | undefined {
  return invoices.find((invoice) => invoice.id === id)
}

// Fungsi untuk menambahkan invoice baru
export function addInvoice(invoice: Omit<Invoice, "id">): Invoice {
  // Generate ID baru
  const newId = `INV${String(invoices.length + 1).padStart(3, "0")}`
  const newInvoice = { ...invoice, id: newId }

  invoices.push(newInvoice)

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.INVOICES, invoices)

  return newInvoice
}

// Fungsi untuk memperbarui invoice yang ada
export function updateInvoice(id: string, invoice: Partial<Invoice>): Invoice | null {
  const index = invoices.findIndex((inv) => inv.id === id)
  if (index === -1) return null

  invoices[index] = { ...invoices[index], ...invoice }

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.INVOICES, invoices)

  return invoices[index]
}

// Fungsi untuk menghapus invoice
export function deleteInvoice(id: string): boolean {
  const index = invoices.findIndex((invoice) => invoice.id === id)
  if (index === -1) return false

  invoices.splice(index, 1)

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.INVOICES, invoices)

  return true
}

// Fungsi untuk mendapatkan invoice berdasarkan filter
export function getFilteredInvoices(filters: {
  status?: string
  clientId?: string
  dateFrom?: Date
  dateTo?: Date
  searchTerm?: string
}): Invoice[] {
  return invoices.filter((invoice) => {
    const matchesStatus = !filters.status || filters.status === "all" || invoice.status === filters.status

    const matchesClient = !filters.clientId || invoice.clientId === filters.clientId

    const issueDate = new Date(invoice.issueDate)
    const matchesDateFrom = !filters.dateFrom || issueDate >= filters.dateFrom
    const matchesDateTo = !filters.dateTo || issueDate <= filters.dateTo

    const matchesSearch =
      !filters.searchTerm ||
      invoice.invoiceNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (invoice.notes && invoice.notes.toLowerCase().includes(filters.searchTerm.toLowerCase()))

    return matchesStatus && matchesClient && matchesDateFrom && matchesDateTo && matchesSearch
  })
}

// Fungsi untuk mendapatkan statistik invoice
export function getInvoiceStats() {
  const totalPaid = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0)

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
    .reduce((sum, inv) => sum + inv.total, 0)

  const totalOverdue = invoices.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.total, 0)

  return {
    totalPaid,
    totalOutstanding,
    totalOverdue,
    count: invoices.length,
    paidCount: invoices.filter((inv) => inv.status === "paid").length,
    overdueCount: invoices.filter((inv) => inv.status === "overdue").length,
  }
}

// Fungsi untuk memuat data dari localStorage
export function loadInvoicesFromStorage(): void {
  invoices = getFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, invoicesData)
}

// Inisialisasi data
loadInvoicesFromStorage()
