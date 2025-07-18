'use client'

import { useState } from 'react'
import { Eye, Calendar, Tag, ExternalLink, Search, TrendingUp, Shield, Server, Code, Globe } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'

export default function VeillesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const veilles = [
    {
      id: 1,
      title: 'L\'évolution de la cybersécurité en 2024',
      description: 'Analyse des nouvelles menaces et des solutions de sécurité émergentes. Focus sur l\'intelligence artificielle appliquée à la détection d\'intrusions.',
      category: 'security',
      date: '2024-01-15',
      tags: ['IA', 'Sécurité', 'Détection', 'Menaces'],
      readTime: '5 min',
      source: 'ANSSI',
      link: '#'
    },
    {
      id: 2,
      title: 'Containers et orchestration : Docker vs Kubernetes',
      description: 'Comparaison des technologies de containerisation et d\'orchestration. Avantages et inconvénients pour les infrastructures modernes.',
      category: 'infrastructure',
      date: '2024-01-10',
      tags: ['Docker', 'Kubernetes', 'DevOps', 'Virtualisation'],
      readTime: '8 min',
      source: 'Red Hat',
      link: '#'
    },
    {
      id: 3,
      title: 'Frameworks JavaScript : Tendances 2024',
      description: 'État des lieux des frameworks JavaScript les plus populaires. Next.js, React, Vue.js et les nouvelles technologies émergentes.',
      category: 'development',
      date: '2024-01-05',
      tags: ['JavaScript', 'React', 'Next.js', 'Vue.js'],
      readTime: '6 min',
      source: 'Stack Overflow',
      link: '#'
    },
    {
      id: 4,
      title: 'Windows Server 2025 : Nouvelles fonctionnalités',
      description: 'Découverte des nouvelles fonctionnalités de Windows Server 2025 et leur impact sur l\'administration système.',
      category: 'infrastructure',
      date: '2023-12-20',
      tags: ['Windows Server', 'Administration', 'Nouveautés'],
      readTime: '7 min',
      source: 'Microsoft',
      link: '#'
    },
    {
      id: 5,
      title: 'Zero Trust : Architecture de sécurité moderne',
      description: 'Comprendre les principes du Zero Trust et son implémentation dans les environnements d\'entreprise.',
      category: 'security',
      date: '2023-12-15',
      tags: ['Zero Trust', 'Architecture', 'Sécurité', 'Entreprise'],
      readTime: '10 min',
      source: 'NIST',
      link: '#'
    },
    {
      id: 6,
      title: 'Intelligence Artificielle et développement',
      description: 'Impact de l\'IA sur le développement logiciel : outils, GitHub Copilot, et nouvelles méthodologies.',
      category: 'development',
      date: '2023-12-10',
      tags: ['IA', 'Développement', 'GitHub Copilot', 'Outils'],
      readTime: '9 min',
      source: 'GitHub',
      link: '#'
    }
  ]

  const categories = [
    { id: 'all', name: 'Toutes les veilles', icon: Eye, color: 'gray' },
    { id: 'security', name: 'Cybersécurité', icon: Shield, color: 'red' },
    { id: 'infrastructure', name: 'Infrastructure', icon: Server, color: 'blue' },
    { id: 'development', name: 'Développement', icon: Code, color: 'green' }
  ]

  const filteredVeilles = veilles.filter(veille => {
    const matchesCategory = selectedCategory === 'all' || veille.category === selectedCategory
    const matchesSearch = veille.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         veille.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         veille.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category) => {
    const categoryObj = categories.find(cat => cat.id === category)
    return categoryObj ? categoryObj.color : 'gray'
  }

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.id === category)
    if (categoryObj) {
      const Icon = categoryObj.icon
      return <Icon className="w-4 h-4" />
    }
    return <Eye className="w-4 h-4" />
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                <Eye className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Veilles Technologiques
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Suivez mes recherches et analyses sur les dernières tendances technologiques. 
              Cybersécurité, infrastructure, développement : restez à jour avec les innovations du secteur.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une veille..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Veilles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredVeilles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune veille trouvée</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVeilles.map((veille) => (
                <Card key={veille.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`bg-${getCategoryColor(veille.category)}-100 text-${getCategoryColor(veille.category)}-800`}>
                        {getCategoryIcon(veille.category)}
                        <span className="ml-1 capitalize">{veille.category}</span>
                      </Badge>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(veille.date)}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-green-600 transition-colors">
                      {veille.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {veille.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {veille.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>📖 {veille.readTime} de lecture</span>
                      <span>Source: {veille.source}</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open(veille.link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Lire la veille
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Statistiques de veille
            </h2>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">{veilles.length}</div>
              <div className="text-gray-600">Veilles publiées</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">
                {veilles.filter(v => v.category === 'security').length}
              </div>
              <div className="text-gray-600">Cybersécurité</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">
                {veilles.filter(v => v.category === 'infrastructure').length}
              </div>
              <div className="text-gray-600">Infrastructure</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">
                {veilles.filter(v => v.category === 'development').length}
              </div>
              <div className="text-gray-600">Développement</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}