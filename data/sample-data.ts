// Sample data untuk testing dan development
// File ini berisi contoh data yang bisa digunakan untuk populate sistem

import type { Reservation } from "./reservations"
import type { Expense } from "./expenses"

export const sampleReservations: Reservation[] = [
  {
    id: 1,
    bookingCode: "BK-20250501-001",
    bookingDate: "2025-05-01",
    customerName: "John Doe",
    phoneNumber: "081234567890",
    checkIn: "2025-05-10",
    checkOut: "2025-05-12",
    tripSchedule: "2025-05-11 (City Tour)",
    orderDetails: "Villa Standard - 1 Kamar",
    gro: "STAFF1",
    category: "Akomodasi",
    finalPrice: 2500000,
    customerDeposit: 1250000,
    partnerDeposit: 1000000,
    remainingPayment: 1250000,
    basePrice: 2000000,
    profit: 500000,
    status: "Proses",
    notes: "Sample reservation for testing",
  },
]

export const sampleClients = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "081234567890",
    company: "Sample Company",
    status: "aktif",
    notes: "Sample client for testing",
    reservations: 1,
    revenue: 2500000,
  },
]

export const sampleInvoices = [
  {
    id: "INV001",
    invoiceNumber: "INV/20250501/001",
    clientId: "1",
    clientName: "John Doe",
    reservationId: "1",
    issueDate: "2025-05-01",
    dueDate: "2025-05-15",
    subtotal: 2500000,
    tax: 10,
    discount: 0,
    total: 2750000,
    notes: "Sample invoice for testing",
    status: "draft",
    items: [
      {
        description: "Villa Standard (2 malam)",
        quantity: 2,
        unitPrice: "1250000",
        amount: "2500000",
      },
    ],
  },
]

export const sampleExpenses: Expense[] = [
  {
    id: "EXP001",
    date: "2025-05-01",
    category: "Maintenance",
    description: "Sample maintenance expense",
    amount: 500000,
    paymentMethod: "cash",
    status: "completed",
    notes: "Sample expense for testing",
    createdBy: "Admin",
  },
]

// Fungsi untuk populate data sample (untuk development/testing)
export function populateSampleData() {
  console.log("Sample data available for manual population")
  console.log("Use the admin interface to add data manually")
}
