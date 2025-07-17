import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Calendar, Code, Server, Shield, Loader2, Eye, Star, BookOpen, Search, Filter, Tag, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { portfolioApi } from '../services/api';

const ProjectsPage = () => {
  const { data, loading, error } = usePortfolioData();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [procedures, setProcedures] = useState([]);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [procedureCategory, setProcedureCategory] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Système', label: 'Système' },
    { value: 'Réseau', label: 'Réseau' },
    { value: 'Sécurité', label: 'Sécurité' },
    { value: 'Virtualisation', label: 'Virtualisation' },
    { value: 'Base de données', label: 'Base de données' },
    { value: 'Développement', label: 'Développement' },
    { value: 'Autre', label: 'Autre' }
  ];

  useEffect(() => {
    setIsVisible(true);
    fetchProcedures();
  }, []);

  useEffect(() => {
    filterProcedures();
  }, [procedures, searchTerm, procedureCategory]);

  const fetchProcedures = async () => {
    try {
      const response = await portfolioApi.getProcedures();
      setProcedures(response.data);
    } catch (error) {
      console.error('Error fetching procedures:', error);
    }
  };

  const filterProcedures = () => {
    let filtered = procedures;

    if (searchTerm) {
      filtered = filtered.filter(procedure =>
        procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        procedure.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        procedure.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (procedureCategory !== 'all') {
      filtered = filtered.filter(procedure => procedure.category === procedureCategory);
    }

    setFilteredProcedures(filtered);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Système': return <Code className="w-5 h-5" />;
      case 'Réseau': return <Server className="w-5 h-5" />;
      case 'Sécurité': return <Shield className="w-5 h-5" />;
      case 'Virtualisation': return <BookOpen className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Système': return 'bg-blue-500/20 text-blue-300 border-blue-400';
      case 'Réseau': return 'bg-green-500/20 text-green-300 border-green-400';
      case 'Sécurité': return 'bg-red-500/20 text-red-300 border-red-400';
      case 'Virtualisation': return 'bg-purple-500/20 text-purple-300 border-purple-400';
      case 'Base de données': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'Développement': return 'bg-indigo-500/20 text-indigo-300 border-indigo-400';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  const openViewModal = (procedure) => {
    setSelectedProcedure(procedure);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-xl text-gray-300">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ Erreur</div>
          <p className="text-gray-300">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const { projects } = data;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'terminé':
        return 'bg-green-500/20 text-green-300 border-green-400';
      case 'in_progress':
      case 'en_cours':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'planning':
      case 'planification':
        return 'bg-blue-500/20 text-blue-300 border-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'planning':
        return 'Planification';
      default:
        return status;
    }
  };

  const getTechIcon = (tech) => {
    switch (tech.toLowerCase()) {
      case 'react':
      case 'javascript':
      case 'js':
        return <Code className="w-4 h-4 text-blue-400" />;
      case 'node':
      case 'nodejs':
      case 'express':
        return <Server className="w-4 h-4 text-green-400" />;
      case 'python':
      case 'django':
      case 'flask':
        return <Code className="w-4 h-4 text-yellow-400" />;
      default:
        return <Code className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get unique categories
  const projectCategories = ['all', ...new Set(projects?.map(p => p.category).filter(Boolean))];

  // Filter projects by category
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects?.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with cybersecurity theme */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxjeWJlcnNlY3VyaXR5fGVufDB8fHx8MTc1Mjc3NDk5N3ww&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 tech-grid-bg opacity-20 z-10"></div>
      
      <div className="relative z-20 container mx-auto px-4 py-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mes Projets
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez mes réalisations techniques et projets développés au cours de ma formation et de mes expériences
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50 border border-gray-700">
                <TabsTrigger value="projects" className="flex items-center gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                  <Code className="w-4 h-4" />
                  Projets Techniques
                </TabsTrigger>
                <TabsTrigger value="procedures" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                  <FileText className="w-4 h-4" />
                  Procédures & Documentation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-8">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {projectCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category === 'all' ? 'Tous' : category}
                    </Button>
                  ))}
                </div>

                {/* Projects Grid */}
                {filteredProjects?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Projets à venir</h3>
                    <p className="text-gray-400">Cette section sera bientôt mise à jour avec mes projets.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects?.map((project, index) => (
                      <Card key={project.id || index} className="group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 dark-glass-effect neon-border">
                        {/* Project Image */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-500/30 to-purple-600/30 overflow-hidden rounded-t-lg">
                          {project.image ? (
                            <img 
                              src={project.image} 
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-400">
                              <Code className="w-16 h-16 opacity-50" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusLabel(project.status)}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-lg line-clamp-1 text-white">{project.title}</CardTitle>
                            {project.featured && (
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            )}
                          </div>
                          <CardDescription className="line-clamp-2 text-sm text-gray-300">
                            {project.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Technologies */}
                          <div>
                            <p className="text-sm font-medium text-gray-300 mb-2">Technologies</p>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                                <Badge key={techIndex} variant="secondary" className="text-xs flex items-center gap-1 bg-gray-700/50 text-gray-300">
                                  {getTechIcon(tech)}
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies?.length > 3 && (
                                <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300">
                                  +{project.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Project Details */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{project.date || 'Date non spécifiée'}</span>
                            </div>
                            {project.category && (
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                                  {project.category}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-4">
                            {project.github && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                                onClick={() => window.open(project.github, '_blank')}
                              >
                                <Github className="w-4 h-4 mr-1" />
                                Code
                              </Button>
                            )}
                            {project.demo && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                                onClick={() => window.open(project.demo, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Demo
                              </Button>
                            )}
                            {!project.github && !project.demo && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 border-gray-600 text-gray-400"
                                disabled
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Voir plus
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="procedures" className="space-y-8">
                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-1 gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher une procédure..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <Select value={procedureCategory} onValueChange={setProcedureCategory}>
                      <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-700">
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Procedures Grid */}
                {filteredProcedures.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      {searchTerm || procedureCategory !== 'all' ? 'Aucune procédure trouvée' : 'Aucune procédure disponible'}
                    </h3>
                    <p className="text-gray-400">
                      {searchTerm || procedureCategory !== 'all' 
                        ? 'Essayez de modifier vos critères de recherche'
                        : 'Les procédures seront bientôt disponibles'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProcedures.map((procedure) => (
                      <Card key={procedure.id} className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 dark-glass-effect neon-border">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg ${getCategoryColor(procedure.category)}`}>
                              {getCategoryIcon(procedure.category)}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewModal(procedure)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <CardTitle className="text-lg line-clamp-2 text-white">{procedure.title}</CardTitle>
                          <CardDescription className="line-clamp-2 text-gray-300">{procedure.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(procedure.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Tag className="w-4 h-4 text-gray-400" />
                              <Badge variant="secondary" className={getCategoryColor(procedure.category)}>
                                {procedure.category}
                              </Badge>
                            </div>
                            {procedure.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {procedure.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                    {tag}
                                  </Badge>
                                ))}
                                {procedure.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                                    +{procedure.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto dark-glass-effect neon-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Intéressé par mes projets ?
                </h3>
                <p className="text-gray-300 mb-6">
                  N'hésitez pas à me contacter pour discuter de mes réalisations ou d'une éventuelle collaboration.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Me contacter
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">{selectedProcedure?.title}</DialogTitle>
          </DialogHeader>
          {selectedProcedure && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge className={getCategoryColor(selectedProcedure.category)}>
                  {selectedProcedure.category}
                </Badge>
                <span className="text-sm text-gray-400">
                  Créé le {new Date(selectedProcedure.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <p className="text-gray-300">{selectedProcedure.description}</p>
              
              {selectedProcedure.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-white">Tags :</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProcedure.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-3 text-white">Contenu de la procédure :</h4>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                    {selectedProcedure.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;