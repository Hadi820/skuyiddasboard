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

export const expensesData: Expense[] = []

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
