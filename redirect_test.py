#!/usr/bin/env python3
"""
Root Redirect Testing for Next.js Portfolio Application
Tests the server-side redirect from "/" to "/accueil"
"""

import requests
import sys
import time
from urllib.parse import urljoin

# Configuration
BASE_URL = "http://localhost:3000"

def test_root_redirect():
    """Test the root page redirect functionality"""
    print("🔍 Testing Root Page Redirect (/ → /accueil)...")
    
    try:
        # Test root redirect with allow_redirects=False to see the redirect response
        response = requests.get(BASE_URL, allow_redirects=False, timeout=10)
        
        print(f"  Initial response status: {response.status_code}")
        print(f"  Response headers: {dict(response.headers)}")
        
        # Check if it's a proper redirect (307 for Next.js server-side redirect)
        if response.status_code in [301, 302, 307, 308]:
            location = response.headers.get('Location', '')
            print(f"  Redirect location: {location}")
            
            # Check if redirecting to /accueil
            if location.endswith('/accueil') or '/accueil' in location:
                print("  ✅ Proper redirect to /accueil detected")
                
                # Now follow the redirect to ensure /accueil loads
                final_response = requests.get(BASE_URL, allow_redirects=True, timeout=10)
                if final_response.status_code == 200:
                    print("  ✅ /accueil page loads successfully after redirect")
                    
                    # Check if we're actually on /accueil
                    if '/accueil' in final_response.url:
                        print(f"  ✅ Final URL confirmed: {final_response.url}")
                        return {
                            "success": True,
                            "redirect_status": response.status_code,
                            "redirect_location": location,
                            "final_url": final_response.url,
                            "final_status": final_response.status_code,
                            "server_side": True
                        }
                    else:
                        print(f"  ❌ Final URL unexpected: {final_response.url}")
                        return {"success": False, "error": f"Final URL unexpected: {final_response.url}"}
                else:
                    print(f"  ❌ /accueil page failed to load: {final_response.status_code}")
                    return {"success": False, "error": f"/accueil page failed to load: {final_response.status_code}"}
            else:
                print(f"  ❌ Redirect location incorrect: {location}")
                return {"success": False, "error": f"Redirect location incorrect: {location}"}
        else:
            # If no redirect, check if we get content directly (which would be wrong)
            print(f"  ❌ No redirect detected, got status {response.status_code}")
            if response.status_code == 200:
                print("  ❌ Root page serving content directly instead of redirecting")
                return {"success": False, "error": "Root page serving content directly instead of redirecting"}
            else:
                return {"success": False, "error": f"Unexpected status code: {response.status_code}"}
                
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Connection error: {str(e)}")
        return {"success": False, "error": f"Connection error: {str(e)}"}

def test_no_intermediate_page():
    """Test that there's no intermediate 'Redirection...' page"""
    print("\n🔍 Testing for Intermediate 'Redirection...' Page...")
    
    try:
        # Make request and capture the response content
        response = requests.get(BASE_URL, allow_redirects=True, timeout=10)
        
        if response.status_code == 200:
            content = response.text.lower()
            
            # Check for signs of intermediate redirection page
            intermediate_indicators = [
                'redirection',
                'redirecting',
                'please wait',
                'loading',
                'useeffect',
                'window.location'
            ]
            
            found_indicators = []
            for indicator in intermediate_indicators:
                if indicator in content:
                    found_indicators.append(indicator)
            
            if found_indicators:
                print(f"  ❌ Possible intermediate page detected. Found: {found_indicators}")
                return {"success": False, "intermediate_detected": True, "indicators": found_indicators}
            else:
                print("  ✅ No intermediate redirection page detected")
                return {"success": True, "intermediate_detected": False}
        else:
            print(f"  ❌ Failed to load page: {response.status_code}")
            return {"success": False, "error": f"Failed to load page: {response.status_code}"}
            
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Connection error: {str(e)}")
        return {"success": False, "error": f"Connection error: {str(e)}"}

def test_redirect_performance():
    """Test redirect performance and timing"""
    print("\n🔍 Testing Redirect Performance...")
    
    try:
        start_time = time.time()
        response = requests.get(BASE_URL, allow_redirects=True, timeout=10)
        end_time = time.time()
        
        total_time = end_time - start_time
        
        print(f"  Total redirect time: {total_time:.3f} seconds")
        
        if total_time < 1.0:
            print("  ✅ Redirect performance excellent (< 1 second)")
            performance_rating = "excellent"
        elif total_time < 2.0:
            print("  ✅ Redirect performance good (< 2 seconds)")
            performance_rating = "good"
        else:
            print("  ⚠️ Redirect performance slow (> 2 seconds)")
            performance_rating = "slow"
        
        return {
            "success": True,
            "total_time": total_time,
            "performance_rating": performance_rating
        }
        
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Connection error: {str(e)}")
        return {"success": False, "error": f"Connection error: {str(e)}"}

