'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone, Shield, Server, Network, Monitor, Code, Zap, Star, Calendar, Award, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isVisible, setIsVisible] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    
    // Simuler le chargement des données
    setTimeout(() => {
      setPortfolioData({
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
        education: [
          {
            id: 1,
            degree: 'BTS SIO - Services Informatiques aux Organisations',
            school: 'IFC Marseille',
            period: '2024-2026',
            description: 'Spécialisation SISR (Solutions d\'Infrastructure, Systèmes et Réseaux). Formation axée sur l\'administration des systèmes, la gestion des réseaux et la sécurité informatique.',
            skills: ['Windows Server', 'Linux', 'Réseaux', 'Sécurité', 'Virtualisation']
          },
          {
            id: 2,
            degree: 'Licence Mathématiques-Informatique-Mécanique',
            school: 'Université Aix-Marseille - Portails Descartes',
            period: '2023-2024',
            description: 'Formation universitaire pluridisciplinaire associant mathématiques, informatique et mécanique.',
            skills: ['Mathématiques', 'Programmation', 'Algorithmique', 'Physique']
          },
          {
            id: 3,
            degree: 'Baccalauréat Général',
            school: 'Lycée Alexandre Dumas',
            period: '2020-2023',
            description: 'Baccalauréat général avec spécialités scientifiques.',
            skills: ['Mathématiques', 'Physique-Chimie', 'Sciences']
          }
        ],
        skills: [
          {
            id: 1,
            category: 'Systèmes',
            items: [
              { name: 'Windows Server', level: 85 },
              { name: 'Active Directory', level: 80 },
              { name: 'Linux/Ubuntu', level: 75 },
              { name: 'Hyper-V', level: 70 }
            ]
          },
          {
            id: 2,
            category: 'Réseaux',
            items: [
              { name: 'Routeurs Zyxel', level: 85 },
              { name: 'Switchs managés', level: 80 },
              { name: 'pfSense', level: 75 },
              { name: 'VPN', level: 70 }
            ]
          },
          {
            id: 3,
            category: 'Sécurité',
            items: [
              { name: 'Firewalls', level: 80 },
              { name: 'Antivirus', level: 85 },
              { name: 'Sauvegardes', level: 90 },
              { name: 'Monitoring', level: 75 }
            ]
          },
          {
            id: 4,
            category: 'Virtualisation',
            items: [
              { name: 'VMware', level: 80 },
              { name: 'Hyper-V', level: 85 },
              { name: 'VirtualBox', level: 75 },
              { name: 'Proxmox', level: 65 }
            ]
          }
        ],
        projects: [
          {
            id: 1,
            title: 'Infrastructure Réseau BTS',
            category: 'Réseaux',
            date: '2024',
            description: 'Conception et mise en place d\'une infrastructure réseau complète pour le BTS SIO avec segmentation VLAN, routage inter-VLAN et sécurisation.',
            technologies: ['Cisco', 'VLAN', 'Routage', 'Sécurité'],
            image: 'https://images.unsplash.com/photo-1551808525-051d2b2e4633?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxuZXR3b3JrfGVufDB8fHx8MTc1Mjc3NDk1Nnww&ixlib=rb-4.1.0&q=85',
            highlights: [
              'Segmentation réseau avec VLANs',
              'Configuration de routeurs et switchs',
              'Mise en place de règles de sécurité',
              'Documentation complète'
            ]
          },
          {
            id: 2,
            title: 'Système de Monitoring',
            category: 'Surveillance',
            date: '2024',
            description: 'Déploiement d\'une solution de monitoring pour surveiller l\'infrastructure réseau et les serveurs avec alertes automatisées.',
            technologies: ['Nagios', 'SNMP', 'Grafana', 'Linux'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxtb25pdG9yaW5nfGVufDB8fHx8MTc1Mjc3NDk1Nnww&ixlib=rb-4.1.0&q=85',
            highlights: [
              'Monitoring des équipements réseau',
              'Alertes en temps réel',
              'Tableaux de bord personnalisés',
              'Historique des performances'
            ]
          },
          {
            id: 3,
            title: 'Solution de Sauvegarde',
            category: 'Sécurité',
            date: '2024',
            description: 'Implémentation d\'une solution de sauvegarde automatisée pour les données critiques avec restauration rapide.',
            technologies: ['Veeam', 'Windows Server', 'PowerShell', 'Stockage'],
            image: 'https://images.unsplash.com/photo-1551808525-051d2b2e4633?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxzZWN1cml0eXxlbnwwfHx8fDE3NTI3NzQ5NTZ8MA&ixlib=rb-4.1.0&q=85',
            highlights: [
              'Sauvegardes automatisées',
              'Politique de rétention',
              'Tests de restauration',
              'Monitoring des sauvegardes'
            ]
          }
        ],
        experience: [
          {
            id: 1,
            title: 'Stage Administrateur Réseaux',
            company: 'Sauvegarde13',
            period: '2024',
            description: 'Stage d\'immersion dans l\'administration des réseaux et systèmes informatiques.',
            responsibilities: [
              'Maintenance des équipements réseau',
              'Support technique aux utilisateurs',
              'Monitoring des infrastructures',
              'Participation aux projets d\'amélioration'
            ]
          }
        ],
        certifications: [
          {
            id: 1,
            name: 'CISCO CCNA',
            issuer: 'Cisco Systems',
            date: '2025',
            description: 'Certification sur les fondamentaux des réseaux Cisco.',
            status: 'En cours'
          }
        ],
        testimonials: [
          {
            id: 1,
            name: 'Jean Dupont',
            role: 'Formateur',
            company: 'IFC Marseille',
            content: 'Hocine fait preuve d\'une grande motivation et d\'une excellente capacité d\'adaptation. Ses compétences techniques évoluent rapidement.',
            avatar: null
          },
          {
            id: 2,
            name: 'Marie Martin',
            role: 'Tuteur de stage',
            company: 'Sauvegarde13',
            content: 'Étudiant sérieux et appliqué, avec un réel intérêt pour les technologies réseau. Très bon esprit d\'équipe.',
            avatar: null
          }
        ]
      })
      setLoading(false)
    }, 1000)

    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      return
    }

    setIsSubmitting(true)
    
    // Simuler l'envoi du message
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' })
      setIsSubmitting(false)
      alert('Message envoyé avec succès!')
    }, 1000)
  }

  const handleContactChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement du portfolio...</p>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Erreur</div>
          <p className="text-gray-600">Impossible de charger les données du portfolio</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  const { personalInfo, education, skills, projects, experience, certifications, testimonials } = portfolioData

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {personalInfo?.name}
            </div>
            <div className="hidden md:flex space-x-8">
              {[
                { id: 'hero', label: 'Accueil' },
                { id: 'about', label: 'À propos' },
                { id: 'skills', label: 'Compétences' },
                { id: 'projects', label: 'Projets' },
                { id: 'experience', label: 'Expérience' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 $\{
                    activeSection === item.id ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1639066648921-82d4500abf1a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxzZXJ2ZXJzfGVufDB8fHx8MTc1MjcwNTYwMnww&ixlib=rb-4.1.0&q=85')`
          }}
        />
        
        {/* Tech Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/4 -right-8 w-20 h-20 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 -left-8 w-12 h-12 bg-cyan-500/10 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-500/10 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 animate-float">
            <Shield className="w-8 h-8 text-blue-500/20" />
          </div>
          <div className="absolute top-20 right-20 animate-float-delay">
            <Server className="w-6 h-6 text-purple-500/20" />
          </div>
          <div className="absolute bottom-20 left-20 animate-float-delay-2">
            <Network className="w-10 h-10 text-cyan-500/20" />
          </div>
          <div className="absolute bottom-10 right-10 animate-float">
            <Monitor className="w-7 h-7 text-green-500/20" />
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white space-y-8 px-4 max-w-4xl">
          <div className={`transform transition-all duration-1000 $\{isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <Avatar className="w-32 h-32 mx-auto mb-8 border-4 border-white/20 shadow-2xl">
              <AvatarImage src={personalInfo?.avatar} alt={personalInfo?.name} />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
                {personalInfo?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {personalInfo?.name}
            </h1>
            <h2 className="text-3xl font-semibold mb-2">{personalInfo?.title}</h2>
            <p className="text-xl text-gray-300 mb-8">{personalInfo?.subtitle}</p>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
              {personalInfo?.description}
            </p>
          </div>
          <div className={`transform transition-all duration-1000 delay-500 $\{isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => scrollToSection('projects')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              >
                Voir mes projets
              </Button>
              <Button 
                variant="outline" 
                onClick={() => scrollToSection('contact')}
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              >
                Me contacter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              À propos de moi
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>{personalInfo?.email}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>{personalInfo?.phone}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{personalInfo?.location}</span>
              </div>
              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => window.open(personalInfo?.social?.github, '_blank')}
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => window.open(personalInfo?.social?.linkedin, '_blank')}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => window.open(personalInfo?.social?.email, '_blank')}
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4">Formation</h3>
              {education?.map((edu, index) => (
                <Card key={edu.id} className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">{edu.degree}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {edu.school} • {edu.period}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{edu.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {edu.skills?.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Compétences techniques
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills?.map((skillCategory, index) => (
              <Card key={skillCategory.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    {index === 0 && <Server className="w-8 h-8 text-white" />}
                    {index === 1 && <Network className="w-8 h-8 text-white" />}
                    {index === 2 && <Shield className="w-8 h-8 text-white" />}
                    {index === 3 && <Monitor className="w-8 h-8 text-white" />}
                  </div>
                  <CardTitle className="text-xl">{skillCategory.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skillCategory.items?.map((skill, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mes projets
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.map((project, index) => (
              <Card key={project.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-600 text-white">{project.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {project.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {project.highlights?.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Expérience professionnelle
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="experience" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="experience">Expériences</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="experience" className="space-y-6">
                {experience?.map((exp, index) => (
                  <Card key={exp.id} className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl">{exp.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {exp.company} • {exp.period}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{exp.description}</p>
                      <ul className="space-y-2">
                        {exp.responsibilities?.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="certifications" className="space-y-6">
                {certifications?.map((cert, index) => (
                  <Card key={cert.id} className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        {cert.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {cert.issuer} • {cert.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-2">{cert.description}</p>
                      <Badge 
                        variant={cert.status === 'En cours' ? 'secondary' : 'outline'}
                        className={cert.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}
                      >
                        {cert.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Contactez-moi</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"></div>
            <p className="text-xl text-gray-300 mt-6">
              Prêt à discuter de votre projet ou d'une opportunité professionnelle ?
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Email</h3>
                    <p className="text-gray-300">{personalInfo?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Téléphone</h3>
                    <p className="text-gray-300">{personalInfo?.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Localisation</h3>
                    <p className="text-gray-300">{personalInfo?.location}</p>
                  </div>
                </div>
                
                <div className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Réseaux sociaux</h3>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => window.open(personalInfo?.social?.github, '_blank')}
                    >
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => window.open(personalInfo?.social?.linkedin, '_blank')}
                    >
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => window.open(personalInfo?.social?.email, '_blank')}
                    >
                      <Mail className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Envoyez-moi un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Nom</label>
                      <input 
                        type="text" 
                        value={contactForm.name}
                        onChange={(e) => handleContactChange('name', e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Email</label>
                      <input 
                        type="email" 
                        value={contactForm.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Message</label>
                      <textarea 
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => handleContactChange('message', e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Votre message..."
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <Separator className="my-12 bg-white/20" />
            
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6">Témoignages</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {testimonials?.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <p className="text-gray-200 mb-4 italic">"{testimonial.content}"</p>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">{testimonial.name}</p>
                          <p className="text-sm text-gray-300">{testimonial.role}</p>
                          <p className="text-sm text-gray-400">{testimonial.company}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}