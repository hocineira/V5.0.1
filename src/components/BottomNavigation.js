'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Home, ShieldCheck, GraduationCap, FolderOpen, Eye } from 'lucide-react'

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [navigating, setNavigating] = useState(null)

  // Reset navigation state when pathname changes
  useEffect(() => {
    setNavigating(null)
  }, [pathname])

  const navigation = [
    {
      name: 'Accueil',
      href: '/accueil',
      icon: Home,
    },
    {
      name: 'TCS',
      href: '/tcs',
      icon: ShieldCheck,
    },
    {
      name: 'BTS SIO',
      href: '/bts-sio',
      icon: GraduationCap,
    },
    {
      name: 'Projets',
      href: '/projets',
      icon: FolderOpen,
    },
    {
      name: 'Veilles',
      href: '/veilles',
      icon: Eye,
    }
  ]

  const isActive = (href) => pathname === href

  const handleNavigation = (href, name) => {
    if (href === pathname) return // Déjà sur la page
    
    // Feedback haptique pour mobile supprimé pour optimisation
    
    // Feedback visuel immédiat
    setNavigating(name)
    
    // Navigation avec animation fluide
    router.push(href)
    
    // Reset avec délai optimisé
    setTimeout(() => {
      setNavigating(null)
    }, 600)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block mobile-nav-optimized">{/* Force visible pour test */}
      {/* Safe area padding pour les smartphones avec encoche */}
      <div className="safe-area-bottom mobile-glass-menu border-t border-white/30 dark:border-gray-700/30">{/* Effet glass appliqué */}
        <div className="px-2 py-1">
          <div className="flex items-center justify-around">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              const isNavigatingToThis = navigating === item.name
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.name)}
                  disabled={isNavigatingToThis}
                  className={`bottom-nav-item touch-target-large flex flex-col items-center justify-center px-2 py-2 rounded-xl relative transition-all duration-200 transform ${
                    active
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105'
                      : isNavigatingToThis
                      ? 'text-blue-500 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/10 scale-95'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 active:scale-95'
                  }`}
                  style={{ 
                    minWidth: '60px', 
                    minHeight: '56px',
                    willChange: 'transform'
                  }}
                >
                  <Icon className={`w-6 h-6 mb-1 transition-all duration-200 ${
                    active 
                      ? 'scale-110' 
                      : isNavigatingToThis 
                      ? 'scale-105 opacity-50' 
                      : ''
                  }`} />
                  <span className={`text-xs font-medium transition-all duration-200 ${
                    active 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : isNavigatingToThis
                      ? 'text-blue-500 dark:text-blue-300 opacity-50'
                      : ''
                  }`}>
                    {item.name}
                  </span>
                  
                  {/* Indicateur actif */}
                  {active && (
                    <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                  
                  {/* Loading indicator plus élégant */}
                  {isNavigatingToThis && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}