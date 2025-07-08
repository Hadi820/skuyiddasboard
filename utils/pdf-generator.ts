import type { Invoice } from "@/services/invoice-service"

export const generateInvoicePDF = async (invoice: Invoice) => {
  // Dynamic import to avoid SSR issues
  const jsPDF = (await import("jspdf")).default
  const autoTable = (await import("jspdf-autotable")).default

  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("INVOICE", 20, 30)

  // Company info
  doc.setFontSize(12)
  doc.text("Hotel Management System", 20, 45)
  doc.text("Jl. Example No. 123", 20, 55)
  doc.text("Jakarta, Indonesia", 20, 65)
  doc.text("Phone: +62 21 1234567", 20, 75)

  // Invoice details
  doc.text(`Invoice Number: ${invoice.number}`, 120, 45)
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString("id-ID")}`, 120, 55)
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString("id-ID")}`, 120, 65)
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 120, 75)

  // Client info
  doc.setFontSize(14)
  doc.text("Bill To:", 20, 95)
  doc.setFontSize(12)
  doc.text(invoice.clientName, 20, 105)
  doc.text(invoice.clientEmail, 20, 115)
  doc.text(invoice.clientPhone, 20, 125)

  // Items table
  const tableData = invoice.items.map((item) => [
    item.description,
    item.quantity.toString(),
    `Rp ${item.rate.toLocaleString("id-ID")}`,
    `Rp ${item.amount.toLocaleString("id-ID")}`,
  ])

  autoTable(doc, {
    startY: 140,
    head: [["Description", "Qty", "Rate", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 10 },
  })

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 20
  doc.text(`Subtotal: Rp ${invoice.subtotal.toLocaleString("id-ID")}`, 120, finalY)
  doc.text(`Tax: Rp ${invoice.tax.toLocaleString("id-ID")}`, 120, finalY + 10)
  doc.setFontSize(14)
  doc.text(`Total: Rp ${invoice.total.toLocaleString("id-ID")}`, 120, finalY + 25)

  // Payment info if paid
  if (invoice.status === "paid" && invoice.paymentDate) {
    doc.setFontSize(12)
    doc.text(`Payment Date: ${new Date(invoice.paymentDate).toLocaleDateString("id-ID")}`, 20, finalY + 40)
    doc.text(`Payment Method: ${invoice.paymentMethod}`, 20, finalY + 50)
  }

  // Notes
  if (invoice.notes) {
    doc.text("Notes:", 20, finalY + 65)
    doc.text(invoice.notes, 20, finalY + 75)
  }

  return doc
}

export const downloadInvoicePDF = async (invoice: Invoice) => {
  const doc = await generateInvoicePDF(invoice)
  doc.save(`Invoice-${invoice.number}.pdf`)
}

export const printInvoice = async (invoice: Invoice) => {
  const doc = await generateInvoicePDF(invoice)
  const pdfBlob = doc.output("blob")
  const pdfUrl = URL.createObjectURL(pdfBlob)

  const printWindow = window.open(pdfUrl)
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}
