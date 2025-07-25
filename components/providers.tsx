"use client"

import type React from "react"

import { AuthProvider } from "./auth-provider"
import { Toaster } from "./ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  )
}
