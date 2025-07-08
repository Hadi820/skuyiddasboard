export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  issueDate: string
  dueDate: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: string
    amount: string
  }>
  subtotal: number
  tax: number
  discount: number
  total: number
  notes: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  paymentMethod?: string
  paymentDate?: string
}

// Mock data untuk invoice
const invoicesData: Invoice[] = [
  {
    id: "INV001",
    invoiceNumber: "INV/20250108/001",
    clientId: "1",
    clientName: "John Doe",
    issueDate: "2025-01-08",
    dueDate: "2025-01-22",
    items: [
      {
        description: "Villa Booking - 3 Days",
        quantity: 1,
        unitPrice: "1500000",
        amount: "1500000",
      },
    ],
    subtotal: 1500000,
    tax: 10,
    discount: 0,
    total: 1650000,
    notes: "Booking untuk liburan keluarga",
    status: "paid",
    paymentMethod: "transfer",
    paymentDate: "2025-01-10",
  },
  {
    id: "INV002",
    invoiceNumber: "INV/20250108/002",
    clientId: "2",
    clientName: "Jane Smith",
    issueDate: "2025-01-08",
    dueDate: "2025-01-22",
    items: [
      {
        description: "Villa Booking - 2 Days",
        quantity: 1,
        unitPrice: "1000000",
        amount: "1000000",
      },
    ],
    subtotal: 1000000,
    tax: 10,
    discount: 5,
    total: 1050000,
    notes: "Booking untuk acara keluarga",
    status: "sent",
  },
  {
    id: "INV003",
    invoiceNumber: "INV/20250108/003",
    clientId: "3",
    clientName: "Bob Johnson",
    issueDate: "2025-01-05",
    dueDate: "2025-01-19",
    items: [
      {
        description: "Villa Booking - 5 Days",
        quantity: 1,
        unitPrice: "2500000",
        amount: "2500000",
      },
    ],
    subtotal: 2500000,
    tax: 10,
    discount: 0,
    total: 2750000,
    notes: "Booking untuk retreat perusahaan",
    status: "overdue",
  },
  {
    id: "INV004",
    invoiceNumber: "INV/20250108/004",
    clientId: "4",
    clientName: "Alice Brown",
    issueDate: "2025-01-08",
    dueDate: "2025-01-22",
    items: [
      {
        description: "Villa Booking - 1 Day",
        quantity: 1,
        unitPrice: "500000",
        amount: "500000",
      },
    ],
    subtotal: 500000,
    tax: 10,
    discount: 0,
    total: 550000,
    notes: "Booking untuk acara ulang tahun",
    status: "draft",
  },
  {
    id: "INV005",
    invoiceNumber: "INV/20250108/005",
    clientId: "5",
    clientName: "Charlie Wilson",
    issueDate: "2025-01-08",
    dueDate: "2025-01-22",
    items: [
      {
        description: "Villa Booking - 4 Days",
        quantity: 1,
        unitPrice: "2000000",
        amount: "2000000",
      },
    ],
    subtotal: 2000000,
    tax: 10,
    discount: 10,
    total: 1980000,
    notes: "Booking untuk honeymoon",
    status: "paid",
    paymentMethod: "cash",
    paymentDate: "2025-01-09",
  },
  {
    id: "INV006",
    invoiceNumber: "INV/20250108/006",
    clientId: "6",
    clientName: "Diana Prince",
    issueDate: "2025-01-08",
    dueDate: "2025-01-22",
    items: [
      {
        description: "Villa Booking - 3 Days Premium",
        quantity: 1,
        unitPrice: "1800000",
        amount: "1800000",
      },
      {
        description: "Catering Service",
        quantity: 3,
        unitPrice: "200000",
        amount: "600000",
      },
    ],
    subtotal: 2400000,
    tax: 10,
    discount: 0,
    total: 2640000,
    notes: "Booking premium dengan layanan catering",
    status: "sent",
  },
]

export function getAllInvoices(): Invoice[] {
  return invoicesData
}

export function getInvoiceById(id: string): Invoice | undefined {
  return invoicesData.find((invoice) => invoice.id === id)
}

export function addInvoice(invoice: Omit<Invoice, "id">): Invoice {
  const newInvoice: Invoice = {
    ...invoice,
    id: `INV${String(invoicesData.length + 1).padStart(3, "0")}`,
  }
  invoicesData.push(newInvoice)
  return newInvoice
}

export function updateInvoice(id: string, updates: Partial<Invoice>): Invoice | undefined {
  const index = invoicesData.findIndex((invoice) => invoice.id === id)
  if (index !== -1) {
    invoicesData[index] = { ...invoicesData[index], ...updates }
    return invoicesData[index]
  }
  return undefined
}

export function deleteInvoice(id: string): boolean {
  const index = invoicesData.findIndex((invoice) => invoice.id === id)
  if (index !== -1) {
    invoicesData.splice(index, 1)
    return true
  }
  return false
}

export function getInvoiceStats() {
  const totalPaid = invoicesData.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0)

  const totalOutstanding = invoicesData.filter((inv) => inv.status === "sent").reduce((sum, inv) => sum + inv.total, 0)

  const totalOverdue = invoicesData.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.total, 0)

  return {
    totalPaid,
    totalOutstanding,
    totalOverdue,
  }
}
