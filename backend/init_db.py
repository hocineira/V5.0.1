#!/usr/bin/env python3
"""
Script d'initialisation de la base de données Portfolio
Ce script crée les tables et insère des données de démonstration
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine, SessionLocal
from db_models import *
from sqlalchemy.orm import Session

def init_database():
    """Initialise la base de données avec des données de démonstration"""
    
    # Créer toutes les tables
    Base.metadata.create_all(bind=engine)
    
    # Créer une session
    db = SessionLocal()
    
    try:
        # Vérifier si des données existent déjà
        if db.query(PersonalInfoModel).first() is None:
            print("Insertion des données de démonstration...")
            
            # Données personnelles
            personal_info = PersonalInfoModel(
                name="Hocine IRATNI",
                title="Développeur Full Stack",
                subtitle="Spécialiste en développement web moderne",
                description="Développeur passionné avec une expertise en technologies modernes comme React, Node.js, Python et les architectures cloud.",
                email="hocine.iratni@example.com",
                phone="+33 6 12 34 56 78",
                location="Paris, France",
                avatar="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCI+SEk8L3RleHQ+Cjwvc3ZnPgo=",
                resume="https://example.com/resume.pdf",
                social={
                    "linkedin": "https://linkedin.com/in/hocine-iratni",
                    "github": "https://github.com/hocine-iratni",
                    "twitter": "https://twitter.com/hocine_iratni"
                }
            )
            db.add(personal_info)
            
            # Éducation
            education1 = EducationModel(
                degree="Master en Informatique",
                school="Université Paris-Saclay",
                period="2020-2022",
                description="Spécialisation en développement logiciel et architectures distribuées",
                skills=["Python", "Java", "Architecture logicielle", "Base de données"]
            )
            
            education2 = EducationModel(
                degree="Licence en Informatique",
                school="Université Paris-Sud",
                period="2017-2020",
                description="Fondamentaux de l'informatique et programmation",
                skills=["C", "C++", "Algorithmes", "Mathématiques"]
            )
            
            db.add(education1)
            db.add(education2)
            
            # Compétences
            skills1 = SkillCategoryModel(
                category="Frontend",
                items=[
                    {"name": "React", "level": 90},
                    {"name": "Vue.js", "level": 85},
                    {"name": "TypeScript", "level": 88},
                    {"name": "HTML/CSS", "level": 95},
                    {"name": "Tailwind CSS", "level": 92}
                ]
            )
            
            skills2 = SkillCategoryModel(
                category="Backend",
                items=[
                    {"name": "Python", "level": 95},
                    {"name": "FastAPI", "level": 90},
                    {"name": "Node.js", "level": 85},
                    {"name": "PostgreSQL", "level": 88},
                    {"name": "MongoDB", "level": 82}
                ]
            )
            
            skills3 = SkillCategoryModel(
                category="DevOps",
                items=[
                    {"name": "Docker", "level": 85},
                    {"name": "AWS", "level": 80},
                    {"name": "CI/CD", "level": 83},
                    {"name": "Kubernetes", "level": 75}
                ]
            )
            
            db.add(skills1)
            db.add(skills2)
            db.add(skills3)
            
            # Projets
            project1 = ProjectModel(
                title="Plateforme E-commerce",
                description="Développement d'une plateforme e-commerce complète avec React et FastAPI",
                technologies=["React", "FastAPI", "PostgreSQL", "Stripe", "AWS"],
                image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE2Ij5Qcm9qZXQgRS1jb21tZXJjZTwvdGV4dD4KPC9zdmc+",
                category="Web Development",
                date="2024",
                highlights=["Paiement sécurisé", "Interface responsive", "Panel d'administration", "API RESTful"],
                github_url="https://github.com/hocine-iratni/ecommerce-platform",
                demo_url="https://demo-ecommerce.example.com"
            )
            
            project2 = ProjectModel(
                title="Application de Gestion de Tâches",
                description="Application collaborative pour la gestion de projets et tâches en équipe",
                technologies=["Vue.js", "Express.js", "MongoDB", "Socket.io"],
                image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRUNGREYxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE2Ij5BcHAgR2VzdGlvbiBUw6JjaGVzPC90ZXh0Pgo8L3N2Zz4=",
                category="Application Web",
                date="2023",
                highlights=["Collaboration temps réel", "Notifications push", "Dashboard analytique", "Export PDF"],
                github_url="https://github.com/hocine-iratni/task-manager",
                demo_url="https://demo-tasks.example.com"
            )
            
            db.add(project1)
            db.add(project2)
            
            # Expériences
            experience1 = ExperienceModel(
                title="Développeur Full Stack Senior",
                company="TechCorp France",
                period="2022 - Présent",
                description="Développement d'applications web et mobiles pour des clients variés",
                responsibilities=[
                    "Développement d'applications React/Vue.js",
                    "Conception d'APIs RESTful avec FastAPI",
                    "Gestion de bases de données PostgreSQL",
                    "Déploiement et maintenance sur AWS",
                    "Encadrement d'équipe de 3 développeurs junior"
                ]
            )
            
            experience2 = ExperienceModel(
                title="Développeur Frontend",
                company="WebAgency Paris",
                period="2020 - 2022",
                description="Création d'interfaces utilisateur modernes et responsives",
                responsibilities=[
                    "Développement d'interfaces React.js",
                    "Intégration d'APIs tierces",
                    "Optimisation des performances",
                    "Tests unitaires et d'intégration"
                ]
            )
            
            db.add(experience1)
            db.add(experience2)
            
            # Certifications
            cert1 = CertificationModel(
                name="AWS Solutions Architect",
                issuer="Amazon Web Services",
                status="Obtenu",
                date="2023",
                description="Certification en architecture cloud AWS",
                credential_url="https://aws.amazon.com/certification/certified-solutions-architect-associate/"
            )
            
            cert2 = CertificationModel(
                name="Python Professional",
                issuer="Python Institute",
                status="Obtenu",
                date="2022",
                description="Certification avancée en développement Python",
                credential_url="https://pythoninstitute.org/certification"
            )
            
            db.add(cert1)
            db.add(cert2)
            
            # Témoignages
            testimonial1 = TestimonialModel(
                name="Marie Dubois",
                role="Chef de projet",
                company="TechCorp France",
                content="Hocine est un développeur exceptionnel. Sa capacité à résoudre des problèmes complexes et son approche collaborative font de lui un atout précieux pour toute équipe.",
                avatar="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNFRDhGMzYiLz4KPHRleHQgeD0iMjUiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5NRDwvdGV4dD4KPC9zdmc+"
            )
            
            testimonial2 = TestimonialModel(
                name="Pierre Martin",
                role="Directeur Technique",
                company="WebAgency Paris",
                content="Hocine a démontré des compétences techniques solides et une grande capacité d'adaptation. Son travail sur nos projets React a été remarquable.",
                avatar="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiMzQjgyRjYiLz4KPHRleHQgeD0iMjUiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5QTTwvdGV4dD4KPC9zdmc+"
            )
            
            db.add(testimonial1)
            db.add(testimonial2)
            
            # Procédures
            procedure1 = ProcedureModel(
                title="Déploiement d'une application React",
                description="Guide étape par étape pour déployer une application React sur AWS",
                content="""
