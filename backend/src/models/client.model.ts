import mongoose, { Schema, type Document } from "mongoose"

export interface IClient extends Document {
  _id: string
  name: string
  email?: string
  phone?: string
  address?: string
  company?: string
  notes?: string
  status: "Active" | "Inactive"
  totalReservations: number
  totalRevenue: number
  lastReservation?: Date
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
}

const ClientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      index: true,
      sparse: true,
      validate: {
        validator: (v: string) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: "Please enter a valid email",
      },
    },
    phone: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    company: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    notes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
      index: true,
    },
    totalReservations: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastReservation: {
      type: Date,
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

// Indexes
ClientSchema.index({ name: 1 })
ClientSchema.index({ email: 1 }, { sparse: true })
ClientSchema.index({ phone: 1 })
ClientSchema.index({ company: 1 })
ClientSchema.index({ status: 1 })
ClientSchema.index({ createdAt: -1 })
ClientSchema.index({ totalRevenue: -1 })

export const Client = mongoose.model<IClient>("Client", ClientSchema)
