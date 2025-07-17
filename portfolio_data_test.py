#!/usr/bin/env python3
"""
Focused Portfolio Data Verification Test
Tests specific portfolio data updates as requested in the review
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://c464f1f9-4356-42e9-8896-63e3b0137cb3.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class PortfolioDataTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message="", data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if data and success:
            print(f"   Data: {json.dumps(data, indent=2, ensure_ascii=False)}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'data': data
        })
        
    def test_personal_info_updates(self):
        """Test 1: Données personnelles mises à jour"""
        print("\n=== 1. Testing Personal Info Updates ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/personal-info")
            if response.status_code == 200:
                data = response.json()
                
                # Check specific requirements
                name = data.get('name', '')
                title = data.get('title', '')
                email = data.get('email', '')
                
                # Verify name doesn't contain "-Updated"
                name_check = "-Updated" not in name
                # Verify title is "Etudiant en BTS SIO-SISR"
                title_check = title == "Etudiant en BTS SIO-SISR"
                # Verify email is hocineira@gmail.com
                email_check = email == "hocineira@gmail.com"
                
                if name_check and title_check and email_check:
                    self.log_test("Personal Info Data Verification", True, 
                                f"Name: {name}, Title: {title}, Email: {email}", data)
                else:
                    issues = []
                    if not name_check: issues.append(f"Name contains '-Updated': {name}")
                    if not title_check: issues.append(f"Title incorrect: {title}")
                    if not email_check: issues.append(f"Email incorrect: {email}")
                    self.log_test("Personal Info Data Verification", False, 
                                f"Issues found: {'; '.join(issues)}")
            else:
                self.log_test("Personal Info Data Verification", False, 
                            f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Personal Info Data Verification", False, f"Error: {str(e)}")
    
    def test_education_formations(self):
        """Test 2: Nouvelles formations"""
        print("\n=== 2. Testing Education Formations ===")
        
        expected_formations = [
            {
                "degree": "BTS SIO Option SISR",
                "school": "IFC Marseille",
                "period": "2024-2026"
            },
            {
                "degree": "Licence portails descartes",
                "school": "Aix marseille université",
                "period": "2022-2024"
            },
            {
                "degree": "Bac général",
                "school": "Lycée International Alexandre Dumas",
                "period": "2022"
            }
        ]
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/education")
            if response.status_code == 200:
                data = response.json()
                
                if len(data) >= 3:
                    found_formations = []
                    for formation in expected_formations:
                        found = any(
                            edu.get('degree') == formation['degree'] and
                            edu.get('school') == formation['school'] and
                            edu.get('period') == formation['period']
                            for edu in data
                        )
                        found_formations.append(found)
                        if found:
                            print(f"   ✅ Found: {formation['degree']} at {formation['school']}")
                        else:
                            print(f"   ❌ Missing: {formation['degree']} at {formation['school']}")
                    
                    if all(found_formations):
                        self.log_test("Education Formations Verification", True, 
                                    f"All 3 expected formations found", data)
                    else:
                        self.log_test("Education Formations Verification", False, 
                                    f"Missing formations: {sum(1 for f in found_formations if not f)}/3")
                else:
                    self.log_test("Education Formations Verification", False, 
                                f"Expected 3+ formations, found {len(data)}")
            else:
                self.log_test("Education Formations Verification", False, 
                            f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Education Formations Verification", False, f"Error: {str(e)}")
    
    def test_skills_categories(self):
        """Test 3: Compétences réseaux/systèmes"""
        print("\n=== 3. Testing Skills Categories ===")
        
        expected_categories = [
            "Systèmes",
            "Réseaux", 
            "Sécurité",
            "Virtualisation"
        ]
        
        expected_skills = {
            "Systèmes": ["Windows Server", "Active Directory", "Hyper-V"],
            "Réseaux": ["Router Zyxel", "Switch", "Pfsense"],
            "Sécurité": ["Firewall", "VPN"],
            "Virtualisation": ["VMware", "Hyper-V"]
        }
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/skills")
            if response.status_code == 200:
                data = response.json()
                
                found_categories = []
                for expected_cat in expected_categories:
                    found = any(skill.get('category') == expected_cat for skill in data)
                    found_categories.append(found)
                    if found:
                        print(f"   ✅ Found category: {expected_cat}")
                        # Check specific skills in category
                        cat_data = next((skill for skill in data if skill.get('category') == expected_cat), None)
                        if cat_data and expected_cat in expected_skills:
                            items = cat_data.get('items', [])
                            for expected_skill in expected_skills[expected_cat]:
                                skill_found = any(item.get('name') == expected_skill for item in items)
                                if skill_found:
                                    print(f"     ✅ Found skill: {expected_skill}")
                                else:
                                    print(f"     ❌ Missing skill: {expected_skill}")
                    else:
                        print(f"   ❌ Missing category: {expected_cat}")
                
                if all(found_categories):
                    self.log_test("Skills Categories Verification", True, 
                                f"All expected categories found", data)
                else:
                    missing = [cat for i, cat in enumerate(expected_categories) if not found_categories[i]]
                    self.log_test("Skills Categories Verification", False, 
                                f"Missing categories: {missing}")
            else:
                self.log_test("Skills Categories Verification", False, 
                            f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Skills Categories Verification", False, f"Error: {str(e)}")
    
    def test_cisco_certification(self):
        """Test 4: Certification CISCO CCNA"""
        print("\n=== 4. Testing CISCO CCNA Certification ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/certifications")
            if response.status_code == 200:
                data = response.json()
                
                cisco_found = any(
                    "CISCO" in cert.get('name', '').upper() and 
                    "CCNA" in cert.get('name', '').upper() and
                    "2025" in cert.get('date', '')
                    for cert in data
                )
                
                if cisco_found:
                    cisco_cert = next((cert for cert in data 
                                     if "CISCO" in cert.get('name', '').upper() and 
                                        "CCNA" in cert.get('name', '').upper()), None)
                    self.log_test("CISCO CCNA Certification Verification", True, 
                                f"Found CISCO CCNA 2025", cisco_cert)
                else:
                    self.log_test("CISCO CCNA Certification Verification", False, 
                                "CISCO CCNA 2025 certification not found")
            else:
                self.log_test("CISCO CCNA Certification Verification", False, 
                            f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("CISCO CCNA Certification Verification", False, f"Error: {str(e)}")
    
    def test_stage_experience(self):
        """Test 5: Expérience stage"""
        print("\n=== 5. Testing Stage Experience ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/experience")
            if response.status_code == 200:
                data = response.json()
                
                stage_found = any(
                    "Administrateur Réseaux" in exp.get('title', '') and
                    "sauvegarde13" in exp.get('company', '') and
                    "Marseille" in exp.get('company', '') and
                    "13/03/2025-28/05/2025" in exp.get('period', '')
                    for exp in data
                )
                
                if stage_found:
                    stage_exp = next((exp for exp in data 
                                    if "Administrateur Réseaux" in exp.get('title', '')), None)
                    self.log_test("Stage Experience Verification", True, 
                                f"Found stage experience", stage_exp)
                else:
                    self.log_test("Stage Experience Verification", False, 
                                "Stage 'Administrateur Réseaux' at sauvegarde13 Marseille not found")
            else:
                self.log_test("Stage Experience Verification", False, 
                            f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Stage Experience Verification", False, f"Error: {str(e)}")
    
    def test_veille_updates(self):
        """Test 6: Veille technologique mise à jour"""
        print("\n=== 6. Testing Veille Technologique Updates ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/veille")
            if response.status_code == 200:
                data = response.json()
                
                windows_found = any("Windows" in item.get('title', '') for item in data)
                rgpd_found = any("RGPD" in item.get('title', '') for item in data)
                
                if windows_found and rgpd_found:
                    self.log_test("Veille Updates Verification", True, 
                                f"Found Windows and RGPD content", data)
                elif windows_found:
                    self.log_test("Veille Updates Verification", False, 
                                "Found Windows content but missing RGPD")
                elif rgpd_found:
                    self.log_test("Veille Updates Verification", False, 
                                "Found RGPD content but missing Windows")
                else:
                    self.log_test("Veille Updates Verification", False, 
                                "Missing both Windows and RGPD content")
            else:
                self.log_test("Veille Updates Verification", False, 
                            f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Veille Updates Verification", False, f"Error: {str(e)}")
    
    def test_basic_endpoints(self):
        """Test 7: Endpoints de base"""
        print("\n=== 7. Testing Basic Endpoints ===")
        
        endpoints = [
            ("/api/", "API root"),
            ("/api/health", "Health check")
        ]
        
        all_working = True
        for endpoint, description in endpoints:
            try:
                response = self.session.get(f"{BACKEND_URL}{endpoint}")
                if response.status_code == 200:
                    print(f"   ✅ {description}: {response.json()}")
                else:
                    print(f"   ❌ {description}: HTTP {response.status_code}")
                    all_working = False
            except Exception as e:
                print(f"   ❌ {description}: Error {str(e)}")
                all_working = False
        
        self.log_test("Basic Endpoints Verification", all_working, 
                    "All basic endpoints working" if all_working else "Some endpoints failing")
    
    def test_data_integrity(self):
        """Test 8: Intégrité des données"""
        print("\n=== 8. Testing Data Integrity ===")
        
        endpoints_to_test = [
            "/api/portfolio/personal-info",
            "/api/portfolio/education", 
            "/api/portfolio/skills",
            "/api/portfolio/projects",
            "/api/portfolio/experience",
            "/api/portfolio/certifications",
            "/api/portfolio/testimonials",
            "/api/portfolio/contact-messages",
            "/api/portfolio/procedures",
            "/api/portfolio/veille"
        ]
        
        integrity_issues = []
        
        for endpoint in endpoints_to_test:
            try:
                response = self.session.get(f"{BACKEND_URL}{endpoint}")
                if response.status_code == 200:
                    data = response.json()
                    
                    # Check JSON serialization
                    try:
                        json.dumps(data)
                        print(f"   ✅ {endpoint}: JSON serializable")
                    except Exception as json_e:
                        integrity_issues.append(f"{endpoint}: JSON serialization error - {str(json_e)}")
                        print(f"   ❌ {endpoint}: JSON serialization error")
                    
                    # Check UUIDs if data is a list
                    if isinstance(data, list):
                        for item in data:
                            if isinstance(item, dict) and 'id' in item:
                                item_id = item['id']
                                # Check if ID looks like a UUID
                                if isinstance(item_id, str) and len(item_id) == 36 and item_id.count('-') == 4:
                                    continue
                                else:
                                    integrity_issues.append(f"{endpoint}: Invalid UUID format - {item_id}")
                    elif isinstance(data, dict) and 'id' in data:
                        item_id = data['id']
                        if not (isinstance(item_id, str) and len(item_id) == 36 and item_id.count('-') == 4):
                            integrity_issues.append(f"{endpoint}: Invalid UUID format - {item_id}")
                            
                else:
                    integrity_issues.append(f"{endpoint}: HTTP {response.status_code}")
                    print(f"   ❌ {endpoint}: HTTP {response.status_code}")
                    
            except Exception as e:
                integrity_issues.append(f"{endpoint}: Error - {str(e)}")
                print(f"   ❌ {endpoint}: Error {str(e)}")
        
        if not integrity_issues:
            self.log_test("Data Integrity Verification", True, 
                        "All data properly serialized with valid UUIDs")
        else:
            self.log_test("Data Integrity Verification", False, 
                        f"Issues found: {'; '.join(integrity_issues)}")
    
    def run_focused_tests(self):
        """Run all focused portfolio data tests"""
        print(f"🎯 Starting focused portfolio data verification for: {BACKEND_URL}")
        print(f"📅 Test started at: {datetime.now()}")
        
        # Run specific tests as requested
        self.test_personal_info_updates()
        self.test_education_formations()
        self.test_skills_categories()
        self.test_cisco_certification()
        self.test_stage_experience()
        self.test_veille_updates()
        self.test_basic_endpoints()
        self.test_data_integrity()
        
        # Summary
        print(f"\n{'='*60}")
        print("📊 FOCUSED TEST SUMMARY")
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
    tester = PortfolioDataTester()
    success = tester.run_focused_tests()
    sys.exit(0 if success else 1)