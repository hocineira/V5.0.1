import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePortfolioData } from '../hooks/usePortfolioData';

const ContactPage = () => {
  const { data, loading, error, submitContactMessage } = usePortfolioData();
  const [isVisible, setIsVisible] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Optimized form handlers with useCallback
  const handleContactChange = useCallback((field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNameChange = useCallback((e) => {
    handleContactChange('name', e.target.value);
  }, [handleContactChange]);

  const handleEmailChange = useCallback((e) => {
    handleContactChange('email', e.target.value);
  }, [handleContactChange]);

  const handleMessageChange = useCallback((e) => {
    handleContactChange('message', e.target.value);
  }, [handleContactChange]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      return;
    }

    setIsSubmitting(true);
    const success = await submitContactMessage(contactForm);
    if (success) {
      setContactForm({ name: '', email: '', message: '' });
    }
    setIsSubmitting(false);
  };

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

  const { personalInfo, testimonials } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-white">
              Contactez-moi
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Une question, un projet, ou simplement envie d'échanger ? N'hésitez pas à me contacter !
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Mes coordonnées</CardTitle>
                  <CardDescription className="text-gray-300">
                    Plusieurs moyens de me joindre
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-gray-300">{personalInfo?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Téléphone</p>
                      <p className="text-gray-300">{personalInfo?.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Localisation</p>
                      <p className="text-gray-300">{personalInfo?.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Réseaux sociaux</CardTitle>
                  <CardDescription className="text-gray-300">
                    Retrouvez-moi sur les réseaux
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => window.open(personalInfo?.social?.github, '_blank')}
                    >
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => window.open(personalInfo?.social?.linkedin, '_blank')}
                    >
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => window.open(personalInfo?.social?.email, '_blank')}
                    >
                      <Mail className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Envoyez-moi un message</CardTitle>
                  <CardDescription className="text-gray-300">
                    Je vous répondrai dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Nom complet</label>
                      <input 
                        type="text" 
                        value={contactForm.name}
                        onChange={handleNameChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Adresse email</label>
                      <input 
                        type="email" 
                        value={contactForm.email}
                        onChange={handleEmailChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Message</label>
                      <textarea 
                        rows={6}
                        value={contactForm.message}
                        onChange={handleMessageChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Décrivez votre projet ou votre message..."
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonials */}
          {testimonials && testimonials.length > 0 && (
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Témoignages</h2>
                <p className="text-gray-300">Ce que disent les personnes qui ont travaillé avec moi</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <Card key={testimonial.id || index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <p className="text-gray-200 mb-4 italic">"{testimonial.content}"</p>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">{testimonial.name}</p>
                          <p className="text-sm text-gray-300">{testimonial.role}</p>
                          <p className="text-sm text-gray-400">{testimonial.company}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;