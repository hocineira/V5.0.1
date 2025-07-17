import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone, Shield, Server, Network, Monitor, Code, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const HomePage = () => {
  const [animationVisible, setAnimationVisible] = useState(false);

  useEffect(() => {
    setAnimationVisible(true);
  }, []);

  // Animation des particules tech
  const TechParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse"></div>
      <div className="absolute top-1/4 -right-8 w-20 h-20 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 -left-8 w-12 h-12 bg-cyan-500/10 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-500/10 rounded-full animate-pulse delay-500"></div>
    </div>
  );

  // Icônes flottantes
  const FloatingIcons = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 animate-float">
        <Shield className="w-8 h-8 text-blue-500/20" />
      </div>
      <div className="absolute top-20 right-20 animate-float delay-1000">
        <Server className="w-6 h-6 text-purple-500/20" />
      </div>
      <div className="absolute bottom-20 left-20 animate-float delay-2000">
        <Network className="w-10 h-10 text-cyan-500/20" />
      </div>
      <div className="absolute bottom-10 right-10 animate-float delay-500">
        <Monitor className="w-7 h-7 text-green-500/20" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background with Network Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxuZXR3b3JrJTIwc3lzdGVtc3xlbnwwfHx8fDE3NTI3NzQ5NTZ8MA&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Tech Particles */}
      <TechParticles />
      <FloatingIcons />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${animationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-12">
                <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  Hocine IRATNI
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 mx-auto mb-8 animate-pulse"></div>
                <p className="text-2xl text-cyan-300 mb-8 font-semibold">
                  Étudiant en BTS SIO SISR
                </p>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Bienvenue sur mon portfolio professionnel. Découvrez mon parcours, mes compétences et mes projets 
                  dans le domaine des systèmes et réseaux informatiques.
                </p>
              </div>
              
              {/* Tech Skills Preview */}
              <div className="mb-16">
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/30">
                    <Network className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-sm">Réseaux</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30">
                    <Server className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 text-sm">Systèmes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-500/30">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 text-sm">Sécurité</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                    <Monitor className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm">Virtualisation</span>
                  </div>
                </div>
              </div>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <CardTitle className="text-lg">À propos</CardTitle>
                <CardDescription>Découvrez mon parcours et mes objectifs</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/about">
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    Découvrir <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <CardTitle className="text-lg">Compétences</CardTitle>
                <CardDescription>Mes compétences techniques et professionnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/skills">
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    Explorer <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <CardTitle className="text-lg">Projets</CardTitle>
                <CardDescription>Mes réalisations et projets techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/projects">
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    Voir <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <CardTitle className="text-lg">Expérience</CardTitle>
                <CardDescription>Mon parcours professionnel</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/experience">
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    Consulter <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <CardTitle className="text-lg">Formation</CardTitle>
                <CardDescription>BTS SIO - Systèmes et Réseaux</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/bts-sio">
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
                <CardDescription>Entrons en contact</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/contact">
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    Me contacter <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Accès rapide</h2>
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
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Retrouvez-moi sur :</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="icon" className="hover:bg-blue-50">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-blue-50">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-blue-50">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;