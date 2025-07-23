'use client'

import { useState, useEffect, memo, useMemo } from 'react'
import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone, GraduationCap, User, Target, Server, Network, Monitor, Database, Shield, Cpu, Zap, Globe, Lock, Settings, Code, Terminal, Wifi } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Données statiques modernes pour un design technologique unifié
const StaticData = {
  personalInfo: {
    name: 'Hocine IRATNI',
    title: 'Étudiant en BTS SIO SISR',
    subtitle: 'Spécialiste Systèmes et Réseaux Informatiques',
    description: 'Passionné par l\'infrastructure IT et les nouvelles technologies, je développe des compétences en administration système, sécurité réseau et virtualisation.',
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
      description: 'Découvrez le parcours BTS Services Informatiques aux Organisations',
      href: '/bts-sio'
    },
    {
      icon: Server,
      title: 'Projets Techniques',
      description: 'Explorez mes réalisations en infrastructure et réseaux',
      href: '/projets'
    },
    {
      icon: Monitor,
      title: 'Veilles Technologiques',
      description: 'Suivez mes analyses des dernières innovations IT',
      href: '/veilles'
    }
  ],
  // Stack technologique unifié avec design moderne
  techStack: [
    { 
      icon: Network, 
      name: 'Cisco CCNA', 
      category: 'Réseaux',
      description: 'Configuration et maintenance',
      status: 'expert'
    },
    { 
      icon: Shield, 
      name: 'pfSense', 
      category: 'Sécurité',
      description: 'Firewall et VPN',
      status: 'avancé'
    },
    { 
      icon: Database, 
      name: 'Active Directory', 
      category: 'Systèmes',
      description: 'Gestion d\'identités',
      status: 'avancé'
    },
    { 
      icon: Settings, 
      name: 'Proxmox', 
      category: 'Virtualisation',
      description: 'Hyperviseur open-source',
      status: 'intermédiaire'
    },
    { 
      icon: Terminal, 
      name: 'Linux/Windows', 
      category: 'OS',
      description: 'Administration système',
      status: 'expert'
    },
    { 
      icon: Wifi, 
      name: 'VLANs', 
      category: 'Réseaux',
      description: 'Segmentation réseau',
      status: 'avancé'
    }
  ],
  infrastructure: [
    { name: 'pfSense Firewall', status: 'active', type: 'security' },
    { name: 'Switch Managé', status: 'active', type: 'network' },
    { name: 'Serveur AD', status: 'active', type: 'system' },
    { name: 'Proxmox Cluster', status: 'active', type: 'virtualization' }
  ]
}

