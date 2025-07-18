#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Portfolio Migration
Tests all endpoints after PostgreSQL to MariaDB migration
Focus on MariaDB-specific features: String(36) UUIDs, JSON serialization, stability
"""

import requests
import json
import sys
from datetime import datetime
import uuid
import time

# Backend URL from environment
BACKEND_URL = "https://66424d3a-9758-4952-8d63-59ac332a7fdf.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class MariaDBPortfolioTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_ids = {}  # Store created IDs for cleanup
        self.mariadb_specific_tests = []  # Track MariaDB-specific test results
        
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
        
    def log_mariadb_test(self, test_name, success, message=""):
        """Log MariaDB-specific test results"""
        status = "✅ MARIADB OK" if success else "❌ MARIADB FAIL"
        print(f"{status} {test_name}: {message}")
        self.mariadb_specific_tests.append({
            'test': test_name,
            'success': success,
            'message': message
        })
        
    def test_mariadb_connection(self):
        """Test MariaDB connection and basic functionality"""
        print("\n=== Testing MariaDB Connection ===")
        
        try:
            # Test basic health endpoint to verify MariaDB connection
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                self.log_mariadb_test("MariaDB Connection", True, "Backend successfully connected to MariaDB")
            else:
                self.log_mariadb_test("MariaDB Connection", False, f"Connection failed with status: {response.status_code}")
                
            # Test health endpoint
            health_response = self.session.get(f"{API_BASE}/health")
            if health_response.status_code == 200:
                self.log_mariadb_test("MariaDB Health Check", True, "Health endpoint responding correctly")
            else:
                self.log_mariadb_test("MariaDB Health Check", False, f"Health check failed: {health_response.status_code}")
                
        except Exception as e:
            self.log_mariadb_test("MariaDB Connection", False, f"Connection error: {str(e)}")
    
    def test_uuid_string36_handling(self):
        """Test UUID handling as String(36) in MariaDB"""
        print("\n=== Testing UUID String(36) Handling ===")
        
        try:
            # Create a test education record to verify UUID generation
            test_education = {
                "degree": "Test MariaDB UUID",
                "school": "UUID Test University",
                "period": "2024",
                "description": "Testing UUID generation and storage in MariaDB",
                "skills": ["MariaDB", "UUID", "String36"]
            }
            
            response = self.session.post(f"{API_BASE}/portfolio/education", json=test_education)
            
            if response.status_code == 200:
                data = response.json()
                uuid_id = data.get('id')
                
                # Verify UUID format (36 characters with hyphens)
                if uuid_id and len(uuid_id) == 36 and uuid_id.count('-') == 4:
                    self.log_mariadb_test("UUID String(36) Generation", True, f"Valid UUID generated: {uuid_id}")
                    
                    # Test retrieval with UUID
                    get_response = self.session.get(f"{API_BASE}/portfolio/education")
                    if get_response.status_code == 200:
                        education_list = get_response.json()
                        found_record = next((edu for edu in education_list if edu['id'] == uuid_id), None)
                        
                        if found_record:
                            self.log_mariadb_test("UUID String(36) Retrieval", True, "UUID correctly stored and retrieved from MariaDB")
                        else:
                            self.log_mariadb_test("UUID String(36) Retrieval", False, "UUID not found in database")
                    
                    # Cleanup test record
                    self.session.delete(f"{API_BASE}/portfolio/education/{uuid_id}")
                    
                else:
                    self.log_mariadb_test("UUID String(36) Generation", False, f"Invalid UUID format: {uuid_id}")
            else:
                self.log_mariadb_test("UUID String(36) Generation", False, f"Failed to create test record: {response.status_code}")
                
        except Exception as e:
            self.log_mariadb_test("UUID String(36) Handling", False, f"Error: {str(e)}")
    
    def test_json_serialization_mariadb(self):
        """Test JSON serialization with MariaDB"""
        print("\n=== Testing JSON Serialization in MariaDB ===")
        
        try:
            # Test complex JSON data storage
            test_skill = {
                "category": "MariaDB JSON Test",
                "items": [
                    {"name": "MariaDB", "level": 95},
                    {"name": "JSON Storage", "level": 90},
                    {"name": "String UUID", "level": 85}
                ]
            }
            
            response = self.session.post(f"{API_BASE}/portfolio/skills", json=test_skill)
            
            if response.status_code == 200:
                data = response.json()
                skill_id = data.get('id')
                
                # Verify JSON data integrity
                items = data.get('items', [])
                if len(items) == 3 and all('name' in item and 'level' in item for item in items):
                    self.log_mariadb_test("JSON Serialization", True, "Complex JSON data correctly stored in MariaDB")
                    
                    # Test JSON data retrieval and modification
                    update_data = {
                        "items": [
                            {"name": "MariaDB", "level": 98},
                            {"name": "JSON Storage", "level": 95},
                            {"name": "String UUID", "level": 90},
                            {"name": "Migration Success", "level": 100}
                        ]
                    }
                    
                    put_response = self.session.put(f"{API_BASE}/portfolio/skills/{skill_id}", json=update_data)
                    
                    if put_response.status_code == 200:
                        updated_data = put_response.json()
                        updated_items = updated_data.get('items', [])
                        
                        if len(updated_items) == 4:
                            self.log_mariadb_test("JSON Update", True, "JSON data successfully updated in MariaDB")
                        else:
                            self.log_mariadb_test("JSON Update", False, f"JSON update failed, got {len(updated_items)} items instead of 4")
                    
                    # Cleanup
                    self.session.delete(f"{API_BASE}/portfolio/skills/{skill_id}")
                    
                else:
                    self.log_mariadb_test("JSON Serialization", False, "JSON data structure corrupted")
            else:
                self.log_mariadb_test("JSON Serialization", False, f"Failed to create JSON test record: {response.status_code}")
                
        except Exception as e:
            self.log_mariadb_test("JSON Serialization", False, f"Error: {str(e)}")
    
    def test_mariadb_stability(self):
        """Test MariaDB stability with multiple consecutive requests"""
        print("\n=== Testing MariaDB Stability ===")
        
        try:
            success_count = 0
            total_requests = 10
            
            for i in range(total_requests):
                # Alternate between different endpoints
                if i % 2 == 0:
                    response = self.session.get(f"{API_BASE}/portfolio/personal-info")
                else:
                    response = self.session.get(f"{API_BASE}/portfolio/skills")
                
                if response.status_code == 200:
                    success_count += 1
                
                # Small delay between requests
                time.sleep(0.1)
            
            success_rate = (success_count / total_requests) * 100
            
            if success_rate >= 95:
                self.log_mariadb_test("MariaDB Stability", True, f"Stability test passed: {success_rate}% success rate ({success_count}/{total_requests})")
            else:
                self.log_mariadb_test("MariaDB Stability", False, f"Stability test failed: {success_rate}% success rate ({success_count}/{total_requests})")
                
        except Exception as e:
            self.log_mariadb_test("MariaDB Stability", False, f"Stability test error: {str(e)}")
    
    def test_mariadb_error_handling(self):
        """Test error handling with MariaDB"""
        print("\n=== Testing MariaDB Error Handling ===")
        
        try:
            # Test invalid UUID format
            invalid_uuid = "invalid-uuid-format"
            response = self.session.get(f"{API_BASE}/portfolio/education/{invalid_uuid}")
            
            if response.status_code == 404:
                self.log_mariadb_test("Invalid UUID Handling", True, "MariaDB correctly handles invalid UUID format")
            else:
                self.log_mariadb_test("Invalid UUID Handling", False, f"Unexpected response for invalid UUID: {response.status_code}")
            
            # Test non-existent record
            fake_uuid = str(uuid.uuid4())
            response = self.session.get(f"{API_BASE}/portfolio/projects/{fake_uuid}")
            
            if response.status_code == 404:
                self.log_mariadb_test("Non-existent Record", True, "MariaDB correctly handles non-existent records")
            else:
                self.log_mariadb_test("Non-existent Record", False, f"Unexpected response for non-existent record: {response.status_code}")
                
        except Exception as e:
            self.log_mariadb_test("MariaDB Error Handling", False, f"Error handling test failed: {str(e)}")
    
    def test_all_endpoints_mariadb_compatibility(self):
        """Test all endpoints for MariaDB compatibility"""
        print("\n=== Testing All Endpoints MariaDB Compatibility ===")
        
        endpoints = [
            "/portfolio/personal-info",
            "/portfolio/education", 
            "/portfolio/skills",
            "/portfolio/projects",
            "/portfolio/experience",
            "/portfolio/certifications",
            "/portfolio/testimonials",
            "/portfolio/contact-messages",
            "/portfolio/procedures",
            "/portfolio/veille"
        ]
        
        success_count = 0
        
        for endpoint in endpoints:
            try:
                response = self.session.get(f"{API_BASE}{endpoint}")
                if response.status_code == 200:
                    data = response.json()
                    # Verify data structure and UUID format for list endpoints
                    if isinstance(data, list):
                        if len(data) > 0:
                            for item in data:
                                if 'id' in item and len(str(item['id'])) == 36:
                                    success_count += 1
                                    break
                        else:
                            # Empty list is also valid
                            success_count += 1
                    else:
                        # Single item endpoint (personal-info)
                        if 'id' in data and len(str(data['id'])) == 36:
                            success_count += 1
                else:
                    print(f"❌ Endpoint {endpoint} failed with status {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Endpoint {endpoint} error: {str(e)}")
        
        success_rate = (success_count / len(endpoints)) * 100
        
        if success_rate >= 90:
            self.log_mariadb_test("All Endpoints Compatibility", True, f"MariaDB compatibility: {success_rate}% ({success_count}/{len(endpoints)} endpoints)")
        else:
            self.log_mariadb_test("All Endpoints Compatibility", False, f"MariaDB compatibility issues: {success_rate}% ({success_count}/{len(endpoints)} endpoints)")
    
    def test_comprehensive_crud_operations(self):
        """Test comprehensive CRUD operations on all endpoints"""
        print("\n=== Testing Comprehensive CRUD Operations ===")
        
        # Test contact messages CRUD (most complete workflow)
        try:
            # CREATE
            new_message = {
                "name": "Pierre Dupont",
                "email": "pierre.dupont@mariadb-test.com",
                "message": "Test de migration MariaDB réussi. Félicitations pour cette migration!"
            }
            
            create_response = self.session.post(f"{API_BASE}/portfolio/contact-messages", json=new_message)
            
            if create_response.status_code == 200:
                created_data = create_response.json()
                message_id = created_data.get('id')
                
                if message_id and len(message_id) == 36:
                    self.log_mariadb_test("CRUD Create", True, f"Successfully created record with UUID: {message_id}")
                    
                    # READ
                    read_response = self.session.get(f"{API_BASE}/portfolio/contact-messages")
                    if read_response.status_code == 200:
                        messages = read_response.json()
                        found_message = next((msg for msg in messages if msg['id'] == message_id), None)
                        
                        if found_message and found_message['name'] == "Pierre Dupont":
                            self.log_mariadb_test("CRUD Read", True, "Successfully retrieved created record")
                            
                            # UPDATE (mark as read)
                            update_response = self.session.put(f"{API_BASE}/portfolio/contact-messages/{message_id}/read")
                            if update_response.status_code == 200:
                                self.log_mariadb_test("CRUD Update", True, "Successfully updated record")
                                
                                # DELETE
                                delete_response = self.session.delete(f"{API_BASE}/portfolio/contact-messages/{message_id}")
                                if delete_response.status_code == 200:
                                    self.log_mariadb_test("CRUD Delete", True, "Successfully deleted record")
                                else:
                                    self.log_mariadb_test("CRUD Delete", False, f"Delete failed: {delete_response.status_code}")
                            else:
                                self.log_mariadb_test("CRUD Update", False, f"Update failed: {update_response.status_code}")
                        else:
                            self.log_mariadb_test("CRUD Read", False, "Failed to retrieve created record")
                    else:
                        self.log_mariadb_test("CRUD Read", False, f"Read failed: {read_response.status_code}")
                else:
                    self.log_mariadb_test("CRUD Create", False, f"Invalid UUID in created record: {message_id}")
            else:
                self.log_mariadb_test("CRUD Create", False, f"Create failed: {create_response.status_code}")
                
        except Exception as e:
            self.log_mariadb_test("CRUD Operations", False, f"CRUD test error: {str(e)}")
    
    def run_mariadb_specific_tests(self):
        """Run all MariaDB-specific tests"""
        print(f"🔍 Starting MariaDB-specific testing for: {BACKEND_URL}")
        print(f"📅 MariaDB tests started at: {datetime.now()}")
        
        # Run MariaDB-specific test suites
        self.test_mariadb_connection()
        self.test_uuid_string36_handling()
        self.test_json_serialization_mariadb()
        self.test_mariadb_stability()
        self.test_mariadb_error_handling()
        self.test_all_endpoints_mariadb_compatibility()
        self.test_comprehensive_crud_operations()
        
        # MariaDB-specific summary
        print(f"\n{'='*60}")
        print("🗄️ MARIADB MIGRATION TEST SUMMARY")
        print(f"{'='*60}")
        
        total_mariadb_tests = len(self.mariadb_specific_tests)
        passed_mariadb_tests = sum(1 for result in self.mariadb_specific_tests if result['success'])
        failed_mariadb_tests = total_mariadb_tests - passed_mariadb_tests
        
        print(f"MariaDB Tests: {total_mariadb_tests}")
        print(f"✅ Passed: {passed_mariadb_tests}")
        print(f"❌ Failed: {failed_mariadb_tests}")
        print(f"MariaDB Success Rate: {(passed_mariadb_tests/total_mariadb_tests)*100:.1f}%")
        
        if failed_mariadb_tests > 0:
            print(f"\n❌ FAILED MARIADB TESTS:")
            for result in self.mariadb_specific_tests:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return failed_mariadb_tests == 0

if __name__ == "__main__":
    tester = MariaDBPortfolioTester()
    
    # Run MariaDB-specific tests
    print("🔍 MariaDB Migration Validation")
    mariadb_success = tester.run_mariadb_specific_tests()
    
    # Final summary
    print(f"\n{'='*80}")
    print("🎯 MARIADB MIGRATION TEST RESULTS")
    print(f"{'='*80}")
    print(f"MariaDB Migration Tests: {'✅ PASSED' if mariadb_success else '❌ FAILED'}")
    
    sys.exit(0 if mariadb_success else 1)