'use client'

import { useState } from 'react'
import { MapPin, Phone, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Agent {
  id?: string
  full_name: string
  [key: string]: any
}

const activeDeliveries = [
  {
    id: 1,
    orderId: 'ORD-2024-001',
    student: 'Zama Mbelu',
    business: 'Mulungushi Fruits',
    items: 'Fresh Tomatoes x2, Onions 1kg',
    pickupAddress: 'Mulungushi Market, Upschool',
    deliveryAddress: 'Plot 12, Kabwe Road',
    distance: '2.5 km',
    eta: '8 mins',
    status: 'in_transit',
    amount: 150.00,
  },
  {
    id: 2,
    orderId: 'ORD-2024-002',
    student: 'Chileshe Banda',
    business: 'Fresh Hub',
    items: 'Cooking Oil 5L, Nshima Flour',
    pickupAddress: 'UNZA Market, Downtown',
    deliveryAddress: 'Kabulonga, Lusaka',
    distance: '5.2 km',
    eta: '15 mins',
    status: 'accepted',
    amount: 200.00,
  },
  {
    id: 3,
    orderId: 'ORD-2024-003',
    student: 'Muyunda Nkhata',
    business: 'Meat City',
    items: 'Chicken Pieces 2kg',
    pickupAddress: 'Mulungushi Market, Town',
    deliveryAddress: 'Main Street, Kabwe',
    distance: '1.8 km',
    eta: '5 mins',
    status: 'picked',
    amount: 250.00,
  },
]

const pastDeliveries = [
  {
    id: 4,
    orderId: 'ORD-2024-004',
    student: 'Mubita Phiri',
    amount: 180.00,
    deliveryDate: '2 hours ago',
    rating: 5,
  },
  {
    id: 5,
    orderId: 'ORD-2024-005',
    student: 'Nkomo Siachitema',
    amount: 120.00,
    deliveryDate: '5 hours ago',
    rating: 4,
  },
]

export function AgentDashboard({ agent }: { agent: Agent }) {
  const [selectedDelivery, setSelectedDelivery] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-blue-400'
      case 'picked':
        return 'text-yellow-400'
      case 'in_transit':
        return 'text-emerald-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <AlertCircle className="w-5 h-5" />
      case 'picked':
        return <Clock className="w-5 h-5" />
      case 'in_transit':
        return <MapPin className="w-5 h-5" />
      default:
        return <CheckCircle className="w-5 h-5" />
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase()
  }

  return (
    <div className="space-y-8">
      {/* Active Deliveries */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Active Deliveries</h2>
        <div className="space-y-4">
          {activeDeliveries.map(delivery => (
            <div
              key={delivery.id}
              onClick={() => setSelectedDelivery(delivery.id)}
              className="glass rounded-lg p-6 border border-white/10 hover:border-emerald-400/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-white">{delivery.orderId}</span>
                    <span className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor(delivery.status)}`}>
                      {getStatusIcon(delivery.status)}
                      {getStatusLabel(delivery.status)}
                    </span>
                  </div>
                  <p className="text-gray-300 font-medium mb-3">{delivery.student} • {delivery.business}</p>
                  <p className="text-gray-400 text-sm mb-3">{delivery.items}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">K {delivery.amount.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm mt-1">{delivery.distance}</p>
                </div>
              </div>

              {selectedDelivery === delivery.id && (
                <div className="bg-black/20 rounded-lg p-4 border border-white/10 mb-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Pickup</p>
                    <p className="text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {delivery.pickupAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Delivery</p>
                    <p className="text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {delivery.deliveryAddress}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">ETA: {delivery.eta}</span>
                </div>
                {delivery.status === 'accepted' && (
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Pick Up Order
                  </Button>
                )}
                {delivery.status === 'picked' && (
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Start Delivery
                  </Button>
                )}
                {delivery.status === 'in_transit' && (
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Delivered
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Deliveries */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Recent Completions</h2>
        <div className="glass rounded-lg border border-white/10 overflow-hidden">
          <div className="space-y-0">
            {pastDeliveries.map(delivery => (
              <div key={delivery.id} className="p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{delivery.orderId} • {delivery.student}</p>
                    <p className="text-gray-400 text-sm">{delivery.deliveryDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">K {delivery.amount.toFixed(2)}</p>
                      <p className="text-yellow-400 text-sm">★ {delivery.rating}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Go Online Button */}
      <div className="flex justify-center pt-6">
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg">
          Go Online Now
        </Button>
      </div>
    </div>
  )
}
