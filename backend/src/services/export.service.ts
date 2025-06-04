import xlsx from "xlsx"
import { logger } from "../utils/logger"

export class ExportService {
  /**
   * Export reservations to Excel or CSV
   */
  async exportReservations(reservations: any[], format = "excel"): Promise<Buffer> {
    try {
      // Prepare data for export
      const data = reservations.map((reservation) => ({
        "Booking Code": reservation.bookingCode,
        "Customer Name": reservation.customerName,
        "Phone Number": reservation.phoneNumber || "",
        "Check In": this.formatDate(reservation.checkIn),
        "Check Out": this.formatDate(reservation.checkOut),
        "Order Details": reservation.orderDetails,
        GRO: reservation.gro || "",
        Category: reservation.category,
        "Final Price": reservation.finalPrice,
        "Customer Deposit": reservation.customerDeposit || 0,
        "Base Price": reservation.basePrice || 0,
        Status: reservation.status,
        Notes: reservation.notes || "",
        "Created At": this.formatDate(reservation.createdAt),
        Client: reservation.client ? reservation.client.name : "",
        "Client Email": reservation.client ? reservation.client.email || "" : "",
        "Client Phone": reservation.client ? reservation.client.phone || "" : "",
      }))

      // Create workbook
      const worksheet = xlsx.utils.json_to_sheet(data)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, "Reservations")

      // Set column widths
      const colWidths = [
        { wch: 15 }, // Booking Code
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Phone Number
        { wch: 12 }, // Check In
        { wch: 12 }, // Check Out
        { wch: 30 }, // Order Details
        { wch: 10 }, // GRO
        { wch: 12 }, // Category
        { wch: 12 }, // Final Price
        { wch: 12 }, // Customer Deposit
        { wch: 12 }, // Base Price
        { wch: 10 }, // Status
        { wch: 25 }, // Notes
        { wch: 20 }, // Created At
        { wch: 20 }, // Client
        { wch: 20 }, // Client Email
        { wch: 15 }, // Client Phone
      ]
      worksheet["!cols"] = colWidths

      // Generate buffer
      if (format === "csv") {
        const csv = xlsx.utils.sheet_to_csv(worksheet)
        return Buffer.from(csv, "utf-8")
      } else {
        return Buffer.from(xlsx.write(workbook, { type: "buffer", bookType: "xlsx" }))
      }
    } catch (error) {
      logger.error("Error exporting reservations:", error)
      throw new Error(`Failed to export reservations: ${error}`)
    }
  }

  /**
   * Export clients to Excel or CSV
   */
  async exportClients(clients: any[], format = "excel"): Promise<Buffer> {
    try {
      // Prepare data for export
      const data = clients.map((client) => ({
        Name: client.name,
        Email: client.email || "",
        Phone: client.phone || "",
        Company: client.company || "",
        Address: client.address || "",
        Status: client.status,
        "Total Reservations": client.totalReservations || 0,
        "Total Revenue": client.totalRevenue || 0,
        "Last Reservation": client.lastReservation ? this.formatDate(client.lastReservation) : "",
        "Created At": this.formatDate(client.createdAt),
        Notes: client.notes || "",
      }))

      // Create workbook
      const worksheet = xlsx.utils.json_to_sheet(data)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, "Clients")

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 20 }, // Company
        { wch: 30 }, // Address
        { wch: 10 }, // Status
        { wch: 15 }, // Total Reservations
        { wch: 15 }, // Total Revenue
        { wch: 20 }, // Last Reservation
        { wch: 20 }, // Created At
        { wch: 30 }, // Notes
      ]
      worksheet["!cols"] = colWidths

      // Generate buffer
      if (format === "csv") {
        const csv = xlsx.utils.sheet_to_csv(worksheet)
        return Buffer.from(csv, "utf-8")
      } else {
        return Buffer.from(xlsx.write(workbook, { type: "buffer", bookType: "xlsx" }))
      }
    } catch (error) {
      logger.error("Error exporting clients:", error)
      throw new Error(`Failed to export clients: ${error}`)
    }
  }

  /**
   * Export invoices to Excel or CSV
   */
  async exportInvoices(invoices: any[], format = "excel"): Promise<Buffer> {
    try {
      // Prepare data for export
      const data = invoices.map((invoice) => ({
        "Invoice Number": invoice.invoiceNumber,
        "Invoice Date": this.formatDate(invoice.invoiceDate),
        "Due Date": this.formatDate(invoice.dueDate),
        Amount: invoice.amount,
        "Paid Amount": invoice.paidAmount || 0,
        Status: invoice.status,
        Client: invoice.client ? invoice.client.name : "",
        "Client Email": invoice.client ? invoice.client.email || "" : "",
        Reservation: invoice.reservation ? invoice.reservation.bookingCode : "",
        Description: invoice.description || "",
        Notes: invoice.notes || "",
        "Created At": this.formatDate(invoice.createdAt),
      }))

      // Create workbook
      const worksheet = xlsx.utils.json_to_sheet(data)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, "Invoices")

      // Set column widths
      const colWidths = [
        { wch: 15 }, // Invoice Number
        { wch: 12 }, // Invoice Date
        { wch: 12 }, // Due Date
        { wch: 12 }, // Amount
        { wch: 12 }, // Paid Amount
        { wch: 10 }, // Status
        { wch: 20 }, // Client
        { wch: 25 }, // Client Email
        { wch: 15 }, // Reservation
        { wch: 30 }, // Description
        { wch: 25 }, // Notes
        { wch: 20 }, // Created At
      ]
      worksheet["!cols"] = colWidths

      // Generate buffer
      if (format === "csv") {
        const csv = xlsx.utils.sheet_to_csv(worksheet)
        return Buffer.from(csv, "utf-8")
      } else {
        return Buffer.from(xlsx.write(workbook, { type: "buffer", bookType: "xlsx" }))
      }
    } catch (error) {
      logger.error("Error exporting invoices:", error)
      throw new Error(`Failed to export invoices: ${error}`)
    }
  }

  /**
   * Format date for export
   */
  private formatDate(date: Date | string | null): string {
    if (!date) return ""
    const d = new Date(date)
    return d.toISOString().split("T")[0]
  }
}
