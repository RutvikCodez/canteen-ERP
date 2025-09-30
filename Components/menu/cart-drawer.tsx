"use client"

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/Components/ui/sheet"
import { Badge } from "@/Components/ui/badge"
import { useCartStore } from "@/lib/cart-store"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onPlaceOrder: () => void
  isDesktop?: boolean
}

export function CartDrawer({ isOpen, onClose, onPlaceOrder, isDesktop = false }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()

  const CartContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some delicious items to get started!</p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <Badge variant="secondary" className="min-w-[2rem] justify-center">
                        {item.quantity}
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t p-4 space-y-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total ({getTotalItems()} items)</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>

          <Button onClick={onPlaceOrder} className="w-full" size="lg">
            Place Order
          </Button>
        </div>
      )}
    </div>
  )

  if (isDesktop) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Order
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-5rem)]">
          <CartContent />
        </CardContent>
      </Card>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Order
          </SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100%-5rem)]">
          <CartContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}
