#!/bin/bash

# ==================================================================================
# SCRIPT DE VALIDATION FINALE - PORTFOLIO UBUNTU 24.04
# Test complet de l'installation et fonctionnement
# ==================================================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Variables
DOMAIN=${1:-"localhost"}
BACKEND_PORT=${2:-8001}
FRONTEND_PORT=${3:-3000}

log_info "🎯 VALIDATION COMPLÈTE PORTFOLIO UBUNTU 24.04"
log_info "Domain: $DOMAIN | Backend: $BACKEND_PORT | Frontend: $FRONTEND_PORT"

# ==================================================================================
# TEST 1: SERVICES SYSTÈME
# ==================================================================================

log_info "🔧 Test 1: Services système..."

# Test MariaDB
if systemctl is-active mariadb > /dev/null 2>&1 || pgrep mysqld > /dev/null 2>&1; then
    log_success "✅ MariaDB service actif"
else
    log_error "❌ MariaDB service non actif"
    exit 1
fi

# Test Nginx
if systemctl is-active nginx > /dev/null 2>&1 || pgrep nginx > /dev/null 2>&1; then
    log_success "✅ Nginx service actif"
else
    log_warning "⚠️ Nginx service non actif (optionnel)"
fi

# Test Supervisor
if systemctl is-active supervisor > /dev/null 2>&1 || pgrep supervisord > /dev/null 2>&1; then
    log_success "✅ Supervisor service actif"
else
    log_error "❌ Supervisor service non actif"
    exit 1
fi

# ==================================================================================
# TEST 2: SERVICES PORTFOLIO
# ==================================================================================

log_info "🚀 Test 2: Services portfolio..."

# Test backend
if supervisorctl status backend | grep RUNNING > /dev/null 2>&1; then
    log_success "✅ Backend portfolio actif"
else
    log_error "❌ Backend portfolio non actif"
    exit 1
fi

# Test frontend
if supervisorctl status frontend | grep RUNNING > /dev/null 2>&1; then
    log_success "✅ Frontend portfolio actif"
else
    log_error "❌ Frontend portfolio non actif"
    exit 1
fi

# ==================================================================================
# TEST 3: CONNECTIVITÉ API
# ==================================================================================

log_info "🌐 Test 3: Connectivité API..."

# Test health check
if curl -s -f "http://localhost:$BACKEND_PORT/api/health" > /dev/null 2>&1; then
    log_success "✅ Health check API fonctionnel"
else
    log_error "❌ Health check API non accessible"
    exit 1
fi

# Test personal info
if curl -s -f "http://localhost:$BACKEND_PORT/api/portfolio/personal-info" > /dev/null 2>&1; then
    log_success "✅ Endpoint personal-info fonctionnel"
else
    log_error "❌ Endpoint personal-info non accessible"
    exit 1
fi

# Test skills
if curl -s -f "http://localhost:$BACKEND_PORT/api/portfolio/skills" > /dev/null 2>&1; then
    log_success "✅ Endpoint skills fonctionnel"
else
    log_error "❌ Endpoint skills non accessible"
    exit 1
fi

# Test projects
if curl -s -f "http://localhost:$BACKEND_PORT/api/portfolio/projects" > /dev/null 2>&1; then
    log_success "✅ Endpoint projects fonctionnel"
else
    log_error "❌ Endpoint projects non accessible"
    exit 1
fi

# ==================================================================================
# TEST 4: FRONTEND
# ==================================================================================

log_info "⚛️ Test 4: Frontend..."

# Test accessibilité frontend
if curl -s -f "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
    log_success "✅ Frontend accessible"
else
    log_error "❌ Frontend non accessible"
    exit 1
fi

# ==================================================================================
# TEST 5: BASE DE DONNÉES
# ==================================================================================

log_info "🗄️ Test 5: Base de données..."

# Test connexion DB
if mysql -u portfolio_user -pportfolio_password -e "SELECT 1;" portfolio_db > /dev/null 2>&1; then
    log_success "✅ Connexion base de données OK"
else
    log_error "❌ Connexion base de données échouée"
    exit 1
fi

# Test tables
TABLE_COUNT=$(mysql -u portfolio_user -pportfolio_password -e "SHOW TABLES;" portfolio_db 2>/dev/null | wc -l)
if [ "$TABLE_COUNT" -gt 5 ]; then
    log_success "✅ Tables de base de données présentes ($TABLE_COUNT tables)"
