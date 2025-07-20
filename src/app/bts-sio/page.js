'use client'

import { useState } from 'react'
import { GraduationCap, BookOpen, Target, Users, Award, CheckCircle, ArrowRight, Building, Briefcase, TrendingUp, Calendar, Star, Code, Server, Database, Network, Shield, Monitor } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export default function BTSSIOPage() {
  const [expandedSection, setExpandedSection] = useState(null)
  const [clickTimeout, setClickTimeout] = useState(null)

  const btsInfo = {
    title: 'BTS SIO - Services Informatiques aux Organisations',
    subtitle: 'Brevet de Technicien Supérieur niveau 5 (Bac+2)',
    description: 'Le BTS SIO forme des professionnels capables de gérer et maintenir l\'infrastructure informatique d\'une organisation, de développer des applications et d\'accompagner les utilisateurs.',
    duration: '2 ans',
    level: 'Niveau 5 (Bac+2)',
    admission: 'Baccalauréat ou équivalent',
    
    presentation: {
      title: 'Présentation de la formation',
      content: [
        'Le BTS Services Informatiques aux Organisations s\'adresse à ceux qui s\'intéressent à la réalisation de services informatiques aux organisations, que ce soit au niveau de la création d\'applications ou de l\'administration et la gestion du parc informatique.',
        'Cette formation polyvalente permet d\'acquérir les compétences nécessaires pour exercer dans tous les secteurs d\'activité, car toutes les organisations ont des besoins en services informatiques.',
        'Le diplômé peut travailler dans une entreprise utilisatrice (service informatique intégré), dans une SSII (Société de Services en Ingénierie Informatique), ou encore dans une société éditrice de logiciels.'
      ]
    },

    competences: {
      title: 'Compétences développées',
      communes: [
        'Support et mise à disposition de services informatiques',
        'Administration des systèmes et des réseaux',
        'Gestion du patrimoine informatique',
        'Réponse aux incidents et aux demandes d\'assistance',
        'Développement, adaptation et maintenance des applications',
        'Gestion de projets informatiques',
        'Veille technologique et cybersécurité'
      ],
      sisr: [
        'Installation et configuration des équipements et services',
        'Administration et surveillance des réseaux et des domaines',
        'Déploiement et maintenance des services informatiques',
        'Assistance aux utilisateurs et résolution des incidents',
        'Participation à la gestion du parc informatique'
      ],
      slam: [
        'Développement d\'applications informatiques',
        'Maintenance et évolution des applications existantes',
        'Gestion des données et des bases de données',
        'Conception et réalisation de services en ligne',
        'Développement d\'applications mobiles'
      ]
    },

    options: {
      sisr: {
        name: 'SISR - Solutions d\'Infrastructure, Systèmes et Réseaux',
        description: 'L\'option SISR est destinée aux étudiants qui s\'orientent vers la gestion d\'infrastructure réseau, l\'administration des systèmes et la maintenance du parc informatique.',
        objectifs: [
          'Installer, intégrer, administrer et faire évoluer des systèmes et réseaux',
          'Exploiter, dépanner et superviser des réseaux et des services',
          'Assurer la sécurité et la disponibilité des équipements et des services'
        ],
        matieres: [
          'Administration des systèmes',
          'Gestion des réseaux informatiques',
          'Cybersécurité',
          'Virtualisation et cloud computing',
          'Supervision et monitoring',
          'Support technique niveau 2'
        ],
        debouches: [
          'Administrateur systèmes et réseaux',
          'Technicien infrastructure',
          'Technicien de maintenance informatique',
          'Responsable du parc informatique',
          'Consultant en systèmes et réseaux',
          'Technicien sécurité'
        ]
      },
      slam: {
        name: 'SLAM - Solutions Logicielles et Applications Métiers',
        description: 'L\'option SLAM s\'adresse aux étudiants qui s\'intéressent à la programmation et au développement d\'applications informatiques.',
        objectifs: [
          'Développer, adapter et maintenir des solutions applicatives',
          'Gérer des données et garantir leur sécurité',
          'Travailler dans le cadre d\'un projet informatique'
        ],
        matieres: [
          'Programmation orientée objet',
          'Développement web et mobile',
          'Gestion de bases de données',
          'Frameworks et architectures',
          'Gestion de projet agile',
          'Qualité logicielle et tests'
        ],
        debouches: [
          'Développeur d\'applications informatiques',
          'Développeur web/mobile',
          'Analyste programmeur',
          'Technicien d\'études informatiques',
          'Consultant en développement',
          'Chef de projet junior'
        ]
      }
    },

    programme: {
      title: 'Programme de formation',
      enseignements: [
        { matiere: 'Support et mise à disposition de services informatiques', heures: '13h' },
        { matiere: 'Solutions d\'infrastructure, systèmes et réseaux (SISR)', heures: '12h' },
        { matiere: 'Solutions logicielles et applications métiers (SLAM)', heures: '12h' },
        { matiere: 'Mathématiques pour l\'informatique', heures: '3h' },
        { matiere: 'Algorithmique appliquée', heures: '2h' },
        { matiere: 'Analyse économique, managériale et juridique', heures: '5h' },
        { matiere: 'Anglais', heures: '2h' },
        { matiere: 'Expression et communication', heures: '2h' }
      ],
      stages: [
        { nom: 'Stage de première année', duree: '5 semaines minimum' },
        { nom: 'Stage de deuxième année', duree: '5 semaines minimum' },
        { nom: 'Projets personnalisés encadrés', duree: '120 heures' }
      ]
    },

    modalites: {
      title: 'Modalités d\'évaluation',
      controle: [
        'Contrôle continu pour les matières générales',
        'Épreuves ponctuelles pour les matières professionnelles',
        'Projet personnalisé encadré (PPE)',
        'Stages en entreprise avec rapport et soutenance',
        'Épreuve E4 : Conception et maintenance de solutions informatiques',
        'Épreuve E5 : Production et fourniture de services informatiques'
      ]
    },

    poursuite: {
      title: 'Poursuites d\'études',
      formations: [
        'Licence professionnelle en informatique',
        'École d\'ingénieurs (admissions parallèles)',
        'Bachelor informatique',
        'Licence générale en informatique',
        'Master en alternance (après licence)',
        'Certificats professionnels spécialisés'
      ]
    }
  }

  const toggleSection = (section) => {
    // Si on clique sur la même section qui est déjà ouverte, on la ferme
    // Sinon, on ouvre la nouvelle section
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
              {btsInfo.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-6">
              {btsInfo.subtitle}
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {btsInfo.description}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                {btsInfo.duration}
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-800 px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                {btsInfo.level}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                {btsInfo.admission}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Options Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Deux spécialisations au choix
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* SISR Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Option SISR</CardTitle>
                    <CardDescription className="text-blue-100">
                      Solutions d'Infrastructure, Systèmes et Réseaux
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  {btsInfo.options.sisr.description}
                </p>
                <div className="space-y-3 mb-6">
                  {btsInfo.options.sisr.objectifs.map((objectif, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objectif}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => toggleSection('sisr')}
                >
                  Découvrir SISR
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* SLAM Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Option SLAM</CardTitle>
                    <CardDescription className="text-indigo-100">
                      Solutions Logicielles et Applications Métiers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  {btsInfo.options.slam.description}
                </p>
                <div className="space-y-3 mb-6">
                  {btsInfo.options.slam.objectifs.map((objectif, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objectif}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => toggleSection('slam')}
                >
                  Découvrir SLAM
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Expanded Sections */}
      {expandedSection && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {expandedSection === 'sisr' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Option SISR - Solutions d'Infrastructure, Systèmes et Réseaux
                    </h3>
                    <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-blue-600">
                          <Target className="w-5 h-5 mr-2" />
                          Matières principales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {btsInfo.options.sisr.matieres.map((matiere, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                              <span className="text-gray-700">{matiere}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-blue-600">
                          <Briefcase className="w-5 h-5 mr-2" />
                          Débouchés professionnels
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3">
                          {btsInfo.options.sisr.debouches.map((debouche, index) => (
                            <Badge key={index} variant="outline" className="border-blue-200 text-blue-700 justify-center py-2">
                              {debouche}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {expandedSection === 'slam' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Option SLAM - Solutions Logicielles et Applications Métiers
                    </h3>
                    <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-indigo-600">
                          <Target className="w-5 h-5 mr-2" />
                          Matières principales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {btsInfo.options.slam.matieres.map((matiere, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                              <span className="text-gray-700">{matiere}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-indigo-600">
                          <Briefcase className="w-5 h-5 mr-2" />
                          Débouchés professionnels
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3">
                          {btsInfo.options.slam.debouches.map((debouche, index) => (
                            <Badge key={index} variant="outline" className="border-indigo-200 text-indigo-700 justify-center py-2">
                              {debouche}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Programme Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Programme et organisation
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Enseignements hebdomadaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {btsInfo.programme.enseignements.map((enseignement, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">{enseignement.matiere}</span>
                      <Badge variant="secondary">{enseignement.heures}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Building className="w-5 h-5 mr-2" />
                  Stages et projets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {btsInfo.programme.stages.map((stage, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">{stage.nom}</h4>
                      <p className="text-blue-700">{stage.duree}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compétences Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Compétences développées
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-blue-600">
                Compétences communes aux deux options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {btsInfo.competences.communes.map((competence, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{competence}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Poursuites et modalités */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Poursuites d'études
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {btsInfo.poursuite.formations.map((formation, index) => (
                    <div key={index} className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-blue-600 mr-3" />
                      <span className="text-gray-700">{formation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Star className="w-5 h-5 mr-2" />
                  Modalités d'évaluation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {btsInfo.modalites.controle.map((modalite, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{modalite}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}