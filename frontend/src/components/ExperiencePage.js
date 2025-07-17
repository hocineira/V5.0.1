import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building, Award, Briefcase, Loader2, Clock, CheckCircle, Shield, Server, Network } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-xl text-gray-300">Chargement des expériences...</p>
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

  const { experience } = data;

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'stage':
      case 'internship':
        return 'bg-blue-500/20 text-blue-300 border-blue-400';
      case 'emploi':
      case 'job':
        return 'bg-green-500/20 text-green-300 border-green-400';
      case 'freelance':
        return 'bg-purple-500/20 text-purple-300 border-purple-400';
      case 'bénévolat':
      case 'volunteer':
        return 'bg-orange-500/20 text-orange-300 border-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'stage':
      case 'internship':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'emploi':
      case 'job':
        return <Briefcase className="w-5 h-5 text-green-400" />;
      case 'freelance':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'bénévolat':
      case 'volunteer':
        return <CheckCircle className="w-5 h-5 text-orange-400" />;
      default:
        return <Briefcase className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Server Room Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.9)), url('https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 tech-grid-bg opacity-20 z-10"></div>
      
      {/* Floating Tech Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <div className="absolute top-20 left-10 animate-float">
          <Shield className="w-8 h-8 text-blue-400/30 animate-tech-glow" />
        </div>
        <div className="absolute top-40 right-20 animate-float delay-1000">
          <Server className="w-6 h-6 text-purple-400/30 animate-tech-glow" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float delay-2000">
          <Network className="w-10 h-10 text-cyan-400/30 animate-tech-glow" />
        </div>
      </div>
      
      <div className="relative z-30 container mx-auto px-4 py-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mon Expérience
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez mon parcours professionnel et les expériences qui ont façonné mes compétences
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {experience?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Début de parcours</h3>
                <p className="text-gray-400">Mon parcours professionnel commence avec ma formation BTS SIO.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-400 to-purple-400 hidden md:block"></div>
                
                <div className="space-y-8">
                  {experience?.map((exp, index) => (
                    <div key={exp.id || index} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-8 w-4 h-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full border-4 border-gray-900 shadow-lg animate-pulse-glow hidden md:block"></div>
                      
                      <Card className="md:ml-16 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 dark-glass-effect neon-border">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(exp.type)}
                              <Badge className={getTypeColor(exp.type)}>
                                {exp.type || 'Stage'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{exp.period}</span>
                            </div>
                          </div>
                          
                          <CardTitle className="text-xl font-bold text-white">
                            {exp.position || exp.title}
                          </CardTitle>
                          
                          <CardDescription className="flex items-center gap-2 text-base text-gray-300">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-blue-300">{exp.company}</span>
                            {exp.location && (
                              <>
                                <span className="text-gray-500">•</span>
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{exp.location}</span>
                              </>
                            )}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-gray-300 leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                          
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-white mb-2">Réalisations principales :</h4>
                              <ul className="space-y-1">
                                {exp.achievements.map((achievement, achIndex) => (
                                  <li key={achIndex} className="flex items-start gap-2 text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-white mb-2">Responsabilités :</h4>
                              <ul className="space-y-1">
                                {exp.responsibilities.map((responsibility, resIndex) => (
                                  <li key={resIndex} className="flex items-start gap-2 text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{responsibility}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-white mb-2">Technologies utilisées :</h4>
                              <div className="flex flex-wrap gap-2">
                                {exp.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} variant="secondary" className="text-xs bg-gray-700/50 text-gray-300">
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
            <Card className="dark-glass-effect neon-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-blue-400" />
                  Compétences acquises
                </CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  Ce que j'ai appris au travers de mes expériences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-800/50 rounded-lg shadow-sm border border-gray-700">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400">
                      <Briefcase className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Professionnalisme</h3>
                    <p className="text-sm text-gray-300">
                      Rigueur, ponctualité et respect des délais dans un environnement professionnel
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-800/50 rounded-lg shadow-sm border border-gray-700">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-400">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Résolution de problèmes</h3>
                    <p className="text-sm text-gray-300">
                      Capacité à analyser et résoudre des problèmes techniques complexes
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-800/50 rounded-lg shadow-sm border border-gray-700">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-400">
                      <Award className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Travail en équipe</h3>
                    <p className="text-sm text-gray-300">
                      Collaboration efficace avec des équipes multidisciplinaires
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto dark-glass-effect neon-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Prêt pour de nouveaux défis
                </h3>
                <p className="text-gray-300 mb-6">
                  Fort de ces expériences, je suis motivé pour contribuer à de nouveaux projets et continuer à apprendre.
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
    </div>
  );
};

export default ExperiencePage;
export default ExperiencePage;