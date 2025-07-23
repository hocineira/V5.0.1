#!/usr/bin/env python3
"""
Backend API Testing for Next.js Portfolio Application
Tests the PDF API endpoint functionality and root redirect
"""

import requests
import json
import sys
import os
import time
from urllib.parse import urljoin

# Configuration
BASE_URL = "http://localhost:3000"
API_BASE = f"{BASE_URL}/api"

def test_pdf_api_endpoint():
    """Test the PDF API endpoint functionality"""
    print("🔍 Testing PDF API Endpoint...")
    
    # Test files that should exist based on the directory listing
    test_files = [
        "VLAN_Interco.pdf",
        "Zabbix.pdf", 
        "Active_Directory.pdf",
        "GLPI.pdf",
        "Proxmox.pdf",
        "GPO.pdf",
        "MITM_Ettercap.pdf",
        "MITM_DNS_Spoofing.pdf"
    ]
    
    results = {
        "endpoint_accessible": False,
        "files_served": 0,
        "total_files": len(test_files),
        "errors": [],
        "successful_files": [],
        "failed_files": []
    }
    
    for filename in test_files:
        try:
            url = f"{API_BASE}/pdf/{filename}"
            print(f"  Testing: {url}")
            
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                # Check if it's actually a PDF
                content_type = response.headers.get('Content-Type', '')
                if 'application/pdf' in content_type:
                    results["files_served"] += 1
                    results["successful_files"].append(filename)
                    print(f"    ✅ {filename} - OK (PDF served correctly)")
                else:
                    results["failed_files"].append(f"{filename} - Wrong content type: {content_type}")
                    print(f"    ❌ {filename} - Wrong content type: {content_type}")
            else:
                results["failed_files"].append(f"{filename} - HTTP {response.status_code}")
                print(f"    ❌ {filename} - HTTP {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            results["failed_files"].append(f"{filename} - Connection error: {str(e)}")
            print(f"    ❌ {filename} - Connection error: {str(e)}")
    
    # Check if endpoint is accessible (at least one file worked)
    results["endpoint_accessible"] = results["files_served"] > 0
    
    return results

def test_pdf_api_error_handling():
    """Test PDF API error handling for non-existent files"""
    print("\n🔍 Testing PDF API Error Handling...")
    
    try:
        # Test with non-existent file
        url = f"{API_BASE}/pdf/nonexistent.pdf"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 404:
            print("  ✅ 404 error handling working correctly")
            return True
        else:
            print(f"  ❌ Expected 404, got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Connection error: {str(e)}")
        return False

def test_application_health():
    """Test if the Next.js application is running and accessible"""
    print("🔍 Testing Application Health...")
    
    try:
        response = requests.get(BASE_URL, timeout=10)
        if response.status_code == 200:
            print("  ✅ Application is accessible")
            return True
        else:
            print(f"  ❌ Application returned HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Application not accessible: {str(e)}")
        return False

def main():
    """Main testing function"""
    print("🚀 Starting Backend API Testing for Next.js Portfolio")
    print("=" * 60)
    
    # Test application health first
    app_healthy = test_application_health()
    if not app_healthy:
        print("\n❌ Application is not running. Cannot proceed with API testing.")
        return False
    
    # Test PDF API endpoint
    pdf_results = test_pdf_api_endpoint()
    
    # Test error handling
    error_handling_ok = test_pdf_api_error_handling()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 BACKEND TESTING SUMMARY")
    print("=" * 60)
    
    print(f"Application Health: {'✅ HEALTHY' if app_healthy else '❌ UNHEALTHY'}")
    print(f"PDF API Endpoint: {'✅ WORKING' if pdf_results['endpoint_accessible'] else '❌ FAILING'}")
    print(f"Error Handling: {'✅ WORKING' if error_handling_ok else '❌ FAILING'}")
    print(f"PDF Files Served: {pdf_results['files_served']}/{pdf_results['total_files']}")
    
    if pdf_results['successful_files']:
        print(f"\n✅ Successfully served PDFs:")
        for file in pdf_results['successful_files']:
            print(f"  - {file}")
    
    if pdf_results['failed_files']:
        print(f"\n❌ Failed PDFs:")
        for file in pdf_results['failed_files']:
            print(f"  - {file}")
    
    # Overall assessment
    overall_success = (
        app_healthy and 
        pdf_results['endpoint_accessible'] and 
        error_handling_ok and
        pdf_results['files_served'] >= 6  # At least 75% of files should work
    )
    
    print(f"\n🎯 OVERALL BACKEND STATUS: {'✅ WORKING' if overall_success else '❌ FAILING'}")
    
    if not overall_success:
        print("\n🔧 ISSUES IDENTIFIED:")
        if not app_healthy:
            print("  - Application is not running or not accessible")
        if not pdf_results['endpoint_accessible']:
            print("  - PDF API endpoint is not working")
        if not error_handling_ok:
            print("  - Error handling is not working properly")
        if pdf_results['files_served'] < 6:
            print(f"  - Only {pdf_results['files_served']}/8 PDF files are being served correctly")
    
    return overall_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)