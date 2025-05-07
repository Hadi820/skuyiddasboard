import { reservationsData } from "@/data/reservations"

// Konstanta untuk komisi GRO per reservasi
export const GRO_COMMISSION_PER_RESERVATION = 50000 // Rp 50.000

// Tipe data untuk riwayat komisi
export interface CommissionHistory {
  id: string
  gro: string
  reservationId: number
  bookingCode: string
  customerName: string
  amount: number
  date: string
  status: "pending" | "paid" | "cancelled"
}

// Data riwayat komisi
export const commissionHistoryData: CommissionHistory[] = []

// Fungsi untuk menghitung total komisi GRO
export function calculateGroCommission(gro: string): number {
  const reservations = reservationsData.filter((res) => res.gro === gro)
  return reservations.length * GRO_COMMISSION_PER_RESERVATION
}

// Fungsi untuk mendapatkan riwayat komisi GRO
export function getGroCommissionHistory(gro: string): CommissionHistory[] {
  return commissionHistoryData.filter((history) => history.gro === gro)
}

// Fungsi untuk mendapatkan semua GRO unik dengan jumlah reservasi dan komisi
export function getGroSummaryWithCommission() {
  const groMap = new Map<
    string,
    { count: number; revenue: number; commission: number; paidCommission: number; pendingCommission: number }
  >()

  reservationsData.forEach((reservation) => {
    if (!reservation.gro) return

    if (!groMap.has(reservation.gro)) {
      groMap.set(reservation.gro, {
        count: 0,
        revenue: 0,
        commission: 0,
        paidCommission: 0,
        pendingCommission: 0,
      })
    }

    const groData = groMap.get(reservation.gro)!
    groData.count += 1
    groData.revenue += reservation.finalPrice
    groData.commission += GRO_COMMISSION_PER_RESERVATION
    groMap.set(reservation.gro, groData)
  })

  // Tambahkan informasi komisi yang sudah dibayar
  commissionHistoryData.forEach((history) => {
    if (!groMap.has(history.gro)) return

    const groData = groMap.get(history.gro)!
    if (history.status === "paid") {
      groData.paidCommission += history.amount
    } else if (history.status === "pending") {
      groData.pendingCommission += history.amount
    }
    groMap.set(history.gro, groData)
  })

  return Array.from(groMap.entries()).map(([gro, data]) => ({
    gro,
    count: data.count,
    revenue: data.revenue,
    commission: data.commission,
    paidCommission: data.paidCommission,
    pendingCommission: data.pendingCommission,
  }))
}

// Fungsi untuk menambahkan riwayat komisi
export function addCommissionHistory(commission: Omit<CommissionHistory, "id">): CommissionHistory {
  const id = `COM-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  const newCommission = { ...commission, id }
  commissionHistoryData.push(newCommission)
  return newCommission
}

// Fungsi untuk memperbarui status komisi
export function updateCommissionStatus(id: string, status: "pending" | "paid" | "cancelled"): boolean {
  const index = commissionHistoryData.findIndex((com) => com.id === id)
  if (index === -1) return false

  commissionHistoryData[index].status = status
  return true
}

// Fungsi untuk menginisialisasi data komisi dari reservasi yang ada
export function initializeCommissionData() {
  if (commissionHistoryData.length > 0) return // Sudah diinisialisasi

  reservationsData.forEach((reservation) => {
    if (!reservation.gro) return

    // Cek apakah sudah ada riwayat komisi untuk reservasi ini
    const existingCommission = commissionHistoryData.find((com) => com.reservationId === reservation.id)
    if (existingCommission) return

    // Tambahkan riwayat komisi baru
    addCommissionHistory({
      gro: reservation.gro,
      reservationId: reservation.id,
      bookingCode: reservation.bookingCode,
      customerName: reservation.customerName,
      amount: GRO_COMMISSION_PER_RESERVATION,
      date: new Date().toISOString(),
      status: reservation.status === "Selesai" ? "paid" : "pending",
    })
  })
}

// Inisialisasi data komisi
initializeCommissionData()
