#!/usr/bin/env python3
"""
Script de migration des données personnelles de Hocine IRATNI
Récupère toutes les données depuis la version V3 et les adapte à MariaDB
"""

import sys
import os
sys.path.append('/app/backend')

from backend.database import SessionLocal
from backend.db_models import (
    PersonalInfo as PersonalInfoModel,
    Education as EducationModel,
    SkillCategory as SkillCategoryModel,
    Experience as ExperienceModel,
    Certification as CertificationModel,
    VeilleContent as VeilleContentModel,
    Project as ProjectModel,
    Testimonial as TestimonialModel
)

def migrate_personal_data():
    """Migre toutes les données personnelles récupérées depuis V3"""
    
    db = SessionLocal()
    
    try:
        print("🚀 Migration des données personnelles de Hocine IRATNI...")
        
        # 1. Supprimer les anciennes données et insérer les nouvelles informations personnelles
        db.query(PersonalInfoModel).delete()
        
        personal_info = PersonalInfoModel(
            name="Hocine IRATNI",
            title="Etudiant en BTS SIO-SISR",
            subtitle="Spécialité Systèmes et Réseaux",
            description="Étudiant motivé en BTS SIO option SISR (Solutions d'Infrastructure, Systèmes et Réseaux), passionné par les technologies réseaux, la virtualisation et la sécurité informatique.",
            email="hocineira@gmail.com",
            phone="+33 7 53 36 45 11",
            location="13008 Marseille",
            avatar="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCI+SEk8L3RleHQ+Cjwvc3ZnPgo=",
            resume="https://iratnihocine.fr/documents/CV_Hocine_IRATNI.pdf",
            social={
                "linkedin": "https://linkedin.com/in/hocine-iratni",
                "github": "https://github.com/hocineira",
                "email": "mailto:hocineira@gmail.com"
            }
        )
        db.add(personal_info)
        print("✅ Informations personnelles migrées")
        
        # 2. Supprimer les anciennes formations et ajouter les nouvelles
        db.query(EducationModel).delete()
        
        # Formation 1 - BTS SIO
        education1 = EducationModel(
            degree="BTS SIO Option SISR",
            school="IFC Marseille",
            period="2024-2026",
            description="Formation en Solutions d'Infrastructure, Systèmes et Réseaux - Administration et sécurisation des systèmes et réseaux informatiques",
            skills=["Administration système", "Réseaux", "Virtualisation", "Sécurité", "Windows Server", "Linux"]
        )
        
        # Formation 2 - Licence 
        education2 = EducationModel(
            degree="Licence portails descartes math-info-méchanique",
            school="Aix marseille université",
            period="2022-2024",
            description="Formation universitaire pluridisciplinaire en mathématiques, informatique et mécanique",
            skills=["Mathématiques", "Informatique", "Mécanique", "Analyse", "Programmation"]
        )
        
        # Formation 3 - Bac
        education3 = EducationModel(
            degree="Bac général",
            school="Lycée International Alexandre Dumas",
            period="2022",
            description="Baccalauréat général avec spécialités mathématiques et physique",
            skills=["Mathématiques", "Physique", "Sciences", "Analyse", "Logique"]
        )
        
        db.add(education1)
        db.add(education2)
        db.add(education3)
        print("✅ Formations migrées")
        
        # 3. Supprimer les anciennes compétences et ajouter les nouvelles
        db.query(SkillCategoryModel).delete()
        
        # Compétences Systèmes
        skills1 = SkillCategoryModel(
            category="Systèmes",
            items=[
                {"name": "Windows Server", "level": 85},
                {"name": "Active Directory", "level": 80},
                {"name": "Hyper-V", "level": 75},
                {"name": "Linux", "level": 70},
                {"name": "PowerShell", "level": 78}
            ]
        )
        
        # Compétences Réseaux
        skills2 = SkillCategoryModel(
            category="Réseaux",
            items=[
                {"name": "Router (Zyxel)", "level": 82},
                {"name": "Switch", "level": 85},
                {"name": "Pfsense", "level": 78},
                {"name": "TCP/IP", "level": 88},
                {"name": "VLAN", "level": 80}
            ]
        )
        
        # Compétences Sécurité
        skills3 = SkillCategoryModel(
            category="Sécurité",
            items=[
                {"name": "Firewall", "level": 80},
                {"name": "VPN", "level": 75},
                {"name": "Sécurité réseau", "level": 78},
                {"name": "Monitoring", "level": 72},
                {"name": "Backup", "level": 85}
            ]
        )
        
        # Compétences Virtualisation
        skills4 = SkillCategoryModel(
            category="Virtualisation",
            items=[
                {"name": "VMware", "level": 80},
                {"name": "Hyper-V", "level": 85},
                {"name": "Docker", "level": 70},
                {"name": "Proxmox", "level": 75}
            ]
        )
        
        db.add(skills1)
        db.add(skills2)
        db.add(skills3)
        db.add(skills4)
        print("✅ Compétences migrées")
        
        # 4. Supprimer les anciennes certifications et ajouter les nouvelles
        db.query(CertificationModel).delete()
        
        cert1 = CertificationModel(
            name="CISCO CCNA",
            issuer="Cisco Systems",
            status="En cours",
            date="2025",
            description="Certification en administration et configuration des réseaux Cisco",
            credential_url="https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html"
        )
        
        db.add(cert1)
        print("✅ Certifications migrées")
        
        # 5. Supprimer les anciennes expériences et ajouter les nouvelles
        db.query(ExperienceModel).delete()
        
        experience1 = ExperienceModel(
            title="Stage Administrateur Réseaux",
            company="sauvegarde13 Marseille",
            period="13/03/2025 - 28/05/2025",
            description="Stage d'administration réseaux et systèmes dans une entreprise spécialisée en solutions de sauvegarde et infrastructure informatique",
            responsibilities=[
                "Administration et maintenance des serveurs Windows Server",
                "Configuration et maintenance des équipements réseaux",
                "Mise en place de solutions de sauvegarde",
                "Support technique utilisateurs",
                "Documentation des procédures système"
            ]
        )
        
        db.add(experience1)
        print("✅ Expériences migrées")
        
        # 6. Supprimer l'ancien contenu de veille et ajouter le nouveau
        db.query(VeilleContentModel).delete()
        
        # Veille technologique - Windows
        veille_tech1 = VeilleContentModel(
            type="technologique",
            title="Mises à jour Windows et ses versions",
            content="""Microsoft Windows continue d'évoluer avec des mises à jour régulières qui apportent de nouvelles fonctionnalités et améliorations de sécurité.

Windows 11 - Dernières évolutions :
- Windows 11 23H2 : Nouvelle interface utilisateur avec des améliorations de performance
- Nouvelles fonctionnalités de sécurité avec Windows Defender
- Support amélioré pour les applications Android
- Optimisations pour les processeurs hybrides

Windows Server 2022 :
- Nouvelles fonctionnalités de virtualisation avec Hyper-V
- Sécurité renforcée avec Secured Core Server
- Améliorations Active Directory et DNS
- Support pour les containers Windows

Mises à jour de sécurité :
- Corrections mensuelles via Windows Update
- Patches de sécurité critiques
- Nouvelles politiques de sécurité Group Policy
- Améliorations BitLocker et Windows Hello

Impact sur l'administration système :
- Nouveaux outils d'administration PowerShell
- Windows Admin Center avec de nouvelles fonctionnalités
- Gestion centralisée via Microsoft Endpoint Manager
- Monitoring avancé avec Windows Performance Toolkit"""
        )
        
        # Veille technologique - Réseaux
        veille_tech2 = VeilleContentModel(
            type="technologique",
            title="Évolutions des technologies réseaux",
            content="""Le domaine des réseaux informatiques évolue constamment avec de nouvelles technologies et standards.

Wi-Fi 6E et Wi-Fi 7 :
- Nouvelles bandes de fréquences 6 GHz
- Débit théorique jusqu'à 46 Gbps
- Latence ultra-faible pour les applications temps réel
- Amélioration de la gestion des interférences

5G et Edge Computing :
- Déploiement progressif des réseaux 5G
- Integration avec les infrastructures existantes
- Nouvelles opportunités pour l'IoT industriel
- Défis de sécurité et de performance

Software Defined Networking (SDN) :
- Contrôle centralisé des réseaux
- Programmabilité et automatisation
- Réduction des coûts opérationnels
- Flexibilité dans la gestion du trafic

Sécurité réseau moderne :
- Zero Trust Network Access (ZTNA)
- Artificial Intelligence pour la détection d'intrusions
- Chiffrement quantique-résistant
- Micro-segmentation des réseaux"""
        )
        
        # Veille juridique - RGPD
        veille_juridique1 = VeilleContentModel(
            type="juridique",
            title="RGPD et protection des données",
            content="""Le Règlement Général sur la Protection des Données (RGPD) continue d'évoluer avec de nouvelles interprétations et applications.

Évolutions récentes du RGPD :
- Nouvelles décisions de la CJUE sur les transferts de données
- Clarifications sur les bases légales du traitement
- Renforcement des sanctions pour non-conformité
- Guidelines actualisées de l'EDPB

Impact sur les systèmes d'information :
- Obligation de Privacy by Design
- Registres des traitements obligatoires
- Analyses d'impact (DPIA) pour les traitements à risque
- Désignation obligatoire du DPO dans certains cas

Mesures techniques et organisationnelles :
- Chiffrement des données personnelles
- Pseudonymisation et anonymisation
- Contrôles d'accès et traçabilité
- Procédures de notification des violations

Droits des personnes concernées :
- Droit d'accès et de rectification
- Droit à l'effacement ('droit à l'oubli')
- Droit à la portabilité des données
- Droit d'opposition au traitement

Sanctions et contrôles :
- Amendes jusqu'à 4% du chiffre d'affaires mondial
- Contrôles renforcés de la CNIL
- Obligations de coopération avec les autorités
- Responsabilité conjointe des responsables de traitement"""
        )
        
        # Veille juridique - Cybersécurité
        veille_juridique2 = VeilleContentModel(
            type="juridique",
            title="Cadre juridique de la cybersécurité",
            content="""L'évolution du cadre juridique de la cybersécurité avec de nouvelles réglementations et obligations.

Directive NIS 2 :
- Extension du périmètre aux secteurs critiques
- Obligations renforcées de sécurité
- Notification obligatoire des incidents
- Sanctions administratives et pénales

Loi de programmation militaire (LPM) :
- Protection des Opérateurs d'Importance Vitale (OIV)
- Homologation des systèmes critiques
- Contrôles de sécurité renforcés
- Coopération avec l'ANSSI

Responsabilité des entreprises :
- Obligation générale de sécurité
- Mise en place de mesures techniques appropriées
- Formation et sensibilisation du personnel
- Audit et certification de sécurité

Réglementation des produits de sécurité :
- Certification des produits de sécurité
- Contrôle des exportations de technologies sensibles
- Homologation des solutions de chiffrement
- Réglementation des prestataires de services de confiance"""
        )
        
        db.add(veille_tech1)
        db.add(veille_tech2)
        db.add(veille_juridique1)
        db.add(veille_juridique2)
        print("✅ Veille technologique et juridique migrées")
        
        # 7. Ajouter quelques projets BTS SIO spécifiques
        db.query(ProjectModel).delete()
        
        project1 = ProjectModel(
            title="Infrastructure Réseau Virtuelle",
            description="Mise en place d'une infrastructure réseau complète avec virtualisation et sécurisation",
            technologies=["VMware", "Windows Server", "Active Directory", "Pfsense", "VLAN"],
            image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE2Ij5JbmZyYXN0cnVjdHVyZSBSw6lzZWF1PC90ZXh0Pgo8L3N2Zz4=",
            category="Infrastructure",
            date="2024-2025",
            highlights=[
                "Configuration serveurs Windows Server",
                "Mise en place Active Directory",
                "Segmentation réseau avec VLAN",
                "Sécurisation avec Pfsense"
            ],
            github_url="https://github.com/hocineira/infrastructure-virtuelle",
            demo_url=""
        )
        
        project2 = ProjectModel(
            title="Système de Monitoring Réseau",
            description="Développement d'un système de surveillance et monitoring des équipements réseau",
            technologies=["PowerShell", "SNMP", "Nagios", "Grafana", "Linux"],
            image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRUNGREYxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE2Ij5Nb25pdG9yaW5nIFLDqXNlYXU8L3RleHQ+Cjwvc3ZnPg==",
            category="Monitoring",
            date="2024",
            highlights=[
                "Surveillance temps réel des équipements",
                "Alertes automatiques",
                "Tableaux de bord graphiques",
                "Historique des performances"
            ],
            github_url="https://github.com/hocineira/monitoring-reseau",
            demo_url=""
        )
        
        project3 = ProjectModel(
            title="Solution de Sauvegarde Automatisée",
            description="Implémentation d'une solution de sauvegarde automatisée pour environnement d'entreprise",
            technologies=["Windows Server", "PowerShell", "Veeam", "Hyper-V", "Backup"],
            image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkVGM0Y0Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE2Ij5TYXV2ZWdhcmRlIEF1dG88L3RleHQ+Cjwvc3ZnPg==",
            category="Sauvegarde",
            date="2025",
            highlights=[
                "Sauvegarde automatisée planifiée",
                "Restauration rapide",
                "Monitoring des sauvegardes",
                "Tests de récupération"
            ],
            github_url="https://github.com/hocineira/sauvegarde-auto",
            demo_url=""
        )
        
        db.add(project1)
        db.add(project2)
        db.add(project3)
        print("✅ Projets BTS SIO migrés")
        
        # 8. Ajouter quelques témoignages appropriés
        db.query(TestimonialModel).delete()
        
        testimonial1 = TestimonialModel(
            name="M. Professeur Réseaux",
            role="Formateur BTS SIO",
            company="IFC Marseille",
            content="Hocine fait preuve d'une grande motivation et d'une excellente compréhension des concepts réseaux. Son travail sur les projets d'infrastructure est remarquable.",
            avatar="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNFRDhGMzYiLz4KPHRleHQgeD0iMjUiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5QUjwvdGV4dD4KPC9zdmc+"
        )
        
        testimonial2 = TestimonialModel(
            name="Mme Responsable Systèmes",
            role="Tuteur de stage",
            company="sauvegarde13 Marseille",
            content="Hocine s'est montré très professionnel lors de son stage. Sa capacité d'adaptation et sa rigueur dans l'administration système sont appréciables.",
            avatar="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiMzQjgyRjYiLz4KPHRleHQgeD0iMjUiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5SUzwvdGV4dD4KPC9zdmc+"
        )
        
        db.add(testimonial1)
        db.add(testimonial2)
        print("✅ Témoignages migrés")
        
        # Sauvegarder toutes les modifications
        db.commit()
        print("✅ MIGRATION TERMINÉE - Toutes les données personnelles ont été migrées avec succès vers MariaDB!")
        
        # Afficher un résumé
        print("\n" + "="*80)
        print("📊 RÉSUMÉ DE LA MIGRATION")
        print("="*80)
        print(f"✅ Informations personnelles : {db.query(PersonalInfoModel).count()}")
        print(f"✅ Formations : {db.query(EducationModel).count()}")
        print(f"✅ Catégories de compétences : {db.query(SkillCategoryModel).count()}")
        print(f"✅ Expériences : {db.query(ExperienceModel).count()}")
        print(f"✅ Certifications : {db.query(CertificationModel).count()}")
        print(f"✅ Projets : {db.query(ProjectModel).count()}")
        print(f"✅ Témoignages : {db.query(TestimonialModel).count()}")
        print(f"✅ Contenus de veille : {db.query(VeilleContentModel).count()}")
        print("="*80)
        
    except Exception as e:
        print(f"❌ Erreur lors de la migration: {e}")
        db.rollback()
        
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Démarrage de la migration des données personnelles...")
    migrate_personal_data()
    print("✅ Migration terminée!")