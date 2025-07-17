import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hocine IRATNI
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"></div>
            <p className="text-2xl text-gray-600 mb-8">
              Étudiant en BTS SIO SISR
            </p>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Bienvenue sur mon portfolio professionnel. Découvrez mon parcours, mes compétences et mes projets 
              dans le domaine des systèmes et réseaux informatiques.
            </p>
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
              <Link to="/tcs">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Tableaux de Compétences
                </Button>
              </Link>
              <Link to="/projets-scolaires">
                <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
                  Projets Scolaires
                </Button>
              </Link>
              <Link to="/veille">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Veille Technologique
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