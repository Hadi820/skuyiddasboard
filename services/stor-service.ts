import { saveToStorage, getFromStorage, STORAGE_KEYS } from "./storage-service"

// Tipe data untuk transaksi Harga Stor
export interface StorTransaction {
  id: string
  amount: number
  type: "deposit" | "withdrawal"
  description: string
  date: string
  createdBy: string
}

// Data transaksi Harga Stor default
const defaultStorTransactions: StorTransaction[] = [
  {
    id: "STOR-001",
    amount: 5000000,
    type: "deposit",
    description: "Setoran awal bulan",
    date: "2023-05-01T08:00:00Z",
    createdBy: "admin",
  },
  {
    id: "STOR-002",
    amount: 1500000,
    type: "withdrawal",
    description: "Penarikan untuk biaya operasional",
    date: "2023-05-10T14:30:00Z",
    createdBy: "admin",
  },
  {
    id: "STOR-003",
    amount: 3000000,
    type: "deposit",
    description: "Setoran tambahan",
    date: "2023-05-15T09:45:00Z",
    createdBy: "admin",
  },
  {
    id: "STOR-004",
    amount: 2000000,
    type: "withdrawal",
    description: "Penarikan untuk pembayaran vendor",
    date: "2023-05-20T16:15:00Z",
    createdBy: "admin",
  },
]

// Inisialisasi data transaksi Harga Stor dari localStorage atau data default
let storTransactions = getFromStorage<StorTransaction[]>(STORAGE_KEYS.STOR_TRANSACTIONS, defaultStorTransactions)

// Fungsi untuk mendapatkan saldo Harga Stor
export function getStorBalance(): number {
  return storTransactions.reduce((balance, transaction) => {
    if (transaction.type === "deposit") {
      return balance + transaction.amount
    } else {
      return balance - transaction.amount
    }
  }, 0)
}

// Fungsi untuk mendapatkan semua transaksi Harga Stor
export function getAllStorTransactions(): StorTransaction[] {
  return [...storTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Fungsi untuk menambahkan transaksi Harga Stor baru
export function addStorTransaction(transaction: Omit<StorTransaction, "id">): StorTransaction {
  const id = `STOR-${String(storTransactions.length + 1).padStart(3, "0")}`
  const newTransaction = { ...transaction, id }

  storTransactions.push(newTransaction)

  // Simpan ke localStorage
  saveToStorage(STORAGE_KEYS.STOR_TRANSACTIONS, storTransactions)

  return newTransaction
}

// Fungsi untuk mendapatkan total deposit
export function getTotalDeposits(): number {
  return storTransactions
    .filter((transaction) => transaction.type === "deposit")
    .reduce((total, transaction) => total + transaction.amount, 0)
}

// Fungsi untuk mendapatkan total penarikan
export function getTotalWithdrawals(): number {
  return storTransactions
    .filter((transaction) => transaction.type === "withdrawal")
    .reduce((total, transaction) => total + transaction.amount, 0)
}

// Fungsi untuk mendapatkan transaksi berdasarkan tipe
export function getTransactionsByType(type: "deposit" | "withdrawal"): StorTransaction[] {
  return storTransactions.filter((transaction) => transaction.type === type)
}

// Fungsi untuk mendapatkan transaksi berdasarkan ID
export function getTransactionById(id: string): StorTransaction | undefined {
  return storTransactions.find((transaction) => transaction.id === id)
}

// Fungsi untuk memuat data dari localStorage
export function loadStorTransactionsFromStorage(): void {
  storTransactions = getFromStorage<StorTransaction[]>(STORAGE_KEYS.STOR_TRANSACTIONS, defaultStorTransactions)
}

// Inisialisasi data
loadStorTransactionsFromStorage()
