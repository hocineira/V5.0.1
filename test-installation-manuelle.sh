#!/bin/bash

# ==================================================================================
# SCRIPT DE TEST POUR L'INSTALLATION MANUELLE UBUNTU 24.04
# Test des étapes d'installation du portfolio Hocine IRATNI
# ==================================================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction pour vérifier si une commande s'est bien déroulée
check_command() {
    if [ $? -eq 0 ]; then
        log_success "$1"
        return 0
    else
        log_error "$1"
        return 1
    fi
}

# Variables de test
TEST_COUNT=0
PASS_COUNT=0
FAIL_COUNT=0

# Fonction pour exécuter un test
run_test() {
    TEST_COUNT=$((TEST_COUNT + 1))
    log_info "Test $TEST_COUNT: $1"
    
    if eval "$2"; then
        PASS_COUNT=$((PASS_COUNT + 1))
        log_success "✅ $1"
        return 0
    else
        FAIL_COUNT=$((FAIL_COUNT + 1))
        log_error "❌ $1"
        return 1
    fi
}

log_info "🧪 DÉBUT DES TESTS DE VALIDATION - INSTALLATION MANUELLE UBUNTU 24.04"
log_info "Test de la procédure d'installation du portfolio Hocine IRATNI"

# ==================================================================================
# TESTS DES PRÉREQUIS SYSTÈME
# ==================================================================================

log_info "📋 Tests des prérequis système..."

run_test "Vérification Ubuntu/Debian" "grep -E 'Ubuntu|Debian' /etc/os-release > /dev/null 2>&1"
run_test "Vérification présence curl" "command -v curl > /dev/null 2>&1"
run_test "Vérification présence wget" "command -v wget > /dev/null 2>&1"
run_test "Vérification présence git" "command -v git > /dev/null 2>&1"
run_test "Vérification présence supervisorctl" "command -v supervisorctl > /dev/null 2>&1"

# ==================================================================================
# TESTS DE MARIADB
# ==================================================================================

log_info "🗄️ Tests de MariaDB..."

run_test "Vérification installation MariaDB" "command -v mysql > /dev/null 2>&1"
run_test "Vérification service MariaDB" "systemctl is-active mariadb > /dev/null 2>&1 || pgrep mysqld > /dev/null 2>&1"
run_test "Test connexion base portfolio_db" "mysql -u portfolio_user -pportfolio_password -e 'SELECT 1;' portfolio_db > /dev/null 2>&1"
run_test "Vérification tables portfolio" "mysql -u portfolio_user -pportfolio_password -e 'SHOW TABLES;' portfolio_db | grep -E 'personal_info|education|skills' > /dev/null 2>&1"

# ==================================================================================
# TESTS DE NODE.JS ET YARN
# ==================================================================================

log_info "📦 Tests de Node.js et Yarn..."

run_test "Vérification installation Node.js" "command -v node > /dev/null 2>&1"
run_test "Vérification version Node.js (>= 18)" "node --version | grep -E 'v(18|19|20|21|22)' > /dev/null 2>&1"
run_test "Vérification installation Yarn" "command -v yarn > /dev/null 2>&1"

# ==================================================================================
# TESTS DE PYTHON
# ==================================================================================

log_info "🐍 Tests de Python..."

run_test "Vérification installation Python 3" "command -v python3 > /dev/null 2>&1"
run_test "Vérification version Python (>= 3.8)" "python3 --version | grep -E 'Python 3\.(8|9|10|11|12)' > /dev/null 2>&1"
run_test "Vérification installation pip" "command -v pip3 > /dev/null 2>&1"

# ==================================================================================
# TESTS DU PORTFOLIO
# ==================================================================================

log_info "📁 Tests du portfolio..."

run_test "Vérification répertoire backend" "[ -d '/app/backend' ]"
run_test "Vérification répertoire frontend" "[ -d '/app/frontend' ]"
run_test "Vérification fichier requirements.txt" "[ -f '/app/backend/requirements.txt' ]"
run_test "Vérification fichier package.json" "[ -f '/app/frontend/package.json' ]"

# ==================================================================================
# TESTS DU BACKEND
# ==================================================================================

log_info "🔧 Tests du backend..."

