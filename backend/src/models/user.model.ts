import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  _id: string
  email: string
  password: string
  name: string
  role: "admin" | "manager" | "staff" | "gro"
  status: "Active" | "Inactive" | "Suspended"
  avatar?: string
  phone?: string
  lastLogin?: Date
  passwordChangedAt?: Date
  loginHistory: Array<{
    timestamp: Date
    ip: string
  }>
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "manager", "staff", "gro"],
      default: "staff",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(\+62|62|0)8[1-9][0-9]{6,9}$/, "Please provide a valid Indonesian phone number"],
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    loginHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ip: {
          type: String,
          default: "unknown",
        },
      },
    ],
    createdBy: {
      type: String,
      default: "system",
    },
    updatedBy: {
      type: String,
      default: "system",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.password
        return ret
      },
    },
  },
)

// Indexes for performance
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ status: 1 })
UserSchema.index({ createdAt: -1 })

// Pre-save middleware to update timestamps
UserSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date()
  }
  next()
})

export const UserModel = mongoose.model<IUser>("User", UserSchema)
