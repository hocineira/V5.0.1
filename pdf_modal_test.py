#!/usr/bin/env python3
"""
Advanced PDF Modal Testing - Simulating Frontend Behavior
Tests iframe loading and CSP compliance for PDF modal functionality
"""

import requests
import json
import sys
import time
from urllib.parse import urljoin

# Configuration
BASE_URL = "http://localhost:3000"
API_BASE = f"{BASE_URL}/api"

def test_iframe_pdf_loading():
    """Test PDF loading in iframe context (simulating frontend modal behavior)"""
    print("🔍 Testing PDF Loading in iframe Context...")
    
    test_files = ["VLAN_Interco.pdf", "Zabbix.pdf", "Active_Directory.pdf"]
    results = {
        "direct_access": 0,
        "api_access": 0,
        "csp_compliant": True,
        "issues": []
    }
    
    for filename in test_files:
        print(f"\n  Testing: {filename}")
        
        # Test direct access (how frontend might try to load)
        try:
            direct_url = f"{BASE_URL}/procedures/{filename}"
            response = requests.get(direct_url, timeout=10)
            
            if response.status_code == 200:
                results["direct_access"] += 1
                print(f"    ✅ Direct access: OK")
                
                # Check CSP headers for iframe compatibility
                csp = response.headers.get('Content-Security-Policy', '')
                if 'frame-src' in csp and ('self' in csp or '*' in csp):
                    print(f"    ✅ CSP allows iframe loading")
                else:
                    results["csp_compliant"] = False
                    results["issues"].append(f"{filename} - CSP may block iframe loading")
                    print(f"    ⚠️  CSP might restrict iframe loading")
            else:
                results["issues"].append(f"{filename} - Direct access failed: HTTP {response.status_code}")
                print(f"    ❌ Direct access failed: HTTP {response.status_code}")
                
        except Exception as e:
            results["issues"].append(f"{filename} - Direct access error: {str(e)}")
            print(f"    ❌ Direct access error: {str(e)}")
        
        # Test API access
        try:
            api_url = f"{API_BASE}/pdf/{filename}"
            response = requests.get(api_url, timeout=10)
            
            if response.status_code == 200:
                results["api_access"] += 1
                print(f"    ✅ API access: OK")
                
                # Check content disposition for inline display
                content_disp = response.headers.get('Content-Disposition', '')
                if 'inline' in content_disp:
                    print(f"    ✅ Content-Disposition set for inline display")
                else:
                    print(f"    ⚠️  Content-Disposition not optimized for inline display")
            else:
                results["issues"].append(f"{filename} - API access failed: HTTP {response.status_code}")
                print(f"    ❌ API access failed: HTTP {response.status_code}")
                
        except Exception as e:
            results["issues"].append(f"{filename} - API access error: {str(e)}")
            print(f"    ❌ API access error: {str(e)}")
    
    return results

