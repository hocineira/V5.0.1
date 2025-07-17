#!/usr/bin/env python3
"""
Specific tests for Hocine IRATNI's portfolio data after MariaDB migration
Validates that all personal data has been correctly migrated from V3 to MariaDB
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://480e1067-9934-42f2-825d-d1520ef33e84.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class HocinePortfolioValidator:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message="", details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"    Details: {details}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'details': details
        })
    
    def test_personal_info_hocine(self):
        """Test Hocine IRATNI's personal information"""
        print("\n=== Testing Hocine IRATNI Personal Information ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/personal-info")
            if response.status_code == 200:
                data = response.json()
                
                # Check name
                if data.get('name') == 'Hocine IRATNI':
                    self.log_test("Personal Info - Name", True, f"Name correctly set: {data.get('name')}")
                else:
                    self.log_test("Personal Info - Name", False, f"Expected 'Hocine IRATNI', got: {data.get('name')}")
                
                # Check title
                expected_title = "Etudiant en BTS SIO-SISR"
                if expected_title in data.get('title', ''):
                    self.log_test("Personal Info - Title", True, f"Title contains BTS SIO-SISR: {data.get('title')}")
                else:
                    self.log_test("Personal Info - Title", False, f"Expected BTS SIO-SISR in title, got: {data.get('title')}")
                
                # Check location (Marseille)
                location = data.get('location', '')
                if 'Marseille' in location:
                    self.log_test("Personal Info - Location", True, f"Location contains Marseille: {location}")
                else:
                    self.log_test("Personal Info - Location", False, f"Expected Marseille in location, got: {location}")
                    
            else:
                self.log_test("Personal Info - API", False, f"Failed to retrieve personal info: {response.status_code}")
        except Exception as e:
            self.log_test("Personal Info - API", False, f"Error: {str(e)}")
    
    def test_formations_hocine(self):
        """Test Hocine's 3 formations"""
        print("\n=== Testing Hocine's Formations (3 expected) ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/education")
            if response.status_code == 200:
                data = response.json()
                
                if len(data) == 3:
                    self.log_test("Formations - Count", True, f"Found 3 formations as expected")
                else:
                    self.log_test("Formations - Count", False, f"Expected 3 formations, found {len(data)}")
                
                # Check for BTS SIO
                bts_found = any('BTS SIO' in item.get('degree', '') for item in data)
                if bts_found:
                    self.log_test("Formations - BTS SIO", True, "BTS SIO formation found")
                else:
                    self.log_test("Formations - BTS SIO", False, "BTS SIO formation not found")
                
                # Check for Licence
                licence_found = any('Licence' in item.get('degree', '') for item in data)
                if licence_found:
                    self.log_test("Formations - Licence", True, "Licence formation found")
                else:
                    self.log_test("Formations - Licence", False, "Licence formation not found")
                
                # Check for Bac
                bac_found = any('Bac' in item.get('degree', '') for item in data)
                if bac_found:
                    self.log_test("Formations - Bac", True, "Bac formation found")
                else:
                    self.log_test("Formations - Bac", False, "Bac formation not found")
                    
            else:
                self.log_test("Formations - API", False, f"Failed to retrieve formations: {response.status_code}")
        except Exception as e:
            self.log_test("Formations - API", False, f"Error: {str(e)}")
    
    def test_competences_reseaux_systemes(self):
        """Test network and systems skills specific to BTS SIO"""
        print("\n=== Testing Network/Systems Skills (BTS SIO specific) ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/skills")
            if response.status_code == 200:
                data = response.json()
                
                if len(data) == 4:
                    self.log_test("Skills - Count", True, f"Found 4 skill categories as expected")
                else:
                    self.log_test("Skills - Count", False, f"Expected 4 categories, found {len(data)}")
                
                # Check for Systems category
                systems_found = any('Systèmes' in item.get('category', '') for item in data)
                if systems_found:
                    self.log_test("Skills - Systèmes", True, "Systèmes category found")
                else:
                    self.log_test("Skills - Systèmes", False, "Systèmes category not found")
                
                # Check for Networks category
                networks_found = any('Réseaux' in item.get('category', '') for item in data)
                if networks_found:
                    self.log_test("Skills - Réseaux", True, "Réseaux category found")
                else:
                    self.log_test("Skills - Réseaux", False, "Réseaux category not found")
                
                # Check for Security category
                security_found = any('Sécurité' in item.get('category', '') for item in data)
                if security_found:
                    self.log_test("Skills - Sécurité", True, "Sécurité category found")
                else:
                    self.log_test("Skills - Sécurité", False, "Sécurité category not found")
                
                # Check for Virtualization category
                virtual_found = any('Virtualisation' in item.get('category', '') for item in data)
                if virtual_found:
                    self.log_test("Skills - Virtualisation", True, "Virtualisation category found")
                else:
                    self.log_test("Skills - Virtualisation", False, "Virtualisation category not found")
                    
            else:
                self.log_test("Skills - API", False, f"Failed to retrieve skills: {response.status_code}")
        except Exception as e:
            self.log_test("Skills - API", False, f"Error: {str(e)}")
    
    def test_experience_stage(self):
        """Test stage experience at sauvegarde13"""
        print("\n=== Testing Stage Experience ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/experience")
            if response.status_code == 200:
                data = response.json()
                
                if len(data) >= 1:
                    self.log_test("Experience - Count", True, f"Found {len(data)} experience(s)")
                    
                    # Check for stage at sauvegarde13
                    stage_found = any('sauvegarde13' in item.get('company', '').lower() for item in data)
                    if stage_found:
                        self.log_test("Experience - Sauvegarde13", True, "Stage at sauvegarde13 found")
                    else:
                        self.log_test("Experience - Sauvegarde13", False, "Stage at sauvegarde13 not found")
                    
                    # Check for Administrateur Réseaux
                    admin_found = any('Administrateur' in item.get('title', '') and 'Réseaux' in item.get('title', '') for item in data)
                    if admin_found:
                        self.log_test("Experience - Admin Réseaux", True, "Administrateur Réseaux role found")
                    else:
                        self.log_test("Experience - Admin Réseaux", False, "Administrateur Réseaux role not found")
                        
                else:
                    self.log_test("Experience - Count", False, f"Expected at least 1 experience, found {len(data)}")
                    
            else:
                self.log_test("Experience - API", False, f"Failed to retrieve experience: {response.status_code}")
        except Exception as e:
            self.log_test("Experience - API", False, f"Error: {str(e)}")
    
    def test_certification_cisco(self):
        """Test CISCO CCNA certification"""
        print("\n=== Testing CISCO CCNA Certification ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/certifications")
            if response.status_code == 200:
                data = response.json()
                
                if len(data) >= 1:
                    self.log_test("Certifications - Count", True, f"Found {len(data)} certification(s)")
                    
                    # Check for CISCO CCNA
                    cisco_found = any('CISCO' in item.get('name', '') and 'CCNA' in item.get('name', '') for item in data)
                    if cisco_found:
                        self.log_test("Certifications - CISCO CCNA", True, "CISCO CCNA certification found")
                    else:
                        self.log_test("Certifications - CISCO CCNA", False, "CISCO CCNA certification not found")
                        
                else:
                    self.log_test("Certifications - Count", False, f"Expected at least 1 certification, found {len(data)}")
                    
            else:
                self.log_test("Certifications - API", False, f"Failed to retrieve certifications: {response.status_code}")
        except Exception as e:
            self.log_test("Certifications - API", False, f"Error: {str(e)}")
    
    def test_projets_3(self):
        """Test 3 projects (Infrastructure, Monitoring, Sauvegarde)"""
        print("\n=== Testing 3 Projects ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/projects")
            if response.status_code == 200:
                data = response.json()
                
                if len(data) == 3:
                    self.log_test("Projects - Count", True, f"Found 3 projects as expected")
                else:
                    self.log_test("Projects - Count", False, f"Expected 3 projects, found {len(data)}")
                
                # Check for Infrastructure project
                infra_found = any('Infrastructure' in item.get('title', '') or 'réseau' in item.get('title', '').lower() for item in data)
                if infra_found:
                    self.log_test("Projects - Infrastructure", True, "Infrastructure/réseau project found")
                else:
                    self.log_test("Projects - Infrastructure", False, "Infrastructure/réseau project not found")
                
                # Check for Monitoring project
                monitoring_found = any('Monitoring' in item.get('title', '') or 'monitoring' in item.get('title', '').lower() for item in data)
                if monitoring_found:
                    self.log_test("Projects - Monitoring", True, "Monitoring project found")
                else:
                    self.log_test("Projects - Monitoring", False, "Monitoring project not found")
                
                # Check for Sauvegarde project
                backup_found = any('Sauvegarde' in item.get('title', '') or 'sauvegarde' in item.get('title', '').lower() for item in data)
                if backup_found:
                    self.log_test("Projects - Sauvegarde", True, "Sauvegarde project found")
                else:
                    self.log_test("Projects - Sauvegarde", False, "Sauvegarde project not found")
                    
            else:
                self.log_test("Projects - API", False, f"Failed to retrieve projects: {response.status_code}")
        except Exception as e:
            self.log_test("Projects - API", False, f"Error: {str(e)}")
    
    def test_temoignages_2(self):
        """Test 2 testimonials (Professor and internship supervisor)"""
        print("\n=== Testing 2 Testimonials ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/testimonials")
            if response.status_code == 200:
                data = response.json()
                
                if len(data) == 2:
                    self.log_test("Testimonials - Count", True, f"Found 2 testimonials as expected")
                else:
                    self.log_test("Testimonials - Count", False, f"Expected 2 testimonials, found {len(data)}")
                
                # Check for professor/teacher testimonial
                prof_found = any('Professeur' in item.get('role', '') or 'professeur' in item.get('role', '').lower() or 'Formateur' in item.get('role', '') or 'formateur' in item.get('role', '').lower() for item in data)
                if prof_found:
                    self.log_test("Testimonials - Professor/Teacher", True, "Professor/Teacher testimonial found")
                else:
                    self.log_test("Testimonials - Professor/Teacher", False, "Professor/Teacher testimonial not found")
                
                # Check for tutor/supervisor testimonial
                tutor_found = any('tuteur' in item.get('role', '').lower() or 'stage' in item.get('role', '').lower() for item in data)
                if tutor_found:
                    self.log_test("Testimonials - Tutor", True, "Tutor/supervisor testimonial found")
                else:
                    self.log_test("Testimonials - Tutor", False, "Tutor/supervisor testimonial not found")
                    
            else:
                self.log_test("Testimonials - API", False, f"Failed to retrieve testimonials: {response.status_code}")
        except Exception as e:
            self.log_test("Testimonials - API", False, f"Error: {str(e)}")
    
    def test_veille_4_contenus(self):
        """Test 4 veille contents (Windows, Réseaux, RGPD, Cybersécurité)"""
        print("\n=== Testing 4 Veille Contents ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/veille")
            if response.status_code == 200:
                data = response.json()
                
                if len(data) == 4:
                    self.log_test("Veille - Count", True, f"Found 4 veille contents as expected")
                else:
                    self.log_test("Veille - Count", False, f"Expected 4 veille contents, found {len(data)}")
                
                # Check for Windows content
                windows_found = any('Windows' in item.get('title', '') for item in data)
                if windows_found:
                    self.log_test("Veille - Windows", True, "Windows veille content found")
                else:
                    self.log_test("Veille - Windows", False, "Windows veille content not found")
                
                # Check for Networks content
                networks_found = any('Réseaux' in item.get('title', '') or 'réseau' in item.get('title', '').lower() for item in data)
                if networks_found:
                    self.log_test("Veille - Réseaux", True, "Réseaux veille content found")
                else:
                    self.log_test("Veille - Réseaux", False, "Réseaux veille content not found")
                
                # Check for RGPD content
                rgpd_found = any('RGPD' in item.get('title', '') for item in data)
                if rgpd_found:
                    self.log_test("Veille - RGPD", True, "RGPD veille content found")
                else:
                    self.log_test("Veille - RGPD", False, "RGPD veille content not found")
                
                # Check for Cybersecurity content
                cyber_found = any('Cybersécurité' in item.get('title', '') or 'cybersécurité' in item.get('title', '').lower() for item in data)
                if cyber_found:
                    self.log_test("Veille - Cybersécurité", True, "Cybersécurité veille content found")
                else:
                    self.log_test("Veille - Cybersécurité", False, "Cybersécurité veille content not found")
                    
            else:
                self.log_test("Veille - API", False, f"Failed to retrieve veille: {response.status_code}")
        except Exception as e:
            self.log_test("Veille - API", False, f"Error: {str(e)}")
    
    def test_mariadb_uuid_format(self):
        """Test that UUIDs are properly formatted as String(36) for MariaDB"""
        print("\n=== Testing MariaDB UUID String(36) Format ===")
        
        try:
            # Test personal info UUID
            response = self.session.get(f"{API_BASE}/portfolio/personal-info")
            if response.status_code == 200:
                data = response.json()
                uuid_val = data.get('id', '')
                if len(uuid_val) == 36 and uuid_val.count('-') == 4:
                    self.log_test("UUID Format - Personal Info", True, f"UUID properly formatted: {uuid_val}")
                else:
                    self.log_test("UUID Format - Personal Info", False, f"Invalid UUID format: {uuid_val}")
            
            # Test skills UUIDs
            response = self.session.get(f"{API_BASE}/portfolio/skills")
            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    uuid_val = data[0].get('id', '')
                    if len(uuid_val) == 36 and uuid_val.count('-') == 4:
                        self.log_test("UUID Format - Skills", True, f"Skills UUID properly formatted: {uuid_val}")
                    else:
                        self.log_test("UUID Format - Skills", False, f"Invalid skills UUID format: {uuid_val}")
                        
        except Exception as e:
            self.log_test("UUID Format", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all Hocine portfolio validation tests"""
        print(f"🎯 Starting Hocine IRATNI Portfolio Validation after MariaDB Migration")
        print(f"📅 Test started at: {datetime.now()}")
        print(f"🔗 Backend URL: {BACKEND_URL}")
        
        # Run all validation tests
        self.test_personal_info_hocine()
        self.test_formations_hocine()
        self.test_competences_reseaux_systemes()
        self.test_experience_stage()
        self.test_certification_cisco()
        self.test_projets_3()
        self.test_temoignages_2()
        self.test_veille_4_contenus()
        self.test_mariadb_uuid_format()
        
        # Summary
        print(f"\n{'='*70}")
        print("📊 HOCINE IRATNI PORTFOLIO VALIDATION SUMMARY")
        print(f"{'='*70}")
        
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
        else:
            print(f"\n🎉 ALL TESTS PASSED! Hocine IRATNI's portfolio data successfully migrated to MariaDB")
        
        print(f"\n📅 Test completed at: {datetime.now()}")
        
        return failed_tests == 0

if __name__ == "__main__":
    validator = HocinePortfolioValidator()
    success = validator.run_all_tests()
    sys.exit(0 if success else 1)