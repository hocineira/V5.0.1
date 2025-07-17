import React, { useState, useEffect } from 'react';
import { Monitor, Scale, Calendar, Search, Filter, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { portfolioApi } from '../services/api';

const VeillePage = () => {
  const [veilleContent, setVeilleContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('technologique');

  useEffect(() => {
    fetchVeilleContent();
  }, []);

  const fetchVeilleContent = async () => {
    try {
      setLoading(true);
      const response = await portfolioApi.getVeilleContent();
      setVeilleContent(response.data);
    } catch (error) {
      console.error('Error fetching veille content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = veilleContent.filter(item => 
    item.type === activeTab &&
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement des contenus de veille...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
      
      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 tech-grid-bg opacity-20 z-10"></div>
      
      {/* Floating elements for tech theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-cyan-500/10 rounded-full animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-30 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Veille Technologique et Juridique
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Dans le domaine des systèmes et réseaux, la veille technologique et juridique est essentielle 
            pour rester informé des évolutions, innovations et réglementations qui impactent notre secteur.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="technologique" className="flex items-center gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                <Monitor className="w-4 h-4" />
                Veille Technologique
              </TabsTrigger>
              <TabsTrigger value="juridique" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                <Scale className="w-4 h-4" />
                Veille Juridique
              </TabsTrigger>
            </TabsList>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans le contenu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <TabsContent value="technologique" className="space-y-8">
              <div className="grid gap-8">
                {filteredContent.length === 0 ? (
                  <div className="text-center py-12">
                    <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {searchTerm ? 'Aucun contenu trouvé' : 'Aucun contenu technologique disponible'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Essayez de modifier votre recherche' : 'Les contenus de veille technologique seront bientôt disponibles'}
                    </p>
                  </div>
                ) : (
                  filteredContent.map((item) => (
                    <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Monitor className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl text-gray-800">{item.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-500">
                                  {new Date(item.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            Technologique
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="prose max-w-none">
                          {formatContent(item.content)}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Additional Technology Topics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-white" />
                      </div>
                      Cloud Computing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      Évolution des services cloud, nouvelles plateformes et impact sur l'infrastructure IT.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-white" />
                      </div>
                      Virtualisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      Nouvelles technologies de virtualisation et optimisation des ressources.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-white" />
                      </div>
                      Cybersécurité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      Nouvelles menaces, outils de protection et bonnes pratiques sécuritaires.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="juridique" className="space-y-8">
              <div className="grid gap-8">
                {filteredContent.length === 0 ? (
                  <div className="text-center py-12">
                    <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {searchTerm ? 'Aucun contenu trouvé' : 'Aucun contenu juridique disponible'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Essayez de modifier votre recherche' : 'Les contenus de veille juridique seront bientôt disponibles'}
                    </p>
                  </div>
                ) : (
                  filteredContent.map((item) => (
                    <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Scale className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl text-gray-800">{item.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-500">
                                  {new Date(item.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">
                            Juridique
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="prose max-w-none">
                          {formatContent(item.content)}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Additional Legal Topics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Scale className="w-4 h-4 text-white" />
                      </div>
                      Conformité RGPD
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      Mise en conformité, obligations légales et bonnes pratiques pour la protection des données.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Scale className="w-4 h-4 text-white" />
                      </div>
                      Cybersécurité et Droit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      Aspects légaux de la cybersécurité, responsabilités et obligations des entreprises.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Scale className="w-4 h-4 text-white" />
                      </div>
                      Propriété Intellectuelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      Droits d'auteur, brevets et protection de la propriété intellectuelle dans l'IT.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VeillePage;