def test_accueil_page_content():
    """Test that /accueil page loads with expected content"""
    print("\n🔍 Testing /accueil Page Content...")
    
    try:
        response = requests.get(f"{BASE_URL}/accueil", timeout=10)
        
        if response.status_code == 200:
            content = response.text.lower()
            
            # Check for expected content on the accueil page
            expected_content = [
                'hocine iratni',
                'accueil',
                'portfolio'
            ]
            
            found_content = []
            for item in expected_content:
                if item in content:
                    found_content.append(item)
            
            if len(found_content) >= 2:  # At least 2 out of 3 expected items
                print(f"  ✅ /accueil page content verified. Found: {found_content}")
                return {"success": True, "content_verified": True, "found_content": found_content}
            else:
                print(f"  ⚠️ /accueil page content partially verified. Found: {found_content}")
                return {"success": True, "content_verified": False, "found_content": found_content}
        else:
            print(f"  ❌ /accueil page failed to load: {response.status_code}")
            return {"success": False, "error": f"/accueil page failed to load: {response.status_code}"}
            
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Connection error: {str(e)}")
        return {"success": False, "error": f"Connection error: {str(e)}"}

def main():
    """Main testing function"""
    print("🚀 Starting Root Redirect Testing for Next.js Portfolio")
    print("=" * 60)
    
    # Test 1: Root redirect functionality
    redirect_result = test_root_redirect()
    
    # Test 2: No intermediate page
    intermediate_result = test_no_intermediate_page()
    
    # Test 3: Redirect performance
    performance_result = test_redirect_performance()
    
    # Test 4: /accueil page content
    content_result = test_accueil_page_content()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 ROOT REDIRECT TESTING SUMMARY")
    print("=" * 60)
    
    print(f"Root Redirect: {'✅ WORKING' if redirect_result.get('success') else '❌ FAILING'}")
    if redirect_result.get('success'):
        print(f"  - Redirect Status: {redirect_result.get('redirect_status')}")
        print(f"  - Final URL: {redirect_result.get('final_url')}")
        print(f"  - Server-side: {'✅ YES' if redirect_result.get('server_side') else '❌ NO'}")
    
    print(f"No Intermediate Page: {'✅ CONFIRMED' if intermediate_result.get('success') and not intermediate_result.get('intermediate_detected') else '❌ DETECTED'}")
    
    print(f"Redirect Performance: {'✅ ' + performance_result.get('performance_rating', 'unknown').upper() if performance_result.get('success') else '❌ FAILED'}")
    if performance_result.get('success'):
        print(f"  - Total Time: {performance_result.get('total_time', 0):.3f}s")
    
    print(f"/accueil Content: {'✅ VERIFIED' if content_result.get('success') and content_result.get('content_verified') else '⚠️ PARTIAL' if content_result.get('success') else '❌ FAILED'}")
    
    # Overall assessment
    overall_success = (
        redirect_result.get('success', False) and
        intermediate_result.get('success', False) and
        not intermediate_result.get('intermediate_detected', True) and
        performance_result.get('success', False) and
        content_result.get('success', False)
    )
    
    print(f"\n🎯 OVERALL REDIRECT STATUS: {'✅ WORKING PERFECTLY' if overall_success else '❌ ISSUES DETECTED'}")
    
    if not overall_success:
        print("\n🔧 ISSUES IDENTIFIED:")
        if not redirect_result.get('success'):
            print(f"  - Root redirect not working: {redirect_result.get('error', 'Unknown error')}")
        if intermediate_result.get('intermediate_detected'):
            print(f"  - Intermediate page detected: {intermediate_result.get('indicators', [])}")
        if not performance_result.get('success'):
            print(f"  - Performance issue: {performance_result.get('error', 'Unknown error')}")
        if not content_result.get('success') or not content_result.get('content_verified'):
            print(f"  - Content verification issue: {content_result.get('error', 'Content not fully verified')}")
    else:
        print("\n🎉 ALL TESTS PASSED:")
        print("  - Server-side redirect from / to /accueil working")
        print("  - No intermediate 'Redirection...' page")
        print("  - Good redirect performance")
        print("  - /accueil page loads correctly")
    
    return overall_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)