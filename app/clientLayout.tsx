"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { useEffect } from "react"
import { loadClientsFromStorage } from "@/services/client-service"
import { loadReservationsFromStorage } from "@/services/reservation-service"
import { loadInvoicesFromStorage } from "@/services/invoice-service"
import { loadExpensesFromStorage } from "@/services/expense-service"
import { loadStorTransactionsFromStorage } from "@/services/stor-service"

const inter = Inter({ subsets: ["latin"] })

function InitializeApp() {
  useEffect(() => {
    // Load data from localStorage on app initialization
    loadClientsFromStorage()
    loadReservationsFromStorage()
    loadInvoicesFromStorage()
    loadExpensesFromStorage()
    loadStorTransactionsFromStorage()
  }, [])

  return null
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <InitializeApp />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
