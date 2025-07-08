import jsPDF from "jspdf"
import "jspdf-autotable"
import { format } from "date-fns"
import { id } from "date-fns/locale"

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export function downloadInvoicePDF(invoice: any, clientName: string) {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("INVOICE", 105, 30, { align: "center" })

  // Status badge
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  const statusText =
    invoice.status === "paid"
      ? "LUNAS"
      : invoice.status === "sent"
        ? "TERKIRIM"
        : invoice.status === "overdue"
          ? "JATUH TEMPO"
          : "DRAFT"
  doc.text(statusText, 105, 40, { align: "center" })

  // Company details
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("Dari:", 20, 60)
  doc.setFont("helvetica", "normal")
  doc.text("Villa Management", 20, 70)
  doc.text("Jl. Reservasi No. 123, Jakarta", 20, 80)
  doc.text("Indonesia", 20, 90)
  doc.text("info@villamanagement.com", 20, 100)
  doc.text("0812-3456-7890", 20, 110)

  // Client details
  doc.setFont("helvetica", "bold")
  doc.text("Untuk:", 120, 60)
  doc.setFont("helvetica", "normal")
  doc.text(clientName, 120, 70)

  // Invoice details
  doc.setFont("helvetica", "bold")
  doc.text("No. Invoice:", 20, 130)
  doc.setFont("helvetica", "normal")
  doc.text(invoice.invoiceNumber, 60, 130)

  doc.setFont("helvetica", "bold")
  doc.text("Tanggal:", 20, 140)
  doc.setFont("helvetica", "normal")
  doc.text(format(new Date(invoice.issueDate), "dd MMMM yyyy", { locale: id }), 60, 140)

  doc.setFont("helvetica", "bold")
  doc.text("Jatuh Tempo:", 120, 140)
  doc.setFont("helvetica", "normal")
  doc.text(format(new Date(invoice.dueDate), "dd MMMM yyyy", { locale: id }), 160, 140)

  // Items table
  const tableData = invoice.items.map((item: any) => [
    item.description,
    item.quantity.toString(),
    `Rp ${Number(item.unitPrice).toLocaleString()}`,
    `Rp ${Number(item.amount).toLocaleString()}`,
  ])

  doc.autoTable({
    startY: 160,
    head: [["Deskripsi", "Jumlah", "Harga Satuan", "Total"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    styles: { fontSize: 9 },
  })

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 20

  doc.setFont("helvetica", "normal")
  doc.text("Subtotal:", 120, finalY)
  doc.text(`Rp ${invoice.subtotal.toLocaleString()}`, 160, finalY)

  if (invoice.tax > 0) {
    doc.text(`Pajak (${invoice.tax}%):`, 120, finalY + 10)
    doc.text(`Rp ${((invoice.subtotal * invoice.tax) / 100).toLocaleString()}`, 160, finalY + 10)
  }

  if (invoice.discount > 0) {
    doc.text(`Diskon (${invoice.discount}%):`, 120, finalY + 20)
    doc.text(`-Rp ${((invoice.subtotal * invoice.discount) / 100).toLocaleString()}`, 160, finalY + 20)
  }

  doc.setFont("helvetica", "bold")
  doc.text("Total:", 120, finalY + 30)
  doc.text(`Rp ${invoice.total.toLocaleString()}`, 160, finalY + 30)

  // Notes
  if (invoice.notes) {
    doc.setFont("helvetica", "bold")
    doc.text("Catatan:", 20, finalY + 50)
    doc.setFont("helvetica", "normal")
    const splitNotes = doc.splitTextToSize(invoice.notes, 170)
    doc.text(splitNotes, 20, finalY + 60)
  }

  // Footer
  doc.setFontSize(8)
  doc.text(`Dicetak pada ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: id })}`, 105, 280, { align: "center" })

  // Download
  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`)
}