run_test "Vérification environnement virtuel backend" "[ -d '/app/backend/venv' ] || [ -f '/app/backend/venv/bin/activate' ]"
run_test "Vérification configuration backend (.env)" "[ -f '/app/backend/.env' ]"
run_test "Vérification service backend" "supervisorctl status backend | grep RUNNING > /dev/null 2>&1"
run_test "Test API health check" "curl -s http://localhost:8001/api/health > /dev/null 2>&1"
run_test "Test API personal info" "curl -s http://localhost:8001/api/portfolio/personal-info > /dev/null 2>&1"

# ==================================================================================
# TESTS DU FRONTEND
# ==================================================================================

log_info "⚛️ Tests du frontend..."

run_test "Vérification dépendances frontend" "[ -d '/app/frontend/node_modules' ]"
run_test "Vérification build frontend" "[ -d '/app/frontend/build' ] || [ -f '/app/frontend/build/index.html' ]"
run_test "Vérification service frontend" "supervisorctl status frontend | grep RUNNING > /dev/null 2>&1"
run_test "Test accessibilité frontend" "curl -s http://localhost:3000 > /dev/null 2>&1"

# ==================================================================================
# TESTS DE NGINX
# ==================================================================================

log_info "🌐 Tests de Nginx..."

run_test "Vérification installation Nginx" "command -v nginx > /dev/null 2>&1"
run_test "Vérification service Nginx" "systemctl is-active nginx > /dev/null 2>&1 || pgrep nginx > /dev/null 2>&1"
run_test "Test configuration Nginx" "nginx -t > /dev/null 2>&1"

# ==================================================================================
# TESTS DE SÉCURITÉ
# ==================================================================================

log_info "🔒 Tests de sécurité..."

run_test "Vérification firewall UFW" "command -v ufw > /dev/null 2>&1"
run_test "Vérification statut firewall" "ufw status | grep -E 'Status: active|inactive' > /dev/null 2>&1"

# ==================================================================================
# TESTS DE PERFORMANCE
# ==================================================================================

log_info "⚡ Tests de performance..."

run_test "Test temps de réponse backend" "timeout 5 curl -s http://localhost:8001/api/health > /dev/null 2>&1"
run_test "Test temps de réponse frontend" "timeout 5 curl -s http://localhost:3000 > /dev/null 2>&1"

# ==================================================================================
# TESTS DE DONNÉES
# ==================================================================================

log_info "📊 Tests de données..."

run_test "Test données Hocine IRATNI" "curl -s http://localhost:8001/api/portfolio/personal-info | grep -i 'hocine' > /dev/null 2>&1"
run_test "Test données compétences" "curl -s http://localhost:8001/api/portfolio/skills | grep -E 'Réseaux|Systèmes' > /dev/null 2>&1"
run_test "Test données projets" "curl -s http://localhost:8001/api/portfolio/projects | grep -E 'BTS|SIO' > /dev/null 2>&1"

# ==================================================================================
# RÉSUMÉ DES TESTS
# ==================================================================================

log_info "📊 RÉSUMÉ DES TESTS"
echo ""
echo "=================================================="
echo "🎯 RÉSULTATS DES TESTS D'INSTALLATION"
echo "=================================================="
echo ""
echo "📊 Statistiques :"
echo "  • Tests exécutés : $TEST_COUNT"
echo "  • Tests réussis  : $PASS_COUNT"
echo "  • Tests échoués  : $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    log_success "🎉 TOUS LES TESTS PASSÉS ! Installation validée avec succès."
    echo ""
    echo "✅ Votre portfolio Hocine IRATNI est correctement installé et fonctionnel."
    echo "🌐 Accès :"
    echo "  • Backend API : http://localhost:8001/api/"
    echo "  • Frontend    : http://localhost:3000/"
    echo "  • Health Check: http://localhost:8001/api/health"
    echo ""
    exit 0
else
    log_error "❌ $FAIL_COUNT test(s) échoué(s). Vérifiez l'installation."
    echo ""
    echo "🔧 Actions recommandées :"
    echo "  • Vérifiez les logs : tail -f /var/log/supervisor/portfolio-*.log"
    echo "  • Redémarrez les services : sudo supervisorctl restart all"
    echo "  • Consultez le guide : INSTALLATION-MANUELLE-UBUNTU-24.04.md"
    echo ""
    exit 1
fi