'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function VideoIntro() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
              aria-label="Close video"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative overflow-hidden rounded-2xl bg-black aspect-video">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
                onEnded={() => {
                  // Optionally close after video ends, or let it loop
                }}
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hailuo-2_3_Cinematic_App_Intro_Tileta_Vibe_Premium_modern_minimalist._Visual_Palette_Solid_-0-veYXKjQ5Ii33QovYdRtvBAnK3MFnTN.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 mx-auto block px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Skip intro
            </button>
          </div>
        </div>
      )}
    </>
  )
}