// Component moderne pour les compétences tech
const TechSkill = memo(({ skill, index }) => {
  const Icon = skill.icon
  const getStatusColor = (status) => {
    switch (status) {
      case 'expert': return 'bg-cyan-400'
      case 'avancé': return 'bg-blue-400' 
      case 'intermédiaire': return 'bg-slate-400'
      default: return 'bg-slate-400'
    }
  }
  
  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:translate-y-[-4px]">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-700/50 rounded-lg group-hover:bg-cyan-400/10 transition-all duration-300">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <div className={`w-2 h-2 rounded-full ${getStatusColor(skill.status)} opacity-75`}></div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-1">{skill.name}</h3>
      <p className="text-cyan-300 text-sm font-medium mb-2">{skill.category}</p>
      <p className="text-slate-300 text-sm leading-relaxed">{skill.description}</p>
      
      {/* Ligne de progression moderne */}
      <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-1000 
          ${skill.status === 'expert' ? 'w-full' : skill.status === 'avancé' ? 'w-4/5' : 'w-3/5'}`}></div>
      </div>
    </div>
  )
})

// Component moderne pour les features
const ModernFeatureCard = memo(({ feature, index, onAction }) => {
  const Icon = feature.icon
  return (
    <Card 
      className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:border-cyan-400/50 hover:bg-slate-800/50 cursor-pointer transition-all duration-300 hover:translate-y-[-8px] overflow-hidden"
      onClick={() => onAction(feature.href)}
    >
      {/* Effet de lueur moderne */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="text-center pb-4 relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-2xl flex items-center justify-center group-hover:bg-cyan-400/10 transition-all duration-300 group-hover:scale-110">
          <Icon className="w-8 h-8 text-cyan-400" />
        </div>
        <CardTitle className="text-xl text-white group-hover:text-cyan-300 transition-colors duration-300">
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <CardDescription className="text-slate-300 text-center leading-relaxed mb-4">
          {feature.description}
        </CardDescription>
        <div className="flex justify-center">
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full group-hover:w-20 transition-all duration-300"></div>
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

  const handleProjectsClick = () => router.push('/projets')
  const handleContactClick = () => window.open('mailto:hocineira@gmail.com', '_blank')
  const handleSocialClick = (url) => () => window.open(url, '_blank')
  const handleFeatureAction = (href) => router.push(href)

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Hero Section Moderne */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Grille technologique en arrière-plan */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgb(30 41 59 / 0.5) 1px, transparent 1px),
              linear-gradient(180deg, rgb(30 41 59 / 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Éléments décoratifs tech */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 border border-cyan-400/20 rotate-45 rounded-lg"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-cyan-400/10 rotate-12 rounded-lg"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 border border-cyan-400/15 rotate-[-30deg] rounded-lg"></div>
          
          {/* Circuit pattern subtil */}
          <div className="absolute top-1/2 left-1/4 w-1 h-20 bg-cyan-400/10"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-1 bg-cyan-400/10"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-16 bg-cyan-400/10"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-1 bg-cyan-400/10"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-10rem)]">
            {/* Contenu principal */}
            <div className="space-y-8">
              {/* Badge status moderne */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-cyan-400/30 rounded-full">
                <div className="relative">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-sm text-cyan-300 font-medium">Infrastructure Active</span>
              </div>

              {/* Titre principal moderne */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {StaticData.personalInfo.name}
                  </span>
                </h1>
                <h2 className="text-2xl lg:text-3xl font-semibold text-cyan-300">
                  {StaticData.personalInfo.title}
                </h2>
                <p className="text-xl text-slate-300 font-light">
                  {StaticData.personalInfo.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                {StaticData.personalInfo.description}
              </p>

              {/* Boutons d'action modernes */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                  onClick={handleProjectsClick}
                >
                  <Server className="mr-2 w-5 h-5" />
                  <span>Explorer mes projets</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  onClick={handleContactClick}
                >
                  <Mail className="mr-2 w-5 h-5" />
                  <span>Me contacter</span>
                </Button>
              </div>

              {/* Contact info moderne */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <div className="flex items-center gap-3 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer" onClick={handleContactClick}>
                  <Mail className="w-5 h-5" />
                  <span>{StaticData.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-5 h-5" />
                  <span>{StaticData.personalInfo.location}</span>
                </div>
              </div>

              {/* Réseaux sociaux modernes */}
              <div className="flex gap-4 pt-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-400 hover:text-cyan-300 w-12 h-12 rounded-xl transition-all duration-300"
                  onClick={handleSocialClick(StaticData.personalInfo.social.linkedin)}
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-400 hover:text-cyan-300 w-12 h-12 rounded-xl transition-all duration-300"
                  onClick={handleSocialClick(StaticData.personalInfo.social.email)}
                >
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Section image avec infrastructure moderne */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] relative">
                  <Image 
                    src="/images/procedures/optimized_hero_image_new.webp" 
                    alt="Infrastructure réseau moderne" 
                    fill
                    className="object-cover"
                    priority
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                </div>
                
                {/* Overlay avec infrastructure status */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30">
                    <div className="flex items-center gap-2 text-cyan-300 mb-3">
                      <Network className="w-4 h-4" />
                      <span className="text-sm font-medium">Infrastructure SISR</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {StaticData.infrastructure.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-slate-300">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Compétences Techniques Moderne */}
      <section className="py-20 bg-gradient-to-br from-slate-800/50 to-slate-900/80 relative">
        {/* Fond technique subtil */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgb(6 182 212 / 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-cyan-400/30 rounded-full mb-6">
              <Code className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">Stack Technologique</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Compétences
              </span>
              <span className="text-cyan-300"> SISR</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Technologies et outils maîtrisés dans le domaine des systèmes et réseaux informatiques
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {StaticData.techStack.map((skill, index) => (
              <TechSkill key={index} skill={skill} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Navigation des Services */}
      <section className="py-20 bg-gradient-to-br from-slate-900/80 to-slate-800/50 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-cyan-400/30 rounded-full mb-6">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">Portfolio</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Explorez mon
              </span>
              <span className="text-cyan-300"> parcours</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {StaticData.features.map((feature, index) => (
              <ModernFeatureCard 
                key={index} 
                feature={feature} 
                index={index} 
                onAction={handleFeatureAction}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA Finale Moderne */}
      <section className="py-20 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 relative">
        {/* Pattern technique */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 24%, rgb(6 182 212 / 0.1) 25%, rgb(6 182 212 / 0.1) 26%, transparent 27%, transparent 74%, rgb(6 182 212 / 0.1) 75%, rgb(6 182 212 / 0.1) 76%, transparent 77%),
              linear-gradient(-45deg, transparent 24%, rgb(59 130 246 / 0.1) 25%, rgb(59 130 246 / 0.1) 26%, transparent 27%, transparent 74%, rgb(59 130 246 / 0.1) 75%, rgb(59 130 246 / 0.1) 76%, transparent 77%)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900/50 backdrop-blur-sm border border-cyan-400/30 rounded-full mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-cyan-300 font-medium">Prêt à collaborer</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Créons ensemble votre
            </span>
            <span className="text-cyan-300"> infrastructure</span>
          </h2>
          
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Découvrez mes réalisations en systèmes et réseaux, mes compétences techniques 
            et mon approche moderne de l'administration IT.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
              onClick={handleProjectsClick}
            >
              <Server className="mr-2 w-5 h-5" />
              <span>Voir mes projets</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              onClick={handleContactClick}
            >
              <Mail className="mr-2 w-5 h-5" />
              <span>Établir une connexion</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}