'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone, GraduationCap, User, Target } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useRouter } from 'next/navigation'

export default function AccueilPage() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
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
      description: 'Découvrez les deux options du BTS Services Informatiques aux Organisations'
    },
    {
      icon: User,
      title: 'Projets Réalisés',
      description: 'Consultez mes réalisations et projets techniques'
    },
    {
      icon: Target,
      title: 'Veilles Technologiques',
      description: 'Suivez mes analyses et recherches sur les dernières technologies'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                {personalInfo.name}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-blue-600">
                {personalInfo.title}
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {personalInfo.subtitle}
              </p>
              <p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
                {personalInfo.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Découvrir mes projets
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Me contacter
                </Button>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{personalInfo.location}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  onClick={() => window.open(personalInfo.social.github, '_blank')}
                >
                  <Github className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  onClick={() => window.open(personalInfo.social.linkedin, '_blank')}
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  onClick={() => window.open(personalInfo.social.email, '_blank')}
                >
                  <Mail className="w-5 h-5" />
                </Button>
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
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
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
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Voir mes projets
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Me contacter
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}