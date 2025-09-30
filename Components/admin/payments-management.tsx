"use client"

import { useState } from "react"
import { Download, Filter, Search, CreditCard, Smartphone, Wallet } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock transaction data
const transactions = [
  {
    id: "TXN001",
    orderId: "ORD-001",
    amount: 36.97,
    method: "card",
    status: "completed",
    timestamp: "2024-01-15T14:30:00Z",
    customerTable: 5,
    processingFee: 1.11,
    netAmount: 35.86,
  },
  {
    id: "TXN002",
    orderId: "ORD-002",
    amount: 31.98,
    method: "upi",
    status: "completed",
    timestamp: "2024-01-15T14:45:00Z",
    customerTable: 3,
    processingFee: 0.64,
    netAmount: 31.34,
  },
  {
    id: "TXN003",
    orderId: "ORD-003",
    amount: 19.99,
    method: "card",
    status: "completed",
    timestamp: "2024-01-15T15:12:00Z",
    customerTable: 8,
    processingFee: 0.6,
    netAmount: 19.39,
  },
  {
    id: "TXN004",
    orderId: "ORD-004",
    amount: 17.97,
    method: "upi",
    status: "completed",
    timestamp: "2024-01-15T15:30:00Z",
    customerTable: 2,
    processingFee: 0.36,
    netAmount: 17.61,
  },
  {
    id: "TXN005",
    orderId: "ORD-005",
    amount: 41.98,
    method: "wallet",
    status: "pending",
    timestamp: "2024-01-15T16:00:00Z",
    customerTable: 6,
    processingFee: 1.26,
    netAmount: 40.72,
  },
]

const dailyRevenue = [
  { date: "Jan 10", revenue: 1245.5, transactions: 45 },
  { date: "Jan 11", revenue: 1567.8, transactions: 52 },
  { date: "Jan 12", revenue: 1890.25, transactions: 61 },
  { date: "Jan 13", revenue: 2134.75, transactions: 68 },
  { date: "Jan 14", revenue: 1876.4, transactions: 59 },
  { date: "Jan 15", revenue: 2456.3, transactions: 78 },
  { date: "Jan 16", revenue: 2789.15, transactions: 85 },
]

const paymentMethodData = [
  { name: "Card", value: 45, color: "#f97316" },
  { name: "UPI", value: 35, color: "#10b981" },
  { name: "Wallet", value: 20, color: "#3b82f6" },
]

export function PaymentsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customerTable.toString().includes(searchQuery)

    const matchesStatus = statusFilter === "all" || txn.status === statusFilter
    const matchesMethod = methodFilter === "all" || txn.method === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "upi":
        return <Smartphone className="h-4 w-4" />
      case "wallet":
        return <Wallet className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Transaction ID", "Order ID", "Amount", "Method", "Status", "Date", "Table", "Processing Fee", "Net Amount"],
      ...filteredTransactions.map((txn) => [
        txn.id,
        txn.orderId,
        txn.amount,
        txn.method,
        txn.status,
        formatDate(txn.timestamp),
        txn.customerTable,
        txn.processingFee,
        txn.netAmount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const totalRevenue = transactions.reduce((sum, txn) => sum + (txn.status === "completed" ? txn.amount : 0), 0)
  const totalFees = transactions.reduce((sum, txn) => sum + (txn.status === "completed" ? txn.processingFee : 0), 0)
  const netRevenue = totalRevenue - totalFees

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>
          <p className="text-gray-600">Track transactions and payment analytics.</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Processing Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalFees.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{((totalFees / totalRevenue) * 100).toFixed(1)}% of revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${netRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">After processing fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
            <CardDescription>Revenue trends over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentMethodData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All payment transactions with detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search transactions..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Net Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>
                        <div className="font-mono text-sm">{txn.id}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{txn.orderId}</div>
                          <div className="text-sm text-gray-500">Table {txn.customerTable}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">${txn.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMethodIcon(txn.method)}
                          <span className="capitalize">{txn.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(txn.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(txn.timestamp)}</TableCell>
                      <TableCell className="text-red-600">${txn.processingFee.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-green-600">${txn.netAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
