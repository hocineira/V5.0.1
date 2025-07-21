'use client'

import { useState, useEffect, memo, useMemo } from 'react'
import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone, GraduationCap, User, Target, Server, Network, Monitor, Database, Shield, Cpu } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Lazy load du composant Image optimisé
const OptimizedImage = dynamic(() => import('../../components/ui/OptimizedImage'), {
  loading: () => <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />,
  ssr: false
})

// Memoization des données statiques pour éviter les re-créations
const StaticData = {
  personalInfo: {
    name: 'Hocine IRATNI',
    title: 'Étudiant en BTS SIO SISR',
    subtitle: 'Spécialiste Systèmes et Réseaux Informatiques',
    description: 'Passionné par l\'informatique et les nouvelles technologies, je me spécialise dans l\'administration des systèmes et réseaux. Mon objectif est de contribuer à la sécurité et à l\'efficacité des infrastructures IT.',
    email: 'hocineira@gmail.com',
    phone: '06 XX XX XX XX',
    location: 'Marseille, France',
    social: {
      github: 'https://github.com/hocineira',
      linkedin: 'https://linkedin.com/in/hocine-iratni',
      email: 'mailto:hocineira@gmail.com'
    }
  },
  features: [
    {
      icon: GraduationCap,
      title: 'Formation BTS SIO',
      description: 'Découvrez les deux options du BTS Services Informatiques aux Organisations',
      href: '/bts-sio',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Server,
      title: 'Projets Techniques',
      description: 'Consultez mes réalisations en systèmes et réseaux informatiques',
      href: '/projets',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Monitor,
      title: 'Veilles Technologiques',
      description: 'Suivez mes analyses sur les dernières technologies IT',
      href: '/veilles',
      gradient: 'from-indigo-500 to-blue-600'
    }
  ],
  techStats: [
    { icon: Network, label: 'Cisco', value: 'CCNA', color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, label: 'Security', value: 'Wireshark', color: 'from-red-500 to-pink-500' },
    { icon: Database, label: 'Systems', value: 'Windows Server', color: 'from-green-500 to-emerald-500' },
    { icon: Cpu, label: 'Hyperviseur', value: 'Proxmox', color: 'from-purple-500 to-indigo-500' }
  ],
  techList: ['pfSense', 'VLANs', 'Active Directory', 'GLPI', 'Zabbix']
}

// Component memoizé pour les stats tech
const TechStat = memo(({ stat, index }) => {
  const Icon = stat.icon
  return (
    <div key={index} className="flex items-center gap-1 sm:gap-2">
      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
      <span className="text-xs text-gray-300 truncate">{stat.label}</span>
      <span className="text-xs text-green-400 font-mono">{stat.value}</span>
    </div>
  )
})

// Component memoizé pour les features
const FeatureCard = memo(({ feature, index, onAction }) => {
  const Icon = feature.icon
  return (
    <Card 
      className="group mobile-card touch-feedback bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 interactive transform hover:-translate-y-2 active:translate-y-0 cursor-pointer p-4 sm:p-6"
      onClick={() => onAction(feature.href)}
    >
      <CardHeader className="text-center pb-4 sm:pb-6">
        <div className={`w-16 h-16 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 interactive shadow-lg`}>
          <Icon className="w-8 h-8 sm:w-8 sm:h-8 text-white" />
        </div>
        <CardTitle className="text-xl sm:text-xl text-white group-hover:text-blue-400 interactive">
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-gray-300 text-center text-base sm:text-base leading-relaxed line-clamp-3">
          {feature.description}
        </CardDescription>
        <div className="mt-6 flex justify-center">
          <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-16 interactive"></div>
        </div>
      </CardContent>
    </Card>
  )
})

