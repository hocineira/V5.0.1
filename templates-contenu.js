// Template pour ajouter de nouveaux projets
// Copiez ce template dans votre base de données ou utilisez-le via l'API

export const nouveauProjetTemplate = {
  id: "projet-unique-id",
  title: "Nom de votre projet",
  description: "Description courte du projet (2-3 lignes maximum)",
  category: "Web", // ou "Mobile", "Desktop", "API", etc.
  date: "2024-01-01",
  image: "/images/projects/votre-image.jpg",
  technologies: ["React", "Node.js", "MongoDB"], // Technologies utilisées
  highlights: [
    "Première réalisation importante",
    "Deuxième point fort",
    "Troisième accomplissement"
  ],
  github_url: "https://github.com/votre-username/votre-projet",
  demo_url: "https://votre-demo.com",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Template pour ajouter des compétences
export const nouvelleCompetenceTemplate = {
  id: "competence-unique-id",
  category: "Développement Web", // ou "Base de données", "DevOps", etc.
  items: [
    {
      name: "JavaScript",
      level: 85 // Niveau de 0 à 100
    },
    {
      name: "React",
      level: 80
    },
    {
      name: "Node.js",
      level: 75
    }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Template pour ajouter une expérience
export const nouvelleExperienceTemplate = {
  id: "experience-unique-id",
  title: "Intitulé du poste",
  company: "Nom de l'entreprise",
  period: "Jan 2024 - Présent",
  description: "Description générale de votre rôle et responsabilités",
  responsibilities: [
    "Développement d'applications web",
    "Maintenance des systèmes existants",
    "Collaboration avec l'équipe",
    "Formation des nouveaux collaborateurs"
  ],
  technologies: ["Python", "JavaScript", "PostgreSQL"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Template pour ajouter une formation
export const nouvelleFormationTemplate = {
  id: "formation-unique-id",
  degree: "BTS Services Informatiques aux Organisations",
  school: "Nom de l'établissement",
  period: "2022-2024",
  description: "Description de la formation et des compétences acquises",
  skills: [
    "Développement web",
    "Administration système",
    "Gestion de projet",
    "Sécurité informatique"
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Template pour ajouter une procédure
export const nouvelleProcedureTemplate = {
  id: "procedure-unique-id",
  title: "Installation et configuration de Docker",
  description: "Procédure complète pour installer Docker sur Ubuntu 22.04",
  category: "DevOps",
  difficulty: "Intermédiaire", // "Débutant", "Intermédiaire", "Avancé"
  estimated_time: "30 minutes",
  prerequisites: [
    "Accès administrateur au système",
    "Connexion internet stable",
    "Terminal Ubuntu"
  ],
  steps: [
    {
      step_number: 1,
      title: "Mise à jour du système",
      description: "Mise à jour des paquets système avant l'installation",
      command: "sudo apt update && sudo apt upgrade -y",
      expected_output: "Packages updated successfully",
      notes: "Cette étape peut prendre quelques minutes"
    },
    {
      step_number: 2,
      title: "Installation des dépendances",
      description: "Installation des paquets nécessaires pour Docker",
      command: "sudo apt install apt-transport-https ca-certificates curl software-properties-common",
      expected_output: "Packages installed successfully",
      notes: "Tous les paquets sont nécessaires pour une installation sécurisée"
    },
    {
      step_number: 3,
      title: "Ajout de la clé GPG",
      description: "Ajout de la clé GPG officielle de Docker",
      command: "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
      expected_output: "OK",
      notes: "La clé GPG garantit l'authenticité des paquets"
    }
  ],
  tags: ["docker", "ubuntu", "installation", "conteneurisation"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Template pour ajouter un témoignage
export const nouveauTemoignageTemplate = {
  id: "temoignage-unique-id",
  name: "Nom de la personne",
  role: "Poste de la personne",
  company: "Entreprise",
  content: "Le témoignage complet de la personne sur votre travail...",
  avatar: "/images/testimonials/photo-personne.jpg",
  rating: 5, // Note de 1 à 5
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Template pour modifier les informations personnelles
export const informationsPersonnellesTemplate = {
  id: "personal-info",
  name: "Hocine IRATNI",
  title: "Développeur Full Stack",
  subtitle: "Spécialisé en développement web moderne",
  description: "Passionné par le développement web et les nouvelles technologies, je crée des solutions innovantes et performantes.",
  email: "votre.email@example.com",
  phone: "+33 6 12 34 56 78",
  location: "Ville, France",
  avatar: "/images/profile/avatar.jpg",
  resume: "/documents/CV_Hocine_IRATNI.pdf",
  social: {
    github: "https://github.com/hocineira",
    linkedin: "https://linkedin.com/in/votre-profil",
    email: "mailto:votre.email@example.com"
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Fonction d'aide pour générer un ID unique
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Guide d'utilisation des templates
export const guideUtilisationTemplates = {
  comment: `
    GUIDE D'UTILISATION DES TEMPLATES
    
    1. Copiez le template dont vous avez besoin
    2. Modifiez les valeurs selon vos besoins
    3. Changez l'ID par un identifiant unique
    4. Ajoutez les données via l'API ou directement en base
    
    EXEMPLE D'UTILISATION:
    
    // 1. Copier le template
    const monNouveauProjet = { ...nouveauProjetTemplate };
    
    // 2. Modifier les valeurs
    monNouveauProjet.id = "mon-projet-portfolio";
    monNouveauProjet.title = "Mon Portfolio Personnel";
    monNouveauProjet.description = "Site web personnel créé avec React et FastAPI";
    
    // 3. Ajouter via l'API
    fetch('/api/portfolio/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(monNouveauProjet)
    });
  `
};

export default {
  nouveauProjetTemplate,
  nouvelleCompetenceTemplate,
  nouvelleExperienceTemplate,
  nouvelleFormationTemplate,
  nouvelleProcedureTemplate,
  nouveauTemoignageTemplate,
  informationsPersonnellesTemplate,
  generateUniqueId,
  guideUtilisationTemplates
};