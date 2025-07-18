#!/bin/bash

# ==================================================================================
# SCRIPT DE VALIDATION FINALE - UBUNTU 24.04
# Version simple et fonctionnelle
# ==================================================================================

echo "🧪 VALIDATION PORTFOLIO - UBUNTU 24.04"
echo "======================================="
echo ""

# Variables
SUCCESS=0
TOTAL=0

# Fonction de test
run_test() {
    local name="$1"
    local command="$2"
    
    echo -n "Testing $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo "✅ PASS"
        ((SUCCESS++))
    else
        echo "❌ FAIL"
    fi
    ((TOTAL++))
}

# Tests de base de données
echo "🗄️ Tests de base de données MariaDB:"
run_test "Connexion MariaDB" "mysql -u portfolio_user -pportfolio_password -e 'SELECT 1;' portfolio_db"
run_test "Tables créées" "mysql -u portfolio_user -pportfolio_password -D portfolio_db -e 'SHOW TABLES;' | grep -q personal_info"

echo ""
echo "🔧 Tests des services:"
run_test "Backend service" "supervisorctl status backend | grep -q RUNNING"
run_test "Frontend service" "supervisorctl status frontend | grep -q RUNNING"

echo ""
echo "🌐 Tests de connectivité:"
run_test "Backend Health" "curl -s http://localhost:8001/api/health"
run_test "Frontend access" "curl -s http://localhost:3000"

echo ""
echo "📡 Tests des API endpoints:"
run_test "Personal Info API" "curl -s http://localhost:8001/api/portfolio/personal-info"
run_test "Skills API" "curl -s http://localhost:8001/api/portfolio/skills"
run_test "Projects API" "curl -s http://localhost:8001/api/portfolio/projects"
run_test "Experience API" "curl -s http://localhost:8001/api/portfolio/experience"

echo ""
echo "🔄 Test CRUD:"
# Test création message de contact
CONTACT_DATA='{"name":"Test Ubuntu","email":"test@ubuntu.com","message":"Test validation Ubuntu 24.04"}'
run_test "Create contact message" "curl -s -X POST http://localhost:8001/api/portfolio/contact-messages -H 'Content-Type: application/json' -d '$CONTACT_DATA'"

echo ""
echo "======================================="
echo "📊 RÉSUMÉ DES TESTS"
echo "======================================="

SUCCESS_RATE=$((SUCCESS * 100 / TOTAL))

if [ $SUCCESS -eq $TOTAL ]; then
    echo "🎉 TOUS LES TESTS PASSÉS !"
    echo "✅ $SUCCESS/$TOTAL tests réussis ($SUCCESS_RATE%)"
    echo ""
    echo "🚀 Portfolio correctement configuré pour Ubuntu 24.04"
    echo ""
    echo "🌐 URLs disponibles:"
    echo "  • Backend API: http://localhost:8001"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Health Check: http://localhost:8001/api/health"
    echo "  • API Docs: http://localhost:8001/docs"
    echo ""
    echo "🗄️ Base de données:"
    echo "  • Serveur: MariaDB"
    echo "  • Base: portfolio_db"
    echo "  • Utilisateur: portfolio_user"
    echo ""
    echo "📋 Commandes utiles:"
    echo "  • supervisorctl status"
    echo "  • supervisorctl restart backend"
    echo "  • supervisorctl restart frontend"
    echo "  • service mariadb status"
    echo ""
    echo "✅ Installation Ubuntu 24.04 VALIDÉE !"
    exit 0
else
    echo "❌ CERTAINS TESTS ONT ÉCHOUÉ !"
    echo "✅ $SUCCESS/$TOTAL tests réussis ($SUCCESS_RATE%)"
    echo ""
    echo "🔧 Vérifiez les erreurs ci-dessus"
    echo ""
    echo "📋 Logs utiles:"
    echo "  • Backend: tail -f /var/log/supervisor/backend.err.log"
    echo "  • Frontend: tail -f /var/log/supervisor/frontend.err.log"
    echo ""
    echo "🔄 Redémarrage:"
    echo "  • supervisorctl restart all"
    echo ""
    exit 1
fi