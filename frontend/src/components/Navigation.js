import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Download, FileText, BookOpen, FolderOpen, Search, Home } from 'lucide-react';
import { Button } from './ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      path: '/', 
      label: 'Accueil', 
      icon: Home,
      description: 'Page d\'accueil du portfolio'
    },
    { 
      path: '/about', 
      label: 'À propos', 
      icon: FileText,
      description: 'Mon parcours et mes informations'
    },
    { 
      path: '/skills', 
      label: 'Compétences', 
      icon: BookOpen,
      description: 'Mes compétences techniques'
    },
    { 
      path: '/projects', 
      label: 'Projets', 
      icon: FolderOpen,
      description: 'Mes réalisations et projets'
    },
    { 
      path: '/experience', 
      label: 'Expérience', 
      icon: BookOpen,
      description: 'Mon parcours professionnel'
    },
    { 
      path: '/contact', 
      label: 'Contact', 
      icon: Search,
      description: 'Me contacter'
    },
    { 
      path: '/tcs', 
      label: 'TCS', 
      icon: FileText,
      description: 'Tableaux de Compétences et Savoirs'
    },
    { 
      path: '/bts-sio', 
      label: 'BTS SIO', 
      icon: BookOpen,
      description: 'Présentation de la formation'
    },
    { 
      path: '/projets-scolaires', 
      label: 'Projets Scolaires', 
      icon: FolderOpen,
      description: 'Procédures et documentations'
    },
    { 
      path: '/veille', 
      label: 'Veille', 
      icon: Search,
      description: 'Veille technologique et juridique'
    }
  ];

  const isCurrentPage = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div 
              className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              Hocine IRATNI
            </div>
            
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                      isCurrentPage(item.path) ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              CV
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div 
              className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              Hocine IRATNI
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 hover:bg-blue-50 ${
                        isCurrentPage(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger CV
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16"></div>
    </>
  );
};

export default Navigation;