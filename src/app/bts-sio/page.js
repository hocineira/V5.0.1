'use client'

import { useState } from 'react'
import { GraduationCap, Server, Code, Network, Shield, Database, Monitor, Globe } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function BTSSIOPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const btsInfo = {
    title: 'BTS SIO - Services Informatiques aux Organisations',
    description: 'Formation de niveau Bac+2 qui forme des techniciens supérieurs capables de gérer et maintenir les systèmes informatiques des entreprises.',
    duration: '2 ans',
    level: 'Niveau 5 (Bac+2)',
    options: {
      sisr: {
        name: 'SISR - Solutions d\'Infrastructure, Systèmes et Réseaux',
        description: 'Spécialisation dans l\'administration des systèmes et réseaux informatiques',
        skills: [
          'Administration Windows/Linux',
          'Gestion des réseaux',
          'Virtualisation',
          'Sécurité informatique',
          'Supervision et monitoring',
          'Support technique'
        ],
        jobs: [
          'Administrateur systèmes et réseaux',
          'Technicien infrastructure',
          'Responsable informatique',
          'Consultant en systèmes'
        ]
      },
      slam: {
        name: 'SLAM - Solutions Logicielles et Applications Métiers',
        description: 'Spécialisation dans le développement d\'applications et la programmation',
        skills: [
          'Développement web',
          'Programmation orientée objet',
          'Bases de données',
          'Frameworks modernes',
          'Gestion de projet',
          'Tests et débogage'
        ],
        jobs: [
          'Développeur web',
          'Analyste programmeur',
          'Développeur d\'applications',
          'Consultant en développement'
        ]
      }
    }
  }

  const commonSkills = [
    'Analyse des besoins',
    'Gestion de projet',
    'Support utilisateur',
    'Veille technologique',
    'Communication technique',
    'Maintenance informatique'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              {btsInfo.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              {btsInfo.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">
                {btsInfo.duration}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">
                {btsInfo.level}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Options Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Deux options de spécialisation
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="sisr">SISR</TabsTrigger>
              <TabsTrigger value="slam">SLAM</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-12">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">Option SISR</CardTitle>
                    <CardDescription className="text-lg">
                      Solutions d'Infrastructure, Systèmes et Réseaux
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      {btsInfo.options.sisr.description}
                    </p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setActiveTab('sisr')}
                    >
                      Découvrir SISR
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">Option SLAM</CardTitle>
                    <CardDescription className="text-lg">
                      Solutions Logicielles et Applications Métiers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      {btsInfo.options.slam.description}
                    </p>
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => setActiveTab('slam')}
                    >
                      Découvrir SLAM
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Compétences communes */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 text-center">
                    Compétences communes aux deux options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {commonSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-blue-200 text-blue-700 justify-center py-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sisr" className="space-y-12">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {btsInfo.options.sisr.name}
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {btsInfo.options.sisr.description}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 flex items-center">
                      <Shield className="w-6 h-6 mr-2 text-blue-600" />
                      Compétences SISR
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {btsInfo.options.sisr.skills.map((skill, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 flex items-center">
                      <Monitor className="w-6 h-6 mr-2 text-blue-600" />
                      Débouchés professionnels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {btsInfo.options.sisr.jobs.map((job, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 justify-center py-2">
                          {job}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="slam" className="space-y-12">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {btsInfo.options.slam.name}
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {btsInfo.options.slam.description}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 flex items-center">
                      <Database className="w-6 h-6 mr-2 text-indigo-600" />
                      Compétences SLAM
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {btsInfo.options.slam.skills.map((skill, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 flex items-center">
                      <Globe className="w-6 h-6 mr-2 text-indigo-600" />
                      Débouchés professionnels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {btsInfo.options.slam.jobs.map((job, index) => (
                        <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800 justify-center py-2">
                          {job}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}