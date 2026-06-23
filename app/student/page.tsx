'use server'

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, MapPin, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  in_stock: boolean
}

interface MarketSection {
  id: string
  market_id: string
  section_name: string
  location: string
  products?: Product[]
}

interface Market {
  id: string
  name: string
  description: string
  image_url: string
  location: string
  sections?: MarketSection[]
}

export default async function StudentPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/register?role=student")
  }

  // Fetch all markets with their sections and products
  const marketsResult = await sql`
    SELECT 
      m.id,
      m.name,
      m.description,
      m.image_url,
      m.location,
      ms.id as section_id,
      ms.section_name,
      ms.location as section_location,
      p.id as product_id,
      p.name as product_name,
      p.description as product_description,
      p.price,
      p.category,
      p.in_stock
    FROM markets m
    LEFT JOIN market_sections ms ON m.id = ms.market_id
    LEFT JOIN products p ON ms.id = p.market_section_id
    ORDER BY m.name, ms.section_name, p.name
  `

  // Process the flat result into a nested structure
  const marketsMap = new Map<string, Market>()
  
  for (const row of marketsResult) {
    if (!marketsMap.has(row.id)) {
      marketsMap.set(row.id, {
        id: row.id,
        name: row.name,
        description: row.description,
        image_url: row.image_url,
        location: row.location,
        sections: []
      })
    }

    const market = marketsMap.get(row.id)!
    
    if (row.section_id) {
      let section = market.sections?.find(s => s.id === row.section_id)
      if (!section) {
        section = {
          id: row.section_id,
          market_id: row.market_id,
          section_name: row.section_name,
          location: row.section_location,
          products: []
        }
        market.sections?.push(section)
      }

      if (row.product_id) {
        section.products?.push({
          id: row.product_id,
          name: row.product_name,
          description: row.product_description,
          price: parseFloat(row.price),
          category: row.category,
          in_stock: row.in_stock
        })
      }
    }
  }

  const markets = Array.from(marketsMap.values())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Tileta Marketplace, {user.name}
          </h1>
          <div className="flex items-center gap-2 text-xl text-emerald-400 font-semibold">
            <ShoppingCart className="w-6 h-6" />
            <span>Wallet Balance: ZMW 2,000.00</span>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid gap-8">
          {markets.map(market => (
            <div key={market.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500 transition-colors">
              {/* Market Header */}
              <div className="relative h-48 bg-slate-700 overflow-hidden group">
                {market.image_url && (
                  <Image
                    src={market.image_url}
                    alt={market.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{market.name}</h2>
                  <p className="text-gray-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {market.location}
                  </p>
                </div>
              </div>

              {/* Market Sections */}
              <div className="p-6">
                <p className="text-gray-300 mb-6">{market.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {market.sections?.map(section => (
                    <div
                      key={section.id}
                      className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer border border-slate-600 hover:border-emerald-400"
                    >
                      <h3 className="font-semibold text-white mb-2">{section.section_name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{section.location}</p>
                      
                      {/* Products in this section */}
                      {section.products && section.products.length > 0 && (
                        <div className="space-y-2">
                          {section.products.map(product => (
                            <div
                              key={product.id}
                              className="bg-slate-800 p-2 rounded text-sm hover:bg-slate-750 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-emerald-400">{product.name}</span>
                                <span className="text-emerald-300 font-bold">
                                  ZMW {product.price.toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-400 text-xs mb-2">{product.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">{product.category}</span>
                                <span className={`text-xs font-semibold ${product.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!section.products || section.products.length === 0 && (
                        <div className="text-gray-500 text-sm italic">No products yet</div>
                      )}

                      <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                        View {section.section_name}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
