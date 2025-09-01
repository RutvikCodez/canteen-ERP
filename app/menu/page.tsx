"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet"
import { MenuHeader } from "@/Components/menu/menu-header"
import { MenuCategories } from "@/Components/menu/menu-categories"
import { CartDrawer } from "@/Components/menu/cart-drawer"
import { OrderConfirmationModal } from "@/Components/menu/order-confirmation-modal"
import { useCartStore } from "@/lib/cart-store"
import menuData from "@/content/menu-data.json"
import type { MenuCategory } from "@/lib/types"

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [tableNumber, setTableNumber] = useState<number | null>(null)

  const { items: cartItems, getTotalItems, getTotalPrice, setTableNumber: setStoreTableNumber } = useCartStore()

  // Get table number from URL params (simulating QR code scan)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const table = urlParams.get("table")
    if (table) {
      const tableNum = Number.parseInt(table)
      setTableNumber(tableNum)
      setStoreTableNumber(tableNum)
    } else {
      // Default to table 1 for demo
      setTableNumber(1)
      setStoreTableNumber(1)
    }
  }, [setStoreTableNumber])

  const categories: MenuCategory[] = menuData.categories
  const restaurant = menuData.restaurant

  // Filter items based on search and category
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !selectedCategory || category.id === selectedCategory
        return matchesSearch && matchesCategory && item.available
      }),
    }))
    .filter((category) => category.items.length > 0)

  const handlePlaceOrder = () => {
    setShowOrderConfirmation(true)
    setIsCartOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <MenuHeader restaurantName={restaurant.name} tableNumber={tableNumber} />

      {/* Search and Filter Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[300px]">
              <SheetHeader>
                <SheetTitle>Filter by Category</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className="justify-start"
                >
                  All Items
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="justify-start"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="pb-24">
        <MenuCategories categories={filteredCategories} />
      </div>

      {/* Cart Button - Mobile */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
          <Button onClick={() => setIsCartOpen(true)} size="lg" className="rounded-full h-14 w-14 shadow-lg">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {getTotalItems()}
              </Badge>
            </div>
          </Button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onPlaceOrder={handlePlaceOrder} />

      {/* Desktop Cart Sidebar */}
      <div className="hidden md:block fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-card border-l">
        <div className="p-4 h-full">
          <CartDrawer isOpen={true} onClose={() => {}} onPlaceOrder={handlePlaceOrder} isDesktop={true} />
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showOrderConfirmation}
        onClose={() => setShowOrderConfirmation(false)}
        orderTotal={getTotalPrice()}
      />
    </div>
  )
}
