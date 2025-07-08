"use client"

import { useAuth } from "@/components/auth-provider"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, DollarSign, TrendingUp, Bell, Plus } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Total Reservations",
      value: "156",
      description: "+12% from last month",
      icon: Calendar,
    },
    {
      title: "Active Clients",
      value: "89",
      description: "+5% from last month",
      icon: Users,
    },
    {
      title: "Revenue",
      value: "Rp 45,231,000",
      description: "+18% from last month",
      icon: DollarSign,
    },
    {
      title: "Occupancy Rate",
      value: "78%",
      description: "+3% from last month",
      icon: TrendingUp,
    },
  ]

  const recentActivities = [
    "New reservation from John Doe for Room 101",
    "Payment received from Jane Smith",
    "Room 205 maintenance completed",
    "New client registration: ABC Corp",
    "Invoice #INV-001 sent to client",
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Here's what's happening at your hotel today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest updates from your hotel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-600">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you might want to perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    New Reservation
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="mr-2 h-4 w-4" />
                    Add Client
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
