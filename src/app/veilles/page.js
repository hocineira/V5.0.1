'use client'

import { Monitor, Shield, Calendar, ExternalLink, TrendingUp, Download, Eye, Server, FileText } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export default function VeillesPage() {
  const windowsVersions = [
    {
      id: 1,
      version: 'Windows 11 24H2',
      releaseDate: '2024-10-01',
      description: 'La dernière mise à jour majeure de Windows 11 apportant de nouvelles fonctionnalités de sécurité et de productivité.',
      features: [
        'Nouvelles options de sécurité avancées',
        'Interface utilisateur améliorée',
        'Copilot intégré',
        'Performances optimisées'
      ],
      support: 'Jusqu\'en octobre 2029',
      status: 'Stable',
      category: 'Major'
    },
    {
      id: 2,
      version: 'Windows Server 2025',
      releaseDate: '2024-11-01',
      description: 'La nouvelle version de Windows Server avec des fonctionnalités cloud natives et une sécurité renforcée.',
      features: [
        'Containers Windows améliorés',
        'Sécurité Zero Trust native',
        'Azure Arc intégré',
        'Gestion hybride avancée'
      ],
      support: 'Support étendu jusqu\'en 2034',
      status: 'Stable',
      category: 'Server'
    },
    {
      id: 3,
      version: 'Windows 10 22H2',
      releaseDate: '2022-10-18',
      description: 'Dernière version de Windows 10 avant la fin du support principal.',
      features: [
        'Améliorations de sécurité',
        'Optimisations de performance',
        'Corrections de bugs',
        'Compatibilité étendue'
      ],
      support: 'Fin de support : octobre 2025',
      status: 'Fin de vie programmée',
      category: 'Legacy'
    },
    {
      id: 4,
      version: 'Windows 11 23H2',
      releaseDate: '2023-10-31',
      description: 'Version précédente de Windows 11 avec stabilité éprouvée.',
      features: [
        'Copilot en version bêta',
        'Améliorations du menu Démarrer',
        'Nouvelles applications natives',
        'Gestion des widgets optimisée'
      ],
      support: 'Support jusqu\'en 2026',
      status: 'Stable',
      category: 'Stable'
    }
  ]

  const rgpdTopics = [
    {
      id: 1,
      title: 'RGPD et Cybersécurité : Obligations en 2025',
      description: 'Les nouvelles exigences du RGPD concernant la cybersécurité et la protection des données personnelles.',
      content: [
        'Notification des violations dans les 72h',
        'Analyses d\'impact obligatoires',
        'Mesures de sécurité par défaut',
        'Formation du personnel aux risques'
      ],
      lastUpdate: '2025-01-15',
      importance: 'Critique',
      sector: 'Toutes entreprises'
    },
    {
      id: 2,
      title: 'Droits des utilisateurs et conformité',
      description: 'Guide complet sur les droits des utilisateurs et les obligations des entreprises.',
      content: [
        'Droit à l\'oubli numérique',
        'Portabilité des données',
        'Consentement explicite requis',
        'Délégué à la protection des données (DPO)'
      ],
      lastUpdate: '2024-12-20',
      importance: 'Élevée',
      sector: 'Services numériques'
    },
    {
      id: 3,
      title: 'Sanctions et amendes RGPD',
      description: 'Évolution des sanctions appliquées par la CNIL et les autorités européennes.',
      content: [
        'Amendes jusqu\'à 4% du chiffre d\'affaires',
        'Sanctions administratives renforcées',
        'Contrôles inopinés plus fréquents',
        'Coopération entre autorités nationales'
      ],
      lastUpdate: '2024-11-30',
      importance: 'Critique',
      sector: 'Toutes entreprises'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Stable': return 'bg-green-100 text-green-800'
      case 'Fin de vie programmée': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'Critique': return 'bg-red-100 text-red-800'
      case 'Élevée': return 'bg-orange-100 text-orange-800'
      default: return 'bg-blue-100 text-blue-800'
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Eye className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Veilles Technologiques
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ma veille technologique spécialisée sur les versions de Windows et les évolutions du RGPD. 
              Restez informé sur les dernières mises à jour et réglementations importantes.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Veille Technologique Windows */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Monitor className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Une Veille Technologique
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Suivi des versions de Windows et de leurs évolutions techniques
            </p>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {windowsVersions.map((version) => (
              <Card key={version.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getStatusColor(version.status)}>
                      {version.status}
                    </Badge>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(version.releaseDate)}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {version.version}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {version.description}
                  </CardDescription>
                  <Badge variant="outline" className="w-fit">
                    {version.category}
                  </Badge>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Fonctionnalités principales :</h4>
                    <ul className="space-y-2">
                      {version.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Support :</span>
                      <span className="font-medium text-gray-900">{version.support}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: RGPD */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Veille RGPD
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Évolutions et obligations du Règlement Général sur la Protection des Données
            </p>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mt-6"></div>
          </div>

          <div className="space-y-8">
            {rgpdTopics.map((topic) => (
              <Card key={topic.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                      <Badge className={getImportanceColor(topic.importance)}>
                        {topic.importance}
                      </Badge>
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-800">
                        {topic.sector}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Mis à jour le {formatDate(topic.lastUpdate)}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-6">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Points clés :</h4>
                      <ul className="space-y-3">
                        {topic.content.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-indigo-50 p-6 rounded-lg">
                      <h5 className="font-semibold text-indigo-900 mb-3">Informations utiles</h5>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Importance :</span> {topic.importance}</p>
                        <p><span className="font-medium">Secteur concerné :</span> {topic.sector}</p>
                        <p><span className="font-medium">Dernière mise à jour :</span> {formatDate(topic.lastUpdate)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Statistiques de Veille
            </h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">{windowsVersions.length}</div>
              <div className="text-blue-100">Versions Windows suivies</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">
                {windowsVersions.filter(v => v.status === 'Stable').length}
              </div>
              <div className="text-blue-100">Versions stables</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">{rgpdTopics.length}</div>
              <div className="text-blue-100">Sujets RGPD</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">
                {rgpdTopics.filter(t => t.importance === 'Critique').length}
              </div>
              <div className="text-blue-100">Points critiques</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Besoin d'accompagnement ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pour toute question sur ces veilles technologiques ou pour discuter de vos besoins en matière de mise à jour système et conformité RGPD.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => window.location.href = 'mailto:hocineira@gmail.com'}
            >
              Me contacter
              <ExternalLink className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => window.open('/projets', '_self')}
            >
              Voir mes procédures
              <FileText className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}