'use client'

import { useState } from 'react'
import { FolderOpen, Github, ExternalLink, Calendar, Star, Code, Server, Network, Shield, HardDrive, Monitor, Wifi, FileText, Download, Eye } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export default function ProjetsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'Infrastructure réseau d\'entreprise',
      description: 'Conception et mise en place d\'une infrastructure réseau complète pour une PME avec segmentation VLAN, routage inter-VLAN, et politique de sécurité avancée. Implémentation d\'un pare-feu pfSense et configuration d\'un serveur Windows Server 2022.',
      category: 'sisr',
      technologies: ['Windows Server 2022', 'pfSense', 'VLAN', 'Active Directory', 'DHCP', 'DNS'],
      date: '2024',
      status: 'completed',
      image: '/api/placeholder/400/200',
      github: '#',
      demo: '#',
      icon: Network
    },
    {
      id: 2,
      title: 'Serveur de virtualisation Hyper-V',
      description: 'Installation et configuration d\'un serveur de virtualisation Hyper-V sur Windows Server 2022 pour optimiser les ressources informatiques. Mise en place de machines virtuelles avec différents rôles serveur et configuration des ressources.',
      category: 'sisr',
      technologies: ['Hyper-V', 'Windows Server 2022', 'PowerShell', 'System Center', 'Backup'],
      date: '2024',
      status: 'completed',
      image: '/api/placeholder/400/200',
      github: '#',
      demo: '#',
      icon: HardDrive
    },
    {
      id: 3,
      title: 'Solution de sauvegarde automatisée',
      description: 'Mise en place d\'une solution de sauvegarde automatisée pour les données critiques de l\'entreprise avec Veeam Backup & Replication. Configuration de sauvegardes incrémentales et différentielles avec restauration granulaire.',
      category: 'sisr',
      technologies: ['Veeam Backup', 'PowerShell', 'Task Scheduler', 'Robocopy', 'NAS Synology'],
      date: '2024',
      status: 'completed',
      image: '/api/placeholder/400/200',
      github: '#',
      demo: '#',
      icon: Shield
    },
    {
      id: 4,
      title: 'Système de monitoring réseau',
      description: 'Déploiement d\'une solution de monitoring réseau avec PRTG pour surveiller l\'état des équipements réseau, serveurs et services. Configuration d\'alertes et de rapports automatisés pour optimiser la maintenance préventive.',
      category: 'sisr',
      technologies: ['PRTG', 'SNMP', 'Windows Server', 'PowerShell', 'Grafana'],
      date: '2024',
      status: 'completed',
      image: '/api/placeholder/400/200',
      github: '#',
      demo: '#',
      icon: Monitor
    },
    {
      id: 5,
      title: 'Configuration réseau sécurisé Wi-Fi',
      description: 'Implémentation d\'un réseau Wi-Fi d\'entreprise sécurisé avec authentification 802.1X, contrôleur Wi-Fi et segmentation réseau. Configuration de politiques d\'accès et de sécurité pour différents profils utilisateurs.',
      category: 'sisr',
      technologies: ['802.1X', 'RADIUS', 'WPA3', 'Cisco Controller', 'Active Directory'],
      date: '2023',
      status: 'completed',
      image: '/api/placeholder/400/200',
      github: '#',
      demo: '#',
      icon: Wifi
    },
    {
      id: 6,
      title: 'Migration et modernisation AD',
      description: 'Migration d\'Active Directory vers Windows Server 2022 avec modernisation des services de domaine. Implémentation d\'Azure AD Connect pour l\'intégration hybrid cloud et amélioration des politiques de sécurité.',
      category: 'sisr',
      technologies: ['Active Directory', 'Azure AD', 'Windows Server 2022', 'PowerShell', 'Group Policy'],
      date: '2023',
      status: 'completed',
      image: '/api/placeholder/400/200',
      github: '#',
      demo: '#',
      icon: Server
    },
    {
      id: 7,
      title: 'Procédure VLAN Interco',
      description: 'Procédure détaillée pour la création de VLAN sur Switch et Routeur. Configuration de l\'interconnexion entre différents réseaux virtuels avec gestion des politiques de routage.',
      category: 'procedure',
      technologies: ['VLAN', 'Switch', 'Routeur', 'Cisco', 'Networking'],
      date: '2024',
      status: 'completed',
      type: 'procedure',
      pdfUrl: '/procedures/VLAN_Interco.pdf',
      icon: Network
    },
    {
      id: 8,
      title: 'Procédure ZABBIX',
      description: 'Procédure complète d\'installation et de configuration de ZABBIX sur Debian pour la supervision et monitoring des infrastructures réseau et serveurs.',
      category: 'procedure',
      technologies: ['ZABBIX', 'Debian', 'Monitoring', 'SNMP', 'MySQL'],
      date: '2024',
      status: 'completed',
      type: 'procedure',
      pdfUrl: '/procedures/Zabbix.pdf',
      icon: Monitor
    },
    {
      id: 9,
      title: 'Procédure Active Directory',
      description: 'Procédure détaillée d\'installation et de configuration de l\'Active Directory avec gestion des utilisateurs, groupes et GPO (Group Policy Objects).',
      category: 'procedure',
      technologies: ['Active Directory', 'Windows Server', 'GPO', 'Users', 'Groups'],
      date: '2024',
      status: 'completed',
      type: 'procedure',
      pdfUrl: '/procedures/Active_Directory.pdf',
      icon: Server
    },
    {
      id: 10,
      title: 'Procédure GLPI',
      description: 'Procédure complète d\'installation et de configuration de GLPI sur Ubuntu pour la gestion des services informatiques et helpdesk.',
      category: 'procedure',
      technologies: ['GLPI', 'Ubuntu', 'ITSM', 'Helpdesk', 'Apache', 'MySQL'],
      date: '2024',
      status: 'completed',
      type: 'procedure',
      pdfUrl: '/procedures/GLPI.pdf',
      icon: FileText
    },
    {
      id: 11,
      title: 'Procédure Proxmox',
      description: 'Procédure d\'installation et de configuration de Proxmox pour la virtualisation et gestion des machines virtuelles dans un environnement d\'entreprise.',
      category: 'procedure',
      technologies: ['Proxmox', 'Virtualisation', 'KVM', 'LXC', 'Cluster'],
      date: '2024',
      status: 'completed',
      type: 'procedure',
      pdfUrl: '/procedures/Proxmox.pdf',
      icon: HardDrive
    },
    {
      id: 12,
      title: 'Procédure GPO',
      description: 'Procédure de création et gestion des GPO (Group Policy Objects) pour la configuration centralisée des environnements Windows.',
      category: 'procedure',
      technologies: ['GPO', 'Active Directory', 'Windows Server', 'Policy', 'Configuration'],
      date: '2024',
      status: 'completed',
      type: 'procedure',
      pdfUrl: '/procedures/GPO.pdf',
      icon: Shield
    },
    {
      id: 13,
      title: 'Attaque MITM - ARP Poisoning',
      description: 'Réalisation d\'attaques Man-in-the-Middle avec ARP Poisoning et test de la sécurité des réseaux avec Ettercap sur Kali Linux.',
      category: 'procedure',
      technologies: ['Kali Linux', 'Ettercap', 'ARP Poisoning', 'MITM', 'Sécurité'],
      date: '2024',
      status: 'completed',
      type: 'procedure',
      pdfUrl: '/procedures/MITM_Ettercap.pdf',
      icon: Shield
    },
    {
      id: 14,
      title: 'Attaque MITM - DNS Spoofing',
      description: 'Réalisation d\'une attaque Man-in-the-Middle avec DNS Spoofing et ARP Poisoning, évaluation de la sécurité des réseaux via l\'ingénierie sociale.',
      category: 'procedure',
      technologies: ['Kali Linux', 'DNS Spoofing', 'ARP Poisoning', 'Social Engineering', 'MITM'],
      date: '2024',
      status: 'completed',
      type: 'procedure',
      pdfUrl: '/procedures/MITM_DNS_Spoofing.pdf',
      icon: Shield
    }
  ]

  const categories = [
    { id: 'all', name: 'Tous les projets', icon: FolderOpen },
    { id: 'sisr', name: 'SISR - Systèmes & Réseaux', icon: Server },
    { id: 'procedure', name: 'Procédures Techniques', icon: FileText }
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé'
      case 'in-progress': return 'En cours'
      default: return 'En attente'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <FolderOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Mes Projets & Procédures
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez mes réalisations techniques et mes procédures dans les domaines des systèmes et réseaux informatiques. 
              Chaque projet reflète ma passion pour l'infrastructure IT et ma volonté d'apprendre les dernières technologies.
            </p>
            <div className="flex justify-center items-center gap-4 mb-8">
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
                <Server className="w-4 h-4 mr-2" />
                Systèmes & Réseaux
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Sécurité
              </Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                <Network className="w-4 h-4 mr-2" />
                Infrastructure
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 px-4 py-2">
                <FileText className="w-4 h-4 mr-2" />
                Procédures
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
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
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const ProjectIcon = project.icon
              return (
                <Card key={project.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden border-0 shadow-lg">
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <div className="text-6xl text-purple-400 group-hover:text-purple-600 transition-colors duration-300">
                      <ProjectIcon className="w-16 h-16" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="flex items-center text-gray-500 mt-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.date}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 text-xs hover:bg-purple-200 transition-colors">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                        onClick={() => window.open(project.github, '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                        onClick={() => window.open(project.demo, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Démo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {projects.length}
              </div>
              <div className="text-gray-600">Projets SISR réalisés</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-gray-600">Projets terminés</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {new Set(projects.flatMap(p => p.technologies)).size}
              </div>
              <div className="text-gray-600">Technologies maîtrisées</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Intéressé par mes réalisations ?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            N'hésitez pas à me contacter pour discuter de vos projets d'infrastructure IT ou pour en savoir plus sur mes compétences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => window.location.href = 'mailto:hocineira@gmail.com'}
            >
              Me contacter
              <ExternalLink className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => window.open('/veilles', '_self')}
            >
              Voir mes veilles
              <Star className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}