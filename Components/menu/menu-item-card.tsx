"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { useCartStore } from "@/lib/cart-store"
import type { MenuItem } from "@/lib/types"

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCartStore()

  const handleAddToCart = async () => {
    setIsAdding(true)

    // Add ripple effect
    const button = document.getElementById(`add-btn-${item.id}`)
    if (button) {
      const ripple = document.createElement("span")
      ripple.className = "absolute inset-0 bg-white/30 rounded-full animate-ripple"
      button.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    }

    addItem({ ...item, quantity: 1 })

    // Brief delay for animation
    setTimeout(() => setIsAdding(false), 300)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3]">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Unavailable</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
            <span className="text-lg font-bold text-primary ml-2">${item.price}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>

          <Button
            id={`add-btn-${item.id}`}
            onClick={handleAddToCart}
            disabled={!item.available || isAdding}
            className="w-full mt-3 relative overflow-hidden"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
