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
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              {tcsInfo.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {tcsInfo.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Badge variant="secondary" className="bg-red-100 text-red-800 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                {tcsInfo.duration}
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800 px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                {tcsInfo.level}
              </Badge>
            </div>

            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              onClick={handleDownloadPDF}
            >
              <Download className="mr-2 w-5 h-5" />
              Télécharger le tableau de compétences
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Objectifs */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-red-600" />
                  Objectifs de formation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tcsInfo.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Compétences */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-red-600" />
                  Compétences développées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {tcsInfo.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-red-200 text-red-700 justify-center py-2">
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