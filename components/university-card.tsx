'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, MapPin, DollarSign } from "lucide-react"
import Image from "next/image"

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

interface UniversityCardProps {
  university: University
  campuses: Campus[]
}

export function UniversityCard({ university, campuses }: UniversityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="group bg-card border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300">
      {/* University Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        {university.image_url ? (
          <Image
            src={university.image_url}
            alt={university.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {university.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          {university.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <MapPin className="w-4 h-4" />
          {university.location} • Founded {university.founded_year}
        </div>

        {/* Campuses Section */}
        <div className="border-t pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            <span>{campuses.length} Campus Locations</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>

          {isExpanded && (
            <div className="mt-4 space-y-3 border-t pt-4">
              {campuses.map((campus) => (
                <div key={campus.id} className="bg-background/50 rounded p-3 text-sm">
                  <div className="font-semibold text-foreground mb-1">
                    {campus.campus_name}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {campus.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {campus.address}
                    </span>
                    {campus.tuition_price !== null && (
                      <div className="flex items-center gap-1 font-semibold text-primary text-xs">
                        <DollarSign className="w-3 h-3" />
                        ZMW {Number(campus.tuition_price).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button className="w-full mt-4 gap-2" asChild>
          <Link href={`/university/${university.id}`}>
            Explore
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
