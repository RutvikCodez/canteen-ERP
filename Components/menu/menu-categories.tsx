"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible"
import type { MenuCategory } from "@/lib/types"
import { MenuItemCard } from "./menu-item-card"

interface MenuCategoriesProps {
  categories: MenuCategory[]
}

export function MenuCategories({ categories }: MenuCategoriesProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(categories.map((cat) => cat.id)))

  const toggleCategory = (categoryId: string) => {
    const newOpenCategories = new Set(openCategories)
    if (newOpenCategories.has(categoryId)) {
      newOpenCategories.delete(categoryId)
    } else {
      newOpenCategories.add(categoryId)
    }
    setOpenCategories(newOpenCategories)
  }

  return (
    <div className="px-4 py-6 space-y-6 md:pr-84">
      {categories.map((category) => (
        <Collapsible
          key={category.id}
          open={openCategories.has(category.id)}
          onOpenChange={() => toggleCategory(category.id)}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
              <h2 className="text-2xl font-serif font-semibold text-left text-foreground">{category.name}</h2>
              {openCategories.has(category.id) ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
