import React, { useState, useEffect } from 'react';
import { Code, Server, Shield, Users, Loader2, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { usePortfolioData } from '../hooks/usePortfolioData';

const SkillsPage = () => {
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
          <p className="text-xl text-gray-600">Chargement des compétences...</p>
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

  const { skills } = data;

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'développement':
      case 'development':
        return <Code className="w-6 h-6 text-blue-500" />;
      case 'système':
      case 'system':
        return <Server className="w-6 h-6 text-green-500" />;
      case 'sécurité':
      case 'security':
        return <Shield className="w-6 h-6 text-red-500" />;
      case 'soft skills':
        return <Users className="w-6 h-6 text-purple-500" />;
      default:
        return <Code className="w-6 h-6 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'développement':
      case 'development':
        return 'from-blue-500 to-blue-600';
      case 'système':
      case 'system':
        return 'from-green-500 to-green-600';
      case 'sécurité':
      case 'security':
        return 'from-red-500 to-red-600';
      case 'soft skills':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getProgressColor = (level) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 70) return 'bg-blue-500';
    if (level >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Group skills by category
  const skillsByCategory = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mes Compétences
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez mes compétences techniques et professionnelles acquises au cours de ma formation et de mes expériences
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue={Object.keys(skillsByCategory)[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                {Object.keys(skillsByCategory).map((category) => (
                  <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <TabsContent key={category} value={category} className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">{category}</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      {category === 'Développement' && "Technologies et langages de programmation maîtrisés"}
                      {category === 'Système' && "Administration système et gestion d'infrastructure"}
                      {category === 'Sécurité' && "Cybersécurité et protection des systèmes d'information"}
                      {category === 'Soft Skills' && "Compétences relationnelles et organisationnelles"}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorySkills.map((skill, index) => (
                      <Card key={skill.id || index} className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${getCategoryColor(category)}`}>
                              {getCategoryIcon(category)}
                            </div>
                            <Badge variant="secondary" className="text-sm">
                              {skill.level || 0}%
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{skill.name}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {skill.description || `Compétence en ${skill.name}`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Niveau</span>
                              <span className="font-semibold">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Débutant</span>
                              <span>Expert</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Skills Summary */}
            <div className="mt-16">
              <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <Award className="w-6 h-6 text-blue-500" />
                    Résumé de mes compétences
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Vue d'ensemble de mon expertise technique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
                      const avgLevel = categorySkills && categorySkills.length > 0 
                        ? categorySkills.reduce((sum, skill) => sum + (skill.level || 0), 0) / categorySkills.length 
                        : 0;
                      return (
                        <div key={category} className="text-center p-6 bg-white rounded-lg shadow-sm">
                          <div className="mb-4">
                            {getCategoryIcon(category)}
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-2">{category}</h3>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-blue-600">{Math.round(avgLevel)}%</div>
                            <Progress value={avgLevel} className="h-2" />
                            <p className="text-sm text-gray-600">{categorySkills?.length || 0} compétences</p>
                          </div>
                        </div>
                      );
                    })}
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

export default SkillsPage;