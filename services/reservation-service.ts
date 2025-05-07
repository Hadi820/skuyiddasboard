import { reservationsData } from "@/data/reservations"
import type { Reservation } from "@/types/reservation"

// Fungsi untuk mendapatkan semua reservasi
export function getAllReservations(): Reservation[] {
  return reservationsData
}

// Fungsi untuk mendapatkan reservasi berdasarkan ID
export function getReservationById(id: number): Reservation | undefined {
  return reservationsData.find((res) => res.id === id)
}

// Fungsi untuk menambahkan reservasi baru
export function addReservation(reservation: Omit<Reservation, "id">): Reservation {
  const newId = Math.max(0, ...reservationsData.map((r) => r.id)) + 1
  const newReservation = { ...reservation, id: newId }
  reservationsData.push(newReservation)

  // Simpan ke localStorage untuk persistensi data
  saveReservationsToLocalStorage()

  return newReservation
}

// Fungsi untuk memperbarui reservasi yang ada
export function updateReservation(id: number, reservation: Partial<Reservation>): Reservation | null {
  const index = reservationsData.findIndex((res) => res.id === id)
  if (index === -1) return null

  reservationsData[index] = { ...reservationsData[index], ...reservation }

  // Simpan ke localStorage untuk persistensi data
  saveReservationsToLocalStorage()

  return reservationsData[index]
}

// Fungsi untuk menghapus reservasi
export function deleteReservation(id: number): boolean {
  const index = reservationsData.findIndex((res) => res.id === id)
  if (index === -1) return false

  reservationsData.splice(index, 1)

  // Simpan ke localStorage untuk persistensi data
  saveReservationsToLocalStorage()

  return true
}

// Fungsi untuk mendapatkan reservasi berdasarkan filter
export function getFilteredReservations(filters: {
  status?: string
  category?: string
  date?: Date
  searchTerm?: string
  gro?: string
}): Reservation[] {
  return reservationsData.filter((reservation) => {
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

// Fungsi untuk mendapatkan reservasi berdasarkan GRO
export function getReservationsByGro(gro: string): Reservation[] {
  return reservationsData.filter((reservation) => reservation.gro === gro)
}

// Fungsi untuk mendapatkan semua GRO unik dengan jumlah reservasi
export function getGroSummary() {
  const groMap = new Map<string, { count: number; revenue: number }>()

  reservationsData.forEach((reservation) => {
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

// Fungsi untuk menyimpan data ke localStorage
function saveReservationsToLocalStorage() {
  try {
    localStorage.setItem("reservationsData", JSON.stringify(reservationsData))
  } catch (error) {
    console.error("Error saving reservations to localStorage:", error)
  }
}

// Fungsi untuk memuat data dari localStorage
export function loadReservationsFromLocalStorage() {
  try {
    const savedData = localStorage.getItem("reservationsData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)

      // Kosongkan array saat ini
      reservationsData.length = 0

      // Tambahkan data yang dimuat
      parsedData.forEach((item: Reservation) => {
        reservationsData.push(item)
      })
    }
  } catch (error) {
    console.error("Error loading reservations from localStorage:", error)
  }
}
