'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone, GraduationCap, User, Target, Server, Network, Monitor, Database, Shield, Cpu } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useRouter } from 'next/navigation'

export default function AccueilPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [particleCount, setParticleCount] = useState(20)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
    // Ajuster le nombre de particules selon la taille de l'écran
    const handleResize = () => {
      setParticleCount(window.innerWidth < 768 ? 10 : 20)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleContactClick = () => {
    window.location.href = `mailto:${personalInfo.email}`
  }

  const handleProjectsClick = () => {
    router.push('/projets')
  }

  const personalInfo = {
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
  }

  const features = [
    {
      icon: GraduationCap,
      title: 'Formation BTS SIO',
      description: 'Découvrez les deux options du BTS Services Informatiques aux Organisations',
      action: () => router.push('/bts-sio'),
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Server,
      title: 'Projets Techniques',
      description: 'Consultez mes réalisations en systèmes et réseaux informatiques',
      action: () => router.push('/projets'),
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Monitor,
      title: 'Veilles Technologiques',
      description: 'Suivez mes analyses sur les dernières technologies IT',
      action: () => router.push('/veilles'),
      gradient: 'from-indigo-500 to-blue-600'
    }
  ]

  const techStats = [
    { icon: Network, label: 'Réseaux', value: '95%' },
    { icon: Shield, label: 'Sécurité', value: '88%' },
    { icon: Database, label: 'Systèmes', value: '92%' },
    { icon: Cpu, label: 'Performance', value: '90%' }
  ]

  // Génération des particules pour l'animation réseau
  const generateParticles = () => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 2
    }))
  }

  const particles = generateParticles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Network Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Ligne de connexion réseau animées */}
        <div className="absolute inset-0">
          {particles.map((particle, index) => (
            <div key={particle.id} className="absolute">
              <div 
                className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`
                }}
              />
              {index < particles.length - 1 && (
                <div 
                  className="absolute border-t border-blue-300/30 animate-pulse"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${Math.abs(particles[index + 1].x - particle.x)}%`,
                    transform: `rotate(${Math.atan2(particles[index + 1].y - particle.y, particles[index + 1].x - particle.x) * 180 / Math.PI}deg)`,
                    transformOrigin: 'left center',
                    animationDelay: `${particle.delay + 1}s`
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Floating tech elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-300">Système en ligne</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {personalInfo.name}
                  </span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-blue-300">
                  {personalInfo.title}
                </h2>
                <p className="text-xl text-blue-200 mb-8">
                  {personalInfo.subtitle}
                </p>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  {personalInfo.description}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  onClick={handleProjectsClick}
                >
                  <Server className="mr-2 w-5 h-5" />
                  Découvrir mes projets
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-blue-400 text-blue-400 hover:bg-blue-500/10 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  onClick={handleContactClick}
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Me contacter
                </Button>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row gap-6 items-start text-gray-300 mb-8">
                <div className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer" onClick={handleContactClick}>
                  <Mail className="w-5 h-5" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{personalInfo.location}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-blue-400/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-200 transform hover:scale-110"
                  onClick={() => window.open(personalInfo.social.github, '_blank')}
                >
                  <Github className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-blue-400/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-200 transform hover:scale-110"
                  onClick={() => window.open(personalInfo.social.linkedin, '_blank')}
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-blue-400/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-200 transform hover:scale-110"
                  onClick={() => window.open(personalInfo.social.email, '_blank')}
                >
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1543953589-18ab987d605f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxuZXR3b3JraW5nfGVufDB8fHxibHVlfDE3NTI4NzA1NDR8MA&ixlib=rb-4.1.0&q=85" 
                  alt="Infrastructure IT" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                      <Server className="w-4 h-4" />
                      <span className="text-sm">Infrastructure Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {techStats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-300">{stat.label}</span>
                            <span className="text-xs text-green-400 font-mono">{stat.value}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Explorez mon parcours
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg cursor-pointer"
                  onClick={feature.action}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Prêt à découvrir mon travail ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explorez mes projets, mes compétences et mon parcours dans le domaine des systèmes et réseaux informatiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={handleProjectsClick}
            >
              Voir mes projets
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={handleContactClick}
            >
              Me contacter
              <Mail className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}