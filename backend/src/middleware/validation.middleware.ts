import { body, param, query, validationResult } from "express-validator"
import type { Request, Response, NextFunction } from "express"
import { ReservationStatus, ReservationCategory, ClientStatus, UserRole, UserStatus } from "@prisma/client"

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: errors.array(),
    })
  }
  next()
}

/**
 * User validation rules
 */
export const validateCreateUser = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("name").notEmpty().withMessage("Name is required"),
  body("role")
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(", ")}`),
  handleValidationErrors,
]

export const validateUpdateUser = [
  body("email").optional().isEmail().withMessage("Please provide a valid email address"),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("role")
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(", ")}`),
  body("status")
    .optional()
    .isIn(Object.values(UserStatus))
    .withMessage(`Status must be one of: ${Object.values(UserStatus).join(", ")}`),
  handleValidationErrors,
]

/**
 * Client validation rules
 */
export const validateCreateClient = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").optional().isEmail().withMessage("Please provide a valid email address"),
  body("phone").optional().isMobilePhone("id-ID").withMessage("Please provide a valid Indonesian phone number"),
  body("status")
    .optional()
    .isIn(Object.values(ClientStatus))
    .withMessage(`Status must be one of: ${Object.values(ClientStatus).join(", ")}`),
  handleValidationErrors,
]

export const validateUpdateClient = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Please provide a valid email address"),
  body("phone").optional().isMobilePhone("id-ID").withMessage("Please provide a valid Indonesian phone number"),
  body("status")
    .optional()
    .isIn(Object.values(ClientStatus))
    .withMessage(`Status must be one of: ${Object.values(ClientStatus).join(", ")}`),
  handleValidationErrors,
]

/**
 * Reservation validation rules
 */
export const validateCreateReservation = [
  body("customerName").notEmpty().withMessage("Customer name is required"),
  body("checkIn").isISO8601().withMessage("Check-in date must be a valid date"),
  body("checkOut").isISO8601().withMessage("Check-out date must be a valid date"),
  body("orderDetails").notEmpty().withMessage("Order details are required"),
  body("category")
    .isIn(Object.values(ReservationCategory))
    .withMessage(`Category must be one of: ${Object.values(ReservationCategory).join(", ")}`),
  body("finalPrice").isNumeric().withMessage("Final price must be a number"),
  body("customerDeposit").optional().isNumeric().withMessage("Customer deposit must be a number"),
  body("basePrice").optional().isNumeric().withMessage("Base price must be a number"),
  body("status")
    .optional()
    .isIn(Object.values(ReservationStatus))
    .withMessage(`Status must be one of: ${Object.values(ReservationStatus).join(", ")}`),
  body("clientId").optional().isString().withMessage("Client ID must be a string"),
  handleValidationErrors,
]

export const validateUpdateReservation = [
  body("customerName").optional().notEmpty().withMessage("Customer name cannot be empty"),
  body("checkIn").optional().isISO8601().withMessage("Check-in date must be a valid date"),
  body("checkOut").optional().isISO8601().withMessage("Check-out date must be a valid date"),
  body("orderDetails").optional().notEmpty().withMessage("Order details cannot be empty"),
  body("category")
    .optional()
    .isIn(Object.values(ReservationCategory))
    .withMessage(`Category must be one of: ${Object.values(ReservationCategory).join(", ")}`),
  body("finalPrice").optional().isNumeric().withMessage("Final price must be a number"),
  body("customerDeposit").optional().isNumeric().withMessage("Customer deposit must be a number"),
  body("basePrice").optional().isNumeric().withMessage("Base price must be a number"),
  body("status")
    .optional()
    .isIn(Object.values(ReservationStatus))
    .withMessage(`Status must be one of: ${Object.values(ReservationStatus).join(", ")}`),
  handleValidationErrors,
]

/**
 * Invoice validation rules
 */
export const validateCreateInvoice = [
  body("invoiceDate").isISO8601().withMessage("Invoice date must be a valid date"),
  body("dueDate").isISO8601().withMessage("Due date must be a valid date"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("clientId").optional().isString().withMessage("Client ID must be a string"),
  body("reservationId").optional().isString().withMessage("Reservation ID must be a string"),
  handleValidationErrors,
]

export const validateUpdateInvoice = [
  body("invoiceDate").optional().isISO8601().withMessage("Invoice date must be a valid date"),
  body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
  body("amount").optional().isNumeric().withMessage("Amount must be a number"),
  body("paidAmount").optional().isNumeric().withMessage("Paid amount must be a number"),
  handleValidationErrors,
]

/**
 * Expense validation rules
 */
export const validateCreateExpense = [
  body("title").notEmpty().withMessage("Title is required"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("expenseDate").isISO8601().withMessage("Expense date must be a valid date"),
  handleValidationErrors,
]

export const validateUpdateExpense = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("amount").optional().isNumeric().withMessage("Amount must be a number"),
  body("expenseDate").optional().isISO8601().withMessage("Expense date must be a valid date"),
  handleValidationErrors,
]

/**
 * Pagination validation rules
 */
export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
]

/**
 * ID parameter validation
 */
export const validateIdParam = [param("id").notEmpty().withMessage("ID is required"), handleValidationErrors]
