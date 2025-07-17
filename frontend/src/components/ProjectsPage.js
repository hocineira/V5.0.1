import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Calendar, Code, Server, Shield, Loader2, Eye, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { usePortfolioData } from '../hooks/usePortfolioData';

const ProjectsPage = () => {
  const { data, loading, error } = usePortfolioData();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Erreur</div>
          <p className="text-gray-600">{error}</p>
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
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'en_cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'planning':
      case 'planification':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'node':
      case 'nodejs':
      case 'express':
        return <Server className="w-4 h-4 text-green-500" />;
      case 'python':
      case 'django':
      case 'flask':
        return <Code className="w-4 h-4 text-yellow-500" />;
      default:
        return <Code className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(projects?.map(p => p.category).filter(Boolean))];

  // Filter projects by category
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects?.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mes Projets
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez mes réalisations techniques et projets développés au cours de ma formation et de mes expériences
            </p>
          </div>

          {/* Category Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
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
          </div>

          {/* Projects Grid */}
          <div className="max-w-6xl mx-auto">
            {filteredProjects?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Projets à venir</h3>
                <p className="text-gray-500">Cette section sera bientôt mise à jour avec mes projets.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects?.map((project, index) => (
                  <Card key={project.id || index} className="group shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                    {/* Project Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
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
                        <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                        {project.featured && (
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <CardDescription className="line-clamp-2 text-sm">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Technologies */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Technologies</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs flex items-center gap-1">
                              {getTechIcon(tech)}
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{project.date || 'Date non spécifiée'}</span>
                        </div>
                        {project.category && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Badge variant="outline" className="text-xs">
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
                            className="flex-1"
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
                            className="flex-1"
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
                            className="flex-1"
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
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Intéressé par mes projets ?
                </h3>
                <p className="text-gray-600 mb-6">
                  N'hésitez pas à me contacter pour discuter de mes réalisations ou d'une éventuelle collaboration.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Me contacter
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline">
                      Voir mon CV
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;