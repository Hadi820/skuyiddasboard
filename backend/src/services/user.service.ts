import { UserModel, type IUser } from "../models/user.model"
import type { PaginationParams, PaginatedResult } from "../types/api.types"
import { logger } from "../utils/logger"

export interface UserFilters {
  role?: string
  status?: string
  searchTerm?: string
}

export interface CreateUserDto {
  email: string
  password: string
  name: string
  role: "admin" | "manager" | "staff" | "gro"
  phone?: string
  createdBy: string
}

export interface UpdateUserDto {
  name?: string
  role?: "admin" | "manager" | "staff" | "gro"
  status?: "Active" | "Inactive" | "Suspended"
  phone?: string
  avatar?: string
  updatedBy: string
}

export class UserService {
  /**
   * Get all users with filters and pagination
   */
  async getAllUsers(
    filters: UserFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 },
  ): Promise<PaginatedResult<IUser>> {
    try {
      const { role, status, searchTerm } = filters
      const { page, limit } = pagination

      // Build query
      const query: any = {}

      if (role) {
        query.role = role
      }

      if (status) {
        query.status = status
      }

      if (searchTerm) {
        query.$or = [{ name: { $regex: searchTerm, $options: "i" } }, { email: { $regex: searchTerm, $options: "i" } }]
      }

      // Calculate pagination
      const skip = (page - 1) * limit
      const total = await UserModel.countDocuments(query)
      const totalPages = Math.ceil(total / limit)

      // Fetch users
      const users = await UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

      return {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      logger.error("Error in getAllUsers:", error)
      throw new Error(`Failed to retrieve users: ${error}`)
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(id).lean()
      return user
    } catch (error) {
      logger.error("Error in getUserById:", error)
      throw new Error(`Failed to retrieve user: ${error}`)
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ email }).lean()
      return user
    } catch (error) {
      logger.error("Error in getUserByEmail:", error)
      throw new Error(`Failed to retrieve user: ${error}`)
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserDto): Promise<IUser> {
    try {
      const user = await UserModel.create(userData)
      return user.toObject()
    } catch (error) {
      logger.error("Error in createUser:", error)
      if ((error as any).code === 11000) {
        throw new Error("User with this email already exists")
      }
      throw new Error(`Failed to create user: ${error}`)
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, updateData: UpdateUserDto): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true },
      ).lean()

      return user
    } catch (error) {
      logger.error("Error in updateUser:", error)
      throw new Error(`Failed to update user: ${error}`)
    }
  }

  /**
   * Delete user (soft delete by setting status to Inactive)
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndUpdate(id, { status: "Inactive", updatedAt: new Date() }, { new: true })

      return !!result
    } catch (error) {
      logger.error("Error in deleteUser:", error)
      throw new Error(`Failed to delete user: ${error}`)
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<any> {
    try {
      const stats = await UserModel.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
            },
            inactiveUsers: {
              $sum: { $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0] },
            },
            suspendedUsers: {
              $sum: { $cond: [{ $eq: ["$status", "Suspended"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalUsers: 1,
            activeUsers: 1,
            inactiveUsers: 1,
            suspendedUsers: 1,
          },
        },
      ])

      const roleStats = await UserModel.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ])

      return {
        ...stats[0],
        roleDistribution: roleStats.reduce((acc, item) => {
          acc[item._id] = item.count
          return acc
        }, {}),
      }
    } catch (error) {
      logger.error("Error in getUserStats:", error)
      throw new Error(`Failed to get user statistics: ${error}`)
    }
  }
}
