"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

type ExportFormat = "csv" | "excel" | "pdf"

interface ExportButtonProps {
  data: any[]
  filename?: string
  format?: ExportFormat
  label?: string
}

export function ExportButton({
  data,
  filename = "export",
  format = "excel",
  label = "Export Data",
}: ExportButtonProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)

      toast({
        title: "Data berhasil diekspor",
        description: `File ${filename}.${format} telah diunduh.`,
        variant: "default",
      })

      // In a real implementation, you would generate and download the file here
      // For CSV example:
      if (data && data.length > 0) {
        const headers = Object.keys(data[0])
        const csvContent = [
          headers.join(","),
          ...data.map((row) => headers.map((header) => JSON.stringify(row[header] || "")).join(",")),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${filename}.${format}`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }, 1500)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-1"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Mengekspor...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>{label}</span>
        </>
      )}
    </Button>
  )
}
