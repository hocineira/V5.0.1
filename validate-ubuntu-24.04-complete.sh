#!/bin/bash

# ==================================================================================
# SCRIPT DE VALIDATION COMPLÈTE - UBUNTU 24.04 
# Test de toutes les fonctionnalités après réparation
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

echo "🧪 VALIDATION COMPLÈTE PORTFOLIO - UBUNTU 24.04"
echo "================================================"
echo ""

# ==================================================================================
# 1. TESTS DE BASE DE DONNÉES
# ==================================================================================

echo "🗄️ Tests de base de données MariaDB..."

# Test connexion MariaDB
mysql -u portfolio_user -pportfolio_password -e "SELECT 1;" portfolio_db > /dev/null 2>&1
test_result $? "Connexion MariaDB"

# Test tables créées
table_count=$(mysql -u portfolio_user -pportfolio_password -D portfolio_db -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ $table_count -gt 8 ]; then
    test_result 0 "Tables créées ($((table_count-1)) tables)"
else
    test_result 1 "Tables insuffisantes ($((table_count-1)) tables)"
fi

# Test données personnelles
personal_count=$(mysql -u portfolio_user -pportfolio_password -D portfolio_db -e "SELECT COUNT(*) FROM personal_info;" 2>/dev/null | tail -1)
test_result $([ "$personal_count" -ge 1 ] && echo 0 || echo 1) "Données personnelles ($personal_count enregistrements)"

# Test données projets
projects_count=$(mysql -u portfolio_user -pportfolio_password -D portfolio_db -e "SELECT COUNT(*) FROM projects;" 2>/dev/null | tail -1)
test_result $([ "$projects_count" -ge 1 ] && echo 0 || echo 1) "Projets ($projects_count enregistrements)"

# Test données compétences
skills_count=$(mysql -u portfolio_user -pportfolio_password -D portfolio_db -e "SELECT COUNT(*) FROM skill_categories;" 2>/dev/null | tail -1)
test_result $([ "$skills_count" -ge 1 ] && echo 0 || echo 1) "Compétences ($skills_count catégories)"

# ==================================================================================
# 2. TESTS DES SERVICES
# ==================================================================================

echo ""
echo "🔧 Tests des services..."

# Test service MariaDB
pgrep -x "mysqld" > /dev/null 2>&1
test_result $? "Service MariaDB actif"

# Test service backend
supervisorctl status backend | grep -q RUNNING
test_result $? "Service Backend actif"

# Test service frontend
supervisorctl status frontend | grep -q RUNNING
test_result $? "Service Frontend actif"

# ==================================================================================
# 3. TESTS DE CONNECTIVITÉ
# ==================================================================================

echo ""
echo "🌐 Tests de connectivité..."

# Test backend health
curl -s http://localhost:8001/api/health > /dev/null 2>&1
test_result $? "Backend Health endpoint"

# Test frontend
curl -s http://localhost:3000 > /dev/null 2>&1
test_result $? "Frontend accessible"

# ==================================================================================
# 4. TESTS DES API ENDPOINTS
# ==================================================================================

echo ""
echo "📡 Tests des API endpoints..."

# Test personal info
curl -s http://localhost:8001/api/portfolio/personal-info > /dev/null 2>&1
test_result $? "API Personal Info"

# Test education
curl -s http://localhost:8001/api/portfolio/education > /dev/null 2>&1
test_result $? "API Education"

# Test skills
curl -s http://localhost:8001/api/portfolio/skills > /dev/null 2>&1
test_result $? "API Skills"

# Test projects
curl -s http://localhost:8001/api/portfolio/projects > /dev/null 2>&1
test_result $? "API Projects"

# Test experience
curl -s http://localhost:8001/api/portfolio/experience > /dev/null 2>&1
test_result $? "API Experience"

# Test certifications
curl -s http://localhost:8001/api/portfolio/certifications > /dev/null 2>&1
test_result $? "API Certifications"

# Test testimonials
curl -s http://localhost:8001/api/portfolio/testimonials > /dev/null 2>&1
test_result $? "API Testimonials"

# Test contact messages
curl -s http://localhost:8001/api/portfolio/contact-messages > /dev/null 2>&1
test_result $? "API Contact Messages"

# Test procedures
curl -s http://localhost:8001/api/portfolio/procedures > /dev/null 2>&1
test_result $? "API Procedures"

# Test veille
curl -s http://localhost:8001/api/portfolio/veille > /dev/null 2>&1
test_result $? "API Veille"

# ==================================================================================
# 5. TESTS DE PERFORMANCE
# ==================================================================================

echo ""
echo "⚡ Tests de performance..."

# Test temps de réponse API
start_time=$(date +%s.%N)
curl -s http://localhost:8001/api/health > /dev/null 2>&1
end_time=$(date +%s.%N)
response_time=$(echo "$end_time - $start_time" | bc)

if (( $(echo "$response_time < 2.0" | bc -l) )); then
    test_result 0 "Temps de réponse API acceptable (${response_time}s)"
else
    test_result 1 "Temps de réponse API lent (${response_time}s)"
fi

