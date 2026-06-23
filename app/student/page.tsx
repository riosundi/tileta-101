import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { UniversityCard } from "@/components/university-card"
import Link from "next/link"

interface Campus {
  id: string
  university_id: string
  campus_name: string
  location: string
  address: string
  tuition_price: number | null
}

interface University {
  id: string
  name: string
  description: string
  image_url: string
  location: string
  founded_year: number
}

export default async function StudentDashboard() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== "student") {
    redirect("/register?role=student")
  }

  const universities = (await sql`
    SELECT id, name, description, image_url, location, founded_year
    FROM universities
    ORDER BY name
  `) as University[]

  const campuses = (await sql`
    SELECT id, university_id, campus_name, location, address, tuition_price
    FROM campuses
    ORDER BY university_id, campus_name
  `) as Campus[]

  // Group campuses by university
  const campusesByUniversity = campuses.reduce(
    (acc, campus) => {
      if (!acc[campus.university_id]) {
        acc[campus.university_id] = []
      }
      acc[campus.university_id].push(campus)
      return acc
    },
    {} as Record<string, Campus[]>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, {user.full_name}! 👋
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore Zambian universities and find the perfect campus for you
          </p>
          <div className="flex items-center gap-4 bg-card border rounded-lg p-4 w-fit">
            <div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-2xl font-bold text-primary">
                ZMW {user.wallet_balance?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full"></span>
            Zambian Universities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <UniversityCard 
                key={university.id} 
                university={university}
                campuses={campusesByUniversity[university.id] || []}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {universities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No universities available at the moment
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
