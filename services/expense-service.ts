import { expensesData } from "@/data/expenses"
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "./storage-service"

// Tipe data untuk pengeluaran
export interface Expense {
  id: string
  date: string
  category: string
  description: string
  amount: number
  paymentMethod: string
  status: "completed" | "pending" | "cancelled"
  notes?: string
  attachmentUrl?: string
  createdBy: string
}

// Inisialisasi data pengeluaran dari localStorage atau data default
let expenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, expensesData)

// Fungsi untuk mendapatkan semua pengeluaran
export function getAllExpenses(): Expense[] {
  return expenses
}

// Fungsi untuk mendapatkan pengeluaran berdasarkan ID
export function getExpenseById(id: string): Expense | undefined {
  return expenses.find((expense) => expense.id === id)
}

// Fungsi untuk menambahkan pengeluaran baru
export function addExpense(expense: Omit<Expense, "id">): Expense {
  // Generate ID baru
  const newId = `EXP${String(expenses.length + 1).padStart(3, "0")}`
  const newExpense = { ...expense, id: newId }

  expenses.push(newExpense)

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses)

  return newExpense
}

// Fungsi untuk memperbarui pengeluaran yang ada
export function updateExpense(id: string, expense: Partial<Expense>): Expense | null {
  const index = expenses.findIndex((exp) => exp.id === id)
  if (index === -1) return null

  expenses[index] = { ...expenses[index], ...expense }

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses)

  return expenses[index]
}

// Fungsi untuk menghapus pengeluaran
export function deleteExpense(id: string): boolean {
  const index = expenses.findIndex((expense) => expense.id === id)
  if (index === -1) return false

  expenses.splice(index, 1)

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses)

  return true
}

// Fungsi untuk mendapatkan pengeluaran berdasarkan filter
export function getFilteredExpenses(filters: {
  category?: string
  status?: string
  dateFrom?: Date
  dateTo?: Date
  searchTerm?: string
}): Expense[] {
  return expenses.filter((expense) => {
    const matchesCategory = !filters.category || filters.category === "all" || expense.category === filters.category

    const matchesStatus = !filters.status || filters.status === "all" || expense.status === filters.status

    const expenseDate = new Date(expense.date)
    const matchesDateFrom = !filters.dateFrom || expenseDate >= filters.dateFrom
    const matchesDateTo = !filters.dateTo || expenseDate <= filters.dateTo

    const matchesSearch =
      !filters.searchTerm ||
      expense.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (expense.notes && expense.notes.toLowerCase().includes(filters.searchTerm.toLowerCase()))

    return matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo && matchesSearch
  })
}

// Fungsi untuk mendapatkan total pengeluaran
export function getTotalExpenses(dateFrom?: Date, dateTo?: Date): number {
  return expenses
    .filter((expense) => {
      if (!dateFrom && !dateTo) return true

      const expenseDate = new Date(expense.date)
      const matchesDateFrom = !dateFrom || expenseDate >= dateFrom
      const matchesDateTo = !dateTo || expenseDate <= dateTo

      return matchesDateFrom && matchesDateTo
    })
    .reduce((sum, expense) => sum + expense.amount, 0)
}

// Fungsi untuk memuat data dari localStorage
export function loadExpensesFromStorage(): void {
  expenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, expensesData)
}

// Inisialisasi data
loadExpensesFromStorage()
