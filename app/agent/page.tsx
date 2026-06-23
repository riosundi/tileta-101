import { getCurrentUser } from '@/lib/auth'
import { Navigation } from '@/components/navigation'
import { AgentDashboard } from '@/components/agent/agent-dashboard'
import { Briefcase, TrendingUp, Clock } from 'lucide-react'

export default async function AgentPage() {
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
            Delivery Agent Dashboard
          </h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Deliveries</p>
                  <p className="text-3xl font-bold text-white mt-2">3</p>
                </div>
                <Briefcase className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            
            <div className="glass rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Today's Earnings</p>
                  <p className="text-3xl font-bold text-emerald-400 mt-2">K 450.00</p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            
            <div className="glass rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Response</p>
                  <p className="text-3xl font-bold text-white mt-2">2 min</p>
                </div>
                <Clock className="w-10 h-10 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <AgentDashboard agent={user} />
      </main>
    </div>
  )
}
