'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShieldCheck, GraduationCap, FolderOpen, Eye } from 'lucide-react'

export default function BottomNavigation() {
  const pathname = usePathname()

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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Safe area padding pour les smartphones avec encoche */}
      <div className="safe-area-bottom bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="px-2 py-1">
          <div className="flex items-center justify-around">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}  // Force le prefetch pour une navigation plus rapide
                  className={`touch-target-large flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-colors duration-150 active:scale-95 ${
                    active
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50'
                  }`}
                  style={{ 
                    minWidth: '60px', 
                    minHeight: '56px' 
                  }}
                >
                  <Icon className={`w-6 h-6 mb-1 transition-transform duration-150 ${
                    active ? 'scale-110' : ''
                  }`} />
                  <span className={`text-xs font-medium transition-colors duration-150 ${
                    active ? 'text-blue-600 dark:text-blue-400' : ''
                  }`}>
                    {item.name}
                  </span>
                  
                  {/* Indicateur actif - simplifié */}
                  {active && (
                    <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}