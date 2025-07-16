import { useState, useEffect } from 'react';
import { portfolioApi } from '../services/api';
import { toast } from '../hooks/use-toast';

export const usePortfolioData = () => {
  const [data, setData] = useState({
    personalInfo: null,
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        personalInfoRes,
        educationRes,
        skillsRes,
        projectsRes,
        experienceRes,
        certificationsRes,
        testimonialsRes,
      ] = await Promise.all([
        portfolioApi.getPersonalInfo(),
        portfolioApi.getEducation(),
        portfolioApi.getSkills(),
        portfolioApi.getProjects(),
        portfolioApi.getExperience(),
        portfolioApi.getCertifications(),
        portfolioApi.getTestimonials(),
      ]);

      setData({
        personalInfo: personalInfoRes.data,
        education: educationRes.data,
        skills: skillsRes.data,
        projects: projectsRes.data,
        experience: experienceRes.data,
        certifications: certificationsRes.data,
        testimonials: testimonialsRes.data,
      });
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to load portfolio data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load portfolio data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const submitContactMessage = async (messageData) => {
    try {
      await portfolioApi.createContactMessage(messageData);
      toast({
        title: "Message envoyé !",
        description: "Votre message a été envoyé avec succès. Je vous répondrai bientôt.",
      });
      return true;
    } catch (err) {
      console.error('Error sending contact message:', err);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchAllData,
    submitContactMessage,
  };
};

export default usePortfolioData;