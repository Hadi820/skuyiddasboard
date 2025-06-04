import { reservationsData } from "@/data/reservations"
import type { Reservation } from "@/types/reservation"
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "./storage-service"

/**
 * Hotel Reservation Management Service
 *
 * Service ini mengelola semua operasi yang berkaitan dengan reservasi hotel,
 * termasuk CRUD operations, filtering, dan analisis data GRO (Guest Relations Officer).
 *
 * @author Hotel Management System
 * @version 1.0.0
 */

// Inisialisasi data reservasi dari localStorage atau data default
let reservations = getFromStorage<Reservation[]>(STORAGE_KEYS.RESERVATIONS, reservationsData)

/**
 * Mendapatkan semua data reservasi
 * @returns {Reservation[]} Array berisi semua data reservasi
 */
export function getAllReservations(): Reservation[] {
  return reservations
}

/**
 * Mendapatkan reservasi berdasarkan ID
 * @param {number} id - ID reservasi yang dicari
 * @returns {Reservation | undefined} Data reservasi atau undefined jika tidak ditemukan
 */
export function getReservationById(id: number): Reservation | undefined {
  return reservations.find((res) => res.id === id)
}

/**
 * Menambahkan reservasi baru ke sistem
 * @param {Omit<Reservation, "id">} reservation - Data reservasi baru tanpa ID
 * @returns {Reservation} Data reservasi yang telah ditambahkan dengan ID
 */
export function addReservation(reservation: Omit<Reservation, "id">): Reservation {
  const newId = Math.max(0, ...reservations.map((r) => r.id)) + 1
  const newReservation = { ...reservation, id: newId }
  reservations.push(newReservation)

  // Simpan ke localStorage untuk persistensi data
  saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations)

  return newReservation
}

/**
 * Memperbarui data reservasi yang sudah ada
 * @param {number} id - ID reservasi yang akan diperbarui
 * @param {Partial<Reservation>} reservation - Data reservasi yang akan diperbarui
 * @returns {Reservation | null} Data reservasi yang telah diperbarui atau null jika tidak ditemukan
 */
export function updateReservation(id: number, reservation: Partial<Reservation>): Reservation | null {
  const index = reservations.findIndex((res) => res.id === id)
  if (index === -1) return null

  reservations[index] = { ...reservations[index], ...reservation }

  // Simpan ke localStorage untuk persistensi data
  saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations)

  return reservations[index]
}

/**
 * Menghapus reservasi dari sistem
 * @param {number} id - ID reservasi yang akan dihapus
 * @returns {boolean} true jika berhasil dihapus, false jika tidak ditemukan
 */
export function deleteReservation(id: number): boolean {
  const index = reservations.findIndex((res) => res.id === id)
  if (index === -1) return false

  reservations.splice(index, 1)

  // Simpan ke localStorage untuk persistensi data
  saveToStorage(STORAGE_KEYS.RESERVATIONS, reservations)

  return true
}

/**
 * Interface untuk filter reservasi
 */
interface ReservationFilters {
  status?: string
  category?: string
  date?: Date
  searchTerm?: string
  gro?: string
}

/**
 * Mendapatkan reservasi berdasarkan filter yang diberikan
 * @param {ReservationFilters} filters - Object berisi kriteria filter
 * @returns {Reservation[]} Array reservasi yang sesuai dengan filter
 */
export function getFilteredReservations(filters: ReservationFilters): Reservation[] {
  return reservations.filter((reservation) => {
    const matchesStatus = !filters.status || filters.status === "all" || reservation.status === filters.status
    const matchesCategory = !filters.category || filters.category === "all" || reservation.category === filters.category
    const matchesGro = !filters.gro || filters.gro === "all" || reservation.gro === filters.gro
    const matchesDate =
      !filters.date || (new Date(reservation.checkIn) <= filters.date && new Date(reservation.checkOut) >= filters.date)

    const matchesSearch =
      !filters.searchTerm ||
      reservation.customerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      reservation.bookingCode.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      reservation.phoneNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      reservation.orderDetails.toLowerCase().includes(filters.searchTerm.toLowerCase())

    return matchesStatus && matchesCategory && matchesDate && matchesSearch && matchesGro
  })
}

/**
 * Mendapatkan semua reservasi yang ditangani oleh GRO tertentu
 * @param {string} gro - Nama GRO yang dicari
 * @returns {Reservation[]} Array reservasi yang ditangani oleh GRO tersebut
 */
export function getReservationsByGro(gro: string): Reservation[] {
  return reservations.filter((reservation) => reservation.gro === gro)
}

/**
 * Interface untuk summary data GRO
 */
interface GroSummaryData {
  gro: string
  count: number
  revenue: number
}

/**
 * Mendapatkan ringkasan kinerja semua GRO
 * Menghitung jumlah reservasi dan total pendapatan untuk setiap GRO
 * @returns {GroSummaryData[]} Array berisi ringkasan kinerja setiap GRO
 */
export function getGroSummary(): GroSummaryData[] {
  const groMap = new Map<string, { count: number; revenue: number }>()

  reservations.forEach((reservation) => {
    if (!groMap.has(reservation.gro)) {
      groMap.set(reservation.gro, { count: 0, revenue: 0 })
    }

    const groData = groMap.get(reservation.gro)!
    groData.count += 1
    groData.revenue += reservation.finalPrice
    groMap.set(reservation.gro, groData)
  })

  return Array.from(groMap.entries()).map(([gro, data]) => ({
    gro,
    count: data.count,
    revenue: data.revenue,
  }))
}

/**
 * Mendapatkan ringkasan kinerja GRO dengan perhitungan komisi
 * Fungsi ini identik dengan getGroSummary() untuk kompatibilitas
 * @returns {GroSummaryData[]} Array berisi ringkasan kinerja setiap GRO
 */
export function getGroSummaryWithCommission(): GroSummaryData[] {
  return getGroSummary()
}

/**
 * Memuat data reservasi dari localStorage
 * Fungsi ini akan mengganti data reservasi saat ini dengan data dari localStorage
 */
export function loadReservationsFromStorage(): void {
  reservations = getFromStorage<Reservation[]>(STORAGE_KEYS.RESERVATIONS, reservationsData)
}

/**
 * Alias untuk loadReservationsFromStorage() untuk kompatibilitas dengan kode lama
 * @deprecated Gunakan loadReservationsFromStorage() sebagai gantinya
 */
export function loadReservationsFromLocalStorage(): void {
  loadReservationsFromStorage()
}

/**
 * Mendapatkan statistik umum reservasi
 * @returns {Object} Object berisi statistik umum
 */
export function getReservationStats() {
  const totalReservations = reservations.length
  const totalRevenue = reservations.reduce((sum, res) => sum + res.finalPrice, 0)
  const averageRevenue = totalReservations > 0 ? totalRevenue / totalReservations : 0

  const statusCounts = reservations.reduce(
    (acc, res) => {
      acc[res.status] = (acc[res.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalReservations,
    totalRevenue,
    averageRevenue,
    statusCounts,
  }
}

// Inisialisasi data saat service dimuat
loadReservationsFromStorage()
