import mongoose, { Schema, type Document } from "mongoose"

export interface IReservation extends Document {
  _id: string
  clientId?: string
  bookingCode: string
  bookingDate: Date
  customerName: string
  phoneNumber?: string
  checkIn: Date
  checkOut: Date
  tripSchedule?: string
  orderDetails: string
  gro?: string
  category: "Akomodasi" | "Transportasi" | "Trip" | "Event" | "Meeting" | "Lainnya"
  finalPrice: number
  customerDeposit: number
  partnerDeposit: number
  remainingPayment: number
  basePrice: number
  profit: number
  status: "Pending" | "Proses" | "Selesai" | "Batal"
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
}

const ReservationSchema: Schema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: false,
    },
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    checkIn: {
      type: Date,
      required: true,
      index: true,
    },
    checkOut: {
      type: Date,
      required: true,
      index: true,
      validate: {
        validator: function (this: IReservation, value: Date) {
          return value >= this.checkIn
        },
        message: "Check-out date must be after check-in date",
      },
    },
    tripSchedule: {
      type: String,
      required: false,
    },
    orderDetails: {
      type: String,
      required: true,
    },
    gro: {
      type: String,
      required: false,
      index: true,
    },
    category: {
      type: String,
      enum: ["Akomodasi", "Transportasi", "Trip", "Event", "Meeting", "Lainnya"],
      default: "Akomodasi",
      required: true,
      index: true,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    customerDeposit: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    partnerDeposit: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    basePrice: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Proses", "Selesai", "Batal"],
      default: "Pending",
      required: true,
      index: true,
    },
    notes: {
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
      required: false,
    },
    updatedBy: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual fields
ReservationSchema.virtual("remainingPayment").get(function (this: IReservation) {
  return this.finalPrice - this.customerDeposit
})

ReservationSchema.virtual("profit").get(function (this: IReservation) {
  return this.finalPrice - (this.basePrice || 0)
})

// Indexes for better performance
ReservationSchema.index({ bookingCode: 1 })
ReservationSchema.index({ customerName: 1 })
ReservationSchema.index({ gro: 1 })
ReservationSchema.index({ status: 1 })
ReservationSchema.index({ category: 1 })
ReservationSchema.index({ checkIn: 1, checkOut: 1 })
ReservationSchema.index({ createdAt: -1 })
ReservationSchema.index({ finalPrice: -1 })

// Pre-save middleware to generate booking code
ReservationSchema.pre("save", async function (this: IReservation, next) {
  if (this.isNew && !this.bookingCode) {
    const count = await mongoose.model("Reservation").countDocuments()
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    this.bookingCode = `BK-${date}-${String(count + 1).padStart(3, "0")}`
  }
  next()
})

export const Reservation = mongoose.model<IReservation>("Reservation", ReservationSchema)
