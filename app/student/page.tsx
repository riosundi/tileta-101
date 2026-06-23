import { getCurrentUser } from '@/lib/auth'
import { Navigation } from '@/components/navigation'
import { MarketplaceCatalog } from '@/components/marketplace/marketplace-catalog'
import { ShoppingCart } from 'lucide-react'

export default async function StudentDashboard() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to TILETA Marketplace, {user.name}
          </h1>
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShoppingCart className="w-6 h-6" />
              <span>Wallet Balance: K 2,000.00</span>
            </div>
            <div className="text-gray-400">
              Discover products from across Zambia
            </div>
          </div>
        </div>

        {/* Marketplace Catalog */}
        <MarketplaceCatalog />
      </main>
    </div>
  )
}
