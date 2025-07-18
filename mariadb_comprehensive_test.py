#!/usr/bin/env python3
"""
MariaDB Migration Comprehensive Validation
Tests all aspects requested by the user for the PostgreSQL to MariaDB migration
"""

import requests
import json
import sys
from datetime import datetime
import uuid
import time

# Backend URL for local MariaDB testing
BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api"

class MariaDBMigrationValidator:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message="", details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })
    
    def test_mariadb_connection(self):
        """Test 1: MariaDB Connection"""
        print("\n=== Test 1: Connexion MariaDB ===")
        
        try:
            response = self.session.get(f"{API_BASE}/health")
            if response.status_code == 200:
                data = response.json()
                db_status = data.get('database', {}).get('status', 'unknown')
                db_response_time = data.get('database', {}).get('response_time', 'unknown')
                pool_info = data.get('connection_pool', {})
                
                if db_status == 'healthy':
                    self.log_test(
                        "Connexion MariaDB", 
                        True, 
                        f"Base de données saine, temps de réponse: {db_response_time}, Pool: {pool_info}",
                        data.get('database')
                    )
                else:
                    self.log_test("Connexion MariaDB", False, f"Statut base de données: {db_status}")
            else:
                self.log_test("Connexion MariaDB", False, f"Échec health check: {response.status_code}")
        except Exception as e:
            self.log_test("Connexion MariaDB", False, f"Erreur de connexion: {str(e)}")
    
    def test_health_check_endpoint(self):
        """Test 2: Health Check Endpoint"""
        print("\n=== Test 2: Health Check http://localhost:8001/api/health ===")
        
        try:
            response = self.session.get(f"{API_BASE}/health")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['status', 'database', 'connection_pool', 'timestamp']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    self.log_test(
                        "Health Check Endpoint", 
                        True, 
                        f"Endpoint fonctionnel, statut: {data.get('status')}, tous les champs présents"
                    )
                else:
                    self.log_test("Health Check Endpoint", False, f"Champs manquants: {missing_fields}")
            else:
                self.log_test("Health Check Endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Health Check Endpoint", False, f"Erreur: {str(e)}")
    
    def test_all_portfolio_endpoints(self):
        """Test 3: Tous les endpoints API du portfolio"""
        print("\n=== Test 3: Tous les endpoints API du portfolio ===")
        
        endpoints = [
            ("personal-info", "Informations personnelles"),
            ("education", "Formation"),
            ("skills", "Compétences"),
            ("projects", "Projets"),
            ("experience", "Expérience"),
            ("certifications", "Certifications"),
            ("testimonials", "Témoignages"),
            ("contact-messages", "Messages de contact"),
            ("procedures", "Procédures"),
            ("veille", "Contenu de veille")
        ]
        
        successful_endpoints = 0
        total_endpoints = len(endpoints)
        
        for endpoint, description in endpoints:
            try:
                response = self.session.get(f"{API_BASE}/portfolio/{endpoint}")
                if response.status_code == 200:
                    data = response.json()
                    count = len(data) if isinstance(data, list) else 1
                    self.log_test(
                        f"GET /api/portfolio/{endpoint}", 
                        True, 
                        f"{description} - {count} enregistrement(s) récupéré(s)"
                    )
                    successful_endpoints += 1
                else:
                    self.log_test(f"GET /api/portfolio/{endpoint}", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"GET /api/portfolio/{endpoint}", False, f"Erreur: {str(e)}")
        
        # Test de résumé
        success_rate = (successful_endpoints / total_endpoints) * 100
        if success_rate == 100:
            self.log_test("Tous les endpoints portfolio", True, f"Tous les {total_endpoints} endpoints fonctionnent (100%)")
        else:
            self.log_test("Tous les endpoints portfolio", False, f"Seulement {successful_endpoints}/{total_endpoints} endpoints fonctionnent ({success_rate:.1f}%)")
    
    def test_demo_data_presence(self):
        """Test 4: Vérification présence des données de démonstration"""
        print("\n=== Test 4: Vérification des données de démonstration ===")
        
        # Test données personnelles
        try:
            response = self.session.get(f"{API_BASE}/portfolio/personal-info")
            if response.status_code == 200:
                data = response.json()
                name = data.get('name', '')
                title = data.get('title', '')
                
                if name and title:
                    self.log_test("Données démo - Infos personnelles", True, f"Trouvé: {name} - {title}")
                else:
                    self.log_test("Données démo - Infos personnelles", False, "Données personnelles manquantes")
            else:
                self.log_test("Données démo - Infos personnelles", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Données démo - Infos personnelles", False, f"Erreur: {str(e)}")
        
        # Test données compétences
        try:
            response = self.session.get(f"{API_BASE}/portfolio/skills")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Données démo - Compétences", True, f"Trouvé {len(data)} catégories de compétences")
                else:
                    self.log_test("Données démo - Compétences", False, "Aucune donnée de compétences trouvée")
            else:
                self.log_test("Données démo - Compétences", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Données démo - Compétences", False, f"Erreur: {str(e)}")
        
        # Test données projets
        try:
            response = self.session.get(f"{API_BASE}/portfolio/projects")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Données démo - Projets", True, f"Trouvé {len(data)} projets")
                else:
                    self.log_test("Données démo - Projets", False, "Aucune donnée de projets trouvée")
            else:
                self.log_test("Données démo - Projets", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Données démo - Projets", False, f"Erreur: {str(e)}")
    
    def test_stability_consecutive_requests(self):
        """Test 5: Stabilité - Plusieurs requêtes consécutives"""
        print("\n=== Test 5: Stabilité - Plusieurs requêtes consécutives ===")
        
        consecutive_requests = 10
        success_count = 0
        endpoints = [
            f"{API_BASE}/portfolio/personal-info",
            f"{API_BASE}/portfolio/skills",
            f"{API_BASE}/portfolio/projects",
            f"{API_BASE}/portfolio/experience"
        ]
        
        for i in range(consecutive_requests):
            endpoint = endpoints[i % len(endpoints)]  # Rotation des endpoints
            try:
                response = self.session.get(endpoint)
                if response.status_code == 200:
                    success_count += 1
                    print(f"  Requête {i+1}/{consecutive_requests}: ✅ {endpoint.split('/')[-1]}")
                else:
                    print(f"  Requête {i+1}/{consecutive_requests}: ❌ Status {response.status_code}")
                
                # Petit délai entre les requêtes
                time.sleep(0.1)
                
            except Exception as e:
                print(f"  Requête {i+1}/{consecutive_requests}: ❌ Erreur: {str(e)}")
        
        success_rate = (success_count / consecutive_requests) * 100
        if success_rate >= 95:
            self.log_test("Test de stabilité", True, f"{success_count}/{consecutive_requests} requêtes réussies ({success_rate:.1f}%)")
        else:
            self.log_test("Test de stabilité", False, f"Seulement {success_count}/{consecutive_requests} requêtes réussies ({success_rate:.1f}%)")
    
    def test_crud_operations(self):
        """Test 6: Opérations CRUD complètes"""
        print("\n=== Test 6: Opérations CRUD (Création, Lecture, Modification, Suppression) ===")
        
        # Test CREATE avec messages de contact
        try:
            test_message = {
                "name": "Test Migration MariaDB",
                "email": "test@migration-mariadb.com",
                "message": "Test des opérations CRUD après migration PostgreSQL vers MariaDB"
            }
            
            response = self.session.post(f"{API_BASE}/portfolio/contact-messages", json=test_message)
            if response.status_code in [200, 201]:
                data = response.json()
                created_id = data.get('id')
                self.log_test("CRUD - CREATE", True, f"Message de contact créé avec ID: {created_id}")
                
                # Test READ
                if created_id:
                    read_response = self.session.get(f"{API_BASE}/portfolio/contact-messages")
                    if read_response.status_code == 200:
                        messages = read_response.json()
                        found_message = any(msg.get('id') == created_id for msg in messages)
                        if found_message:
                            self.log_test("CRUD - READ", True, "Message créé trouvé dans la liste")
                            
                            # Test UPDATE (marquer comme lu)
                            update_response = self.session.put(f"{API_BASE}/portfolio/contact-messages/{created_id}/mark-read")
                            if update_response.status_code == 200:
                                self.log_test("CRUD - UPDATE", True, "Message marqué comme lu avec succès")
                            else:
                                self.log_test("CRUD - UPDATE", False, f"Échec mise à jour: {update_response.status_code}")
                            
                            # Test DELETE
                            delete_response = self.session.delete(f"{API_BASE}/portfolio/contact-messages/{created_id}")
                            if delete_response.status_code in [200, 204]:
                                self.log_test("CRUD - DELETE", True, "Message supprimé avec succès")
                            else:
                                self.log_test("CRUD - DELETE", False, f"Échec suppression: {delete_response.status_code}")
                        else:
                            self.log_test("CRUD - READ", False, "Message créé non trouvé dans la liste")
                    else:
                        self.log_test("CRUD - READ", False, f"Échec lecture: {read_response.status_code}")
            else:
                self.log_test("CRUD - CREATE", False, f"Échec création: {response.status_code}")
        except Exception as e:
            self.log_test("Opérations CRUD", False, f"Erreur: {str(e)}")
    
    def test_uuid_and_json_handling(self):
        """Test 7: Gestion UUID String(36) et sérialisation JSON"""
        print("\n=== Test 7: Gestion UUID String(36) et sérialisation JSON ===")
        
        # Test format UUID
        try:
            response = self.session.get(f"{API_BASE}/portfolio/personal-info")
            if response.status_code == 200:
                data = response.json()
                record_id = data.get('id', '')
                
                # Vérifier format UUID (36 caractères avec tirets)
                if len(record_id) == 36 and record_id.count('-') == 4:
                    self.log_test("Format UUID String(36)", True, f"Format UUID valide: {record_id}")
                else:
                    self.log_test("Format UUID String(36)", False, f"Format UUID invalide: {record_id}")
            else:
                self.log_test("Format UUID String(36)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Format UUID String(36)", False, f"Erreur: {str(e)}")
        
        # Test sérialisation JSON complexe avec compétences
        try:
            response = self.session.get(f"{API_BASE}/portfolio/skills")
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list) and len(data) > 0:
                    first_skill = data[0]
                    if isinstance(first_skill, dict):
                        items = first_skill.get('items', [])
                        if isinstance(items, list) and len(items) > 0:
                            # Vérifier structure JSON imbriquée
                            first_item = items[0]
                            if 'name' in first_item and 'level' in first_item:
                                self.log_test("Sérialisation JSON", True, f"JSON complexe valide avec {len(items)} éléments imbriqués")
                            else:
                                self.log_test("Sérialisation JSON", False, "Structure JSON des compétences invalide")
                        else:
                            self.log_test("Sérialisation JSON", False, "Pas d'éléments dans les compétences")
                    else:
                        self.log_test("Sérialisation JSON", False, "Compétence pas en format objet JSON")
                else:
                    self.log_test("Sérialisation JSON", False, "Données compétences pas en format liste JSON")
            else:
                self.log_test("Sérialisation JSON", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Sérialisation JSON", False, f"Erreur: {str(e)}")
    
    def run_comprehensive_tests(self):
        """Exécuter tous les tests de validation de migration MariaDB"""
        print(f"🔄 Démarrage des tests complets de validation migration MariaDB")
        print(f"🎯 Objectif: Valider migration PostgreSQL vers MariaDB")
        print(f"🔗 URL Backend: {BACKEND_URL}")
        print(f"📅 Test démarré à: {datetime.now()}")
        
        # Exécuter toutes les suites de tests
        self.test_mariadb_connection()
        self.test_health_check_endpoint()
        self.test_all_portfolio_endpoints()
        self.test_demo_data_presence()
        self.test_stability_consecutive_requests()
        self.test_crud_operations()
        self.test_uuid_and_json_handling()
        
        # Résumé
        print(f"\n{'='*70}")
        print("📊 RÉSUMÉ DES TESTS DE MIGRATION MARIADB")
        print(f"{'='*70}")
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total des tests: {total_tests}")
        print(f"✅ Réussis: {passed_tests}")
        print(f"❌ Échoués: {failed_tests}")
        print(f"Taux de réussite: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ TESTS ÉCHOUÉS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        else:
            print(f"\n🎉 TOUS LES TESTS DE MIGRATION MARIADB RÉUSSIS!")
            print(f"✅ Migration PostgreSQL vers MariaDB réussie")
            print(f"✅ Toutes les fonctionnalités préservées après migration")
            print(f"✅ Base de données MariaDB opérationnelle")
            print(f"✅ UUID String(36) fonctionnel")
            print(f"✅ Sérialisation JSON validée")
            print(f"✅ Stabilité confirmée")
            print(f"✅ Opérations CRUD complètes")
        
        print(f"\n📅 Test terminé à: {datetime.now()}")
        
        return failed_tests == 0

if __name__ == "__main__":
    validator = MariaDBMigrationValidator()
    success = validator.run_comprehensive_tests()
    sys.exit(0 if success else 1)