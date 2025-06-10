import { body, param, query, validationResult } from "express-validator"
import type { Request, Response, NextFunction } from "express"

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "Invalid input data",
      details: errors.array(),
    })
  }
  next()
}

/**
 * Reservation validation rules
 */
export const validateReservation = [
  body("customerName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Customer name must be between 2 and 100 characters"),
  body("phoneNumber").optional().isMobilePhone("id-ID").withMessage("Invalid Indonesian phone number format"),
  body("checkIn").isISO8601().toDate().withMessage("Check-in date must be a valid date"),
  body("checkOut")
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkIn)) {
        throw new Error("Check-out date must be after check-in date")
      }
      return true
    }),
  body("orderDetails")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Order details must be between 5 and 500 characters"),
  body("category")
    .isIn(["AKOMODASI", "TRANSPORTASI", "TRIP", "KULINER", "EVENT", "MEETING", "PHOTOSHOOT", "LAINNYA"])
    .withMessage("Invalid category"),
  body("finalPrice").isFloat({ min: 0 }).withMessage("Final price must be a positive number"),
  body("customerDeposit").optional().isFloat({ min: 0 }).withMessage("Customer deposit must be a positive number"),
  body("basePrice").optional().isFloat({ min: 0 }).withMessage("Base price must be a positive number"),
  body("status").optional().isIn(["PENDING", "PROSES", "SELESAI", "BATAL"]).withMessage("Invalid status"),
  body("gro").optional().trim().isLength({ max: 50 }).withMessage("GRO name must not exceed 50 characters"),
  body("notes").optional().trim().isLength({ max: 1000 }).withMessage("Notes must not exceed 1000 characters"),
  handleValidationErrors,
]

/**
 * Client validation rules
 */
export const validateClient = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
  body("email").optional().isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("phone").optional().isMobilePhone("id-ID").withMessage("Invalid Indonesian phone number format"),
  body("company").optional().trim().isLength({ max: 100 }).withMessage("Company name must not exceed 100 characters"),
  body("address").optional().trim().isLength({ max: 500 }).withMessage("Address must not exceed 500 characters"),
  body("status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Invalid status"),
  handleValidationErrors,
]

/**
 * Auth validation rules
 */
export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
]

export const validateRegister = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least 8 characters with uppercase, lowercase, number, and special character",
    ),
  body("role").optional().isIn(["ADMIN", "MANAGER", "STAFF", "GRO"]).withMessage("Invalid role"),
  handleValidationErrors,
]

export const validateChangePassword = [
  body("currentPassword").isLength({ min: 6 }).withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least 8 characters with uppercase, lowercase, number, and special character",
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match")
    }
    return true
  }),
  handleValidationErrors,
]

/**
 * ID validation
 */
export const validateId = [param("id").isUUID().withMessage("Invalid ID format"), handleValidationErrors]

/**
 * Query validation
 */
export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("sortBy").optional().isAlpha().withMessage("Sort field must contain only letters"),
  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("Sort order must be 'asc' or 'desc'"),
  handleValidationErrors,
]