export default function AccueilPage() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Memoisation des handlers
  const handleContactClick = useMemo(() => () => {
    window.location.href = `mailto:${StaticData.personalInfo.email}`
  }, [])

  const handleProjectsClick = useMemo(() => () => {
    router.push('/projets')
  }, [router])

  const handleFeatureAction = useMemo(() => (href) => {
    router.push(href)
  }, [router])

  const handleSocialClick = useMemo(() => (url) => () => {
    window.open(url, '_blank')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Network Background - Optimisé pour mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating tech elements - Animations uniquement sur desktop */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse-fast"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse-fast delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse-fast delay-2000"></div>
      </div>

      {/* Hero Section - Mobile Optimisé */}
      <section className="relative py-12 sm:py-20 lg:py-32">
        <div className="relative container mx-auto px-3 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content - Mobile Optimized */}
            <div className={`interactive ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-fast"></div>
                  <span className="text-xs sm:text-sm text-blue-300">Système en ligne</span>
                </div>
                <h1 className="responsive-heading font-bold mb-4 sm:mb-6 text-white leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {StaticData.personalInfo.name}
                  </span>
                </h1>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 text-blue-300">
                  {StaticData.personalInfo.title}
                </h2>
                <p className="responsive-text text-blue-200 mb-4 sm:mb-8">
                  {StaticData.personalInfo.subtitle}
                </p>
                <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed line-clamp-3">
                  {StaticData.personalInfo.description}
                </p>
              </div>
              
              <div className="flex flex-col gap-4 sm:gap-4 sm:flex-row mb-6 sm:mb-8">
                <Button 
                  size="lg" 
                  className="touch-target-large mobile-ripple bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-4 sm:py-3 rounded-xl font-semibold interactive shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto text-base sm:text-base"
                  onClick={handleProjectsClick}
                >
                  <Server className="mr-2 w-5 h-5" />
                  <span>Découvrir mes projets</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="touch-target-large mobile-ripple border-2 border-blue-400 text-blue-400 hover:bg-blue-500/10 active:bg-blue-500/20 px-6 sm:px-8 py-4 sm:py-3 rounded-xl font-semibold interactive shadow-lg w-full sm:w-auto text-base sm:text-base"
                  onClick={handleContactClick}
                >
                  <Mail className="mr-2 w-5 h-5" />
                  <span>Me contacter</span>
                </Button>
              </div>

              {/* Contact Info - Mobile Optimized */}
              <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row items-start text-gray-300 mb-6 sm:mb-8">
                <div className="touch-feedback flex items-center gap-3 hover:text-blue-400 interactive cursor-pointer p-2 -m-2 rounded-lg" onClick={handleContactClick}>
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="text-base sm:text-base">{StaticData.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 p-2 -m-2">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span className="text-base sm:text-base">{StaticData.personalInfo.location}</span>
                </div>
              </div>

              {/* Social Links - Mobile Optimized */}
              <div className="flex gap-4 sm:gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="touch-target mobile-ripple border-2 border-blue-400/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 active:bg-blue-500/20 interactive w-12 h-12 sm:w-11 sm:h-11 rounded-xl"
                  onClick={handleSocialClick(StaticData.personalInfo.social.linkedin)}
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="touch-target mobile-ripple border-2 border-blue-400/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 active:bg-blue-500/20 interactive w-12 h-12 sm:w-11 sm:h-11 rounded-xl"
                  onClick={handleSocialClick(StaticData.personalInfo.social.email)}
                >
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right Image - Mobile Optimized avec OptimizedImage */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 sm:h-80 lg:h-96">
                <OptimizedImage 
                  src="https://images.unsplash.com/photo-1543953589-18ab987d605f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxuZXR3b3JraW5nfGVufDB8fHxibHVlfDE3NTI4NzA1NDR8MA&ixlib=rb-4.1.0&q=85" 
                  alt="Infrastructure IT" 
                  className="w-full h-full"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                      <Server className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Infrastructure Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      {StaticData.techStats.map((stat, index) => (
                        <TechStat key={index} stat={stat} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Highlight Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse-fast"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse-fast delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-3 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4 sm:mb-6">
                <Network className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-xs sm:text-sm text-blue-300">Infrastructure Personnelle</span>
              </div>
              <h2 className="responsive-heading font-bold mb-4 sm:mb-6 text-white leading-tight">
                Mon <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Architecture Réseau</span>
              </h2>
              <p className="responsive-text text-blue-100 mb-6 sm:mb-8 leading-relaxed line-clamp-3">
                Découvrez l'infrastructure complète que j'ai mise en place : pfSense pour la sécurité, 
                VLANs pour la segmentation, Active Directory pour la gestion des utilisateurs, 
                et des outils de monitoring comme GLPI et Zabbix.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                {StaticData.techList.map((tech, index) => (
                  <span key={index} className="px-2 sm:px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs sm:text-sm text-blue-200">
                    {tech}
                  </span>
                ))}
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold interactive shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto"
                onClick={handleProjectsClick}
              >
                <Server className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Voir l'architecture complète</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-2xl">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">Infrastructure Active</h3>
                  <p className="text-blue-300 text-sm">Schéma de mon environnement de test</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      { label: 'pfSense Firewall', color: 'green' },
                      { label: 'VLANs Configurés', color: 'blue' },
                      { label: 'Active Directory', color: 'purple' },
                      { label: 'Monitoring Zabbix', color: 'orange' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-2 h-2 bg-${item.color}-400 rounded-full animate-pulse-fast`}></div>
                        <span className="text-gray-300">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs text-blue-400">Cliquez pour voir le schéma détaillé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized avec Lazy Loading */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-800 to-slate-900 relative">
        <div className="relative container mx-auto px-3 sm:px-4">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4 sm:mb-6">
              <Network className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-xs sm:text-sm text-blue-300">Architecture Système</span>
            </div>
            <h2 className="responsive-heading font-bold mb-4 text-white leading-tight">
              Explorez mon <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Infrastructure</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {StaticData.features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                feature={feature} 
                index={index} 
                onAction={handleFeatureAction}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section - Performance optimisée */}
      <section className="py-20 bg-slate-900 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="responsive-heading font-bold mb-4 text-white">
              Stack <span className="text-gradient bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Technologique</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto responsive-text">
              Technologies et outils que j'utilise dans mes projets
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {StaticData.techStats.map((tech, index) => {
              const Icon = tech.icon
              return (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 interactive group">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-blue-400 group-hover:scale-110 interactive" />
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-fast"></div>
                  </div>
                  <div className="text-lg font-bold text-white mb-2">{tech.value}</div>
                  <div className="text-sm text-gray-300">{tech.label}</div>
                  <div className="mt-3 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className={`bg-gradient-to-r ${tech.color} h-full rounded-full w-full interactive`}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Optimisée pour mobile */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-fast"></div>
            <span className="text-sm text-blue-100">Prêt à connecter</span>
          </div>
          <h2 className="responsive-heading font-bold mb-6 text-white">
            Prêt à découvrir mon <span className="text-yellow-300">infrastructure</span> ?
          </h2>
          <p className="responsive-text text-blue-100 mb-8 max-w-2xl mx-auto line-clamp-3">
            Explorez mes projets, mes compétences et mon parcours dans le domaine des systèmes et réseaux informatiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold interactive shadow-lg hover:shadow-white/20"
              onClick={handleProjectsClick}
            >
              <Database className="mr-2 w-5 h-5" />
              Accéder aux projets
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold interactive shadow-lg"
              onClick={handleContactClick}
            >
              <Mail className="mr-2 w-5 h-5" />
              Établir une connexion
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}