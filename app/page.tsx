import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-menu-heading text-charcoal">FoodOrder Pro</h1>
          <p className="text-lg text-muted-foreground font-menu-body">
            Complete restaurant ordering platform with customer menu and admin dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-menu-heading">Customer Menu</CardTitle>
              <CardDescription>Mobile-first ordering interface for customers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/menu">View Menu</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-admin-heading">Admin Dashboard</CardTitle>
              <CardDescription>Restaurant management and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin">Admin Panel</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
