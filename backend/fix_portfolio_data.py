#!/usr/bin/env python3
"""
Script de correction des données du portfolio
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from db_models import PersonalInfo as PersonalInfoModel, Education as EducationModel, Experience as ExperienceModel

def fix_portfolio_data():
    """Corrige les données du portfolio"""
    
    db = SessionLocal()
    
    try:
        print("🔧 Correction des données du portfolio...")
        
        # 1. Corriger les informations personnelles
        personal_info = db.query(PersonalInfoModel).first()
        if personal_info:
            # Supprimer "-Updated" du nom
            personal_info.name = personal_info.name.replace(" - Updated", "").replace("-Updated", "")
            personal_info.title = "Etudiant en BTS SIO-SISR"
            print("✅ Informations personnelles corrigées")
        
        # 2. Corriger les formations
        education = db.query(EducationModel).filter(EducationModel.degree.like("%math-info-méchanique%")).first()
        if education:
            education.degree = "Licences de Mathématique, Physique, Informatique"
            education.school = "Aix marseille université"
            print("✅ Formation licence corrigée")
        else:
            # Chercher aussi avec le nom actuel
            education = db.query(EducationModel).filter(EducationModel.degree.like("%portails%")).first()
            if education:
                education.degree = "Licences de Mathématique, Physique, Informatique"
                education.school = "Aix marseille université"
                print("✅ Formation licence corrigée")
        
        # 3. Corriger l'expérience
        experience = db.query(ExperienceModel).filter(ExperienceModel.title.like("%Stage%")).first()
        if experience:
            experience.title = "Stage Administrateur Réseaux"
            print("✅ Expérience corrigée")
        
        # Sauvegarder les modifications
        db.commit()
        print("✅ Toutes les corrections ont été appliquées avec succès!")
        
    except Exception as e:
        print(f"❌ Erreur lors de la correction: {e}")
        db.rollback()
        
    finally:
        db.close()

if __name__ == "__main__":
    fix_portfolio_data()