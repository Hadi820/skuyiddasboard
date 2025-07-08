export interface Invoice {
  id: string
  number: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string
  dueDate: string
  status: "draft" | "sent" | "paid" | "overdue"
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  paymentDate?: string
  paymentMethod?: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

// Mock invoice data
const mockInvoices: Invoice[] = [
  {
    id: "INV001",
    number: "INV-001",
    clientId: "client1",
    clientName: "PT. ABC Corporation",
    clientEmail: "finance@abc.com",
    clientPhone: "+62812345678",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
    items: [
      {
        id: "1",
        description: "Villa Booking - 3 Days",
        quantity: 3,
        rate: 1500000,
        amount: 4500000,
      },
    ],
    subtotal: 4500000,
    tax: 450000,
    total: 4950000,
    paymentDate: "2024-01-20",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "INV002",
    number: "INV-002",
    clientId: "client2",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "+62812345679",
    date: "2024-01-20",
    dueDate: "2024-02-20",
    status: "sent",
    items: [
      {
        id: "1",
        description: "Villa Booking - 2 Days",
        quantity: 2,
        rate: 1500000,
        amount: 3000000,
      },
    ],
    subtotal: 3000000,
    tax: 300000,
    total: 3300000,
  },
  {
    id: "INV003",
    number: "INV-003",
    clientId: "client3",
    clientName: "Jane Smith",
    clientEmail: "jane@example.com",
    clientPhone: "+62812345680",
    date: "2024-01-25",
    dueDate: "2024-02-25",
    status: "overdue",
    items: [
      {
        id: "1",
        description: "Villa Booking - 5 Days",
        quantity: 5,
        rate: 1500000,
        amount: 7500000,
      },
    ],
    subtotal: 7500000,
    tax: 750000,
    total: 8250000,
  },
  {
    id: "INV004",
    number: "INV-004",
    clientId: "client4",
    clientName: "PT. XYZ Ltd",
    clientEmail: "billing@xyz.com",
    clientPhone: "+62812345681",
    date: "2024-02-01",
    dueDate: "2024-03-01",
    status: "draft",
    items: [
      {
        id: "1",
        description: "Villa Booking - 4 Days",
        quantity: 4,
        rate: 1500000,
        amount: 6000000,
      },
    ],
    subtotal: 6000000,
    tax: 600000,
    total: 6600000,
  },
  {
    id: "INV005",
    number: "INV-005",
    clientId: "client5",
    clientName: "Michael Johnson",
    clientEmail: "michael@example.com",
    clientPhone: "+62812345682",
    date: "2024-02-05",
    dueDate: "2024-03-05",
    status: "sent",
    items: [
      {
        id: "1",
        description: "Villa Booking - 7 Days",
        quantity: 7,
        rate: 1500000,
        amount: 10500000,
      },
    ],
    subtotal: 10500000,
    tax: 1050000,
    total: 11550000,
  },
  {
    id: "INV006",
    number: "INV-006",
    clientId: "client6",
    clientName: "Sarah Wilson",
    clientEmail: "sarah@example.com",
    clientPhone: "+62812345683",
    date: "2024-02-10",
    dueDate: "2024-03-10",
    status: "paid",
    items: [
      {
        id: "1",
        description: "Villa Booking - 3 Days",
        quantity: 3,
        rate: 1500000,
        amount: 4500000,
      },
      {
        id: "2",
        description: "Additional Services",
        quantity: 1,
        rate: 500000,
        amount: 500000,
      },
    ],
    subtotal: 5000000,
    tax: 500000,
    total: 5500000,
    paymentDate: "2024-02-12",
    paymentMethod: "Credit Card",
  },
]

export const invoiceService = {
  async getAllInvoices(): Promise<Invoice[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockInvoices
  },

  async getInvoiceById(id: string): Promise<Invoice | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockInvoices.find((invoice) => invoice.id === id) || null
  },

  async createInvoice(invoice: Omit<Invoice, "id">): Promise<Invoice> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newInvoice = {
      ...invoice,
      id: `INV${String(mockInvoices.length + 1).padStart(3, "0")}`,
    }
    mockInvoices.push(newInvoice)
    return newInvoice
  },

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockInvoices.findIndex((invoice) => invoice.id === id)
    if (index === -1) return null

    mockInvoices[index] = { ...mockInvoices[index], ...updates }
    return mockInvoices[index]
  },

  async deleteInvoice(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockInvoices.findIndex((invoice) => invoice.id === id)
    if (index === -1) return false

    mockInvoices.splice(index, 1)
    return true
  },

  async getInvoiceStats() {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const total = mockInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const paid = mockInvoices.filter((inv) => inv.status === "paid").reduce((sum, invoice) => sum + invoice.total, 0)
    const pending = mockInvoices.filter((inv) => inv.status === "sent").reduce((sum, invoice) => sum + invoice.total, 0)
    const overdue = mockInvoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.total, 0)

    return {
      total,
      paid,
      pending,
      overdue,
      count: mockInvoices.length,
    }
  },
}
