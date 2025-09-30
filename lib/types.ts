export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  available: boolean
  categoryId?: string
  categoryName?: string
}

export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface Order {
  id: string
  tableNumber: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  timestamp: string
  estimatedTime: number
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: "card" | "upi" | "cash" | "wallet"
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved" | "cleaning"
  qrCode: string
  active: boolean
}

export interface Restaurant {
  name: string
  description: string
}
