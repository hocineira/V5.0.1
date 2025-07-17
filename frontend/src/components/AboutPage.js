import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Download, Github, Linkedin, Calendar, Award, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement des informations...</p>
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

  const { personalInfo, education, certifications } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              À propos de moi
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez mon parcours, mes formations et mes objectifs professionnels
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Profile Section */}
            <div className="space-y-8">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-6 border-4 border-white shadow-lg">
                      <AvatarImage src={personalInfo?.avatar} alt={personalInfo?.name} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {personalInfo?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl font-bold text-gray-800">{personalInfo?.name}</CardTitle>
                    <CardDescription className="text-lg text-blue-600 font-medium">{personalInfo?.title}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {personalInfo?.bio}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <span>{personalInfo?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <span>{personalInfo?.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span>{personalInfo?.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-6">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="hover:bg-blue-50"
                      onClick={() => window.open(personalInfo?.social?.github, '_blank')}
                    >
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="hover:bg-blue-50"
                      onClick={() => window.open(personalInfo?.social?.linkedin, '_blank')}
                    >
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="hover:bg-blue-50"
                      onClick={() => window.open(personalInfo?.social?.email, '_blank')}
                    >
                      <Mail className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="text-center pt-6">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger mon CV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Education & Certifications */}
            <div className="space-y-8">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-500" />
                    Formation
                  </CardTitle>
                  <CardDescription>Mon parcours académique</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {education?.map((edu, index) => (
                      <div key={edu.id || index} className="border-l-4 border-blue-500 pl-6 relative">
                        <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-2 top-2"></div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{edu.period}</span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">{edu.degree}</h3>
                        <p className="text-blue-600 font-medium">{edu.institution}</p>
                        <p className="text-gray-600 mt-2">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Award className="w-6 h-6 text-purple-500" />
                    Certifications
                  </CardTitle>
                  <CardDescription>Mes certifications professionnelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 gap-4">
                    {certifications?.map((cert, index) => (
                      <div key={cert.id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                          <Badge variant="secondary">{cert.level}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
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