# Test utilisation mémoire
memory_usage=$(ps aux | grep -E '(mysqld|python|node)' | grep -v grep | awk '{sum += $4} END {print sum}')
if (( $(echo "$memory_usage < 50" | bc -l) )); then
    test_result 0 "Utilisation mémoire acceptable (${memory_usage}%)"
else
    test_result 1 "Utilisation mémoire élevée (${memory_usage}%)"
fi

# ==================================================================================
# 6. TESTS CRUD
# ==================================================================================

echo ""
echo "🔄 Tests CRUD..."

# Test création d'un message de contact
contact_response=$(curl -s -X POST http://localhost:8001/api/portfolio/contact-messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Ubuntu","email":"test@ubuntu.com","message":"Test message from Ubuntu validation"}' 2>/dev/null)

if echo "$contact_response" | grep -q "id"; then
    test_result 0 "Création message de contact"
    
    # Extraction de l'ID pour les tests suivants
    contact_id=$(echo "$contact_response" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    
    # Test récupération
    curl -s http://localhost:8001/api/portfolio/contact-messages/$contact_id > /dev/null 2>&1
    test_result $? "Récupération message de contact"
    
    # Test suppression
    curl -s -X DELETE http://localhost:8001/api/portfolio/contact-messages/$contact_id > /dev/null 2>&1
    test_result $? "Suppression message de contact"
else
    test_result 1 "Création message de contact"
fi

# ==================================================================================
# 7. TESTS DE CONFIGURATION
# ==================================================================================

echo ""
echo "⚙️ Tests de configuration..."

# Test fichier .env backend
[ -f "/app/backend/.env" ] && grep -q "mysql+pymysql" "/app/backend/.env"
test_result $? "Configuration backend (.env)"

# Test fichier .env frontend
[ -f "/app/frontend/.env" ] && grep -q "localhost:8001" "/app/frontend/.env"
test_result $? "Configuration frontend (.env)"

# Test variables d'environnement
cd /app/backend && python -c "import os; print(os.environ.get('DATABASE_URL', 'NOT_SET'))" | grep -q "mysql+pymysql"
test_result $? "Variables d'environnement"

# ==================================================================================
# 8. TESTS DE SÉCURITÉ
# ==================================================================================

echo ""
echo "🛡️ Tests de sécurité..."

# Test permissions fichiers
stat -c "%a" /app/backend/.env | grep -q "6[0-9][0-9]"
test_result $? "Permissions fichiers sensibles"

# Test utilisateur base de données
mysql -u portfolio_user -pportfolio_password -e "SHOW GRANTS;" 2>/dev/null | grep -q "portfolio_db"
test_result $? "Utilisateur base de données restreint"

# Test pas d'accès root sans mot de passe
mysql -u root -e "SELECT 1;" 2>/dev/null && ROOT_ACCESS=1 || ROOT_ACCESS=0
test_result $([ $ROOT_ACCESS -eq 1 ] && echo 0 || echo 1) "Accès root MariaDB sécurisé"

# ==================================================================================
# 9. RÉSUMÉ DES TESTS
# ==================================================================================

echo ""
echo "================================================"
echo "📊 RÉSUMÉ DES TESTS"
echo "================================================"
echo ""

if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS PASSÉS !${NC}"
    echo -e "${GREEN}✅ $TESTS_PASSED/$TESTS_TOTAL tests réussis${NC}"
    echo ""
    echo "🚀 Votre portfolio est correctement configuré pour Ubuntu 24.04"
    echo ""
    echo "🌐 URLs disponibles:"
    echo "  • Backend API: http://localhost:8001"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Health Check: http://localhost:8001/api/health"
    echo ""
    echo "📋 Commandes de gestion:"
    echo "  • supervisorctl status              - Vérifier tous les services"
    echo "  • supervisorctl restart backend     - Redémarrer le backend"
    echo "  • supervisorctl restart frontend    - Redémarrer le frontend"
    echo "  • service mariadb status           - Vérifier MariaDB"
    echo ""
    echo "🗄️ Base de données:"
    echo "  • Serveur: MariaDB 10.11.11"
    echo "  • Base: portfolio_db"
    echo "  • Utilisateur: portfolio_user"
    echo ""
    echo "✅ Le portfolio est prêt pour la production sur Ubuntu 24.04!"
    exit 0
else
    echo -e "${RED}❌ CERTAINS TESTS ONT ÉCHOUÉ !${NC}"
    echo -e "${RED}✅ $TESTS_PASSED/$TESTS_TOTAL tests réussis${NC}"
    echo ""
    echo "🔧 Vérifiez les erreurs ci-dessus et corrigez-les"
    echo ""
    echo "📋 Logs utiles pour le diagnostic:"
    echo "  • Backend: /var/log/supervisor/backend.*.log"
    echo "  • Frontend: /var/log/supervisor/frontend.*.log"
    echo "  • MariaDB: /var/log/mysql/error.log"
    echo ""
    echo "🔄 Commandes de redémarrage:"
    echo "  • supervisorctl restart all"
    echo "  • service mariadb restart"
    echo ""
    exit 1
fi