import { getCurrentUser } from '@/lib/auth'
import { Navigation } from '@/components/navigation'
import { BusinessDashboard } from '@/components/business/business-dashboard'
import { TrendingUp, Package, ShoppingCart, BarChart3 } from 'lucide-react'

export default async function BusinessPage() {
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
          <h1 className="text-4xl font-bold text-white mb-6">
            Business Dashboard
          </h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-2">K 18,500.00</p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            
            <div className="glass rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Products</p>
                  <p className="text-3xl font-bold text-white mt-2">24</p>
                </div>
                <Package className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            
            <div className="glass rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-white mt-2">156</p>
                </div>
                <ShoppingCart className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            
            <div className="glass rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Rating</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">★ 4.8/5</p>
                </div>
                <BarChart3 className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <BusinessDashboard business={user} />
      </main>
    </div>
  )
}
