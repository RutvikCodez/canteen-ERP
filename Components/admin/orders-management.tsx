"use client"

import { useState, useEffect } from "react"
import { Clock, Eye, Filter, Search, CheckCircle, AlertCircle, Package, XCircle } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { OrderDetailsModal } from "./order-details-modal"
import { OrderStatusModal } from "./order-status-modal"
import type { Order } from "@/lib/types"
import { Input } from "@/Components/ui/input"

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Pending" },
  preparing: { icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-100", label: "Preparing" },
  ready: { icon: Package, color: "text-green-600", bg: "bg-green-100", label: "Ready" },
  completed: { icon: CheckCircle, color: "text-gray-600", bg: "bg-gray-100", label: "Completed" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Cancelled" },
}

export function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusChangeOrder, setStatusChangeOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  // Add some mock orders for demonstration
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "ORD-003",
        tableNumber: 8,
        items: [{ id: "lunch-special", name: "Lunch Special", quantity: 1, price: 19.99 }],
        total: 19.99,
        status: "ready" as const,
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        estimatedTime: 15,
        paymentStatus: "paid",
        paymentMethod: "card",
      },
      {
        id: "ORD-004",
        tableNumber: 2,
        items: [
          { id: "tiramisu", name: "Tiramisu", quantity: 1, price: 9.99 },
          { id: "espresso", name: "Espresso", quantity: 2, price: 3.99 },
        ],
        total: 17.97,
        status: "completed" as const,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        estimatedTime: 10,
        paymentStatus: "paid",
        paymentMethod: "upi",
      },
      {
        id: "ORD-005",
        tableNumber: 6,
        items: [
          { id: "osso-buco", name: "Osso Buco", quantity: 1, price: 32.99 },
          { id: "wine-red", name: "House Red Wine", quantity: 1, price: 8.99 },
        ],
        total: 41.98,
        status: "preparing" as const,
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        estimatedTime: 35,
        paymentStatus: "paid",
        paymentMethod: "card",
      },
    ]
    setOrders(mockOrders)
  }, [])

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.toString().includes(searchQuery) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  // Sort orders by timestamp (newest first)
  const sortedOrders = filteredOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const orderTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    const hours = Math.floor(diffInMinutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const handleStatusChange = (order: Order, newStatus: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)))
    setStatusChangeOrder(null)
  }

  const getStatusStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      completed: orders.filter((o) => o.status === "completed").length,
    }
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">Track and manage all restaurant orders in real-time.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Preparing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.preparing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Orders</CardTitle>
          <CardDescription>Real-time order tracking and management</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders, tables, or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Payment Pending</SelectItem>
                <SelectItem value="failed">Payment Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon
                    return (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-mono font-medium">{order.id}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Table {order.tableNumber}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-48">
                            <p className="text-sm truncate">
                              {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                            </p>
                            <p className="text-xs text-gray-500">{order.items.length} items</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig[order.status].bg}`}
                            >
                              <StatusIcon className={`h-4 w-4 ${statusConfig[order.status].color}`} />
                            </div>
                            <span className="text-sm font-medium capitalize">{order.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={order.paymentStatus === "paid" ? "default" : "secondary"}
                            className={
                              order.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800"
                                : order.paymentStatus === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : ""
                            }
                          >
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{getTimeAgo(order.timestamp)}</div>
                            {order.status === "preparing" && (
                              <div className="text-xs text-gray-500">~{order.estimatedTime} min</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status !== "completed" && order.status !== "cancelled" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStatusChangeOrder(order)}
                                className="text-xs"
                              >
                                Update Status
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal isOpen={true} onClose={() => setSelectedOrder(null)} order={selectedOrder} />
      )}

      {/* Status Change Modal */}
      {statusChangeOrder && (
        <OrderStatusModal
          isOpen={true}
          onClose={() => setStatusChangeOrder(null)}
          order={statusChangeOrder}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
