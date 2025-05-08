/**
 * Service untuk mengelola penyimpanan data di localStorage
 */

// Kunci untuk menyimpan data di localStorage
const STORAGE_KEYS = {
  CLIENTS: "villa_management_clients",
  RESERVATIONS: "villa_management_reservations",
  INVOICES: "villa_management_invoices",
  EXPENSES: "villa_management_expenses",
  STOR_TRANSACTIONS: "villa_management_stor_transactions",
  GRO_COMMISSIONS: "villa_management_gro_commissions",
  USER: "villa_management_user",
}

/**
 * Menyimpan data ke localStorage
 * @param key Kunci penyimpanan
 * @param data Data yang akan disimpan
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(key, serializedData)
  } catch (error) {
    console.error(`Error saving data to localStorage with key ${key}:`, error)
  }
}

/**
 * Mengambil data dari localStorage
 * @param key Kunci penyimpanan
 * @param defaultValue Nilai default jika data tidak ditemukan
 * @returns Data yang diambil atau nilai default
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const serializedData = localStorage.getItem(key)
    if (serializedData === null) {
      return defaultValue
    }
    return JSON.parse(serializedData) as T
  } catch (error) {
    console.error(`Error getting data from localStorage with key ${key}:`, error)
    return defaultValue
  }
}

/**
 * Menghapus data dari localStorage
 * @param key Kunci penyimpanan
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing data from localStorage with key ${key}:`, error)
  }
}

/**
 * Memeriksa apakah localStorage tersedia
 * @returns true jika localStorage tersedia, false jika tidak
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = "__storage_test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

export { STORAGE_KEYS }
