// Mock data for Hocine IRATNI - BTS SIO SISR Portfolio
export const personalInfo = {
  name: "Hocine IRATNI",
  title: "Étudiant BTS SIO SISR",
  subtitle: "Spécialisation Systèmes et Réseaux",
  description: "Passionné par l'infrastructure IT et la sécurité réseau, je développe mes compétences en administration système, virtualisation et cybersécurité. Mon objectif est de devenir un expert en architecture réseau et sécurité informatique.",
  email: "h.iratni@email.com",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  avatar: "https://ui-avatars.com/api/?name=Hocine+IRATNI&background=0ea5e9&color=fff&size=128",
  resume: "#",
  social: {
    linkedin: "https://linkedin.com/in/hocine-iratni",
    github: "https://github.com/hiratni",
    email: "mailto:h.iratni@email.com"
  }
};

export const education = [
  {
    id: 1,
    degree: "BTS SIO SISR",
    school: "Lycée Technologique Paris",
    period: "2023 - 2025",
    description: "Services Informatiques aux Organisations - Spécialisation Solutions d'Infrastructure, Systèmes et Réseaux",
    skills: ["Administration système", "Réseaux", "Sécurité", "Virtualisation"]
  },
  {
    id: 2,
    degree: "Baccalauréat STI2D",
    school: "Lycée Général et Technologique",
    period: "2020 - 2023",
    description: "Sciences et Technologies de l'Industrie et du Développement Durable - Spécialité SIN",
    skills: ["Systèmes d'information", "Numérique", "Électronique"]
  }
];

export const skills = [
  {
    category: "Systèmes d'exploitation",
    items: [
      { name: "Windows Server", level: 85 },
      { name: "Linux (Ubuntu/CentOS)", level: 80 },
      { name: "VMware vSphere", level: 75 },
      { name: "Hyper-V", level: 70 }
    ]
  },
  {
    category: "Réseaux",
    items: [
      { name: "TCP/IP", level: 90 },
      { name: "Cisco IOS", level: 75 },
      { name: "VPN", level: 70 },
      { name: "Firewall", level: 80 }
    ]
  },
  {
    category: "Sécurité",
    items: [
      { name: "Sécurité réseau", level: 75 },
      { name: "Analyse de vulnérabilités", level: 70 },
      { name: "Incident Response", level: 65 },
      { name: "Cryptographie", level: 60 }
    ]
  },
  {
    category: "Outils",
    items: [
      { name: "Wireshark", level: 85 },
      { name: "Nmap", level: 80 },
      { name: "PowerShell", level: 75 },
      { name: "Bash", level: 70 }
    ]
  }
];

export const projects = [
  {
    id: 1,
    title: "Infrastructure réseau d'entreprise",
    description: "Conception et déploiement d'une infrastructure réseau complète pour une PME de 50 employés avec segmentation VLAN, serveurs Windows et Linux.",
    technologies: ["Windows Server 2022", "Ubuntu Server", "Cisco", "VLANs", "DHCP", "DNS"],
    image: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg",
    category: "Infrastructure",
    date: "2024",
    highlights: [
      "Segmentation réseau avec 3 VLANs",
      "Serveur de domaine Active Directory",
      "Serveur de fichiers avec quotas",
      "Monitoring avec Nagios"
    ]
  },
  {
    id: 2,
    title: "Audit de sécurité réseau",
    description: "Réalisation d'un audit complet de sécurité réseau d'une infrastructure existante avec tests de pénétration et recommandations.",
    technologies: ["Nmap", "Wireshark", "Metasploit", "Nessus", "Kali Linux"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5fGVufDB8fHx8MTc1MjcwNTYzNnww&ixlib=rb-4.1.0&q=85",
    category: "Sécurité",
    date: "2024",
    highlights: [
      "Scan de vulnérabilités automatisé",
      "Tests d'intrusion manuels",
      "Rapport d'audit détaillé",
      "Plan de remédiation"
    ]
  },
  {
    id: 3,
    title: "Virtualisation avec VMware",
    description: "Mise en place d'une infrastructure virtualisée avec VMware vSphere pour optimiser les ressources et la haute disponibilité.",
    technologies: ["VMware vSphere", "ESXi", "vCenter", "vMotion", "Windows Server", "Linux"],
    image: "https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg",
    category: "Virtualisation",
    date: "2024",
    highlights: [
      "Cluster de 3 serveurs ESXi",
      "Migration à chaud avec vMotion",
      "Sauvegarde automatisée",
      "Monitoring des performances"
    ]
  }
];

export const experience = [
  {
    id: 1,
    title: "Technicien IT - Stage",
    company: "TechSolutions Paris",
    period: "Mai 2024 - Juillet 2024",
    description: "Support technique niveau 2, maintenance préventive des serveurs et assistance utilisateurs.",
    responsibilities: [
      "Gestion des incidents via système de tickets",
      "Maintenance préventive des serveurs",
      "Installation et configuration de postes de travail",
      "Formation des utilisateurs aux bonnes pratiques"
    ]
  },
  {
    id: 2,
    title: "Assistant Support Informatique",
    company: "Lycée Technologique Paris",
    period: "Septembre 2023 - Présent",
    description: "Assistance technique auprès des enseignants et étudiants, maintenance du parc informatique.",
    responsibilities: [
      "Dépannage matériel et logiciel",
      "Gestion des utilisateurs Active Directory",
      "Maintenance du réseau pédagogique",
      "Formation aux outils numériques"
    ]
  }
];

export const certifications = [
  {
    id: 1,
    name: "Cisco CCNA",
    issuer: "Cisco",
    status: "En cours",
    date: "2024",
    description: "Certification réseau Cisco niveau associé"
  },
  {
    id: 2,
    name: "CompTIA Security+",
    issuer: "CompTIA",
    status: "Planifiée",
    date: "2025",
    description: "Certification sécurité informatique fondamentale"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Marc Dubois",
    role: "Responsable IT",
    company: "TechSolutions Paris",
    content: "Hocine a fait preuve d'un excellent esprit d'analyse et d'une grande capacité d'adaptation pendant son stage. Sa passion pour les technologies réseau est évidente.",
    avatar: "https://ui-avatars.com/api/?name=Marc+Dubois&background=4f46e5&color=fff&size=64"
  },
  {
    id: 2,
    name: "Sophie Martin",
    role: "Formatrice Réseaux",
    company: "Lycée Technologique Paris",
    content: "Étudiant sérieux et motivé, Hocine montre un réel intérêt pour l'infrastructure IT et la sécurité. Il sera un excellent professionnel.",
    avatar: "https://ui-avatars.com/api/?name=Sophie+Martin&background=dc2626&color=fff&size=64"
  }
];