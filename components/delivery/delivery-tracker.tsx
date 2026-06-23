'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Clock, Package } from 'lucide-react'

interface DeliveryLocation {
  latitude: number
  longitude: number
  timestamp: string
  speed: number
}

interface DeliveryTrackerProps {
  orderId: string
  agentName: string
  agentPhone: string
  pickupLocation: string
  deliveryLocation: string
  estimatedTime: string
}

// Mock delivery tracking data
const mockLocations: DeliveryLocation[] = [
  { latitude: -12.7662, longitude: 28.2833, timestamp: '2:15 PM', speed: 0 },
  { latitude: -12.7665, longitude: 28.2835, timestamp: '2:16 PM', speed: 15 },
  { latitude: -12.7668, longitude: 28.2838, timestamp: '2:17 PM', speed: 32 },
  { latitude: -12.7670, longitude: 28.2840, timestamp: '2:18 PM', speed: 45 },
]

export function DeliveryTracker({
  orderId,
  agentName,
  agentPhone,
  pickupLocation,
  deliveryLocation,
  estimatedTime,
}: DeliveryTrackerProps) {
  const [currentLocation, setCurrentLocation] = useState<DeliveryLocation>(mockLocations[0])
  const [locationIndex, setLocationIndex] = useState(0)

  // Simulate live tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setLocationIndex(prev => {
        const nextIndex = (prev + 1) % mockLocations.length
        setCurrentLocation(mockLocations[nextIndex])
        return nextIndex
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const progress = ((locationIndex + 1) / mockLocations.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-lg p-6 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Order ID</p>
            <p className="text-white font-bold">{orderId}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Agent</p>
            <p className="text-white font-bold">{agentName}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Status</p>
            <p className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              In Transit
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">ETA</p>
            <p className="text-white font-bold">{estimatedTime}</p>
          </div>
        </div>
      </div>

      {/* Live Map View */}
      <div className="glass rounded-lg p-6 border border-white/10">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          Live Map
        </h3>
        
        {/* Map Placeholder with Coordinates */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg h-64 flex items-center justify-center border border-white/10 relative overflow-hidden mb-4">
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" className="text-slate-700" />
            </svg>
          </div>
          
          {/* Pickup Marker */}
          <div className="absolute top-12 left-12">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse border-2 border-blue-300" />
            <p className="text-xs text-blue-400 mt-1 whitespace-nowrap">Pickup</p>
          </div>
          
          {/* Current Location Marker */}
          <div
            className="absolute"
            style={{
              top: `${30 + locationIndex * 15}%`,
              left: `${40 + locationIndex * 10}%`,
            }}
          >
            <div className="w-5 h-5 bg-emerald-500 rounded-full animate-pulse border-2 border-emerald-300" />
            <p className="text-xs text-emerald-400 mt-1 whitespace-nowrap">Agent</p>
          </div>
          
          {/* Delivery Marker */}
          <div className="absolute bottom-12 right-12">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-300" />
            <p className="text-xs text-red-400 mt-1 whitespace-nowrap">Destination</p>
          </div>
        </div>

        {/* Coordinates */}
        <p className="text-gray-400 text-sm">
          Current Location: {currentLocation.latitude.toFixed(4)}°N, {currentLocation.longitude.toFixed(4)}°E
        </p>
      </div>

      {/* Journey Timeline */}
      <div className="glass rounded-lg p-6 border border-white/10">
        <h3 className="text-white font-bold mb-4">Journey</h3>
        <div className="space-y-4">
          {/* Pickup */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-emerald-500 mt-2" />
            </div>
            <div className="flex-1 pb-8">
              <p className="text-white font-semibold">Pickup</p>
              <p className="text-gray-400 text-sm">{pickupLocation}</p>
              <p className="text-gray-500 text-xs mt-1">2:15 PM</p>
            </div>
          </div>

          {/* In Transit */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse border-2 border-emerald-300" />
              <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-red-500 mt-2" />
            </div>
            <div className="flex-1 pb-8">
              <p className="text-white font-semibold">In Transit</p>
              <p className="text-emerald-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Speed: {currentLocation.speed} km/h
              </p>
              <p className="text-gray-500 text-xs mt-1">{currentLocation.timestamp}</p>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-slate-800 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{Math.round(progress)}% complete</p>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
            </div>
            <div>
              <p className="text-white font-semibold">Delivery Location</p>
              <p className="text-gray-400 text-sm">{deliveryLocation}</p>
              <p className="text-gray-500 text-xs mt-1">ETA: {estimatedTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Contact */}
      <div className="glass rounded-lg p-6 border border-white/10">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-blue-400" />
          Contact Delivery Agent
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">{agentName}</p>
            <p className="text-gray-400 text-sm">{agentPhone}</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">
            Call Agent
          </button>
        </div>
      </div>
    </div>
  )
}