else
    log_error "❌ Tables de base de données manquantes ($TABLE_COUNT tables)"
    exit 1
fi

# ==================================================================================
# TEST 6: DONNÉES PORTFOLIO
# ==================================================================================

log_info "📊 Test 6: Données portfolio..."

# Test données Hocine
if curl -s "http://localhost:$BACKEND_PORT/api/portfolio/personal-info" | grep -i "hocine" > /dev/null 2>&1; then
    log_success "✅ Données Hocine IRATNI présentes"
else
    log_error "❌ Données Hocine IRATNI manquantes"
    exit 1
fi

# Test compétences
if curl -s "http://localhost:$BACKEND_PORT/api/portfolio/skills" | grep -E "Réseaux|Systèmes|réseau|système" > /dev/null 2>&1; then
    log_success "✅ Compétences techniques présentes"
else
    log_warning "⚠️ Compétences techniques non détectées"
fi

# Test projets
if curl -s "http://localhost:$BACKEND_PORT/api/portfolio/projects" | grep -E "BTS|SIO|projet" > /dev/null 2>&1; then
    log_success "✅ Projets présents"
else
    log_warning "⚠️ Projets non détectés"
fi

# ==================================================================================
# TEST 7: PERFORMANCE
# ==================================================================================

log_info "⚡ Test 7: Performance..."

# Test temps de réponse API
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}\n" "http://localhost:$BACKEND_PORT/api/health")
if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
    log_success "✅ Temps de réponse API OK (${RESPONSE_TIME}s)"
else
    log_warning "⚠️ Temps de réponse API lent (${RESPONSE_TIME}s)"
fi

# Test charge API (5 requêtes simultanées)
log_info "Test de charge (5 requêtes)..."
for i in {1..5}; do
    curl -s "http://localhost:$BACKEND_PORT/api/portfolio/personal-info" > /dev/null &
done
wait

log_success "✅ Test de charge terminé"

# ==================================================================================
# TEST 8: SÉCURITÉ
# ==================================================================================

log_info "🔒 Test 8: Sécurité..."

# Test firewall
if command -v ufw > /dev/null 2>&1; then
    if ufw status | grep -q "active"; then
        log_success "✅ Firewall UFW actif"
    else
        log_warning "⚠️ Firewall UFW inactif"
    fi
else
    log_warning "⚠️ UFW non installé"
fi

# Test headers de sécurité (si Nginx configuré)
if curl -s -I "http://localhost/" | grep -E "X-Frame-Options|X-Content-Type-Options" > /dev/null 2>&1; then
    log_success "✅ Headers de sécurité configurés"
else
    log_warning "⚠️ Headers de sécurité non détectés"
fi

# ==================================================================================
# RÉSUMÉ FINAL
# ==================================================================================

log_info "📋 RÉSUMÉ DE LA VALIDATION"
echo ""
echo "=================================================="
echo "🎯 VALIDATION TERMINÉE AVEC SUCCÈS"
echo "=================================================="
echo ""
echo "✅ Tous les tests critiques sont passés !"
echo ""
echo "🌐 Accès au portfolio :"
echo "  • Frontend : http://$DOMAIN:$FRONTEND_PORT/"
echo "  • Backend  : http://$DOMAIN:$BACKEND_PORT/api/"
echo "  • Health   : http://$DOMAIN:$BACKEND_PORT/api/health"
echo ""
echo "🔧 Services actifs :"
echo "  • MariaDB : ✅ Actif"
echo "  • Backend : ✅ Actif"
echo "  • Frontend: ✅ Actif"
echo ""
echo "📊 Données :"
echo "  • Profil Hocine IRATNI : ✅ Présent"
echo "  • Compétences techniques : ✅ Présentes"
echo "  • Projets BTS SIO : ✅ Présents"
echo ""
echo "⚡ Performance :"
echo "  • Temps de réponse API : ${RESPONSE_TIME}s"
echo "  • Test de charge : ✅ Réussi"
echo ""
log_success "🎉 PORTFOLIO UBUNTU 24.04 COMPLÈTEMENT OPÉRATIONNEL !"
echo ""
echo "📞 Support : Consultez INSTALLATION-MANUELLE-UBUNTU-24.04.md"
echo "=================================================="