import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building, Award, Briefcase, Loader2, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { usePortfolioData } from '../hooks/usePortfolioData';

const ExperiencePage = () => {
  const { data, loading, error } = usePortfolioData();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement des expériences...</p>
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

  const { experience } = data;

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'stage':
      case 'internship':
        return 'bg-blue-100 text-blue-800';
      case 'emploi':
      case 'job':
        return 'bg-green-100 text-green-800';
      case 'freelance':
        return 'bg-purple-100 text-purple-800';
      case 'bénévolat':
      case 'volunteer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'stage':
      case 'internship':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'emploi':
      case 'job':
        return <Briefcase className="w-5 h-5 text-green-500" />;
      case 'freelance':
        return <Award className="w-5 h-5 text-purple-500" />;
      case 'bénévolat':
      case 'volunteer':
        return <CheckCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Briefcase className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mon Expérience
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez mon parcours professionnel et les expériences qui ont façonné mes compétences
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {experience?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Début de parcours</h3>
                <p className="text-gray-500">Mon parcours professionnel commence avec ma formation BTS SIO.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 hidden md:block"></div>
                
                <div className="space-y-8">
                  {experience?.map((exp, index) => (
                    <div key={exp.id || index} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-8 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg hidden md:block"></div>
                      
                      <Card className="md:ml-16 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(exp.type)}
                              <Badge className={getTypeColor(exp.type)}>
                                {exp.type || 'Expérience'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{exp.period}</span>
                            </div>
                          </div>
                          
                          <CardTitle className="text-xl font-bold text-gray-800">
                            {exp.position}
                          </CardTitle>
                          
                          <CardDescription className="flex items-center gap-2 text-base">
                            <Building className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-blue-600">{exp.company}</span>
                            {exp.location && (
                              <>
                                <span className="text-gray-400">•</span>
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">{exp.location}</span>
                              </>
                            )}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-gray-700 leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                          
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Réalisations principales :</h4>
                              <ul className="space-y-1">
                                {exp.achievements.map((achievement, achIndex) => (
                                  <li key={achIndex} className="flex items-start gap-2 text-gray-700">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Technologies utilisées :</h4>
                              <div className="flex flex-wrap gap-2">
                                {exp.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} variant="secondary" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills acquired section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-blue-500" />
                  Compétences acquises
                </CardTitle>
                <CardDescription className="text-lg">
                  Ce que j'ai appris au travers de mes expériences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Professionnalisme</h3>
                    <p className="text-sm text-gray-600">
                      Rigueur, ponctualité et respect des délais dans un environnement professionnel
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Résolution de problèmes</h3>
                    <p className="text-sm text-gray-600">
                      Capacité à analyser et résoudre des problèmes techniques complexes
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Travail en équipe</h3>
                    <p className="text-sm text-gray-600">
                      Collaboration efficace avec des équipes multidisciplinaires
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Prêt pour de nouveaux défis
                </h3>
                <p className="text-gray-600 mb-6">
                  Fort de ces expériences, je suis motivé pour contribuer à de nouveaux projets et continuer à apprendre.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Me contacter
                  </Button>
                  <Button variant="outline">
                    Télécharger mon CV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;