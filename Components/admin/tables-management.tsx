"use client"

import { useState } from "react"
import { Plus, QrCode, Download, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Switch } from "@/Components/ui/switch"
import { TableModal } from "./table-modal"
import { QRCodeModal } from "./qr-code-modal"
import { DeleteConfirmModal } from "./delete-confirm-modal"
import type { Table as TableType } from "@/lib/types"

const statusConfig = {
  available: { color: "bg-green-100 text-green-800", label: "Available" },
  occupied: { color: "bg-blue-100 text-blue-800", label: "Occupied" },
  reserved: { color: "bg-yellow-100 text-yellow-800", label: "Reserved" },
  cleaning: { color: "bg-gray-100 text-gray-800", label: "Cleaning" },
}

export function TablesManagement() {
  const [tables, setTables] = useState<TableType[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<TableType | null>(null)
  const [selectedQRTable, setSelectedQRTable] = useState<TableType | null>(null)
  const [deletingTable, setDeletingTable] = useState<TableType | null>(null)

  const handleAddTable = (newTable: Omit<TableType, "id">) => {
    const table: TableType = {
      ...newTable,
      id: `table-${Date.now()}`,
      qrCode: `QR-TABLE-${String(newTable.number).padStart(3, "0")}`,
    }
    setTables([...tables, table])
    setIsAddModalOpen(false)
  }

  const handleEditTable = (updatedTable: TableType) => {
    setTables(tables.map((table) => (table.id === updatedTable.id ? updatedTable : table)))
    setEditingTable(null)
  }

  const handleDeleteTable = (tableId: string) => {
    setTables(tables.filter((table) => table.id !== tableId))
    setDeletingTable(null)
  }

  const handleToggleActive = (tableId: string, active: boolean) => {
    setTables(tables.map((table) => (table.id === tableId ? { ...table, active } : table)))
  }

  const handleStatusChange = (tableId: string, status: TableType["status"]) => {
    setTables(tables.map((table) => (table.id === tableId ? { ...table, status } : table)))
  }

  const generateQRCode = (table: TableType) => {
    setSelectedQRTable(table)
  }

  const downloadAllQRCodes = () => {
    // In a real implementation, this would generate a ZIP file with all QR codes
    alert("Downloading all QR codes as ZIP file...")
  }

  const getStatusStats = () => {
    return {
      total: tables.length,
      available: tables.filter((t) => t.status === "available").length,
      occupied: tables.filter((t) => t.status === "occupied").length,
      reserved: tables.filter((t) => t.status === "reserved").length,
      cleaning: tables.filter((t) => t.status === "cleaning").length,
      active: tables.filter((t) => t.active).length,
    }
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tables & QR Management</h1>
          <p className="text-gray-600">Manage restaurant tables and generate QR codes for ordering.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadAllQRCodes} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download All QR
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.occupied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cleaning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.cleaning}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active QR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className={`${!table.active ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Table {table.number}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => generateQRCode(table)}>
                      <QrCode className="h-4 w-4 mr-2" />
                      View QR Code
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditingTable(table)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Table
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeletingTable(table)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Table
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>Capacity: {table.capacity} people</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className={statusConfig[table.status].color}>{statusConfig[table.status].label}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">QR Code:</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{table.qrCode}</code>
                  <Button variant="ghost" size="sm" onClick={() => generateQRCode(table)} className="h-6 w-6 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active:</span>
                <Switch checked={table.active} onCheckedChange={(checked) => handleToggleActive(table.id, checked)} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quick Status:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChange(table.id, "available")}>
                      Available
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(table.id, "occupied")}>
                      Occupied
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(table.id, "reserved")}>
                      Reserved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(table.id, "cleaning")}>
                      Cleaning
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tables List View */}
      <Card>
        <CardHeader>
          <CardTitle>All Tables</CardTitle>
          <CardDescription>Complete list of restaurant tables with management options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table #</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No tables found
                    </TableCell>
                  </TableRow>
                ) : (
                  tables.map((table) => (
                    <TableRow key={table.id} className={!table.active ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="font-semibold">Table {table.number}</div>
                      </TableCell>
                      <TableCell>{table.capacity} people</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[table.status].color}>{statusConfig[table.status].label}</Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{table.qrCode}</code>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={table.active}
                          onCheckedChange={(checked) => handleToggleActive(table.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateQRCode(table)}
                            className="h-8 w-8 p-0"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTable(table)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingTable(table)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Table Modal */}
      <TableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTable}
        title="Add New Table"
      />

      {/* Edit Table Modal */}
      {editingTable && (
        <TableModal
          isOpen={true}
          onClose={() => setEditingTable(null)}
          onSave={handleEditTable}
          title="Edit Table"
          initialData={editingTable}
        />
      )}

      {/* QR Code Modal */}
      {selectedQRTable && (
        <QRCodeModal isOpen={true} onClose={() => setSelectedQRTable(null)} table={selectedQRTable} />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTable && (
        <DeleteConfirmModal
          isOpen={true}
          onClose={() => setDeletingTable(null)}
          onConfirm={() => handleDeleteTable(deletingTable.id)}
          title="Delete Table"
          description={`Are you sure you want to delete Table ${deletingTable.number}? This will also deactivate its QR code.`}
        />
      )}
    </div>
  )
}