def test_pdf_modal_simulation():
    """Simulate the exact behavior of the PDF modal component"""
    print("\n🔍 Simulating PDF Modal Component Behavior...")
    
    # Test the specific files mentioned in the test_result.md
    modal_test_files = [
        "VLAN_Interco.pdf",
        "Zabbix.pdf", 
        "Active_Directory.pdf",
        "GLPI.pdf"
    ]
    
    results = {
        "modal_compatible": 0,
        "total_tested": len(modal_test_files),
        "loading_issues": [],
        "success_files": []
    }
    
    for filename in modal_test_files:
        print(f"\n  Simulating modal for: {filename}")
        
        # Test multiple loading strategies that the modal might use
        strategies = [
            ("Direct /procedures/", f"{BASE_URL}/procedures/{filename}"),
            ("API endpoint", f"{API_BASE}/pdf/{filename}"),
            ("With iframe params", f"{BASE_URL}/procedures/{filename}#toolbar=1&navpanes=1&scrollbar=1&zoom=fit")
        ]
        
        file_working = False
        
        for strategy_name, url in strategies:
            try:
                print(f"    Testing {strategy_name}: {url}")
                response = requests.get(url, timeout=10)
                
                if response.status_code == 200:
                    content_type = response.headers.get('Content-Type', '')
                    content_length = response.headers.get('Content-Length', '0')
                    
                    if 'application/pdf' in content_type and int(content_length) > 1000:
                        print(f"      ✅ {strategy_name} - PDF loaded successfully ({content_length} bytes)")
                        file_working = True
                        break
                    else:
                        print(f"      ❌ {strategy_name} - Invalid content type or size")
                else:
                    print(f"      ❌ {strategy_name} - HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"      ❌ {strategy_name} - Error: {str(e)}")
        
        if file_working:
            results["modal_compatible"] += 1
            results["success_files"].append(filename)
        else:
            results["loading_issues"].append(filename)
    
    return results

def test_csp_iframe_compatibility():
    """Test CSP configuration for iframe compatibility"""
    print("\n🔍 Testing CSP Configuration for iframe Compatibility...")
    
    try:
        response = requests.get(BASE_URL, timeout=10)
        csp = response.headers.get('Content-Security-Policy', '')
        
        print(f"  Current CSP: {csp}")
        
        # Check specific directives that affect iframe loading
        csp_checks = {
            "frame-src": False,
            "object-src": False,
            "frame-ancestors": False
        }
        
        for directive in csp_checks:
            if directive in csp:
                csp_checks[directive] = True
                print(f"    ✅ {directive} directive present")
            else:
                print(f"    ❌ {directive} directive missing")
        
        # Check if frame-src allows self and blob
        if 'frame-src' in csp:
            frame_src_value = csp.split('frame-src')[1].split(';')[0].strip()
            if "'self'" in frame_src_value and "blob:" in frame_src_value:
                print(f"    ✅ frame-src allows 'self' and 'blob:' - Good for PDF iframes")
                return True
            else:
                print(f"    ⚠️  frame-src configuration: {frame_src_value}")
                return False
        else:
            print(f"    ❌ frame-src directive not found")
            return False
            
    except Exception as e:
        print(f"    ❌ Error checking CSP: {str(e)}")
        return False

def main():
    """Main testing function for PDF modal functionality"""
    print("🚀 Starting Advanced PDF Modal Backend Testing")
    print("=" * 60)
    
    # Test iframe PDF loading
    iframe_results = test_iframe_pdf_loading()
    
    # Test PDF modal simulation
    modal_results = test_pdf_modal_simulation()
    
    # Test CSP compatibility
    csp_compatible = test_csp_iframe_compatibility()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 PDF MODAL BACKEND TESTING SUMMARY")
    print("=" * 60)
    
    print(f"Direct PDF Access: {iframe_results['direct_access']}/3 files working")
    print(f"API PDF Access: {iframe_results['api_access']}/3 files working")
    print(f"Modal Compatibility: {modal_results['modal_compatible']}/{modal_results['total_tested']} files working")
    print(f"CSP iframe Compatibility: {'✅ COMPATIBLE' if csp_compatible else '❌ ISSUES'}")
    
    if modal_results['success_files']:
        print(f"\n✅ Modal-compatible PDFs:")
        for file in modal_results['success_files']:
            print(f"  - {file}")
    
    if modal_results['loading_issues']:
        print(f"\n❌ PDFs with loading issues:")
        for file in modal_results['loading_issues']:
            print(f"  - {file}")
    
    if iframe_results['issues']:
        print(f"\n⚠️  Identified Issues:")
        for issue in iframe_results['issues']:
            print(f"  - {issue}")
    
    # Overall assessment for PDF modal functionality
    modal_backend_working = (
        iframe_results['direct_access'] >= 2 and
        iframe_results['api_access'] >= 2 and
        modal_results['modal_compatible'] >= 3 and
        csp_compatible
    )
    
    print(f"\n🎯 PDF MODAL BACKEND STATUS: {'✅ WORKING' if modal_backend_working else '❌ NEEDS ATTENTION'}")
    
    if not modal_backend_working:
        print("\n🔧 RECOMMENDATIONS:")
        if iframe_results['direct_access'] < 2:
            print("  - Check direct PDF file access configuration")
        if iframe_results['api_access'] < 2:
            print("  - Verify API endpoint functionality")
        if modal_results['modal_compatible'] < 3:
            print("  - Investigate PDF loading strategies in modal component")
        if not csp_compatible:
            print("  - Review CSP configuration for iframe compatibility")
    
    return modal_backend_working

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)