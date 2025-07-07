"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CalendarIcon,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  PieChart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/services/auth-service"

interface SidebarLink {
  title: string
  href: string
  icon: React.ElementType
  submenu?: { title: string; href: string }[]
  roles?: ("admin" | "staff")[]
}

const sidebarLinks: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    title: "Kalender",
    href: "/calendar",
    icon: CalendarIcon,
    roles: ["admin"],
  },
  {
    title: "Klien",
    href: "/clients",
    icon: Users,
    roles: ["admin", "staff"],
  },
  {
    title: "Keuangan",
    href: "/keuangan",
    icon: CreditCard,
    roles: ["admin"],
  },
  {
    title: "KPI Client",
    href: "/kpi-client",
    icon: PieChart,
    roles: ["admin", "staff"],
  },
  {
    title: "KPI Admin",
    href: "/kpi-admin",
    icon: MessageSquare,
    roles: ["admin", "staff"],
  },
  {
    title: "Laporan",
    href: "/reports",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    title: "Pengaturan",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
    submenu: [
      {
        title: "Umum",
        href: "/settings",
      },
      {
        title: "Integrasi",
        href: "/settings/integrations",
      },
      {
        title: "Pengguna",
        href: "/settings/users",
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  const toggleSubmenu = (title: string) => {
    if (activeSubmenu === title) {
      setActiveSubmenu(null)
    } else {
      setActiveSubmenu(title)
    }
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleLogout = () => {
    document.cookie = "user=; Max-Age=0; path=/; SameSite=Lax"
    window.location.href = "/login"
  }

  const filteredLinks = sidebarLinks.filter(
    (link) => !link.roles || (userRole && link.roles.includes(userRole as "admin" | "staff")),
  )

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Villa Management</h2>
        <p className="text-xs text-gray-500 mt-1">Sistem Manajemen Villa</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {filteredLinks.map((link) => (
            <div key={link.title}>
              {link.submenu ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      isActive(link.href) && "bg-gray-100 text-gray-900 font-medium",
                    )}
                    onClick={() => toggleSubmenu(link.title)}
                  >
                    <link.icon className="h-5 w-5 mr-3" />
                    {link.title}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={cn(
                        "h-4 w-4 ml-auto transition-transform",
                        activeSubmenu === link.title && "rotate-180",
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                  {activeSubmenu === link.title && (
                    <div className="pl-10 space-y-1 mt-1">
                      {link.submenu.map((sublink) => (
                        <Link key={sublink.title} href={sublink.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                              isActive(sublink.href) && "bg-gray-100 text-gray-900 font-medium",
                            )}
                          >
                            {sublink.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={link.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      isActive(link.href) && "bg-gray-100 text-gray-900 font-medium",
                    )}
                  >
                    <link.icon className="h-5 w-5 mr-3" />
                    {link.title}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Keluar
        </Button>
      </div>
    </div>
  )
}
