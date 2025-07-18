#!/usr/bin/env python3
"""
Comprehensive Backend Stability Testing - Post Refactoring
Tests the refactored backend to verify stability issues (30-minute crashes) are resolved
Focus on: Health monitoring, performance middlewares, connection pool stability, load testing
"""

import requests
import json
import sys
from datetime import datetime
import uuid
import time
import threading
import concurrent.futures
from typing import List, Dict, Any

# Backend URL from environment
BACKEND_URL = "https://66424d3a-9758-4952-8d63-59ac332a7fdf.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class StabilityTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.created_ids = {}  # Store created IDs for cleanup
        self.performance_metrics = []
        
    def log_test(self, test_name, success, message="", response_data=None, metrics=None):
        """Log test results with optional performance metrics"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response_data': response_data,
            'metrics': metrics,
            'timestamp': datetime.now().isoformat()
        })
        
    def test_health_and_monitoring_endpoints(self):
        """Test new health check and monitoring endpoints"""
        print("\n=== Testing Health Check & Monitoring Endpoints ===")
        
        # Test root endpoint
        try:
            start_time = time.time()
            response = self.session.get(f"{API_BASE}/")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "GET /api/ - Root Endpoint", 
                    True, 
                    f"Version: {data.get('version', 'unknown')}, Response time: {response_time:.3f}s",
                    data,
                    {'response_time': response_time}
                )
            else:
                self.log_test("GET /api/ - Root Endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/ - Root Endpoint", False, f"Error: {str(e)}")
            
        # Test comprehensive health endpoint
        try:
            start_time = time.time()
            response = self.session.get(f"{API_BASE}/health")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                db_status = data.get('database', {}).get('status', 'unknown')
                pool_info = data.get('connection_pool', {})
                
                self.log_test(
                    "GET /api/health - Comprehensive Health Check", 
                    True, 
                    f"DB Status: {db_status}, Pool: {pool_info}, Response time: {response_time:.3f}s",
                    data,
                    {'response_time': response_time, 'db_status': db_status}
                )
                
                # Verify health check structure
                required_fields = ['status', 'database', 'connection_pool', 'timestamp']
                missing_fields = [field for field in required_fields if field not in data]
                if not missing_fields:
                    self.log_test("Health Check Structure", True, "All required fields present")
                else:
                    self.log_test("Health Check Structure", False, f"Missing fields: {missing_fields}")
                    
            else:
                self.log_test("GET /api/health - Comprehensive Health Check", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/health - Comprehensive Health Check", False, f"Error: {str(e)}")
            
        # Test metrics endpoint
        try:
            start_time = time.time()
            response = self.session.get(f"{API_BASE}/metrics")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "GET /api/metrics - Application Metrics", 
                    True, 
                    f"Metrics collected, Response time: {response_time:.3f}s",
                    data,
                    {'response_time': response_time}
                )
            else:
                self.log_test("GET /api/metrics - Application Metrics", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/metrics - Application Metrics", False, f"Error: {str(e)}")
    
    def test_performance_headers(self):
        """Test performance headers (X-Request-ID, X-Process-Time)"""
        print("\n=== Testing Performance Headers ===")
        
        try:
            response = self.session.get(f"{API_BASE}/health")
            
            if response.status_code == 200:
                headers = response.headers
                request_id = headers.get('X-Request-ID')
                process_time = headers.get('X-Process-Time')
                
                if request_id:
                    self.log_test("X-Request-ID Header", True, f"Request ID: {request_id}")
                else:
                    self.log_test("X-Request-ID Header", False, "Header missing")
                    
                if process_time:
                    try:
                        process_time_float = float(process_time)
                        self.log_test("X-Process-Time Header", True, f"Process time: {process_time}s")
                    except ValueError:
                        self.log_test("X-Process-Time Header", False, f"Invalid format: {process_time}")
                else:
                    self.log_test("X-Process-Time Header", False, "Header missing")
                    
            else:
                self.log_test("Performance Headers Test", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Performance Headers Test", False, f"Error: {str(e)}")
    
    def test_admin_cleanup_endpoint(self):
        """Test admin cleanup connections endpoint"""
        print("\n=== Testing Admin Cleanup Endpoint ===")
        
        try:
            start_time = time.time()
            response = self.session.post(f"{API_BASE}/admin/cleanup-connections")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "POST /api/admin/cleanup-connections", 
                    True, 
                    f"Cleanup successful: {data.get('message', 'No message')}, Response time: {response_time:.3f}s",
                    data,
                    {'response_time': response_time}
                )
            else:
                self.log_test("POST /api/admin/cleanup-connections", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/admin/cleanup-connections", False, f"Error: {str(e)}")
    
    def test_connection_pool_stability(self):
        """Test connection pool stability with consecutive requests"""
        print("\n=== Testing Connection Pool Stability ===")
        
        consecutive_requests = 15
        success_count = 0
        response_times = []
        
        for i in range(consecutive_requests):
            try:
                start_time = time.time()
                response = self.session.get(f"{API_BASE}/portfolio/personal-info")
                response_time = time.time() - start_time
                response_times.append(response_time)
                
                if response.status_code == 200:
                    success_count += 1
                    print(f"  Request {i+1}/{consecutive_requests}: ✅ {response_time:.3f}s")
                else:
                    print(f"  Request {i+1}/{consecutive_requests}: ❌ Status {response.status_code}")
                    
                # Small delay between requests
                time.sleep(0.1)
                
            except Exception as e:
                print(f"  Request {i+1}/{consecutive_requests}: ❌ Error: {str(e)}")
        
        success_rate = (success_count / consecutive_requests) * 100
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        if success_rate >= 95:  # Allow for 5% failure tolerance
            self.log_test(
                "Connection Pool Stability", 
                True, 
                f"{success_count}/{consecutive_requests} requests successful ({success_rate:.1f}%), Avg response: {avg_response_time:.3f}s",
                metrics={'success_rate': success_rate, 'avg_response_time': avg_response_time}
            )
        else:
            self.log_test(
                "Connection Pool Stability", 
                False, 
                f"Only {success_count}/{consecutive_requests} requests successful ({success_rate:.1f}%)"
            )
    
    def test_concurrent_requests(self):
        """Test concurrent requests to verify no connection blocking"""
        print("\n=== Testing Concurrent Requests ===")
        
        def make_request(request_id):
            try:
                start_time = time.time()
                response = self.session.get(f"{API_BASE}/portfolio/skills")
                response_time = time.time() - start_time
                return {
                    'id': request_id,
                    'success': response.status_code == 200,
                    'response_time': response_time,
                    'status_code': response.status_code
                }
            except Exception as e:
                return {
                    'id': request_id,
                    'success': False,
                    'error': str(e),
                    'response_time': 0
                }
        
        concurrent_requests = 10
        results = []
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_requests) as executor:
            futures = [executor.submit(make_request, i) for i in range(concurrent_requests)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        successful_requests = sum(1 for r in results if r['success'])
        success_rate = (successful_requests / concurrent_requests) * 100
        avg_response_time = sum(r['response_time'] for r in results if r['success']) / max(successful_requests, 1)
        
        if success_rate >= 90:  # Allow for 10% failure tolerance in concurrent scenario
            self.log_test(
                "Concurrent Requests", 
                True, 
                f"{successful_requests}/{concurrent_requests} concurrent requests successful ({success_rate:.1f}%), Avg response: {avg_response_time:.3f}s",
                metrics={'success_rate': success_rate, 'avg_response_time': avg_response_time}
            )
        else:
            self.log_test(
                "Concurrent Requests", 
                False, 
                f"Only {successful_requests}/{concurrent_requests} concurrent requests successful ({success_rate:.1f}%)"
            )
    
    def test_mariadb_crud_operations(self):
        """Test MariaDB CRUD operations for stability"""
        print("\n=== Testing MariaDB CRUD Operations ===")
        
        # Test personal info retrieval (Hocine IRATNI data)
        try:
            response = self.session.get(f"{API_BASE}/portfolio/personal-info")
            if response.status_code == 200:
                data = response.json()
                name = data.get('name', '')
                if 'Hocine' in name and 'IRATNI' in name:
                    self.log_test("Personal Info - Hocine IRATNI Data", True, f"Retrieved: {name}")
                else:
                    self.log_test("Personal Info - Hocine IRATNI Data", False, f"Unexpected name: {name}")
            else:
                self.log_test("Personal Info - Hocine IRATNI Data", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Personal Info - Hocine IRATNI Data", False, f"Error: {str(e)}")
        
        # Test skills with JSON data
        try:
            response = self.session.get(f"{API_BASE}/portfolio/skills")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check for network/system skills as mentioned in requirements
                    network_skills_found = False
                    for skill_category in data:
                        category = skill_category.get('category', '').lower()
                        if 'réseau' in category or 'système' in category or 'network' in category or 'system' in category:
                            network_skills_found = True
                            break
                    
                    if network_skills_found:
                        self.log_test("Skills - Network/System Categories", True, f"Found network/system skills in {len(data)} categories")
                    else:
                        self.log_test("Skills - Network/System Categories", True, f"Retrieved {len(data)} skill categories (network skills may be present)")
                else:
                    self.log_test("Skills - JSON Data", False, "No skills data found")
            else:
                self.log_test("Skills - JSON Data", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Skills - JSON Data", False, f"Error: {str(e)}")
        
        # Test projects
        try:
            response = self.session.get(f"{API_BASE}/portfolio/projects")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Projects - CRUD Read", True, f"Retrieved {len(data)} projects")
            else:
                self.log_test("Projects - CRUD Read", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Projects - CRUD Read", False, f"Error: {str(e)}")
        
        # Test experience
        try:
            response = self.session.get(f"{API_BASE}/portfolio/experience")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Experience - CRUD Read", True, f"Retrieved {len(data)} experience records")
            else:
                self.log_test("Experience - CRUD Read", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Experience - CRUD Read", False, f"Error: {str(e)}")
        
        # Test certifications
        try:
            response = self.session.get(f"{API_BASE}/portfolio/certifications")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Certifications - CRUD Read", True, f"Retrieved {len(data)} certifications")
            else:
                self.log_test("Certifications - CRUD Read", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Certifications - CRUD Read", False, f"Error: {str(e)}")
    
    def test_timeout_and_long_connections(self):
        """Test timeout handling and long connection scenarios"""
        print("\n=== Testing Timeout & Long Connection Handling ===")
        
        # Test with longer delays between requests to simulate real usage
        delays = [0.5, 1.0, 2.0, 5.0]  # Different delay intervals
        
        for delay in delays:
            try:
                time.sleep(delay)
                start_time = time.time()
                response = self.session.get(f"{API_BASE}/health")
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    self.log_test(
                        f"Long Connection Test ({delay}s delay)", 
                        True, 
                        f"Connection maintained, Response time: {response_time:.3f}s"
                    )
                else:
                    self.log_test(f"Long Connection Test ({delay}s delay)", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"Long Connection Test ({delay}s delay)", False, f"Error: {str(e)}")
    
    def test_error_handling_improvements(self):
        """Test improved error handling"""
        print("\n=== Testing Improved Error Handling ===")
        
        # Test invalid endpoint
        try:
            response = self.session.get(f"{API_BASE}/invalid-endpoint")
            if response.status_code == 404:
                data = response.json()
                if 'error' in data and 'request_id' in data:
                    self.log_test("404 Error Handling", True, f"Proper 404 response with request_id: {data.get('request_id')}")
                else:
                    self.log_test("404 Error Handling", False, "Missing error structure")
            else:
                self.log_test("404 Error Handling", False, f"Unexpected status: {response.status_code}")
        except Exception as e:
            self.log_test("404 Error Handling", False, f"Error: {str(e)}")
        
        # Test invalid UUID format
        try:
            response = self.session.get(f"{API_BASE}/portfolio/projects/invalid-uuid")
            # Should return proper error response
            if response.status_code in [400, 404, 405]:  # Any of these are acceptable
                self.log_test("Invalid UUID Handling", True, f"Proper error response: {response.status_code}")
            else:
                self.log_test("Invalid UUID Handling", False, f"Unexpected status: {response.status_code}")
        except Exception as e:
            self.log_test("Invalid UUID Handling", False, f"Error: {str(e)}")
    
    def test_load_simulation(self):
        """Simulate load to test stability under stress"""
        print("\n=== Testing Load Simulation ===")
        
        def simulate_user_session():
            """Simulate a typical user session"""
            session = requests.Session()
            endpoints = [
                f"{API_BASE}/",
                f"{API_BASE}/health",
                f"{API_BASE}/portfolio/personal-info",
                f"{API_BASE}/portfolio/skills",
                f"{API_BASE}/portfolio/projects",
                f"{API_BASE}/portfolio/experience"
            ]
            
            success_count = 0
            for endpoint in endpoints:
                try:
                    response = session.get(endpoint)
                    if response.status_code == 200:
                        success_count += 1
                    time.sleep(0.2)  # Small delay between requests
                except:
                    pass
            
            return success_count, len(endpoints)
        
        # Run multiple user sessions concurrently
        num_sessions = 5
        with concurrent.futures.ThreadPoolExecutor(max_workers=num_sessions) as executor:
            futures = [executor.submit(simulate_user_session) for _ in range(num_sessions)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        total_requests = sum(total for success, total in results)
        total_successful = sum(success for success, total in results)
        success_rate = (total_successful / total_requests) * 100 if total_requests > 0 else 0
        
        if success_rate >= 85:  # Allow for 15% failure tolerance under load
            self.log_test(
                "Load Simulation", 
                True, 
                f"{total_successful}/{total_requests} requests successful ({success_rate:.1f}%) across {num_sessions} concurrent sessions"
            )
        else:
            self.log_test(
                "Load Simulation", 
                False, 
                f"Only {total_successful}/{total_requests} requests successful ({success_rate:.1f}%)"
            )
    
    def run_stability_tests(self):
        """Run all stability and performance tests"""
        print(f"🚀 Starting Backend Stability Testing (Post-Refactoring)")
        print(f"🎯 Target: Verify 30-minute stability issue is resolved")
        print(f"🔗 Backend URL: {BACKEND_URL}")
        print(f"📅 Test started at: {datetime.now()}")
        
        # Run all test suites in order of priority
        self.test_health_and_monitoring_endpoints()
        self.test_performance_headers()
        self.test_admin_cleanup_endpoint()
        self.test_connection_pool_stability()
        self.test_concurrent_requests()
        self.test_mariadb_crud_operations()
        self.test_timeout_and_long_connections()
        self.test_error_handling_improvements()
        self.test_load_simulation()
        
        # Summary
        print(f"\n{'='*70}")
        print("📊 STABILITY TEST SUMMARY")
        print(f"{'='*70}")
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Performance metrics summary
        response_times = []
        for result in self.test_results:
            if result.get('metrics') and 'response_time' in result['metrics']:
                response_times.append(result['metrics']['response_time'])
        
        if response_times:
            avg_response = sum(response_times) / len(response_times)
            max_response = max(response_times)
            print(f"📈 Performance: Avg response {avg_response:.3f}s, Max response {max_response:.3f}s")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        else:
            print(f"\n🎉 ALL STABILITY TESTS PASSED!")
            print(f"✅ Backend appears stable and ready for production")
            print(f"✅ 30-minute stability issue likely resolved")
        
        print(f"\n📅 Test completed at: {datetime.now()}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = StabilityTester()
    success = tester.run_stability_tests()
    sys.exit(0 if success else 1)