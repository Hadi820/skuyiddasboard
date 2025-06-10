export interface Reservation {
  id: number
  bookingCode: string
  bookingDate: string
  customerName: string
  phoneNumber: string
  checkIn: string
  checkOut: string
  tripSchedule: string | null
  orderDetails: string
  gro: string
  category: string
  finalPrice: number
  customerDeposit: number
  partnerDeposit: number
  remainingPayment: number
  basePrice: number
  profit: number
  status: "Pending" | "Proses" | "Selesai" | "Batal"
  notes?: string
}

export const reservationsData: Reservation[] = []
