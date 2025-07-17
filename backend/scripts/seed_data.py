import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from models import PersonalInfo, Education, SkillCategory, SkillItem, Project, Experience, Certification, Testimonial, VeilleContent, Procedure

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Clear existing data
    await db.personal_info.delete_many({})
    await db.education.delete_many({})
    await db.skills.delete_many({})
    await db.projects.delete_many({})
    await db.experience.delete_many({})
    await db.certifications.delete_many({})
    await db.testimonials.delete_many({})
    await db.veille_content.delete_many({})
    await db.procedures.delete_many({})
    
    # Personal Info - Updated with real information
    personal_info = PersonalInfo(
        name="Hocine IRATNI",
        title="Étudiant BTS SIO SISR",
        subtitle="Spécialisation Systèmes et Réseaux",
        description="Passionné par l'infrastructure IT et la sécurité réseau, je développe mes compétences en administration système, virtualisation et cybersécurité. Mon objectif est de devenir un expert en architecture réseau et sécurité informatique.",
        email="h.iratni@email.com",
        phone="+33 7 53 36 45 11",
        location="Marseille 13008, France",
        avatar="https://ui-avatars.com/api/?name=Hocine+IRATNI&background=0ea5e9&color=fff&size=128",
        resume="#",
        social={
            "linkedin": "https://linkedin.com/in/hocine-iratni",
            "github": "https://github.com/hiratni",
            "email": "mailto:h.iratni@email.com"
        }
    )
    await db.personal_info.insert_one(personal_info.dict())
    
    # Education
    education_data = [
        Education(
            degree="BTS SIO SISR",
            school="Lycée Technologique Marseille",
            period="2023 - 2025",
            description="Services Informatiques aux Organisations - Spécialisation Solutions d'Infrastructure, Systèmes et Réseaux",
            skills=["Administration système", "Réseaux", "Sécurité", "Virtualisation"]
        ),
        Education(
            degree="Baccalauréat STI2D",
            school="Lycée Général et Technologique",
            period="2020 - 2023",
            description="Sciences et Technologies de l'Industrie et du Développement Durable - Spécialité SIN",
            skills=["Systèmes d'information", "Numérique", "Électronique"]
        )
    ]
    for edu in education_data:
        await db.education.insert_one(edu.dict())
    
    # Skills
    skills_data = [
        SkillCategory(
            category="Systèmes d'exploitation",
            items=[
                SkillItem(name="Windows Server", level=85),
                SkillItem(name="Linux (Ubuntu/CentOS)", level=80),
                SkillItem(name="VMware vSphere", level=75),
                SkillItem(name="Hyper-V", level=70)
            ]
        ),
        SkillCategory(
            category="Réseaux",
            items=[
                SkillItem(name="TCP/IP", level=90),
                SkillItem(name="Cisco IOS", level=75),
                SkillItem(name="VPN", level=70),
                SkillItem(name="Firewall", level=80)
            ]
        ),
        SkillCategory(
            category="Sécurité",
            items=[
                SkillItem(name="Sécurité réseau", level=75),
                SkillItem(name="Analyse de vulnérabilités", level=70),
                SkillItem(name="Incident Response", level=65),
                SkillItem(name="Cryptographie", level=60)
            ]
        ),
        SkillCategory(
            category="Outils",
            items=[
                SkillItem(name="Wireshark", level=85),
                SkillItem(name="Nmap", level=80),
                SkillItem(name="PowerShell", level=75),
                SkillItem(name="Bash", level=70)
            ]
        )
    ]
    for skill in skills_data:
        await db.skills.insert_one(skill.dict())
    
    # Projects
    projects_data = [
        Project(
            title="Infrastructure réseau d'entreprise",
            description="Conception et déploiement d'une infrastructure réseau complète pour une PME de 50 employés avec segmentation VLAN, serveurs Windows et Linux.",
            technologies=["Windows Server 2022", "Ubuntu Server", "Cisco", "VLANs", "DHCP", "DNS"],
            image="https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg",
            category="Infrastructure",
            date="2024",
            highlights=[
                "Segmentation réseau avec 3 VLANs",
                "Serveur de domaine Active Directory",
                "Serveur de fichiers avec quotas",
                "Monitoring avec Nagios"
            ]
        ),
        Project(
            title="Audit de sécurité réseau",
            description="Réalisation d'un audit complet de sécurité réseau d'une infrastructure existante avec tests de pénétration et recommandations.",
            technologies=["Nmap", "Wireshark", "Metasploit", "Nessus", "Kali Linux"],
            image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5fGVufDB8fHx8MTc1MjcwNTYzNnww&ixlib=rb-4.1.0&q=85",
            category="Sécurité",
            date="2024",
            highlights=[
                "Scan de vulnérabilités automatisé",
                "Tests d'intrusion manuels",
                "Rapport d'audit détaillé",
                "Plan de remédiation"
            ]
        ),
        Project(
            title="Virtualisation avec VMware",
            description="Mise en place d'une infrastructure virtualisée avec VMware vSphere pour optimiser les ressources et la haute disponibilité.",
            technologies=["VMware vSphere", "ESXi", "vCenter", "vMotion", "Windows Server", "Linux"],
            image="https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg",
            category="Virtualisation",
            date="2024",
            highlights=[
                "Cluster de 3 serveurs ESXi",
                "Migration à chaud avec vMotion",
                "Sauvegarde automatisée",
                "Monitoring des performances"
            ]
        )
    ]
    for project in projects_data:
        await db.projects.insert_one(project.dict())
    
    # Experience
    experience_data = [
        Experience(
            title="Technicien IT - Stage",
            company="TechSolutions Marseille",
            period="Mai 2024 - Juillet 2024",
            description="Support technique niveau 2, maintenance préventive des serveurs et assistance utilisateurs.",
            responsibilities=[
                "Gestion des incidents via système de tickets",
                "Maintenance préventive des serveurs",
                "Installation et configuration de postes de travail",
                "Formation des utilisateurs aux bonnes pratiques"
            ]
        ),
        Experience(
            title="Assistant Support Informatique",
            company="Lycée Technologique Marseille",
            period="Septembre 2023 - Présent",
            description="Assistance technique auprès des enseignants et étudiants, maintenance du parc informatique.",
            responsibilities=[
                "Dépannage matériel et logiciel",
                "Gestion des utilisateurs Active Directory",
                "Maintenance du réseau pédagogique",
                "Formation aux outils numériques"
            ]
        )
    ]
    for exp in experience_data:
        await db.experience.insert_one(exp.dict())
    
    # Certifications
    certifications_data = [
        Certification(
            name="Cisco CCNA",
            issuer="Cisco",
            status="En cours",
            date="2024",
            description="Certification réseau Cisco niveau associé"
        ),
        Certification(
            name="CompTIA Security+",
            issuer="CompTIA",
            status="Planifiée",
            date="2025",
            description="Certification sécurité informatique fondamentale"
        )
    ]
    for cert in certifications_data:
        await db.certifications.insert_one(cert.dict())
    
    # Testimonials
    testimonials_data = [
        Testimonial(
            name="Marc Dubois",
            role="Responsable IT",
            company="TechSolutions Marseille",
            content="Hocine a fait preuve d'un excellent esprit d'analyse et d'une grande capacité d'adaptation pendant son stage. Sa passion pour les technologies réseau est évidente.",
            avatar="https://ui-avatars.com/api/?name=Marc+Dubois&background=4f46e5&color=fff&size=64"
        ),
        Testimonial(
            name="Sophie Martin",
            role="Formatrice Réseaux",
            company="Lycée Technologique Marseille",
            content="Étudiant sérieux et motivé, Hocine montre un réel intérêt pour l'infrastructure IT et la sécurité. Il sera un excellent professionnel.",
            avatar="https://ui-avatars.com/api/?name=Sophie+Martin&background=dc2626&color=fff&size=64"
        )
    ]
    for testimonial in testimonials_data:
        await db.testimonials.insert_one(testimonial.dict())
    
    # Veille Content
    veille_data = [
        VeilleContent(
            type="technologique",
            title="Veille Technologique - Mises à jour Windows",
            content="""Bienvenue sur notre section dédiée à la veille technologique. Dans un environnement de plus en plus connecté et digitalisé, il est essentiel pour les entreprises de rester informées des dernières avancées technologiques afin de maintenir leur compétitivité et répondre aux attentes de leurs clients. La veille technologique est un outil stratégique permettant de suivre les tendances, innovations et évolutions du marché susceptibles d'influencer l'activité de l'entreprise. Ici, nous explorerons les fondamentaux de la veille technologique, ses bénéfices, et les meilleures pratiques pour instaurer une veille efficace dans un contexte de transformation numérique.

Les mises à jour de Windows sont essentielles pour assurer la sécurité, la performance et l'efficacité des systèmes d'exploitation, elles permettent de corriger des failles de sécurité, d'améliorer les fonctionnalités existantes et d'introduire de nouvelles innovations.

En maintenant votre système Windows à jour, Microsoft assure une protection optimale contre les menaces et introduisent les dernières améliorations pour une meilleure expérience utilisateur."""
        ),
        VeilleContent(
            type="juridique",
            title="Veille Juridique - RGPD",
            content="""Bienvenue à cette présentation sur les veilles juridiques. Dans un environnement en constante évolution, il est crucial pour les entreprises et les professionnels du droit de s'adapter aux changements juridiques afin de rester conformes et compétitifs. Les veilles juridiques constituent un outil indispensable pour suivre les évolutions législatives et réglementaires impactant leur secteur. Nous explorerons les concepts fondamentaux des veilles juridiques, leurs avantages et les meilleures pratiques pour établir une veille efficace.

Bienvenue dans cette section consacrée au Règlement Général sur la Protection des Données (RGPD). À l'ère du numérique, la protection des données personnelles est devenue une priorité pour les entreprises et les professionnels. Le RGPD, instauré par l'Union européenne, impose des règles strictes sur la collecte, l'utilisation et la gestion des données à caractère personnel. Cette présentation vous permettra de comprendre les principes clés du RGPD, ses enjeux pour les entreprises, ainsi que les meilleures pratiques pour garantir la conformité tout en assurant une gestion éthique et sécurisée des données."""
        )
    ]
    for veille in veille_data:
        await db.veille_content.insert_one(veille.dict())
    
    # Sample procedures
    sample_procedures = [
        Procedure(
            title="Installation d'un serveur Windows Server 2022",
            description="Procédure complète d'installation et configuration d'un serveur Windows Server 2022",
            content="""# Installation Windows Server 2022

## Prérequis
- RAM : 2 Go minimum (4 Go recommandé)
- Processeur : 1.4 GHz 64-bit
- Espace disque : 32 Go minimum

## Étapes d'installation
1. Démarrage depuis le media d'installation
2. Sélection de la langue et des paramètres régionaux
3. Choix de l'édition Windows Server
4. Configuration du partitionnement
5. Installation du système
6. Configuration initiale (nom, mot de passe administrateur)
7. Mises à jour Windows Update
8. Configuration des rôles et fonctionnalités""",
            category="Système",
            tags=["Windows Server", "Installation", "Configuration"]
        ),
        Procedure(
            title="Configuration d'un VLAN sur switch Cisco",
            description="Procédure de création et configuration d'un VLAN sur un switch Cisco",
            content="""# Configuration VLAN Cisco

## Connexion au switch
```
enable
configure terminal
```

## Création du VLAN
```
vlan 10
name VLAN_USERS
exit
```

## Attribution des ports
```
interface range fa0/1-10
switchport mode access
switchport access vlan 10
exit
```

## Sauvegarde
```
copy running-config startup-config
```""",
            category="Réseau",
            tags=["Cisco", "VLAN", "Switch", "Configuration"]
        )
    ]
    for procedure in sample_procedures:
        await db.procedures.insert_one(procedure.dict())
    
    print("Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())