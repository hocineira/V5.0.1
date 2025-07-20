'use client'

import { Monitor, Calendar, ArrowLeft, Download, ExternalLink, Server, Desktop } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import Link from 'next/link'

export default function VeilleTechnologiquePage() {
  const windowsVersions = [
    {
      id: 1,
      version: 'Windows 11 24H2',
      releaseDate: '2024-10-01',
      description: 'La dernière mise à jour majeure de Windows 11 apportant de nouvelles fonctionnalités de sécurité et de productivité.',
      features: [
        'Nouvelles options de sécurité avancées',
        'Interface utilisateur améliorée',
        'Copilot intégré nativement',
        'Performances optimisées pour l\'IA',
        'Gestion améliorée de la batterie'
      ],
      support: 'Jusqu\'en octobre 2029',
      status: 'Stable',
      category: 'Major Update',
      icon: Desktop
    },
    {
      id: 2,
      version: 'Windows Server 2025',
      releaseDate: '2024-11-01',
      description: 'La nouvelle version de Windows Server avec des fonctionnalités cloud natives et une sécurité renforcée.',
      features: [
        'Containers Windows améliorés',
        'Sécurité Zero Trust native',
        'Azure Arc intégré par défaut',
        'Gestion hybride avancée',
        'Support Kubernetes natif'
      ],
      support: 'Support étendu jusqu\'en 2034',
      status: 'Stable',
      category: 'Server Edition',
      icon: Server
    },
    {
      id: 3,
      version: 'Windows 10 22H2',
      releaseDate: '2022-10-18',
      description: 'Dernière version de Windows 10 avant la fin du support principal. Migration recommandée vers Windows 11.',
      features: [
        'Améliorations de sécurité finales',
        'Optimisations de performance',
        'Corrections de bugs critiques',
        'Compatibilité étendue matériel ancien',
        'Transition vers Windows 11 facilitée'
      ],
      support: 'Fin de support : octobre 2025',
      status: 'End of Life',
      category: 'Legacy Version',
      icon: Desktop
    },
    {
      id: 4,
      version: 'Windows 11 23H2',
      releaseDate: '2023-10-31',
      description: 'Version précédente de Windows 11 avec stabilité éprouvée et fonctionnalités matures.',
      features: [
        'Copilot en version bêta',
        'Améliorations du menu Démarrer',
        'Nouvelles applications natives',
        'Gestion des widgets optimisée',
        'Performance globale stabilisée'
      ],
      support: 'Support jusqu\'en octobre 2026',
      status: 'Stable',
      category: 'Previous Stable',
      icon: Desktop
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Stable': return 'bg-green-100 text-green-800 border-green-200'
      case 'End of Life': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
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
      {/* Header Section */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          {/* Back Button */}
          <Link href="/veilles">
            <Button variant="outline" className="mb-8 hover:bg-blue-50 text-slate-700 border-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux veilles
            </Button>
          </Link>

          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Monitor className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Veille Technologique
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
              Suivi des versions de Windows et de leurs évolutions techniques. 
              Restez informé sur les dernières mises à jour, fonctionnalités et cycles de support.
            </p>
            <div className="flex justify-center items-center gap-4 mb-8">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm border border-blue-200">
                <Monitor className="w-4 h-4 mr-2" />
                4 versions suivies
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-800 px-4 py-2 text-sm border border-indigo-200">
                <Calendar className="w-4 h-4 mr-2" />
                Mis à jour 2025
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Windows Versions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {windowsVersions.map((version) => {
              const Icon = version.icon
              return (
                <Card key={version.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-slate-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <Badge className={getStatusColor(version.status)} variant="outline">
                          {version.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(version.releaseDate)}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {version.version}
                    </CardTitle>
                    <CardDescription className="text-slate-600 mb-4 leading-relaxed">
                      {version.description}
                    </CardDescription>
                    <Badge variant="outline" className="w-fit bg-slate-50 text-slate-700 border-slate-300">
                      {version.category}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">
                        Fonctionnalités principales :
                      </h4>
                      <ul className="space-y-3">
                        {version.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">Support :</span>
                        <span className="font-semibold text-slate-900">{version.support}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ressources complémentaires
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow border border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-slate-900">Documentation officielle</CardTitle>
                <CardDescription className="text-slate-600">
                  Accédez aux documentations Microsoft pour chaque version.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg text-slate-900">Cycles de vie</CardTitle>
                <CardDescription className="text-slate-600">
                  Planifiez vos migrations avec les calendriers de support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg text-slate-900">Mises à jour</CardTitle>
                <CardDescription className="text-slate-600">
                  Suivez les dernières mises à jour de sécurité et fonctionnelles.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Questions sur ces technologies ?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            N'hésitez pas à me contacter pour discuter de stratégies de migration, 
            de planification des mises à jour ou de conseil en infrastructure Windows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => window.location.href = 'mailto:hocineira@gmail.com'}
            >
              Me contacter
              <ExternalLink className="ml-2 w-5 h-5" />
            </Button>
            <Link href="/veilles">
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Retour aux veilles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}