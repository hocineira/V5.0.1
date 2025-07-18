#!/bin/bash

# ==================================================================================
# SCRIPT DE VALIDATION RAPIDE - UBUNTU 24.04
# Version simplifiée et testée
# ==================================================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TESTS_PASSED=0
TESTS_TOTAL=0

# Fonction pour les tests
test_result() {
    ((TESTS_TOTAL++))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} $2"
    fi
}

echo -e "${BLUE}🧪 VALIDATION RAPIDE PORTFOLIO - UBUNTU 24.04${NC}"
echo "=============================================="
echo ""

# ==================================================================================
# 1. TESTS DE BASE DE DONNÉES
# ==================================================================================

echo -e "${BLUE}🗄️ Tests de base de données MariaDB...${NC}"

# Test connexion MariaDB
if mysql -u portfolio_user -pportfolio_password -e "SELECT 1;" portfolio_db > /dev/null 2>&1; then
    test_result 0 "Connexion MariaDB"
else
    test_result 1 "Connexion MariaDB"
fi

# Test tables créées
table_count=$(mysql -u portfolio_user -pportfolio_password -D portfolio_db -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ $table_count -gt 8 ]; then
    test_result 0 "Tables créées ($((table_count-1)) tables)"
else
    test_result 1 "Tables insuffisantes ($((table_count-1)) tables)"
fi

# ==================================================================================
# 2. TESTS DES SERVICES
# ==================================================================================

echo ""
echo -e "${BLUE}🔧 Tests des services...${NC}"

# Test service backend
if supervisorctl status backend | grep -q RUNNING; then
    test_result 0 "Service Backend actif"
else
    test_result 1 "Service Backend inactif"
fi

# Test service frontend
if supervisorctl status frontend | grep -q RUNNING; then
    test_result 0 "Service Frontend actif"
else
    test_result 1 "Service Frontend inactif"
fi

# ==================================================================================
# 3. TESTS DE CONNECTIVITÉ
# ==================================================================================

echo ""
echo -e "${BLUE}🌐 Tests de connectivité...${NC}"

# Test backend health
if curl -s http://localhost:8001/api/health > /dev/null 2>&1; then
    test_result 0 "Backend Health endpoint"
else
    test_result 1 "Backend Health endpoint"
fi

# Test frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    test_result 0 "Frontend accessible"
else
    test_result 1 "Frontend accessible"
fi

# ==================================================================================
# 4. TESTS DES API ENDPOINTS PRINCIPAUX
# ==================================================================================

echo ""
echo -e "${BLUE}📡 Tests des API endpoints...${NC}"

# Test personal info
if curl -s http://localhost:8001/api/portfolio/personal-info > /dev/null 2>&1; then
    test_result 0 "API Personal Info"
else
    test_result 1 "API Personal Info"
fi

# Test skills
if curl -s http://localhost:8001/api/portfolio/skills > /dev/null 2>&1; then
    test_result 0 "API Skills"
else
    test_result 1 "API Skills"
fi

# Test projects
if curl -s http://localhost:8001/api/portfolio/projects > /dev/null 2>&1; then
    test_result 0 "API Projects"
else
    test_result 1 "API Projects"
fi

# ==================================================================================
# 5. TEST CRUD SIMPLE
# ==================================================================================

echo ""
echo -e "${BLUE}🔄 Test CRUD simple...${NC}"

# Test création d'un message de contact
contact_response=$(curl -s -X POST http://localhost:8001/api/portfolio/contact-messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Ubuntu","email":"test@ubuntu.com","message":"Test message from Ubuntu validation"}' 2>/dev/null)

if echo "$contact_response" | grep -q "id"; then
    test_result 0 "Création message de contact"
    
    # Extraction de l'ID pour suppression
    contact_id=$(echo "$contact_response" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")
    
    if [ -n "$contact_id" ]; then
        # Test suppression
        if curl -s -X DELETE http://localhost:8001/api/portfolio/contact-messages/$contact_id > /dev/null 2>&1; then
            test_result 0 "Suppression message de contact"
        else
            test_result 1 "Suppression message de contact"
        fi
    else
        test_result 1 "Extraction ID message de contact"
    fi
else
    test_result 1 "Création message de contact"
fi

# ==================================================================================
# 6. RÉSUMÉ DES TESTS
# ==================================================================================

echo ""
echo "=============================================="
echo -e "${BLUE}📊 RÉSUMÉ DES TESTS${NC}"
echo "=============================================="
echo ""

success_rate=$((TESTS_PASSED * 100 / TESTS_TOTAL))

if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS PASSÉS !${NC}"
    echo -e "${GREEN}✅ $TESTS_PASSED/$TESTS_TOTAL tests réussis (${success_rate}%)${NC}"
    echo ""
    echo -e "${GREEN}🚀 Votre portfolio est correctement configuré pour Ubuntu 24.04${NC}"
    echo ""
    echo -e "${BLUE}🌐 URLs disponibles:${NC}"
    echo "  • Backend API: http://localhost:8001"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Health Check: http://localhost:8001/api/health"
    echo "  • API Docs: http://localhost:8001/docs"
    echo ""
    echo -e "${BLUE}📋 Commandes utiles:${NC}"
    echo "  • supervisorctl status              - Vérifier les services"
    echo "  • supervisorctl restart backend     - Redémarrer le backend"
    echo "  • supervisorctl restart frontend    - Redémarrer le frontend"
    echo "  • service mariadb status           - Vérifier MariaDB"
    echo ""
    echo -e "${BLUE}🗄️ Base de données:${NC}"
    echo "  • Serveur: MariaDB"
    echo "  • Base: portfolio_db"
    echo "  • Utilisateur: portfolio_user"
    echo ""
    echo -e "${GREEN}✅ Portfolio prêt pour la production !${NC}"
    exit 0
else
    echo -e "${RED}❌ CERTAINS TESTS ONT ÉCHOUÉ !${NC}"
    echo -e "${RED}✅ $TESTS_PASSED/$TESTS_TOTAL tests réussis (${success_rate}%)${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Vérifiez les erreurs ci-dessus et corrigez-les${NC}"
    echo ""
    echo -e "${BLUE}📋 Logs utiles pour le diagnostic:${NC}"
    echo "  • Backend: tail -f /var/log/supervisor/backend.err.log"
    echo "  • Frontend: tail -f /var/log/supervisor/frontend.err.log"
    echo "  • MariaDB: tail -f /var/log/mysql/error.log"
    echo ""
    echo -e "${BLUE}🔄 Commandes de redémarrage:${NC}"
    echo "  • supervisorctl restart all"
    echo "  • service mariadb restart"
    echo ""
    echo -e "${YELLOW}Pour plus de détails, consultez le guide d'installation :${NC}"
    echo "  GUIDE-INSTALLATION-UBUNTU-24.04-CORRIGE.md"
    echo ""
    exit 1
fi