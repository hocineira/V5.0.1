import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Calendar, Award, Loader2, Shield, Server, Network } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePortfolioData } from '../hooks/usePortfolioData';

const AboutPage = () => {
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
          <p className="text-xl text-gray-300">Chargement des informations...</p>
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

  const { personalInfo, education, certifications } = data;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
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
        <div className="absolute top-60 left-1/2 animate-float delay-3000">
          <Shield className="w-7 h-7 text-green-400/30 animate-tech-glow" />
        </div>
        <div className="absolute bottom-60 right-10 animate-float delay-4000">
          <Server className="w-9 h-9 text-pink-400/30 animate-tech-glow" />
        </div>
      </div>
      
      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-16 h-16 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-cyan-500/10 rounded-full animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-30 container mx-auto px-4 py-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              À propos de moi
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez mon parcours, mes formations et mes objectifs professionnels
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Profile Section */}
            <div className="space-y-8">
              <Card className="shadow-xl border-0 dark-glass-effect neon-border">
                <CardHeader className="text-center pb-8">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-6 border-4 border-blue-400 shadow-lg animate-pulse-glow">
                      <AvatarImage src={personalInfo?.avatar} alt={personalInfo?.name} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {personalInfo?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl font-bold text-white neon-text">{personalInfo?.name}</CardTitle>
                    <CardDescription className="text-lg text-cyan-300 font-medium">{personalInfo?.title}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {personalInfo?.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span>{personalInfo?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone className="w-5 h-5 text-blue-400" />
                      <span>{personalInfo?.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span>{personalInfo?.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-6">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="hover:bg-blue-50 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                      onClick={() => window.open(personalInfo?.social?.github, '_blank')}
                    >
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="hover:bg-blue-50 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                      onClick={() => window.open(personalInfo?.social?.linkedin, '_blank')}
                    >
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="hover:bg-blue-50 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                      onClick={() => window.open(personalInfo?.social?.email, '_blank')}
                    >
                      <Mail className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Education & Certifications */}
            <div className="space-y-8">
              <Card className="shadow-xl border-0 dark-glass-effect neon-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-400" />
                    Formation
                  </CardTitle>
                  <CardDescription className="text-gray-300">Mon parcours académique</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {education?.map((edu, index) => (
                      <div key={edu.id || index} className="border-l-4 border-blue-400 pl-6 relative">
                        <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-2 top-2 animate-pulse"></div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">{edu.period}</span>
                        </div>
                        <h3 className="font-semibold text-lg text-white">{edu.degree}</h3>
                        <p className="text-blue-300 font-medium">{edu.institution || edu.school}</p>
                        <p className="text-gray-300 mt-2">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 dark-glass-effect neon-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-purple-400" />
                    Certifications
                  </CardTitle>
                  <CardDescription className="text-gray-300">Mes certifications professionnelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 gap-4">
                    {certifications?.map((cert, index) => (
                      <div key={cert.id || index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-purple-400 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{cert.name}</h3>
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400">
                            {cert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{cert.issuer}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{cert.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;