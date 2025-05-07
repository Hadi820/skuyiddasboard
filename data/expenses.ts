export interface Expense {
  id: string
  date: string
  category: string
  description: string
  amount: number
  paymentMethod: string
  status: "pending" | "completed" | "cancelled"
  notes?: string
  attachmentUrl?: string
  createdBy: string
}

export const expensesData: Expense[] = [
  {
    id: "EXP001",
    date: "2025-05-01",
    category: "Catering",
    description: "Pembayaran Catering Acara Wedding Siti & Reza",
    amount: 8500000,
    paymentMethod: "transfer",
    status: "completed",
    notes: "Pembayaran untuk 200 porsi",
    createdBy: "Admin",
  },
  {
    id: "EXP002",
    date: "2025-05-02",
    category: "Dekorasi",
    description: "Pembayaran Dekorasi Wedding Siti & Reza",
    amount: 5000000,
    paymentMethod: "transfer",
    status: "completed",
    notes: "Pembayaran untuk dekorasi pelaminan dan area tamu",
    createdBy: "Admin",
  },
  {
    id: "EXP003",
    date: "2025-05-03",
    category: "Maintenance",
    description: "Perbaikan AC Villa Utama",
    amount: 1200000,
    paymentMethod: "cash",
    status: "completed",
    notes: "Perbaikan dan service 3 unit AC",
    createdBy: "Admin",
  },
  {
    id: "EXP004",
    date: "2025-05-04",
    category: "Supplies",
    description: "Pembelian Perlengkapan Kebersihan",
    amount: 850000,
    paymentMethod: "cash",
    status: "completed",
    notes: "Pembelian sabun, pembersih lantai, dan perlengkapan lainnya",
    createdBy: "Admin",
  },
  {
    id: "EXP005",
    date: "2025-05-05",
    category: "Utilities",
    description: "Pembayaran Listrik Bulan Mei",
    amount: 3500000,
    paymentMethod: "transfer",
    status: "pending",
    notes: "Pembayaran listrik untuk semua properti",
    createdBy: "Admin",
  },
  {
    id: "EXP006",
    date: "2025-05-06",
    category: "Salary",
    description: "Gaji Karyawan Bulan April",
    amount: 15000000,
    paymentMethod: "transfer",
    status: "completed",
    notes: "Pembayaran gaji untuk 10 karyawan",
    createdBy: "Admin",
  },
  {
    id: "EXP007",
    date: "2025-05-07",
    category: "Marketing",
    description: "Iklan di Instagram",
    amount: 2000000,
    paymentMethod: "credit_card",
    status: "completed",
    notes: "Kampanye iklan untuk promo bulan Mei",
    createdBy: "Admin",
  },
  {
    id: "EXP008",
    date: "2025-05-08",
    category: "Equipment",
    description: "Pembelian Sound System Baru",
    amount: 7500000,
    paymentMethod: "transfer",
    status: "completed",
    notes: "Pembelian sound system untuk acara",
    createdBy: "Admin",
  },
  {
    id: "EXP009",
    date: "2025-05-10",
    category: "Insurance",
    description: "Pembayaran Asuransi Properti",
    amount: 5000000,
    paymentMethod: "transfer",
    status: "pending",
    notes: "Pembayaran premi asuransi tahunan",
    createdBy: "Admin",
  },
  {
    id: "EXP010",
    date: "2025-05-12",
    category: "Taxes",
    description: "Pembayaran Pajak Properti",
    amount: 4500000,
    paymentMethod: "transfer",
    status: "pending",
    notes: "Pembayaran pajak properti tahunan",
    createdBy: "Admin",
  },
]

export const expenseCategories = [
  "Catering",
  "Dekorasi",
  "Maintenance",
  "Supplies",
  "Utilities",
  "Salary",
  "Marketing",
  "Equipment",
  "Insurance",
  "Taxes",
  "Rent",
  "Transportation",
  "Other",
]
