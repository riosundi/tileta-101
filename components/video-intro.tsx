'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function VideoIntro() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const hasSeenVideo = localStorage.getItem('tileta-video-seen')
    if (hasSeenVideo) {
      setIsOpen(false)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('tileta-video-seen', 'true')
  }

  if (!isMounted) return null

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen bg-black">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-60 text-white hover:text-gray-300 transition-colors"
            aria-label="Close video"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Full-screen video */}
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onEnded={handleClose}
          >
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hailuo-2_3_Cinematic_App_Intro_Tileta_Vibe_Premium_modern_minimalist._Visual_Palette_Solid_-0-veYXKjQ5Ii33QovYdRtvBAnK3MFnTN.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      )}
    </>
  )
}
