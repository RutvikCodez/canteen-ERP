"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, MenuIcon, ShoppingBag, Package, CreditCard, QrCode, Settings, Home } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Menu", href: "/admin/menu", icon: MenuIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Tables & QR", href: "/admin/tables", icon: QrCode },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-900">FoodOrder Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">© 2024 FoodOrder Platform</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden fixed top-4 left-4 z-50">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
