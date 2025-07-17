#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Portfolio Migration
Tests all endpoints after MongoDB to PostgreSQL migration
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Backend URL from environment
BACKEND_URL = "https://c4579023-7de2-4520-987d-e76d1cabaa03.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class PortfolioAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_ids = {}  # Store created IDs for cleanup
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response_data': response_data
        })
        
    def test_health_endpoints(self):
        """Test basic health and root endpoints"""
        print("\n=== Testing Health Endpoints ===")
        
        # Test root endpoint
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/", True, f"Response: {data}")
            else:
                self.log_test("GET /api/", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/", False, f"Error: {str(e)}")
            
        # Test health endpoint
        try:
            response = self.session.get(f"{API_BASE}/health")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/health", True, f"Response: {data}")
            else:
                self.log_test("GET /api/health", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/health", False, f"Error: {str(e)}")
    
    def test_personal_info(self):
        """Test personal info endpoints"""
        print("\n=== Testing Personal Info Endpoints ===")
        
        # Test GET personal info
        try:
            response = self.session.get(f"{API_BASE}/portfolio/personal-info")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/personal-info", True, f"Retrieved personal info for: {data.get('name', 'Unknown')}")
                
                # Test PUT personal info update
                update_data = {
                    "name": "Hocine IRATNI - Updated",
                    "title": "Développeur Full-Stack Senior - Updated"
                }
                
                put_response = self.session.put(
                    f"{API_BASE}/portfolio/personal-info",
                    json=update_data
                )
                
                if put_response.status_code == 200:
                    updated_data = put_response.json()
                    self.log_test("PUT /api/portfolio/personal-info", True, f"Updated name to: {updated_data.get('name')}")
                else:
                    self.log_test("PUT /api/portfolio/personal-info", False, f"Status: {put_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/personal-info", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/portfolio/personal-info", False, f"Error: {str(e)}")
    
    def test_education_crud(self):
        """Test education CRUD operations"""
        print("\n=== Testing Education CRUD ===")
        
        # Test GET education list
        try:
            response = self.session.get(f"{API_BASE}/portfolio/education")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/education", True, f"Retrieved {len(data)} education records")
                
                # Test POST create education
                new_education = {
                    "degree": "Master en Informatique - Test",
                    "school": "Université de Test",
                    "period": "2020-2022",
                    "description": "Formation complète en développement logiciel et architecture système",
                    "skills": ["Python", "PostgreSQL", "FastAPI", "React"]
                }
                
                post_response = self.session.post(
                    f"{API_BASE}/portfolio/education",
                    json=new_education
                )
                
                if post_response.status_code == 200:
                    created_data = post_response.json()
                    education_id = created_data.get('id')
                    self.created_ids['education'] = education_id
                    self.log_test("POST /api/portfolio/education", True, f"Created education with ID: {education_id}")
                    
                    # Test PUT update education
                    update_data = {
                        "degree": "Master en Informatique - Updated",
                        "description": "Formation mise à jour"
                    }
                    
                    put_response = self.session.put(
                        f"{API_BASE}/portfolio/education/{education_id}",
                        json=update_data
                    )
                    
                    if put_response.status_code == 200:
                        self.log_test("PUT /api/portfolio/education/{id}", True, "Education updated successfully")
                    else:
                        self.log_test("PUT /api/portfolio/education/{id}", False, f"Status: {put_response.status_code}")
                        
                    # Test DELETE education
                    delete_response = self.session.delete(f"{API_BASE}/portfolio/education/{education_id}")
                    if delete_response.status_code == 200:
                        self.log_test("DELETE /api/portfolio/education/{id}", True, "Education deleted successfully")
                    else:
                        self.log_test("DELETE /api/portfolio/education/{id}", False, f"Status: {delete_response.status_code}")
                        
                else:
                    self.log_test("POST /api/portfolio/education", False, f"Status: {post_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/education", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Education CRUD", False, f"Error: {str(e)}")
    
    def test_skills_crud(self):
        """Test skills CRUD operations"""
        print("\n=== Testing Skills CRUD ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/skills")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/skills", True, f"Retrieved {len(data)} skill categories")
                
                # Test POST create skill category
                new_skill = {
                    "category": "Test Technologies",
                    "items": [
                        {"name": "PostgreSQL", "level": 90},
                        {"name": "FastAPI", "level": 85}
                    ]
                }
                
                post_response = self.session.post(
                    f"{API_BASE}/portfolio/skills",
                    json=new_skill
                )
                
                if post_response.status_code == 200:
                    created_data = post_response.json()
                    skill_id = created_data.get('id')
                    self.created_ids['skill'] = skill_id
                    self.log_test("POST /api/portfolio/skills", True, f"Created skill category with ID: {skill_id}")
                    
                    # Test PUT update skill
                    update_data = {
                        "category": "Updated Test Technologies",
                        "items": [
                            {"name": "PostgreSQL", "level": 95},
                            {"name": "FastAPI", "level": 90},
                            {"name": "SQLAlchemy", "level": 85}
                        ]
                    }
                    
                    put_response = self.session.put(
                        f"{API_BASE}/portfolio/skills/{skill_id}",
                        json=update_data
                    )
                    
                    if put_response.status_code == 200:
                        self.log_test("PUT /api/portfolio/skills/{id}", True, "Skill category updated successfully")
                    else:
                        self.log_test("PUT /api/portfolio/skills/{id}", False, f"Status: {put_response.status_code}")
                        
                    # Test DELETE skill
                    delete_response = self.session.delete(f"{API_BASE}/portfolio/skills/{skill_id}")
                    if delete_response.status_code == 200:
                        self.log_test("DELETE /api/portfolio/skills/{id}", True, "Skill category deleted successfully")
                    else:
                        self.log_test("DELETE /api/portfolio/skills/{id}", False, f"Status: {delete_response.status_code}")
                        
                else:
                    self.log_test("POST /api/portfolio/skills", False, f"Status: {post_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/skills", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Skills CRUD", False, f"Error: {str(e)}")
    
    def test_projects_crud(self):
        """Test projects CRUD operations"""
        print("\n=== Testing Projects CRUD ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/projects")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/projects", True, f"Retrieved {len(data)} projects")
                
                # Test POST create project
                new_project = {
                    "title": "Portfolio Migration Test",
                    "description": "Migration complète de MongoDB vers PostgreSQL",
                    "technologies": ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy"],
                    "image": "https://example.com/migration-project.jpg",
                    "category": "Backend Development",
                    "date": "2024",
                    "highlights": [
                        "Migration réussie de MongoDB vers PostgreSQL",
                        "Implémentation complète avec SQLAlchemy",
                        "Tests API complets"
                    ],
                    "github_url": "https://github.com/test/portfolio-migration",
                    "demo_url": "https://portfolio-demo.com"
                }
                
                post_response = self.session.post(
                    f"{API_BASE}/portfolio/projects",
                    json=new_project
                )
                
                if post_response.status_code == 200:
                    created_data = post_response.json()
                    project_id = created_data.get('id')
                    self.created_ids['project'] = project_id
                    self.log_test("POST /api/portfolio/projects", True, f"Created project with ID: {project_id}")
                    
                    # Test GET specific project
                    get_response = self.session.get(f"{API_BASE}/portfolio/projects/{project_id}")
                    if get_response.status_code == 200:
                        self.log_test("GET /api/portfolio/projects/{id}", True, "Retrieved specific project")
                    else:
                        self.log_test("GET /api/portfolio/projects/{id}", False, f"Status: {get_response.status_code}")
                    
                    # Test PUT update project
                    update_data = {
                        "title": "Portfolio Migration Test - Updated",
                        "description": "Migration mise à jour avec tests complets"
                    }
                    
                    put_response = self.session.put(
                        f"{API_BASE}/portfolio/projects/{project_id}",
                        json=update_data
                    )
                    
                    if put_response.status_code == 200:
                        self.log_test("PUT /api/portfolio/projects/{id}", True, "Project updated successfully")
                    else:
                        self.log_test("PUT /api/portfolio/projects/{id}", False, f"Status: {put_response.status_code}")
                        
                    # Test DELETE project
                    delete_response = self.session.delete(f"{API_BASE}/portfolio/projects/{project_id}")
                    if delete_response.status_code == 200:
                        self.log_test("DELETE /api/portfolio/projects/{id}", True, "Project deleted successfully")
                    else:
                        self.log_test("DELETE /api/portfolio/projects/{id}", False, f"Status: {delete_response.status_code}")
                        
                else:
                    self.log_test("POST /api/portfolio/projects", False, f"Status: {post_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/projects", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Projects CRUD", False, f"Error: {str(e)}")
    
    def test_experience_crud(self):
        """Test experience CRUD operations"""
        print("\n=== Testing Experience CRUD ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/experience")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/experience", True, f"Retrieved {len(data)} experience records")
                
                # Test POST create experience
                new_experience = {
                    "title": "Développeur Backend Senior - Test",
                    "company": "TechCorp Test",
                    "period": "2023-2024",
                    "description": "Développement d'APIs robustes et migration de bases de données",
                    "responsibilities": [
                        "Migration MongoDB vers PostgreSQL",
                        "Développement d'APIs FastAPI",
                        "Optimisation des performances"
                    ]
                }
                
                post_response = self.session.post(
                    f"{API_BASE}/portfolio/experience",
                    json=new_experience
                )
                
                if post_response.status_code == 200:
                    created_data = post_response.json()
                    experience_id = created_data.get('id')
                    self.created_ids['experience'] = experience_id
                    self.log_test("POST /api/portfolio/experience", True, f"Created experience with ID: {experience_id}")
                    
                    # Test PUT update experience
                    update_data = {
                        "title": "Développeur Backend Senior - Updated",
                        "description": "Description mise à jour"
                    }
                    
                    put_response = self.session.put(
                        f"{API_BASE}/portfolio/experience/{experience_id}",
                        json=update_data
                    )
                    
                    if put_response.status_code == 200:
                        self.log_test("PUT /api/portfolio/experience/{id}", True, "Experience updated successfully")
                    else:
                        self.log_test("PUT /api/portfolio/experience/{id}", False, f"Status: {put_response.status_code}")
                        
                    # Test DELETE experience
                    delete_response = self.session.delete(f"{API_BASE}/portfolio/experience/{experience_id}")
                    if delete_response.status_code == 200:
                        self.log_test("DELETE /api/portfolio/experience/{id}", True, "Experience deleted successfully")
                    else:
                        self.log_test("DELETE /api/portfolio/experience/{id}", False, f"Status: {delete_response.status_code}")
                        
                else:
                    self.log_test("POST /api/portfolio/experience", False, f"Status: {post_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/experience", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Experience CRUD", False, f"Error: {str(e)}")
    
    def test_certifications_crud(self):
        """Test certifications CRUD operations"""
        print("\n=== Testing Certifications CRUD ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/certifications")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/certifications", True, f"Retrieved {len(data)} certifications")
                
                # Test POST create certification
                new_certification = {
                    "name": "PostgreSQL Database Administration - Test",
                    "issuer": "PostgreSQL Global Development Group",
                    "status": "Obtenu",
                    "date": "2024",
                    "description": "Certification complète en administration PostgreSQL",
                    "credential_url": "https://postgresql.org/cert/test123"
                }
                
                post_response = self.session.post(
                    f"{API_BASE}/portfolio/certifications",
                    json=new_certification
                )
                
                if post_response.status_code == 200:
                    created_data = post_response.json()
                    cert_id = created_data.get('id')
                    self.created_ids['certification'] = cert_id
                    self.log_test("POST /api/portfolio/certifications", True, f"Created certification with ID: {cert_id}")
                    
                    # Test PUT update certification
                    update_data = {
                        "name": "PostgreSQL Database Administration - Updated",
                        "description": "Description mise à jour"
                    }
                    
                    put_response = self.session.put(
                        f"{API_BASE}/portfolio/certifications/{cert_id}",
                        json=update_data
                    )
                    
                    if put_response.status_code == 200:
                        self.log_test("PUT /api/portfolio/certifications/{id}", True, "Certification updated successfully")
                    else:
                        self.log_test("PUT /api/portfolio/certifications/{id}", False, f"Status: {put_response.status_code}")
                        
                    # Test DELETE certification
                    delete_response = self.session.delete(f"{API_BASE}/portfolio/certifications/{cert_id}")
                    if delete_response.status_code == 200:
                        self.log_test("DELETE /api/portfolio/certifications/{id}", True, "Certification deleted successfully")
                    else:
                        self.log_test("DELETE /api/portfolio/certifications/{id}", False, f"Status: {delete_response.status_code}")
                        
                else:
                    self.log_test("POST /api/portfolio/certifications", False, f"Status: {post_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/certifications", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Certifications CRUD", False, f"Error: {str(e)}")
    
    def test_testimonials_crud(self):
        """Test testimonials CRUD operations"""
        print("\n=== Testing Testimonials CRUD ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/testimonials")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/testimonials", True, f"Retrieved {len(data)} testimonials")
                
                # Test POST create testimonial
                new_testimonial = {
                    "name": "Marie Dubois",
                    "role": "Chef de Projet",
                    "company": "TechSolutions",
                    "content": "Excellent travail sur la migration PostgreSQL. Hocine a démontré une expertise technique remarquable.",
                    "avatar": "https://example.com/avatar-marie.jpg"
                }
                
                post_response = self.session.post(
                    f"{API_BASE}/portfolio/testimonials",
                    json=new_testimonial
                )
                
                if post_response.status_code == 200:
                    created_data = post_response.json()
                    testimonial_id = created_data.get('id')
                    self.created_ids['testimonial'] = testimonial_id
                    self.log_test("POST /api/portfolio/testimonials", True, f"Created testimonial with ID: {testimonial_id}")
                    
                    # Test PUT update testimonial
                    update_data = {
                        "content": "Excellent travail sur la migration PostgreSQL - mise à jour du témoignage."
                    }
                    
                    put_response = self.session.put(
                        f"{API_BASE}/portfolio/testimonials/{testimonial_id}",
                        json=update_data
                    )
                    
                    if put_response.status_code == 200:
                        self.log_test("PUT /api/portfolio/testimonials/{id}", True, "Testimonial updated successfully")
                    else:
                        self.log_test("PUT /api/portfolio/testimonials/{id}", False, f"Status: {put_response.status_code}")
                        
                    # Test DELETE testimonial
                    delete_response = self.session.delete(f"{API_BASE}/portfolio/testimonials/{testimonial_id}")
                    if delete_response.status_code == 200:
                        self.log_test("DELETE /api/portfolio/testimonials/{id}", True, "Testimonial deleted successfully")
                    else:
                        self.log_test("DELETE /api/portfolio/testimonials/{id}", False, f"Status: {delete_response.status_code}")
                        
                else:
                    self.log_test("POST /api/portfolio/testimonials", False, f"Status: {post_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/testimonials", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Testimonials CRUD", False, f"Error: {str(e)}")
    
    def test_contact_messages_crud(self):
        """Test contact messages CRUD operations"""
        print("\n=== Testing Contact Messages CRUD ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/contact-messages")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/contact-messages", True, f"Retrieved {len(data)} contact messages")
                
                # Test POST create contact message
                new_message = {
                    "name": "Jean Martin",
                    "email": "jean.martin@example.com",
                    "message": "Bonjour, je suis intéressé par vos services de migration de base de données. Pouvez-vous me contacter ?"
                }
                
                post_response = self.session.post(
                    f"{API_BASE}/portfolio/contact-messages",
                    json=new_message
                )
                
                if post_response.status_code == 200:
                    created_data = post_response.json()
                    message_id = created_data.get('id')
                    self.created_ids['contact_message'] = message_id
                    self.log_test("POST /api/portfolio/contact-messages", True, f"Created contact message with ID: {message_id}")
                    
                    # Test PUT mark as read
                    put_response = self.session.put(f"{API_BASE}/portfolio/contact-messages/{message_id}/read")
                    
                    if put_response.status_code == 200:
                        self.log_test("PUT /api/portfolio/contact-messages/{id}/read", True, "Message marked as read successfully")
                    else:
                        self.log_test("PUT /api/portfolio/contact-messages/{id}/read", False, f"Status: {put_response.status_code}")
                        
                    # Test DELETE contact message
                    delete_response = self.session.delete(f"{API_BASE}/portfolio/contact-messages/{message_id}")
                    if delete_response.status_code == 200:
                        self.log_test("DELETE /api/portfolio/contact-messages/{id}", True, "Contact message deleted successfully")
                    else:
                        self.log_test("DELETE /api/portfolio/contact-messages/{id}", False, f"Status: {delete_response.status_code}")
                        
                else:
                    self.log_test("POST /api/portfolio/contact-messages", False, f"Status: {post_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/contact-messages", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Contact Messages CRUD", False, f"Error: {str(e)}")
    
    def test_procedures_crud(self):
        """Test procedures CRUD operations"""
        print("\n=== Testing Procedures CRUD ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/procedures")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/procedures", True, f"Retrieved {len(data)} procedures")
                
                # Test POST create procedure
                new_procedure = {
                    "title": "Migration MongoDB vers PostgreSQL",
                    "description": "Procédure complète pour migrer une base de données MongoDB vers PostgreSQL",
                    "content": "1. Analyse de la structure MongoDB\n2. Création des modèles PostgreSQL\n3. Migration des données\n4. Tests de validation",
                    "category": "Base de données",
                    "tags": ["mongodb", "postgresql", "migration", "database"]
                }
                
                post_response = self.session.post(
                    f"{API_BASE}/portfolio/procedures",
                    json=new_procedure
                )
                
                if post_response.status_code == 200:
                    created_data = post_response.json()
                    procedure_id = created_data.get('id')
                    self.created_ids['procedure'] = procedure_id
                    self.log_test("POST /api/portfolio/procedures", True, f"Created procedure with ID: {procedure_id}")
                    
                    # Test GET specific procedure
                    get_response = self.session.get(f"{API_BASE}/portfolio/procedures/{procedure_id}")
                    if get_response.status_code == 200:
                        self.log_test("GET /api/portfolio/procedures/{id}", True, "Retrieved specific procedure")
                    else:
                        self.log_test("GET /api/portfolio/procedures/{id}", False, f"Status: {get_response.status_code}")
                    
                    # Test PUT update procedure
                    update_data = {
                        "title": "Migration MongoDB vers PostgreSQL - Updated",
                        "description": "Procédure mise à jour avec plus de détails"
                    }
                    
                    put_response = self.session.put(
                        f"{API_BASE}/portfolio/procedures/{procedure_id}",
                        json=update_data
                    )
                    
                    if put_response.status_code == 200:
                        self.log_test("PUT /api/portfolio/procedures/{id}", True, "Procedure updated successfully")
                    else:
                        self.log_test("PUT /api/portfolio/procedures/{id}", False, f"Status: {put_response.status_code}")
                        
                    # Test DELETE procedure
                    delete_response = self.session.delete(f"{API_BASE}/portfolio/procedures/{procedure_id}")
                    if delete_response.status_code == 200:
                        self.log_test("DELETE /api/portfolio/procedures/{id}", True, "Procedure deleted successfully")
                    else:
                        self.log_test("DELETE /api/portfolio/procedures/{id}", False, f"Status: {delete_response.status_code}")
                        
                else:
                    self.log_test("POST /api/portfolio/procedures", False, f"Status: {post_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/procedures", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Procedures CRUD", False, f"Error: {str(e)}")
    
    def test_veille_crud(self):
        """Test veille content CRUD operations"""
        print("\n=== Testing Veille Content CRUD ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/veille")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/portfolio/veille", True, f"Retrieved {len(data)} veille content items")
                
                # Test GET veille by type
                tech_response = self.session.get(f"{API_BASE}/portfolio/veille/technologique")
                if tech_response.status_code == 200:
                    tech_data = tech_response.json()
                    self.log_test("GET /api/portfolio/veille/technologique", True, f"Retrieved {len(tech_data)} tech veille items")
                else:
                    self.log_test("GET /api/portfolio/veille/technologique", False, f"Status: {tech_response.status_code}")
                
                # Test POST create veille content
                new_veille = {
                    "type": "technologique",
                    "title": "PostgreSQL 16 - Nouvelles fonctionnalités",
                    "content": "PostgreSQL 16 apporte de nombreuses améliorations en termes de performances et de nouvelles fonctionnalités pour les développeurs."
                }
                
                post_response = self.session.post(
                    f"{API_BASE}/portfolio/veille",
                    json=new_veille
                )
                
                if post_response.status_code == 200:
                    created_data = post_response.json()
                    veille_id = created_data.get('id')
                    self.created_ids['veille'] = veille_id
                    self.log_test("POST /api/portfolio/veille", True, f"Created veille content with ID: {veille_id}")
                    
                    # Test PUT update veille content
                    update_data = {
                        "title": "PostgreSQL 16 - Nouvelles fonctionnalités - Updated",
                        "content": "Contenu mis à jour avec plus de détails sur PostgreSQL 16"
                    }
                    
                    put_response = self.session.put(
                        f"{API_BASE}/portfolio/veille/{veille_id}",
                        json=update_data
                    )
                    
                    if put_response.status_code == 200:
                        self.log_test("PUT /api/portfolio/veille/{id}", True, "Veille content updated successfully")
                    else:
                        self.log_test("PUT /api/portfolio/veille/{id}", False, f"Status: {put_response.status_code}")
                        
                    # Test DELETE veille content
                    delete_response = self.session.delete(f"{API_BASE}/portfolio/veille/{veille_id}")
                    if delete_response.status_code == 200:
                        self.log_test("DELETE /api/portfolio/veille/{id}", True, "Veille content deleted successfully")
                    else:
                        self.log_test("DELETE /api/portfolio/veille/{id}", False, f"Status: {delete_response.status_code}")
                        
                else:
                    self.log_test("POST /api/portfolio/veille", False, f"Status: {post_response.status_code}")
                    
            else:
                self.log_test("GET /api/portfolio/veille", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Veille Content CRUD", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting comprehensive API testing for: {BACKEND_URL}")
        print(f"📅 Test started at: {datetime.now()}")
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_personal_info()
        self.test_education_crud()
        self.test_skills_crud()
        self.test_projects_crud()
        self.test_experience_crud()
        self.test_certifications_crud()
        self.test_testimonials_crud()
        self.test_contact_messages_crud()
        self.test_procedures_crud()
        self.test_veille_crud()
        
        # Summary
        print(f"\n{'='*60}")
        print("📊 TEST SUMMARY")
        print(f"{'='*60}")
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print(f"\n📅 Test completed at: {datetime.now()}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = PortfolioAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)