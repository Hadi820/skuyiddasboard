import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { Invoice } from "@/services/invoice-service"

// Fungsi untuk format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Fungsi untuk generate PDF invoice
export const generateInvoicePDF = (invoice: Invoice, clientName: string): jsPDF => {
  // Inisialisasi dokumen PDF
  const doc = new jsPDF()

  // Set font
  doc.setFont("helvetica")

  // Header
  doc.setFontSize(20)
  doc.text("INVOICE", 105, 20, { align: "center" })

  // Status invoice
  doc.setFontSize(12)
  let statusText = ""
  let statusColor = [0, 0, 0] // Default black

  switch (invoice.status) {
    case "paid":
      statusText = "LUNAS"
      statusColor = [39, 174, 96] // Green
      break
    case "sent":
      statusText = "TERKIRIM"
      statusColor = [41, 128, 185] // Blue
      break
    case "overdue":
      statusText = "JATUH TEMPO"
      statusColor = [192, 57, 43] // Red
      break
    case "draft":
      statusText = "DRAFT"
      statusColor = [127, 140, 141] // Gray
      break
    case "cancelled":
      statusText = "DIBATALKAN"
      statusColor = [127, 140, 141] // Gray
      break
  }

  // Add status with color
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
  doc.text(statusText, 105, 30, { align: "center" })
  doc.setTextColor(0, 0, 0) // Reset to black

  // Logo placeholder (in a real app, you would add your logo)
  doc.rect(15, 15, 40, 20)
  doc.setFontSize(10)
  doc.text("LOGO", 35, 25, { align: "center" })

  // Invoice details
  doc.setFontSize(10)
  doc.text(`No. Invoice: ${invoice.invoiceNumber}`, 15, 45)
  doc.text(`Tanggal: ${format(new Date(invoice.issueDate), "dd MMMM yyyy", { locale: id })}`, 15, 50)
  doc.text(`Jatuh Tempo: ${format(new Date(invoice.dueDate), "dd MMMM yyyy", { locale: id })}`, 15, 55)

  // Company details
  doc.setFontSize(10)
  doc.text("Dari:", 15, 70)
  doc.setFontSize(11)
  doc.text("Villa Reservasi", 15, 75)
  doc.setFontSize(10)
  doc.text("Jl. Reservasi No. 123, Jakarta", 15, 80)
  doc.text("Indonesia", 15, 85)
  doc.text("info@villareservasi.com", 15, 90)
  doc.text("0812-3456-7890", 15, 95)

  // Client details
  doc.setFontSize(10)
  doc.text("Untuk:", 120, 70)
  doc.setFontSize(11)
  doc.text(clientName, 120, 75)

  // Table for invoice items
  const tableColumn = ["Deskripsi", "Jumlah", "Harga Satuan", "Total"]
  const tableRows: any[] = []

  // Add rows to the table
  invoice.items.forEach((item) => {
    const itemData = [
      item.description,
      item.quantity,
      formatCurrency(Number(item.unitPrice)),
      formatCurrency(Number(item.amount)),
    ]
    tableRows.push(itemData)
  })

  // Generate the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 110,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  })

  // Calculate the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10

  // Summary
  doc.text("Subtotal:", 130, finalY + 10)
  doc.text(formatCurrency(invoice.subtotal), 175, finalY + 10, { align: "right" })

  if (invoice.tax > 0) {
    doc.text(`Pajak (${invoice.tax}%):`, 130, finalY + 15)
    doc.text(formatCurrency((invoice.subtotal * invoice.tax) / 100), 175, finalY + 15, { align: "right" })
  }

  if (invoice.discount > 0) {
    doc.text(`Diskon (${invoice.discount}%):`, 130, finalY + 20)
    doc.text(`- ${formatCurrency((invoice.subtotal * invoice.discount) / 100)}`, 175, finalY + 20, { align: "right" })
  }

  // Total
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Total:", 130, finalY + 30)
  doc.text(formatCurrency(invoice.total), 175, finalY + 30, { align: "right" })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  // Payment information if paid
  if (invoice.status === "paid" && invoice.paymentDate) {
    doc.setDrawColor(39, 174, 96) // Green border
    doc.setFillColor(240, 255, 240) // Light green background
    doc.roundedRect(15, finalY + 40, 180, 30, 3, 3, "FD")

    doc.setTextColor(39, 174, 96) // Green text
    doc.setFontSize(11)
    doc.text("Informasi Pembayaran", 105, finalY + 50, { align: "center" })
    doc.setFontSize(10)
    doc.text(
      `Metode Pembayaran: ${
        invoice.paymentMethod === "transfer"
          ? "Transfer Bank"
          : invoice.paymentMethod === "cash"
            ? "Tunai"
            : invoice.paymentMethod === "credit_card"
              ? "Kartu Kredit"
              : invoice.paymentMethod === "debit_card"
                ? "Kartu Debit"
                : "E-Wallet"
      }`,
      20,
      finalY + 55,
    )
    doc.text(
      `Tanggal Pembayaran: ${format(new Date(invoice.paymentDate), "dd MMMM yyyy", { locale: id })}`,
      20,
      finalY + 60,
    )
    doc.text(`Jumlah Dibayar: ${formatCurrency(invoice.total)}`, 20, finalY + 65)
    doc.setTextColor(0, 0, 0) // Reset to black
  }

  // Notes
  if (invoice.notes) {
    const notesY = invoice.status === "paid" ? finalY + 80 : finalY + 40
    doc.setFontSize(10)
    doc.text("Catatan:", 15, notesY)
    doc.setFontSize(9)

    // Split notes into multiple lines if needed
    const splitNotes = doc.splitTextToSize(invoice.notes, 180)
    doc.text(splitNotes, 15, notesY + 5)
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Halaman ${i} dari ${pageCount} - Dicetak pada ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: id })}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )
  }

  return doc
}

// Fungsi untuk download PDF invoice
export const downloadInvoicePDF = (invoice: Invoice, clientName: string): void => {
  const doc = generateInvoicePDF(invoice, clientName)
  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`)
}
