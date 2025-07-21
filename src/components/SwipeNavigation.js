'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SwipeNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [showSwipeHint, setShowSwipeHint] = useState(false)

  const pages = [
    { path: '/accueil', name: 'Accueil' },
    { path: '/tcs', name: 'TCS' },
    { path: '/bts-sio', name: 'BTS SIO' },
    { path: '/projets', name: 'Projets' },
    { path: '/veilles', name: 'Veilles' }
  ]

  const currentIndex = pages.findIndex(page => page.path === pathname)
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < pages.length - 1) {
      // Swipe left = page suivante
      router.push(pages[currentIndex + 1].path)
      setShowSwipeHint(true)
      setTimeout(() => setShowSwipeHint(false), 2000)
    }
    
    if (isRightSwipe && currentIndex > 0) {
      // Swipe right = page précédente  
      router.push(pages[currentIndex - 1].path)
      setShowSwipeHint(true)
      setTimeout(() => setShowSwipeHint(false), 2000)
    }
  }

  // Touch events only on mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (isMobile) {
      document.addEventListener('touchstart', onTouchStart, { passive: true })
      document.addEventListener('touchmove', onTouchMove, { passive: true })
      document.addEventListener('touchend', onTouchEnd, { passive: true })

      return () => {
        document.removeEventListener('touchstart', onTouchStart)
        document.removeEventListener('touchmove', onTouchMove)  
        document.removeEventListener('touchend', onTouchEnd)
      }
    }
  }, [touchStart, touchEnd, currentIndex])

  // Don't render if not on a valid page
  if (currentIndex === -1) return null

  return (
    <div className="md:hidden">
      {/* Swipe hint indicators */}
      <div className={`fixed top-1/2 left-4 z-30 transition-all duration-500 ${
        showSwipeHint ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        {currentIndex > 0 && (
          <div className="bg-blue-600/90 text-white p-2 rounded-full backdrop-blur-md shadow-lg">
            <ChevronLeft className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className={`fixed top-1/2 right-4 z-30 transition-all duration-500 ${
        showSwipeHint ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        {currentIndex < pages.length - 1 && (
          <div className="bg-blue-600/90 text-white p-2 rounded-full backdrop-blur-md shadow-lg">
            <ChevronRight className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Page indicator dots */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md rounded-full px-3 py-2">
        <div className="flex space-x-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-600 dark:bg-blue-400 w-6' 
                  : 'bg-gray-400 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}