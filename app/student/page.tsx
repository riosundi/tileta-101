import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, Star, Clock, DollarSign } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number | null
  duration_minutes: number | null
  is_active: boolean
}

export default async function StudentDashboard() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== "student") {
    redirect("/register?role=student")
  }

  const services = (await sql`
    SELECT id, name, description, category, price, duration_minutes, is_active
    FROM services
    WHERE is_active = TRUE
    ORDER BY category, name
  `) as Service[]

  const groupedServices = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = []
      }
      acc[service.category].push(service)
      return acc
    },
    {} as Record<string, Service[]>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navigation user={user} />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, {user.full_name}! 👋
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore our available services and enhance your experience
          </p>
          <div className="flex items-center gap-4 bg-card border rounded-lg p-4 w-fit">
            <div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-2xl font-bold text-primary">
                ${user.wallet_balance?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-12">
          {Object.entries(groupedServices).map(([category, categoryServices]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                {category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => (
                  <div
                    key={service.id}
                    className="group bg-card border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {service.price !== null && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-base">
                            ${Number(service.price).toFixed(2)}
                          </span>
                        </div>
                      )}
                      
                      {service.duration_minutes && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {service.duration_minutes} minutes
                        </div>
                      )}
                    </div>

                    <Button className="w-full gap-2" asChild>
                      <Link href={`/services/${service.id}`}>
                        <ShoppingCart className="w-4 h-4" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {Object.keys(groupedServices).length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No services available at the moment
            </p>
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
