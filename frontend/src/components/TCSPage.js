import React from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const TCSPage = () => {
  const handleDownloadPDF = () => {
    // Redirect to PDF file
    window.open('/documents/TCS_Document.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableaux de Compétences et Savoirs (TCS)
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez mon tableau de compétences et savoirs détaillant mes aptitudes techniques et professionnelles 
            acquises durant ma formation BTS SIO SISR.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Document TCS Complet
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Tableau détaillé de mes compétences techniques et transversales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Contenu du document :</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Compétences techniques en systèmes et réseaux</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Savoirs associés et connaissances théoriques</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Niveaux d'acquisition et d'expertise</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Projets et réalisations associés</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Évolution et perspectives professionnelles</span>
                  </li>
                </ul>
              </div>

              <div className="text-center pt-6">
                <Button 
                  onClick={handleDownloadPDF}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Télécharger le document TCS
                </Button>
                <p className="text-sm text-gray-500 mt-3">
                  Format PDF - Dernière mise à jour : Janvier 2025
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  Domaine D1 - Support et mise à disposition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Compétences liées à l'installation, la configuration et le support des équipements informatiques.
                </p>
                <div className="text-sm text-gray-500">
                  • Gestion du patrimoine informatique<br/>
                  • Support aux utilisateurs<br/>
                  • Maintenance préventive et corrective
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  Domaine D2 - Cybersécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Maîtrise des aspects sécuritaires des systèmes d'information et des réseaux.
                </p>
                <div className="text-sm text-gray-500">
                  • Sécurisation des accès<br/>
                  • Analyse des vulnérabilités<br/>
                  • Mise en place de politiques de sécurité
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  Domaine D3 - Réseaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Conception, installation et administration d'infrastructures réseau.
                </p>
                <div className="text-sm text-gray-500">
                  • Architecture réseau<br/>
                  • Protocoles de communication<br/>
                  • Administration d'équipements réseau
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  Domaine D4 - Développement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Compétences en programmation et automatisation pour l'administration système.
                </p>
                <div className="text-sm text-gray-500">
                  • Scripts d'automatisation<br/>
                  • Outils de monitoring<br/>
                  • Développement d'applications métier
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TCSPage;