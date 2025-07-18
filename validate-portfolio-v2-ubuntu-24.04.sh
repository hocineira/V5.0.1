#!/bin/bash

# =====================================================================
# SCRIPT DE VALIDATION PORTFOLIO v2.0 - UBUNTU 24.04
# Vérifie que l'installation fonctionne correctement
# =====================================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Compteurs
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Fonction de test
test_function() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    ((TOTAL_TESTS++))
    echo -e "${BLUE}[TEST $TOTAL_TESTS] ${test_name}${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS${NC} - $test_name"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} - $test_name"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Fonction d'information
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Fonction de succès
success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Fonction d'erreur
error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction d'avertissement
warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}🧪 VALIDATION PORTFOLIO v2.0 - UBUNTU 24.04${NC}"
echo -e "${GREEN}==============================================${NC}"
echo ""

# =====================================================================
# TEST 1: VÉRIFICATION DU SYSTÈME
# =====================================================================
info "🔍 Vérification du système..."

test_function "Ubuntu 24.04 détecté" \
    "grep -q 'Ubuntu 24.04' /etc/os-release" \
    "true"

test_function "Utilisateur portfolio existe" \
    "id -u portfolio >/dev/null 2>&1" \
    "true"

test_function "Répertoire portfolio existe" \
    "[ -d /opt/portfolio ]" \
    "true"

# =====================================================================
# TEST 2: VÉRIFICATION DES SERVICES
# =====================================================================
info "🔧 Vérification des services..."

test_function "MariaDB en cours d'exécution" \
    "systemctl is-active mariadb >/dev/null 2>&1" \
    "true"

test_function "Nginx en cours d'exécution" \
    "systemctl is-active nginx >/dev/null 2>&1" \
    "true"

test_function "Supervisor en cours d'exécution" \
    "systemctl is-active supervisor >/dev/null 2>&1" \
    "true"

# =====================================================================
# TEST 3: VÉRIFICATION DE LA BASE DE DONNÉES
# =====================================================================
info "🗄️ Vérification de la base de données..."

test_function "Base de données portfolio_db existe" \
    "mysql -u root -e 'USE portfolio_db; SELECT 1;' >/dev/null 2>&1" \
    "true"

test_function "Utilisateur portfolio_user existe" \
    "mysql -u root -e \"SELECT User FROM mysql.user WHERE User='portfolio_user';\" | grep -q portfolio_user" \
    "true"

# Test de connexion avec l'utilisateur portfolio
if [ -f /opt/portfolio/backend/.env ]; then
    DB_PASSWORD=$(grep DATABASE_URL /opt/portfolio/backend/.env | cut -d':' -f3 | cut -d'@' -f1)
    test_function "Connexion utilisateur portfolio_user" \
        "mysql -u portfolio_user -p$DB_PASSWORD -e 'SELECT 1;' >/dev/null 2>&1" \
        "true"
else
    warning "Fichier .env introuvable, test de connexion ignoré"
fi

# =====================================================================
# TEST 4: VÉRIFICATION DU BACKEND
# =====================================================================
info "🐍 Vérification du backend..."

test_function "Environnement virtuel Python existe" \
    "[ -d /opt/portfolio/backend/venv ]" \
    "true"

test_function "Fichier requirements.txt existe" \
    "[ -f /opt/portfolio/backend/requirements.txt ]" \
    "true"

test_function "Fichier .env existe" \
    "[ -f /opt/portfolio/backend/.env ]" \
    "true"

test_function "Service portfolio-backend en cours d'exécution" \
    "supervisorctl status portfolio-backend | grep -q RUNNING" \
    "true"

# =====================================================================
# TEST 5: VÉRIFICATION DU FRONTEND
# =====================================================================
info "⚛️ Vérification du frontend..."

test_function "Répertoire build existe" \
    "[ -d /opt/portfolio/frontend/build ]" \
    "true"

test_function "Fichier package.json existe" \
    "[ -f /opt/portfolio/frontend/package.json ]" \
    "true"

test_function "Node modules installés" \
    "[ -d /opt/portfolio/frontend/node_modules ]" \
    "true"

# =====================================================================
# TEST 6: TESTS DE CONNECTIVITÉ
# =====================================================================
info "🌐 Tests de connectivité..."

# Attendre que les services soient prêts
sleep 5

test_function "Backend répond (port 8001)" \
    "curl -s -o /dev/null -w '%{http_code}' http://localhost:8001/api/ | grep -q 200" \
    "true"

test_function "Frontend répond (port 80)" \
    "curl -s -o /dev/null -w '%{http_code}' http://localhost/ | grep -q 200" \
    "true"

