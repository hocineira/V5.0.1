import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, BookOpen, Code, Network, Shield, Calendar, Tag, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from '../hooks/use-toast';
import { portfolioApi } from '../services/api';

const ProjetScolairePage = () => {
  const [procedures, setProcedures] = useState([]);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: []
  });

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Système', label: 'Système' },
    { value: 'Réseau', label: 'Réseau' },
    { value: 'Sécurité', label: 'Sécurité' },
    { value: 'Virtualisation', label: 'Virtualisation' },
    { value: 'Base de données', label: 'Base de données' },
    { value: 'Développement', label: 'Développement' },
    { value: 'Autre', label: 'Autre' }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Système': return <Code className="w-5 h-5" />;
      case 'Réseau': return <Network className="w-5 h-5" />;
      case 'Sécurité': return <Shield className="w-5 h-5" />;
      case 'Virtualisation': return <BookOpen className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Système': return 'bg-blue-100 text-blue-800';
      case 'Réseau': return 'bg-green-100 text-green-800';
      case 'Sécurité': return 'bg-red-100 text-red-800';
      case 'Virtualisation': return 'bg-purple-100 text-purple-800';
      case 'Base de données': return 'bg-yellow-100 text-yellow-800';
      case 'Développement': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  useEffect(() => {
    filterProcedures();
  }, [procedures, searchTerm, selectedCategory]);

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const response = await portfolioApi.getProcedures();
      setProcedures(response.data);
    } catch (error) {
      console.error('Error fetching procedures:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les procédures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProcedures = () => {
    let filtered = procedures;

    if (searchTerm) {
      filtered = filtered.filter(procedure =>
        procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        procedure.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        procedure.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(procedure => procedure.category === selectedCategory);
    }

    setFilteredProcedures(filtered);
  };

  const handleCreateProcedure = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.content || !formData.category) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = formData.tags.length > 0 ? formData.tags : [];
      const procedureData = {
        ...formData,
        tags: tagsArray
      };

      await portfolioApi.createProcedure(procedureData);
      toast({
        title: "Succès",
        description: "Procédure créée avec succès",
      });
      
      setIsCreateModalOpen(false);
      setFormData({ title: '', description: '', content: '', category: '', tags: [] });
      fetchProcedures();
    } catch (error) {
      console.error('Error creating procedure:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la procédure",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProcedure = async (procedureId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette procédure ?')) {
      return;
    }

    try {
      await portfolioApi.deleteProcedure(procedureId);
      toast({
        title: "Succès",
        description: "Procédure supprimée avec succès",
      });
      fetchProcedures();
    } catch (error) {
      console.error('Error deleting procedure:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la procédure",
        variant: "destructive",
      });
    }
  };

  const handleTagsChange = (value) => {
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags: tagsArray });
  };

  const openViewModal = (procedure) => {
    setSelectedProcedure(procedure);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement des procédures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Projets Scolaires
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Collection de procédures et documentations techniques réalisées dans le cadre de ma formation BTS SIO SISR.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une procédure..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle procédure
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle procédure</DialogTitle>
                  <DialogDescription>
                    Ajoutez une nouvelle procédure technique à votre collection
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProcedure} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Titre de la procédure"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Description courte de la procédure"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                    <Input
                      id="tags"
                      value={formData.tags.join(', ')}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="Windows, Active Directory, Configuration"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Contenu de la procédure *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Détaillez les étapes de la procédure..."
                      rows={10}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Créer la procédure
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Procedures Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredProcedures.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm || selectedCategory !== 'all' ? 'Aucune procédure trouvée' : 'Aucune procédure disponible'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par créer votre première procédure'
                }
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProcedures.map((procedure) => (
                <Card key={procedure.id} className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${getCategoryColor(procedure.category)}`}>
                        {getCategoryIcon(procedure.category)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(procedure)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProcedure(procedure.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{procedure.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{procedure.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(procedure.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <Badge variant="secondary" className={getCategoryColor(procedure.category)}>
                          {procedure.category}
                        </Badge>
                      </div>
                      {procedure.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {procedure.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {procedure.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{procedure.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedProcedure?.title}</DialogTitle>
              <DialogDescription className="text-base">
                {selectedProcedure?.description}
              </DialogDescription>
            </DialogHeader>
            {selectedProcedure && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className={getCategoryColor(selectedProcedure.category)}>
                    {selectedProcedure.category}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Créé le {new Date(selectedProcedure.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                {selectedProcedure.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tags :</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProcedure.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-3">Contenu de la procédure :</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                      {selectedProcedure.content}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjetScolairePage;