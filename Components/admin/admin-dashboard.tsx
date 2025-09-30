"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { DollarSign, ShoppingBag, Users, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const salesData = [
  { name: "Mon", sales: 1200 },
  { name: "Tue", sales: 1900 },
  { name: "Wed", sales: 1600 },
  { name: "Thu", sales: 2100 },
  { name: "Fri", sales: 2800 },
  { name: "Sat", sales: 3200 },
  { name: "Sun", sales: 2400 },
]

const recentOrders = [
  {
    id: "ORD-001",
    table: 5,
    items: "Bruschetta, Pizza Margherita",
    total: 36.97,
    status: "preparing",
    time: "5 min ago",
  },
  { id: "ORD-002", table: 3, items: "Spaghetti Carbonara, Wine", total: 31.98, status: "pending", time: "12 min ago" },
  { id: "ORD-003", table: 8, items: "Lunch Special", total: 19.99, status: "ready", time: "18 min ago" },
  { id: "ORD-004", table: 2, items: "Tiramisu, Espresso", total: 13.98, status: "completed", time: "25 min ago" },
]

const topItems = [
  { name: "Pizza Margherita", orders: 24, revenue: 455.76 },
  { name: "Spaghetti Carbonara", orders: 18, revenue: 413.82 },
  { name: "Classic Bruschetta", orders: 15, revenue: 134.85 },
  { name: "Tiramisu", orders: 12, revenue: 119.88 },
]

export function AdminDashboard() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "preparing":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      preparing: "default",
      ready: "default",
      completed: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening at your restaurant.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,847.50</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tables</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/12</div>
            <p className="text-xs text-muted-foreground">67% occupancy rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$22.42</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.1%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>Revenue for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                <Bar dataKey="sales" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Most popular items this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Live Orders Feed</CardTitle>
          <CardDescription>Real-time order updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant="outline">Table {order.table}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.items}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">${order.total}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                  {getStatusBadge(order.status)}
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