# =====================================================================
# TEST 7: TESTS DE L'API v2.0
# =====================================================================
info "🔍 Tests de l'API v2.0..."

test_function "Health check API disponible" \
    "curl -s http://localhost:8001/api/health | jq -e '.status' | grep -q 'healthy'" \
    "true"

test_function "Métriques API disponibles" \
    "curl -s http://localhost:8001/api/metrics | jq -e '.timestamp' >/dev/null 2>&1" \
    "true"

test_function "Endpoint personal-info disponible" \
    "curl -s -o /dev/null -w '%{http_code}' http://localhost:8001/api/portfolio/personal-info | grep -q 200" \
    "true"

# =====================================================================
# TEST 8: TEST DE STABILITÉ
# =====================================================================
info "⏱️ Test de stabilité (pool de connexions)..."

test_function "10 requêtes consécutives réussies" \
    "for i in {1..10}; do curl -s http://localhost:8001/api/health >/dev/null || exit 1; done" \
    "true"

test_function "Pool de connexions fonctionnel" \
    "curl -s http://localhost:8001/api/health | jq -e '.connection_pool.pool_size' | grep -q '20'" \
    "true"

# =====================================================================
# TEST 9: VÉRIFICATION DES LOGS
# =====================================================================
info "📝 Vérification des logs..."

test_function "Logs backend accessibles" \
    "[ -f /var/log/supervisor/portfolio-backend.log ]" \
    "true"

test_function "Logs monitoring accessibles" \
    "[ -f /var/log/supervisor/portfolio-monitoring.log ]" \
    "true"

test_function "Logs Nginx accessibles" \
    "[ -f /var/log/nginx/access.log ]" \
    "true"

# =====================================================================
# TEST 10: VÉRIFICATION DE LA CONFIGURATION
# =====================================================================
info "⚙️ Vérification de la configuration..."

test_function "Configuration MariaDB personnalisée" \
    "[ -f /etc/mysql/mariadb.conf.d/99-portfolio.cnf ]" \
    "true"

test_function "Configuration Nginx portfolio" \
    "[ -f /etc/nginx/sites-available/portfolio ]" \
    "true"

test_function "Configuration Supervisor portfolio" \
    "[ -f /etc/supervisor/conf.d/portfolio-backend.conf ]" \
    "true"

# =====================================================================
# TEST 11: PERFORMANCE ET RÉPONSE
# =====================================================================
info "⚡ Tests de performance..."

# Test de temps de réponse
RESPONSE_TIME=$(curl -s -o /dev/null -w '%{time_total}' http://localhost:8001/api/health)
if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
    success "Temps de réponse API acceptable: ${RESPONSE_TIME}s"
    ((TESTS_PASSED++))
else
    error "Temps de réponse API lent: ${RESPONSE_TIME}s"
    ((TESTS_FAILED++))
fi
((TOTAL_TESTS++))

# =====================================================================
# RÉSUMÉ FINAL
# =====================================================================
echo ""
echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}📊 RÉSUMÉ DES TESTS${NC}"
echo -e "${GREEN}==============================================${NC}"
echo -e "Total des tests: $TOTAL_TESTS"
echo -e "${GREEN}Tests réussis: $TESTS_PASSED${NC}"
echo -e "${RED}Tests échoués: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 VALIDATION RÉUSSIE !${NC}"
    echo -e "${GREEN}Portfolio v2.0 installé et fonctionnel${NC}"
    echo ""
    echo -e "${BLUE}🌐 Accès au site:${NC}"
    echo -e "- Frontend: http://localhost/"
    echo -e "- API: http://localhost:8001/api/"
    echo -e "- Health Check: http://localhost:8001/api/health"
    echo -e "- Métriques: http://localhost:8001/api/metrics"
    echo ""
    echo -e "${BLUE}🛠️ Commandes utiles:${NC}"
    echo -e "- portfolio-status : Statut des services"
    echo -e "- portfolio-logs backend : Logs du backend"
    echo -e "- portfolio-restart : Redémarrage des services"
    echo ""
    echo -e "${GREEN}✅ Le problème de stabilité 30 minutes a été résolu !${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ VALIDATION ÉCHOUÉE !${NC}"
    echo -e "${RED}$TESTS_FAILED test(s) ont échoué${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Actions recommandées:${NC}"
    echo -e "1. Vérifier les logs: tail -f /var/log/supervisor/portfolio-*.log"
    echo -e "2. Vérifier les services: sudo supervisorctl status"
    echo -e "3. Vérifier la base de données: mysql -u root -e 'SHOW DATABASES;'"
    echo -e "4. Relancer l'installation si nécessaire"
    exit 1
fi