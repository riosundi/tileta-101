'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, Lock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Business {
  id?: string
  full_name: string
  [key: string]: any
}

const products = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    sku: 'FT-001',
    price: 35.00,
    stock: 150,
    sales: 324,
    status: 'active',
    category: 'Vegetables',
  },
  {
    id: 2,
    name: 'Cooking Oil 5L',
    sku: 'CO-002',
    price: 120.00,
    stock: 45,
    sales: 210,
    status: 'active',
    category: 'Cooking Essentials',
  },
  {
    id: 3,
    name: 'Nshima Flour',
    sku: 'NF-003',
    price: 45.00,
    stock: 0,
    sales: 156,
    status: 'inactive',
    category: 'Grains',
  },
  {
    id: 4,
    name: 'Dried Fish',
    sku: 'DF-004',
    price: 85.00,
    stock: 89,
    sales: 95,
    status: 'active',
    category: 'Proteins',
  },
]

const recentOrders = [
  {
    id: 1,
    orderId: 'ORD-2024-001',
    customer: 'Zama Student',
    amount: 150.00,
    date: 'Today',
    status: 'delivered',
  },
  {
    id: 2,
    orderId: 'ORD-2024-002',
    customer: 'Chileshe Banda',
    amount: 200.00,
    date: 'Today',
    status: 'in_transit',
  },
  {
    id: 3,
    orderId: 'ORD-2024-003',
    customer: 'Muyunda Nkhata',
    amount: 250.00,
    date: 'Yesterday',
    status: 'delivered',
  },
  {
    id: 4,
    orderId: 'ORD-2024-004',
    customer: 'Mubita Phiri',
    amount: 180.00,
    date: '2 days ago',
    status: 'delivered',
  },
]

export function BusinessDashboard({ business }: { business: Business }) {
  const [showAddProduct, setShowAddProduct] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'inactive':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'in_transit':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-8">
      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Products</h2>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="glass rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Product</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Price</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Stock</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Sales</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-semibold">{product.name}</p>
                      <p className="text-gray-400 text-sm">{product.sku}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">K {product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock === 0 ? 'text-red-400 font-semibold' : 'text-white'}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">{product.sales}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(product.status)}`}>
                      {product.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/10 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Recent Orders</h2>
        <div className="glass rounded-lg border border-white/10">
          <div className="space-y-0">
            {recentOrders.map(order => (
              <div key={order.id} className="p-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <p className="text-white font-semibold">{order.orderId}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <p className="text-gray-400">{order.customer}</p>
                      <p className="text-gray-500">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-emerald-400 font-bold text-lg">K {order.amount.toFixed(2)}</p>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
