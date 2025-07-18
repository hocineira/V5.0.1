'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, GraduationCap, ShieldCheck, FolderOpen, Eye, Code, Server } from 'lucide-react'

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/accueil" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
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
                    className={`relative group flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative bg-white rounded-lg p-2 inline-flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 relative">
                <span className={`absolute inset-0 bg-current transform transition-transform duration-200 ${
                  isOpen ? 'rotate-45' : ''
                }`} style={{
                  clipPath: isOpen 
                    ? 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
                    : 'polygon(0% 20%, 100% 20%, 100% 80%, 0% 80%)'
                }}>
                  <Menu className="w-6 h-6" />
                </span>
                {isOpen && (
                  <X className="absolute inset-0 w-6 h-6 transition-opacity duration-200" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-white/20'
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${
                    isActive(item.href)
                      ? 'text-white/80'
                      : 'text-gray-500 group-hover:text-blue-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}