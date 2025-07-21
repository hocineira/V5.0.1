'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme()
  
  // Flag pour activer/désactiver le mode sombre
  const isDarkModeEnabled = process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true'
  
  // Si le mode sombre est désactivé, ne pas afficher le bouton
  if (!isDarkModeEnabled) {
    return null
  }

  // Éviter le flash de contenu non stylé pendant le chargement
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full animate-pulse" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 touch-target mobile-ripple w-12 h-12 sm:w-12 sm:h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group"
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      <div className="relative w-6 h-6">
        {/* Icône Soleil */}
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-500 transform ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        
        {/* Icône Lune */}
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-500 transform ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>

      {/* Effet de glow au hover - Plus visible sur mobile */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 group-active:opacity-40 transition-opacity duration-300 ${
        isDark ? 'bg-blue-400' : 'bg-yellow-500'
      }`} />
    </button>
  )
}