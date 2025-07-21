'use client'

import { useState, useEffect } from 'react'
import { GraduationCap, BookOpen, Target, Users, Award, CheckCircle, ArrowRight, Building, Briefcase, TrendingUp, Calendar, Star, Code, Server, Database, Network, Shield, Monitor, Terminal, Cpu, Globe, Cloud, Zap, Play, ExternalLink, ChevronRight, Clock, MapPin, Lightbulb, Brain, Trophy, Rocket, Settings, FileCode } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export default function BTSSIOPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [typedText, setTypedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedSpecialization, setSelectedSpecialization] = useState(null)

  const fullText = "BTS SIO_2025 > Formez-vous aux métiers du numérique_"

  // Animation de frappe pour le hero
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex])

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Globe },
    { id: 'specializations', label: 'Spécialisations', icon: Target },
    { id: 'program', label: 'Programme', icon: BookOpen },
    { id: 'career', label: 'Débouchés', icon: Rocket }
  ]

  const specializations = [
    {
      id: 'sisr',
      name: 'SISR',
      fullName: 'Solutions d\'Infrastructure, Systèmes et Réseaux',
      color: 'from-cyan-500 to-blue-600',
      icon: Server,
      description: 'Administration systèmes, gestion des réseaux et infrastructure IT',
      focus: 'Infrastructure & Sécurité',
      skills: ['Administration Systèmes', 'Réseaux & Télécoms', 'Virtualisation', 'Cybersécurité', 'Cloud Computing', 'Supervision'],
      careers: ['Administrateur systèmes/réseaux', 'Technicien infrastructure', 'Consultant IT', 'Responsable sécurité'],
      tools: ['VMware', 'Cisco', 'Windows Server', 'Linux', 'pfSense', 'Zabbix']
    },
    {
      id: 'slam',
      name: 'SLAM',
      fullName: 'Solutions Logicielles et Applications Métiers',
      color: 'from-purple-500 to-pink-600',
      icon: Code,
      description: 'Développement d\'applications et solutions logicielles métier',
      focus: 'Développement & Innovation',
      skills: ['Programmation Objet', 'Développement Web/Mobile', 'Bases de Données', 'DevOps', 'Architecture Logicielle', 'Tests & Qualité'],
      careers: ['Développeur full-stack', 'Développeur mobile', 'Analyste-programmeur', 'Chef de projet technique'],
      tools: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MySQL', 'Git']
    }
  ]

  const timelineData = [
    { year: 'Année 1', title: 'Fondamentaux', items: ['Base de l\'informatique', 'Première spécialisation', 'Stage 5 semaines'] },
    { year: 'Année 2', title: 'Expertise', items: ['Approfondissement technique', 'Projet professionnel', 'Stage 5 semaines'] }
  ]

  const renderOverview = () => (
    <div className="space-y-12">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Durée', value: '2 ans', icon: Clock, color: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
          { label: 'Niveau', value: 'Bac+2', icon: GraduationCap, color: 'bg-gradient-to-r from-purple-500 to-pink-600' },
          { label: 'Spécialisations', value: '2', icon: Target, color: 'bg-gradient-to-r from-green-500 to-teal-600' },
          { label: 'Débouchés', value: '15+', icon: Rocket, color: 'bg-gradient-to-r from-orange-500 to-red-600' }
        ].map((stat, index) => (
          <Card key={index} className="relative overflow-hidden group hover:scale-105 transition-all duration-300 border-0 shadow-lg">
            <div className={`absolute inset-0 ${stat.color} opacity-10`}></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Description moderne */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-50 to-blue-50">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Une formation d'excellence</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Le BTS SIO forme des professionnels polyvalents capables de répondre aux enjeux numériques 
                des organisations modernes. Entre infrastructure et développement, trouvez votre voie.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Innovation', 'Polyvalence', 'Excellence', 'Avenir'].map((tag) => (
                  <Badge key={tag} className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Brain, label: 'Apprentissage', desc: 'Pédagogie active' },
                { icon: Lightbulb, label: 'Innovation', desc: 'Technologies récentes' },
                { icon: Users, label: 'Accompagnement', desc: 'Suivi personnalisé' },
                { icon: Trophy, label: 'Réussite', desc: 'Taux d\'insertion élevé' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-white/50 hover:bg-white transition-colors">
                  <item.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSpecializations = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4">Choisissez votre spécialisation</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Deux parcours distincts pour répondre à vos aspirations professionnelles
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {specializations.map((spec) => (
          <Card 
            key={spec.id} 
            className={`group cursor-pointer border-0 shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500 ${
              selectedSpecialization === spec.id ? 'ring-4 ring-blue-300' : ''
            }`}
            onClick={() => setSelectedSpecialization(selectedSpecialization === spec.id ? null : spec.id)}
          >
            <div className={`h-2 bg-gradient-to-r ${spec.color}`}></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${spec.color} flex items-center justify-center`}>
                  <spec.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl text-gray-900">{spec.name}</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">{spec.focus}</CardDescription>
                </div>
                <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                  selectedSpecialization === spec.id ? 'rotate-90' : ''
                }`} />
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-700 mb-4">{spec.description}</p>
              
              {selectedSpecialization === spec.id && (
                <div className="space-y-6 animate-slide-in-up">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Compétences développées
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {spec.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="justify-start text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Débouchés principaux
                    </h4>
                    <ul className="space-y-1">
                      {spec.careers.map((career, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center">
                          <ArrowRight className="w-3 h-3 mr-2 text-gray-400" />
                          {career}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileCode className="w-4 h-4 mr-2" />
                      Outils & Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {spec.tools.map((tool, index) => (
                        <Badge key={index} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderProgram = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4">Programme de formation</h3>
        <p className="text-gray-600">Un cursus progressif sur 2 années</p>
      </div>
      
      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-cyan-500 to-purple-600"></div>
        
        {timelineData.map((year, index) => (
          <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-8`}>
            <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    {year.year}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold text-gray-900">
                    {year.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {year.items.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Timeline dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-cyan-500 rounded-full z-10"></div>
          </div>
        ))}
      </div>
      
      {/* Matières communes */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Enseignements transversaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Support et mise à disposition de services informatiques',
              'Mathématiques pour l\'informatique',
              'Algorithmique appliquée',
              'Analyse économique et managériale',
              'Expression et communication',
              'Anglais professionnel'
            ].map((subject, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-500">
                <span className="text-gray-800 font-medium">{subject}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCareer = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4">Votre avenir professionnel</h3>
        <p className="text-gray-600">De nombreuses opportunités dans le secteur du numérique</p>
      </div>
      
      {/* Secteurs d'activité */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Building, title: 'Entreprises', desc: 'Services informatiques intégrés', color: 'from-blue-500 to-cyan-600' },
          { icon: Cloud, title: 'SSII/ESN', desc: 'Sociétés de services numériques', color: 'from-purple-500 to-pink-600' },
          { icon: Zap, title: 'Start-ups', desc: 'Innovation et nouvelles technologies', color: 'from-orange-500 to-red-600' }
        ].map((sector, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${sector.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <sector.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{sector.title}</h4>
              <p className="text-gray-600 text-sm">{sector.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Salaires et évolution */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Évolution salariale
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span>Débutant (0-2 ans)</span>
                  <Badge className="bg-green-100 text-green-800">25-30k€</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span>Confirmé (3-5 ans)</span>
                  <Badge className="bg-blue-100 text-blue-800">32-40k€</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span>Senior (5+ ans)</span>
                  <Badge className="bg-purple-100 text-purple-800">40-55k€</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <Rocket className="w-5 h-5 mr-2 text-blue-600" />
                Poursuites d'études
              </h4>
              <ul className="space-y-3">
                {[
                  'Licence professionnelle Informatique',
                  'École d\'ingénieurs (admissions parallèles)',
                  'Bachelor spécialisé',
                  'Master en alternance'
                ].map((option, index) => (
                  <li key={index} className="flex items-center p-3 bg-white rounded-lg">
                    <ArrowRight className="w-4 h-4 mr-3 text-blue-500" />
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview': return renderOverview()
      case 'specializations': return renderSpecializations()
      case 'program': return renderProgram()
      case 'career': return renderCareer()
      default: return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section - Style Terminal */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 opacity-95"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Terminal Window */}
            <div className="bg-slate-800 rounded-t-xl p-4 mb-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-400 text-sm ml-4">formation_info.sh</span>
              </div>
            </div>
            
            <div className="bg-black rounded-b-xl p-8 font-mono text-left">
              <div className="text-green-400 text-lg">
                $ <span className="text-cyan-300">{typedText}</span>
                <span className="animate-pulse">|</span>
              </div>
              
              <div className="mt-6 text-center">
                <div className="text-4xl md:text-6xl font-bold mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    BTS SIO
                  </span>
                </div>
                <p className="text-xl text-slate-300 mb-6">
                  Services Informatiques aux Organisations
                </p>
                <div className="flex justify-center items-center gap-4 mb-8">
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 px-4 py-2">
                    <Terminal className="w-4 h-4 mr-2" />
                    Niveau 5 (Bac+2)
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 px-4 py-2">
                    <Clock className="w-4 h-4 mr-2" />
                    2 années
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Mobile Optimized */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex justify-center">
            {/* Mobile: Scrollable horizontal tabs */}
            <nav className="flex space-x-1 p-2 overflow-x-auto scrollbar-hide w-full max-w-full sm:w-auto">
              <div className="flex space-x-1 min-w-max sm:min-w-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden xs:inline sm:inline">{tab.label}</span>
                    <span className="xs:hidden sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Prêt à rejoindre l'aventure BTS SIO ?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Transformez votre passion pour l'informatique en expertise professionnelle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => window.location.href = 'mailto:hocineira@gmail.com'}
              >
                <Play className="mr-2 w-5 h-5" />
                Commencer maintenant
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => window.open('/tcs', '_self')}
              >
                <ExternalLink className="mr-2 w-5 h-5" />
                Voir mon parcours
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}