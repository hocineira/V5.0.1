#!/usr/bin/env python3
"""
Quick validation test for specific portfolio data corrections
Tests the 3 specific points requested by the user:
1. Personal data - name without "-Updated", title "Etudiant en BTS SIO-SISR"
2. License education - verify correct naming
3. Internship experience - verify title is "Stage Administrateur Réseaux"
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://453d7b75-8496-48cf-a1d3-d02e08912163.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class QuickValidationTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message="", data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if data:
            print(f"   Data: {json.dumps(data, indent=2, ensure_ascii=False)}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'data': data
        })
        
    def test_personal_info_corrections(self):
        """Test personal info corrections - name without '-Updated', title 'Etudiant en BTS SIO-SISR'"""
        print("\n=== Testing Personal Info Corrections ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/personal-info")
            if response.status_code == 200:
                data = response.json()
                name = data.get('name', '')
                title = data.get('title', '')
                
                # Check name doesn't contain "-Updated"
                name_ok = "-Updated" not in name
                if name_ok:
                    self.log_test("Personal Info - Name without '-Updated'", True, f"Name is clean: '{name}'")
                else:
                    self.log_test("Personal Info - Name without '-Updated'", False, f"Name still contains '-Updated': '{name}'")
                
                # Check title is "Etudiant en BTS SIO-SISR"
                expected_title = "Etudiant en BTS SIO-SISR"
                title_ok = title == expected_title
                if title_ok:
                    self.log_test("Personal Info - Title 'Etudiant en BTS SIO-SISR'", True, f"Title is correct: '{title}'")
                else:
                    self.log_test("Personal Info - Title 'Etudiant en BTS SIO-SISR'", False, f"Title is '{title}', expected '{expected_title}'")
                
                return name_ok and title_ok
                
            else:
                self.log_test("Personal Info - GET Request", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Personal Info - GET Request", False, f"Error: {str(e)}")
            return False
    
    def test_education_license_correction(self):
        """Test education license correction"""
        print("\n=== Testing Education License Correction ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/education")
            if response.status_code == 200:
                data = response.json()
                
                # Look for license education
                license_found = False
                license_correct = False
                
                for education in data:
                    degree = education.get('degree', '').lower()
                    if 'licence' in degree:
                        license_found = True
                        print(f"   Found license: '{education.get('degree')}'")
                        
                        # Check if it contains "portails descartes" or similar correct naming
                        if 'descartes' in degree or 'portails' in degree:
                            license_correct = True
                            self.log_test("Education - License correctly named", True, f"Found correct license: '{education.get('degree')}'")
                            break
                
                if not license_found:
                    self.log_test("Education - License found", False, "No license education found")
                    return False
                elif not license_correct:
                    self.log_test("Education - License correctly named", False, "License found but not correctly named")
                    return False
                
                return True
                
            else:
                self.log_test("Education - GET Request", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Education - GET Request", False, f"Error: {str(e)}")
            return False
    
    def test_experience_internship_correction(self):
        """Test experience internship title correction"""
        print("\n=== Testing Experience Internship Correction ===")
        
        try:
            response = self.session.get(f"{API_BASE}/portfolio/experience")
            if response.status_code == 200:
                data = response.json()
                
                # Look for internship experience
                internship_found = False
                internship_correct = False
                
                for experience in data:
                    title = experience.get('title', '')
                    if 'stage' in title.lower():
                        internship_found = True
                        print(f"   Found internship: '{title}'")
                        
                        # Check if title is "Stage Administrateur Réseaux"
                        expected_title = "Stage Administrateur Réseaux"
                        if title == expected_title:
                            internship_correct = True
                            self.log_test("Experience - Internship title 'Stage Administrateur Réseaux'", True, f"Title is correct: '{title}'")
                            break
                        else:
                            self.log_test("Experience - Internship title 'Stage Administrateur Réseaux'", False, f"Title is '{title}', expected '{expected_title}'")
                
                if not internship_found:
                    self.log_test("Experience - Internship found", False, "No internship experience found")
                    return False
                
                return internship_correct
                
            else:
                self.log_test("Experience - GET Request", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Experience - GET Request", False, f"Error: {str(e)}")
            return False
    
    def run_validation_tests(self):
        """Run the 3 specific validation tests"""
        print(f"🎯 Starting quick validation tests for: {BACKEND_URL}")
        print(f"📅 Test started at: {datetime.now()}")
        
        # Run the 3 specific tests
        personal_ok = self.test_personal_info_corrections()
        education_ok = self.test_education_license_correction()
        experience_ok = self.test_experience_internship_correction()
        
        # Summary
        print(f"\n{'='*60}")
        print("📊 VALIDATION SUMMARY")
        print(f"{'='*60}")
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Specific results
        print(f"\n🎯 SPECIFIC VALIDATION RESULTS:")
        print(f"1. Personal Info Corrections: {'✅ PASS' if personal_ok else '❌ FAIL'}")
        print(f"2. Education License Correction: {'✅ PASS' if education_ok else '❌ FAIL'}")
        print(f"3. Experience Internship Correction: {'✅ PASS' if experience_ok else '❌ FAIL'}")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print(f"\n📅 Test completed at: {datetime.now()}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = QuickValidationTester()
    success = tester.run_validation_tests()
    sys.exit(0 if success else 1)