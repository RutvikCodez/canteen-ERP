interface MenuHeaderProps {
  restaurantName: string
  tableNumber: number | null
}

export function MenuHeader({ restaurantName, tableNumber }: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold">{restaurantName}</h1>
            <p className="text-primary-foreground/80 text-sm">Authentic Italian cuisine</p>
          </div>
          {tableNumber && (
            <div className="text-right">
              <div className="text-2xl font-bold">Table {tableNumber}</div>
              <div className="text-xs text-primary-foreground/80">Scan to order</div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
