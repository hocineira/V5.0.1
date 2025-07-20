'use client'

import { Monitor, Shield, ExternalLink, TrendingUp, ArrowRight, Calendar, FileText } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import Link from 'next/link'

export default function VeillesPage() {
  const veillesCategories = [
    {
      id: 'technologique',
      title: 'Veille Technologique',
      description: 'Suivez les dernières évolutions des versions de Windows et des technologies Microsoft.',
      icon: Monitor,
      color: 'blue',
      bgGradient: 'from-blue-500 to-indigo-600',
      items: [
        'Windows 11 24H2',
        'Windows Server 2025',
        'Windows 10 22H2',
        'Windows 11 23H2'
      ],
      link: '/veilles/technologique',
      stats: '4 versions suivies'
    },
    {
      id: 'juridique',
      title: 'Veille Juridique',  
      description: 'Restez informé sur les évolutions du RGPD et les obligations de conformité.',
      icon: Shield,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-purple-600',
      items: [
        'Obligations cybersécurité 2025',
        'Droits des utilisateurs',
        'Sanctions et amendes',
        'Conformité entreprise'
      ],
      link: '/veilles/juridique',
      stats: '3 sujets traités'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">
              Mes Veilles
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Découvrez mes veilles spécialisées dans les domaines technologique et juridique. 
              Restez informé sur les dernières évolutions et réglementations importantes.
            </p>
            <div className="flex justify-center items-center gap-4 mb-8">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
                <Monitor className="w-4 h-4 mr-2" />
                Technologique
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-800 px-4 py-2 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                Juridique
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Veilles Cards Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {veillesCategories.map((veille) => {
              const Icon = veille.icon
              return (
                <Link key={veille.id} href={veille.link}>
                  <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden border-0 shadow-lg h-full">
                    {/* Header with Gradient */}
                    <div className={`relative h-32 bg-gradient-to-r ${veille.bgGradient} flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative z-10">
                        <Icon className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute top-4 right-4">
                        <ArrowRight className="w-6 h-6 text-white/80 group-hover:text-white group-hover:transform group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${veille.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'} text-sm`}>
                          {veille.stats}
                        </Badge>
                        <div className="text-sm text-slate-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          2025
                        </div>
                      </div>
                      <CardTitle className="text-2xl text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                        {veille.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 leading-relaxed">
                        {veille.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">
                          Contenus disponibles :
                        </h4>
                        <ul className="space-y-2">
                          {veille.items.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className={`w-2 h-2 ${veille.color === 'blue' ? 'bg-blue-600' : 'bg-indigo-600'} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                              <span className="text-slate-700 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className={`${veille.color === 'blue' ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-indigo-50 group-hover:bg-indigo-100'} p-4 rounded-lg transition-colors duration-300`}>
                        <div className="flex items-center justify-between">
                          <span className={`${veille.color === 'blue' ? 'text-blue-800' : 'text-indigo-800'} font-medium text-sm`}>
                            Accéder à la veille
                          </span>
                          <ArrowRight className={`w-4 h-4 ${veille.color === 'blue' ? 'text-blue-700' : 'text-indigo-700'} group-hover:transform group-hover:translate-x-1 transition-all duration-300`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Aperçu de mes veilles
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <div className="text-slate-600 text-sm">Types de veilles</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-slate-600 text-sm">Versions Windows</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-slate-600 text-sm">Sujets RGPD</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">7</div>
              <div className="text-slate-600 text-sm">Total contenus</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Besoin d'informations complémentaires ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Pour toute question sur ces veilles ou pour discuter de vos besoins spécifiques en matière technologique et juridique.
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
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
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