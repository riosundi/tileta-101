'use client'

import { useState } from 'react'
import { ChevronDown, Search, Filter, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const markets = [
  {
    id: 1,
    name: 'Mulungushi Market',
    location: 'Kabwe',
    image: '/markets/mulungushi.png',
    description: 'Main marketplace with diverse vendors',
    sections: [
      { id: 1, name: 'Upschool', products: 4 },
      { id: 2, name: 'Downschool', products: 3 },
      { id: 3, name: 'Across', products: 2 },
      { id: 4, name: 'Town', products: 5 },
    ]
  },
  {
    id: 2,
    name: 'UNZA Market',
    location: 'Lusaka',
    image: '/markets/unza.png',
    description: 'Popular market near UNZA campus',
    sections: [
      { id: 5, name: 'Upschool', products: 3 },
      { id: 6, name: 'Downschool', products: 4 },
      { id: 7, name: 'Across', products: 2 },
      { id: 8, name: 'Town', products: 3 },
    ]
  },
]

const products = [
  { id: 1, name: 'Fresh Tomatoes', section: 'Upschool', market: 'Mulungushi Market', price: 35.00, category: 'Vegetables', image: '🍅' },
  { id: 2, name: 'Cooking Oil 5L', section: 'Downschool', market: 'Mulungushi Market', price: 120.00, category: 'Cooking Essentials', image: '🫗' },
  { id: 3, name: 'Nshima Flour', section: 'Across', market: 'Mulungushi Market', price: 45.00, category: 'Grains', image: '🌾' },
  { id: 4, name: 'Dried Fish', section: 'Town', market: 'Mulungushi Market', price: 85.00, category: 'Proteins', image: '🐟' },
  { id: 5, name: 'Fresh Onions', section: 'Upschool', market: 'UNZA Market', price: 40.00, category: 'Vegetables', image: '🧅' },
  { id: 6, name: 'Chicken Pieces', section: 'Downschool', market: 'UNZA Market', price: 250.00, category: 'Meat', image: '🍗' },
]

export function MarketplaceCatalog() {
  const [expandedMarkets, setExpandedMarkets] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')

  const toggleMarket = (marketId: number) => {
    setExpandedMarkets(prev =>
      prev.includes(marketId)
        ? prev.filter(id => id !== marketId)
        : [...prev, marketId]
    )
  }

  const categories = ['All', 'Vegetables', 'Grains', 'Proteins', 'Cooking Essentials', 'Meat']

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Search and Filter Bar */}
      <div className="glass rounded-lg p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                    : 'bg-slate-800/50 border border-slate-700 text-gray-300 hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Markets List */}
      <div className="space-y-6">
        {markets.map(market => (
          <div key={market.id} className="glass rounded-lg border border-white/10 overflow-hidden">
            {/* Market Header */}
            <button
              onClick={() => toggleMarket(market.id)}
              className="w-full p-6 hover:bg-white/5 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-2xl">
                  🏪
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{market.name}</h3>
                  <p className="text-gray-400">{market.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white font-semibold">{market.location}</p>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-emerald-400 transition-transform ${
                    expandedMarkets.includes(market.id) ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Market Sections and Products */}
            {expandedMarkets.includes(market.id) && (
              <div className="bg-black/20 border-t border-white/10 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {market.sections.map(section => (
                    <div
                      key={section.id}
                      className="p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700 hover:border-emerald-400/50 transition-colors"
                    >
                      <h4 className="font-semibold text-white mb-2">{section.name}</h4>
                      <p className="text-sm text-gray-400">{section.products} products</p>
                    </div>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts
                    .filter(p => p.market === market.name)
                    .map(product => (
                      <div
                        key={product.id}
                        className="glass rounded-lg p-4 border border-white/10 hover:border-emerald-400/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-4xl">{product.image}</div>
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {product.category}
                          </span>
                        </div>
                        <h4 className="text-white font-semibold mb-2">{product.name}</h4>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm text-gray-400">{product.section}</p>
                          <p className="text-lg font-bold text-emerald-400">K {product.price.toFixed(2)}</p>
                        </div>
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
