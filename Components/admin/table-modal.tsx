"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import type { Table as TableType } from "@/lib/types"

interface TableModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (table: TableType) => void
  title: string
  initialData?: TableType
}

export function TableModal({ isOpen, onClose, onSave, title, initialData }: TableModalProps) {
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
    status: "available" as TableType["status"],
    active: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        number: initialData.number.toString(),
        capacity: initialData.capacity.toString(),
        status: initialData.status,
        active: initialData.active,
      })
    } else {
      setFormData({
        number: "",
        capacity: "",
        status: "available",
        active: true,
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.number.trim()) {
      newErrors.number = "Table number is required"
    } else if (isNaN(Number(formData.number)) || Number(formData.number) <= 0) {
      newErrors.number = "Table number must be a positive number"
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = "Capacity is required"
    } else if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const tableData = {
      ...formData,
      number: Number(formData.number),
      capacity: Number(formData.capacity),
    }

    if (initialData) {
      onSave({ ...tableData, id: initialData.id, qrCode: initialData.qrCode })
    } else {
      onSave({
        ...tableData,
        id: Date.now().toString(), // or use a better unique id generator as needed
        qrCode: "",    // or generate a QR code string if required
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the table details below." : "Add a new table to your restaurant."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number">Table Number *</Label>
              <Input
                id="number"
                type="number"
                min="1"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="1"
                className={errors.number ? "border-red-500" : ""}
              />
              {errors.number && <p className="text-sm text-red-500 mt-1">{errors.number}</p>}
            </div>

            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="20"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="4"
                className={errors.capacity ? "border-red-500" : ""}
              />
              {errors.capacity && <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="status">Initial Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as TableType["status"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">QR Code Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update Table" : "Add Table"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
