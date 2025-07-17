import React from 'react';
import { Server, Code, Network, Shield, Users, Laptop, Database, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const BTSSIOPage = () => {
  const sisrSkills = [
    "Administration système Windows/Linux",
    "Gestion des réseaux informatiques",
    "Sécurité des systèmes d'information",
    "Virtualisation (VMware, Hyper-V)",
    "Surveillance et monitoring",
    "Support technique utilisateurs",
    "Gestion de parc informatique",
    "Sauvegarde et restauration"
  ];

  const slamSkills = [
    "Développement d'applications web",
    "Programmation orientée objet",
    "Bases de données relationnelles",
    "Frameworks de développement",
    "Tests et débogage",
    "Méthodes agiles",
    "Analyse et conception",
    "Maintenance applicative"
  ];

  const commonModules = [
    {
      name: "Culture générale et expression",
      description: "Développement des compétences rédactionnelles et de communication"
    },
    {
      name: "Anglais",
      description: "Anglais technique et professionnel dans le domaine informatique"
    },
    {
      name: "Mathématiques",
      description: "Mathématiques appliquées à l'informatique et aux réseaux"
    },
    {
      name: "Économie, management et droit",
      description: "Contexte économique et juridique des organisations"
    }
  ];

  const sisrModules = [
    {
      name: "Support et mise à disposition de services informatiques",
      description: "Gestion du patrimoine informatique et support aux utilisateurs"
    },
    {
      name: "Cybersécurité des services informatiques",
      description: "Sécurisation des accès et protection des données"
    },
    {
      name: "Conception et maintenance de solutions d'infrastructure",
      description: "Architecture réseau et administration système"
    },
    {
      name: "Exploitation et supervision d'infrastructures",
      description: "Monitoring et optimisation des performances"
    }
  ];

  const slamModules = [
    {
      name: "Développement d'applications informatiques",
      description: "Conception et programmation d'applications métier"
    },
    {
      name: "Gestion de données",
      description: "Modélisation et administration de bases de données"
    },
    {
      name: "Intégration et déploiement",
      description: "Mise en production et maintenance d'applications"
    },
    {
      name: "Veille technologique",
      description: "Suivi des évolutions technologiques et méthodologiques"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BTS SIO - Services Informatiques aux Organisations
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Le BTS SIO forme des techniciens supérieurs capables de participer à la production et 
            à la fourniture de services informatiques aux organisations en respectant les normes 
            et les contrats de service.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="sisr">Option SISR</TabsTrigger>
              <TabsTrigger value="slam">Option SLAM</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Server className="w-8 h-8 text-blue-600" />
                      SISR - Solutions d'Infrastructure, Systèmes et Réseaux
                    </CardTitle>
                    <CardDescription className="text-base">
                      Spécialisation dans l'installation, l'intégration et l'administration d'infrastructures réseau
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Network className="w-5 h-5 text-blue-500" />
                        <span>Administration des réseaux</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span>Sécurité des systèmes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span>Support technique</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Laptop className="w-5 h-5 text-blue-500" />
                        <span>Gestion de parc informatique</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Code className="w-8 h-8 text-purple-600" />
                      SLAM - Solutions Logicielles et Applications Métiers
                    </CardTitle>
                    <CardDescription className="text-base">
                      Spécialisation dans la conception et la maintenance de programmes applicatifs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Code className="w-5 h-5 text-purple-500" />
                        <span>Développement d'applications</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-purple-500" />
                        <span>Gestion de bases de données</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-purple-500" />
                        <span>Applications web</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-purple-500" />
                        <span>Analyse des besoins</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Modules communs aux deux options</CardTitle>
                  <CardDescription>
                    Enseignements généraux partagés par les deux spécialisations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {commonModules.map((module, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">{module.name}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sisr" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-blue-600">Option SISR</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  L'option SISR forme des spécialistes capables de participer à la production et 
                  à la fourniture de services en réalisant ou en adaptant des solutions d'infrastructure.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Compétences développées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sisrSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Débouchés professionnels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Technicien réseaux</Badge>
                        <Badge variant="secondary">Administrateur système</Badge>
                        <Badge variant="secondary">Support technique</Badge>
                        <Badge variant="secondary">Technicien sécurité</Badge>
                        <Badge variant="secondary">Gestionnaire de parc</Badge>
                        <Badge variant="secondary">Technicien d'infrastructure</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        Les diplômés peuvent également poursuivre leurs études en licence professionnelle 
                        ou en école d'ingénieurs spécialisée en informatique.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Modules spécialisés SISR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {sisrModules.map((module, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-blue-800 mb-2">{module.name}</h4>
                        <p className="text-sm text-blue-700">{module.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="slam" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-purple-600">Option SLAM</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  L'option SLAM forme des spécialistes capables de participer à la production et 
                  à la fourniture de services en développant des solutions logicielles et applications métiers.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Compétences développées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {slamSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Débouchés professionnels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Développeur d'applications</Badge>
                        <Badge variant="secondary">Programmeur analyste</Badge>
                        <Badge variant="secondary">Développeur web</Badge>
                        <Badge variant="secondary">Technicien d'études</Badge>
                        <Badge variant="secondary">Développeur mobile</Badge>
                        <Badge variant="secondary">Analyste programmeur</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        Les diplômés peuvent également poursuivre leurs études en licence professionnelle 
                        ou en école d'ingénieurs spécialisée en informatique.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Modules spécialisés SLAM</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {slamModules.map((module, index) => (
                      <div key={index} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-semibold text-purple-800 mb-2">{module.name}</h4>
                        <p className="text-sm text-purple-700">{module.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BTSSIOPage;