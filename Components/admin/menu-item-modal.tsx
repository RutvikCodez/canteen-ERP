"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Card, CardContent } from "@/Components/ui/card"
import type { MenuItem, MenuCategory } from "@/lib/types"
import Image from "next/image"
import { Switch } from "@radix-ui/react-switch"

interface MenuItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: MenuItem & { categoryId?: string }) => void
  categories: MenuCategory[]
  title: string
  initialData?: MenuItem & { categoryId?: string }
}

export function MenuItemModal({ isOpen, onClose, onSave, categories, title, initialData }: MenuItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    available: true,
    image: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price.toString(),
        categoryId: initialData.categoryId || "",
        available: initialData.available,
        image: initialData.image,
      })
      setImagePreview(initialData.image)
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        available: true,
        image: "",
      })
      setImagePreview("")
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const itemData = {
      ...formData,
      price: Number(formData.price),
      image: imagePreview || "/generic-food-item.png",
    }

    if (initialData) {
      onSave({ ...itemData, id: initialData.id })
    } else {
      // Generate a unique id for the new item (using Date.now and Math.random for simplicity)
      onSave({ ...itemData, id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}` })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData({ ...formData, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData({ ...formData, image: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the menu item details below." : "Add a new item to your menu."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the item..."
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Available for ordering</Label>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-4">
              <Label>Item Image</Label>
              <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="p-6">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">Upload an image</span>
                          <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF up to 10MB</span>
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update Item" : "Add Item"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
