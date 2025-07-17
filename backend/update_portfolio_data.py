#!/usr/bin/env python3
"""
Script de mise à jour des données du portfolio de Hocine IRATNI
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from db_models import (
    PersonalInfo as PersonalInfoModel,
    Education as EducationModel,
    SkillCategory as SkillCategoryModel,
    Experience as ExperienceModel,
    Certification as CertificationModel,
    VeilleContent as VeilleContentModel
)
from sqlalchemy.orm import Session

def update_portfolio_data():
    """Met à jour les données du portfolio avec les nouvelles informations"""
    
    db = SessionLocal()
    
    try:
        print("🔄 Mise à jour des données du portfolio...")
        
        # 1. Mettre à jour les informations personnelles
        personal_info = db.query(PersonalInfoModel).first()
        if personal_info:
            personal_info.name = "Hocine IRATNI"  # Supprimer -Updated
            personal_info.title = "Etudiant en BTS SIO-SISR"
            personal_info.subtitle = "Spécialité Systèmes et Réseaux"
            personal_info.description = "Étudiant motivé en BTS SIO option SISR (Solutions d'Infrastructure, Systèmes et Réseaux), passionné par les technologies réseaux, la virtualisation et la sécurité informatique."
            personal_info.email = "hocineira@gmail.com"
            personal_info.phone = "+33 7 53 36 45 11"
            personal_info.location = "13008 Marseille"
            personal_info.social = {
                "linkedin": "https://linkedin.com/in/hocine-iratni",
                "github": "https://github.com/hocine-iratni",
                "email": "mailto:hocineira@gmail.com"
            }
            print("✅ Informations personnelles mises à jour")
        
        # 2. Supprimer les anciennes formations et ajouter les nouvelles
        db.query(EducationModel).delete()
        
        # Nouvelle formation 1 - BTS SIO
        education1 = EducationModel(
            degree="BTS SIO Option SISR",
            school="IFC Marseille",
            period="2024-2026",
            description="Formation en Solutions d'Infrastructure, Systèmes et Réseaux - Administration et sécurisation des systèmes et réseaux informatiques",
            skills=["Administration système", "Réseaux", "Virtualisation", "Sécurité", "Windows Server", "Linux"]
        )
        
        # Nouvelle formation 2 - Licence
        education2 = EducationModel(
            degree="Licence portails descartes math-info-méchanique",
            school="Aix marseille université",
            period="2022-2024",
            description="Formation universitaire pluridisciplinaire en mathématiques, informatique et mécanique",
            skills=["Mathématiques", "Informatique", "Mécanique", "Analyse", "Programmation"]
        )
        
        # Nouvelle formation 3 - Bac
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
        print("✅ Formations mises à jour")
        
        # 3. Mettre à jour les compétences
        db.query(SkillCategoryModel).delete()
        
        # Nouvelles compétences systèmes et réseaux
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
        print("✅ Compétences mises à jour")
        
        # 4. Mettre à jour les certifications
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
        print("✅ Certifications mises à jour")
        
        # 5. Mettre à jour les expériences
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
        print("✅ Expériences mises à jour")
        
        # 6. Mettre à jour la veille technologique
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
        print("✅ Veille technologique et juridique mises à jour")
        
        # Sauvegarder toutes les modifications
        db.commit()
        print("✅ Toutes les données ont été mises à jour avec succès!")
        
    except Exception as e:
        print(f"❌ Erreur lors de la mise à jour: {e}")
        db.rollback()
        
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Mise à jour des données du portfolio...")
    update_portfolio_data()
    print("✅ Mise à jour terminée!")