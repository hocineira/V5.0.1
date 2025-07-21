'use client'

import { Shield, Download, FileText, Clock, Users, Award } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

export default function TCSPage() {
  const tcsInfo = {
    title: 'Tableau De Compétences',
    description: 'Évaluation et présentation des compétences acquises dans le cadre du BTS SIO option SISR (Solutions d\'Infrastructure, Systèmes et Réseaux).',
    duration: '2 ans',
    level: 'Niveau 5 (Bac+2)',
    objectives: [
      'Gérer le patrimoine informatique',
      'Répondre aux incidents et aux demandes d\'assistance et d\'évolution',
      'Développer la présence en ligne de l\'organisation',
      'Travailler en mode projet',
      'Mettre à disposition des utilisateurs un service informatique',
      'Organiser son développement professionnel'
    ],
    skills: [
      'Administration des systèmes',
      'Gestion des réseaux',
      'Virtualisation',
      'Sécurité informatique',
      'Support technique',
      'Supervision et monitoring',
      'Configuration des équipements réseau',
      'Gestion de projets IT'
    ],
    opportunities: [
      'Administrateur systèmes et réseaux',
      'Technicien infrastructure',
      'Responsable informatique',
      'Technicien de maintenance',
      'Consultant en systèmes',
      'Spécialiste sécurité'
    ]
  }

  const handleDownloadPDF = () => {
    // Télécharger le PDF TCS
    const link = document.createElement('a');
    link.href = '/procedures/TCS.pdf';
    link.download = 'TCS_IRATNI_Hocine.pdf';
    link.click();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-red-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-3 sm:px-4">
          <div className="text-center">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
              {tcsInfo.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              {tcsInfo.description}
            </p>
            
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center items-center mb-6 sm:mb-8">
              <Badge variant="secondary" className="bg-red-100 text-red-800 px-3 py-2 sm:px-4">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-sm sm:text-base">{tcsInfo.duration}</span>
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800 px-3 py-2 sm:px-4">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-sm sm:text-base">{tcsInfo.level}</span>
              </Badge>
            </div>

            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-200 w-full sm:w-auto max-w-md sm:max-w-none"
              onClick={handleDownloadPDF}
            >
              <Download className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Télécharger le tableau de compétences</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections - Mobile Optimized */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Objectifs - Mobile Optimized */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-600" />
                  Objectifs de formation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tcsInfo.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm sm:text-base">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Compétences - Mobile Optimized */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-600" />
                  Compétences développées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                  {tcsInfo.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-red-200 text-red-700 justify-center py-2 text-xs sm:text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Débouchés */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Débouchés professionnels
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tcsInfo.opportunities.map((opportunity, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{opportunity}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}