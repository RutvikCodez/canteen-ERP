"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Clock, Package, XCircle } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import { Label } from "@/Components/ui/label"
import { Card, CardContent } from "@/Components/ui/card"
import type { Order } from "@/lib/types"

interface OrderStatusModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order
  onStatusChange: (order: Order, newStatus: Order["status"]) => void
}

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    description: "Order received, waiting to start preparation",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
  },
  {
    value: "preparing",
    label: "Preparing",
    description: "Kitchen is preparing the order",
    icon: AlertTriangle,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    value: "ready",
    label: "Ready",
    description: "Order is ready for pickup/serving",
    icon: Package,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
  {
    value: "completed",
    label: "Completed",
    description: "Order has been served to the customer",
    icon: CheckCircle,
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    description: "Order has been cancelled",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
] as const

export function OrderStatusModal({ isOpen, onClose, order, onStatusChange }: OrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Order["status"]>(order.status)

  const handleConfirm = () => {
    if (selectedStatus !== order.status) {
      onStatusChange(order, selectedStatus)
    }
    onClose()
  }

  const currentStatusOption = statusOptions.find((option) => option.value === order.status)
  const selectedStatusOption = statusOptions.find((option) => option.value === selectedStatus)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>Change the status of order {order.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <Card className="border-2 border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Current Status:</div>
                <Badge className={`${currentStatusOption?.bg} ${currentStatusOption?.color} border`}>
                  {currentStatusOption?.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status Selection */}
          <div>
            <Label className="text-sm font-medium">Select New Status:</Label>
            <RadioGroup value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Order["status"])}>
              <div className="space-y-2 mt-2">
                {statusOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = selectedStatus === option.value
                  const isCurrent = order.status === option.value

                  return (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} disabled={isCurrent} />
                      <Label
                        htmlFor={option.value}
                        className={`flex-1 cursor-pointer ${isCurrent ? "opacity-50" : ""}`}
                      >
                        <Card className={`border-2 ${isSelected ? option.bg : "border-gray-200"} transition-colors`}>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <Icon className={`h-4 w-4 ${option.color}`} />
                              <div className="flex-1">
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-gray-500">{option.description}</div>
                              </div>
                              {isCurrent && <Badge variant="outline">Current</Badge>}
                            </div>
                          </CardContent>
                        </Card>
                      </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          </div>

          {selectedStatus !== order.status && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Status will change from {currentStatusOption?.label} to {selectedStatusOption?.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={selectedStatus === order.status}>
            {selectedStatus === order.status ? "No Changes" : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
