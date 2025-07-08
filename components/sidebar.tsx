"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import {
  BarChart3,
  Calendar,
  DollarSign,
  Home,
  LogOut,
  Settings,
  TrendingUp,
  Users,
  FileText,
  Hotel,
  User,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "KPI Admin", href: "/kpi-admin", icon: BarChart3, roles: ["admin"] },
  { name: "KPI Client", href: "/kpi-client", icon: TrendingUp },
  { name: "Keuangan", href: "/keuangan", icon: DollarSign },
  { name: "Kalender", href: "/calendar", icon: Calendar },
  { name: "Klien", href: "/clients", icon: Users },
  { name: "Laporan", href: "/reports", icon: FileText },
  { name: "Pengaturan", href: "/settings", icon: Settings, roles: ["admin"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(user?.role || "")
  })

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center">
          <Hotel className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Hotel MS</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500",
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Keluar
        </Button>
      </div>
    </div>
  )
}
