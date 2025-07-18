'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger automatiquement vers /accueil
    router.push('/accueil')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirection...</h1>
        <p className="text-gray-600">Vous allez être redirigé vers la page d'accueil.</p>
      </div>
    </div>
  )
}