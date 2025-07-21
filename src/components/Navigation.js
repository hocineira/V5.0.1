'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, GraduationCap, ShieldCheck, FolderOpen, Eye, Server, Network } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setScrolled(offset > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    {
      name: 'Accueil',
      href: '/accueil',
      icon: Home,
      description: 'Découvrez mon profil'
    },
    {
      name: 'TCS',
      href: '/tcs',
      icon: ShieldCheck,
      description: 'Technicien Cybersécurité'
    },
    {
      name: 'BTS SIO',
      href: '/bts-sio',
      icon: GraduationCap,
      description: 'Ma formation'
    },
    {
      name: 'Projets',
      href: '/projets',
      icon: FolderOpen,
      description: 'Mes réalisations SISR'
    },
    {
      name: 'Veilles',
      href: '/veilles',
      icon: Eye,
      description: 'Veille technologique'
    }
  ]

  const isActive = (href) => pathname === href

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Optimisé pour mobile */}
            <div className="flex-shrink-0">
              <Link href="/accueil" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Network className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Hocine IRATNI
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch={true}
                      className={`relative group flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                        isActive(item.href)
                          ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                      
                      {/* Tooltip */}
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {item.description}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Mobile menu button - Touch optimisé */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 inline-flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 active:scale-95"
                style={{ minWidth: '48px', minHeight: '48px' }}
                aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                <div className="w-6 h-6 relative">
                  <span className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'
                  }`}>
                    <Menu className="w-6 h-6" />
                  </span>
                  <span className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'
                  }`}>
                    <X className="w-6 h-6" />
                  </span>
                </div>
                
                {/* Ripple effect on tap */}
                <div className="absolute inset-0 rounded-xl bg-blue-500/20 opacity-0 pointer-events-none animate-ping" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay - Slide from right */}
      <div className={`md:hidden fixed inset-0 z-50 transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Network className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Menu
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col py-6">
            {navigation.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-6 py-4 text-base font-medium transition-all duration-200 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 active:scale-95 ${
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border-r-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    minHeight: '60px' 
                  }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-sm mt-0.5 ${
                      isActive(item.href)
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive(item.href) && (
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Portfolio • Hocine IRATNI
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                BTS SIO SISR
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}