# Déploiement d'une application React sur AWS

## Prérequis
- Compte AWS configuré
- Application React prête à déployer
- AWS CLI installé

## Étapes

### 1. Build de l'application
```bash
npm run build
```

### 2. Configuration S3
- Créer un bucket S3
- Configurer l'hébergement web statique
- Télécharger les fichiers de build

### 3. Configuration CloudFront
- Créer une distribution CloudFront
- Configurer les redirections
- Attendre la propagation (15-20 minutes)

### 4. Configuration du domaine
- Configurer Route 53 si nécessaire
- Ajouter les certificats SSL

## Vérifications
- Tester l'application sur le domaine final
- Vérifier la compression et la mise en cache
- Tester sur différents navigateurs
""",
                category="Déploiement",
                tags=["React", "AWS", "S3", "CloudFront", "Déploiement"]
            )
            
            procedure2 = ProcedureModel(
                title="Configuration d'une API FastAPI",
                description="Configuration complète d'une API FastAPI avec authentification",
                content="""
# Configuration d'une API FastAPI

## Installation
```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt]
```

## Structure du projet
```
app/
├── main.py
├── models/
├── routes/
├── auth/
└── database.py
```

## Configuration de base
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mon API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Authentification JWT
- Configuration des clés secrètes
- Middleware d'authentification
- Endpoints de login/logout

## Tests
```bash
pytest tests/
```
""",
                category="Développement",
                tags=["FastAPI", "Python", "API", "JWT", "Authentification"]
            )
            
            db.add(procedure1)
            db.add(procedure2)
            
            # Contenu de veille
            veille1 = VeilleContentModel(
                type="technologique",
                title="Nouvelles fonctionnalités React 19",
                content="React 19 apporte des améliorations significatives en termes de performance et de développement. Les nouvelles fonctionnalités incluent : Server Components stables, Actions pour la gestion des formulaires, nouveaux hooks useOptimistic et useFormStatus, et des améliorations du compilateur React."
            )
            
            veille2 = VeilleContentModel(
                type="juridique",
                title="RGPD et développement web",
                content="Le Règlement Général sur la Protection des Données (RGPD) impose des obligations importantes pour les développeurs web. Les points clés incluent : consentement explicite pour les cookies, droit à l'oubli, portabilité des données, et notification des violations dans les 72 heures."
            )
            
            db.add(veille1)
            db.add(veille2)
            
            # Sauvegarder toutes les données
            db.commit()
            print("✅ Données de démonstration insérées avec succès!")
            
        else:
            print("ℹ️ Des données existent déjà dans la base de données.")
            
    except Exception as e:
        print(f"❌ Erreur lors de l'insertion des données: {e}")
        db.rollback()
        
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initialisation de la base de données Portfolio...")
    init_database()
    print("✅ Initialisation terminée!")