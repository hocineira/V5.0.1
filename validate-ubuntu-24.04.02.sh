#!/bin/bash

# ==================================================================================
# SCRIPT DE VALIDATION POST-INSTALLATION
# Portfolio Hocine IRATNI - Ubuntu Server 24.04.02
# ==================================================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
PORTFOLIO_USER="portfolio"
PORTFOLIO_DIR="/home/$PORTFOLIO_USER/portfolio"
DB_NAME="portfolio_db"
DB_USER="portfolio_user"
DB_PASSWORD="portfolio_password"
DOMAIN="iratnihocine.fr"

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

echo "🧪 VALIDATION POST-INSTALLATION - Portfolio Hocine IRATNI"
echo "=========================================================="
echo ""

# ==================================================================================
# 1. TESTS DES PRÉREQUIS SYSTÈME
# ==================================================================================

echo "📋 Tests des prérequis système..."

# Test Ubuntu version
ubuntu_version=$(lsb_release -rs 2>/dev/null || echo "unknown")
if [[ "$ubuntu_version" == "24.04" ]]; then
    test_result 0 "Ubuntu Server 24.04.02 détecté"
else
    test_result 1 "Version Ubuntu: $ubuntu_version (attendu: 24.04)"
fi

# Test des paquets installés
dpkg -l | grep -q mariadb-server
test_result $? "MariaDB Server installé"

dpkg -l | grep -q nginx
test_result $? "Nginx installé"

dpkg -l | grep -q supervisor
test_result $? "Supervisor installé"

which node > /dev/null 2>&1
test_result $? "Node.js installé"

which yarn > /dev/null 2>&1
test_result $? "Yarn installé"

which python3 > /dev/null 2>&1
test_result $? "Python3 installé"

# ==================================================================================
# 2. TESTS DE L'UTILISATEUR ET DES RÉPERTOIRES
# ==================================================================================

echo ""
echo "👤 Tests de l'utilisateur et des répertoires..."

id "$PORTFOLIO_USER" > /dev/null 2>&1
test_result $? "Utilisateur $PORTFOLIO_USER existe"

[ -d "$PORTFOLIO_DIR" ]
test_result $? "Répertoire portfolio existe"

[ -f "$PORTFOLIO_DIR/backend/requirements.txt" ]
test_result $? "Backend configuré"

[ -f "$PORTFOLIO_DIR/frontend/package.json" ]
test_result $? "Frontend configuré"

# ==================================================================================
# 3. TESTS DE LA BASE DE DONNÉES
# ==================================================================================

echo ""
echo "🗄️ Tests de la base de données MariaDB..."

systemctl is-active mariadb > /dev/null 2>&1
test_result $? "Service MariaDB actif"

mysql -u $DB_USER -p$DB_PASSWORD -e "SELECT 1" $DB_NAME > /dev/null 2>&1
test_result $? "Connexion à la base de données"

# Test des tables
table_count=$(mysql -u $DB_USER -p$DB_PASSWORD -D $DB_NAME -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ $table_count -gt 1 ]; then
    test_result 0 "Tables créées ($((table_count-1)) tables)"
else
    test_result 1 "Tables non créées"
fi

# Test des données de Hocine
personal_data=$(mysql -u $DB_USER -p$DB_PASSWORD -D $DB_NAME -e "SELECT COUNT(*) FROM personal_info WHERE name='Hocine IRATNI';" 2>/dev/null | tail -1)
if [ "$personal_data" = "1" ]; then
    test_result 0 "Données personnelles de Hocine présentes"
else
    test_result 1 "Données personnelles de Hocine manquantes"
fi

# Test des formations
education_count=$(mysql -u $DB_USER -p$DB_PASSWORD -D $DB_NAME -e "SELECT COUNT(*) FROM education;" 2>/dev/null | tail -1)
if [ "$education_count" = "3" ]; then
    test_result 0 "Formations présentes (3 formations)"
else
    test_result 1 "Formations manquantes (trouvé: $education_count, attendu: 3)"
fi

# Test des compétences
skills_count=$(mysql -u $DB_USER -p$DB_PASSWORD -D $DB_NAME -e "SELECT COUNT(*) FROM skill_categories;" 2>/dev/null | tail -1)
if [ "$skills_count" = "4" ]; then
    test_result 0 "Compétences présentes (4 catégories)"
else
    test_result 1 "Compétences manquantes (trouvé: $skills_count, attendu: 4)"
fi

# ==================================================================================
# 4. TESTS DES SERVICES
# ==================================================================================

echo ""
echo "🔧 Tests des services..."

systemctl is-active nginx > /dev/null 2>&1
test_result $? "Service Nginx actif"

systemctl is-active supervisor > /dev/null 2>&1
test_result $? "Service Supervisor actif"

supervisorctl status portfolio-backend | grep -q RUNNING
test_result $? "Portfolio Backend actif"

supervisorctl status portfolio-frontend | grep -q RUNNING
test_result $? "Portfolio Frontend actif"

# ==================================================================================
# 5. TESTS DE CONNECTIVITÉ
# ==================================================================================

echo ""
echo "🌐 Tests de connectivité..."

# Test backend local
curl -s http://localhost:8001/api/health > /dev/null 2>&1
test_result $? "Backend accessible (localhost:8001)"

# Test frontend local
curl -s http://localhost:3000 > /dev/null 2>&1
test_result $? "Frontend accessible (localhost:3000)"

# Test nginx local
curl -s http://localhost > /dev/null 2>&1
test_result $? "Nginx accessible (localhost:80)"

# Test API endpoints
curl -s http://localhost:8001/api/portfolio/personal-info > /dev/null 2>&1
test_result $? "API Personal Info accessible"

curl -s http://localhost:8001/api/portfolio/education > /dev/null 2>&1
test_result $? "API Education accessible"

curl -s http://localhost:8001/api/portfolio/skills > /dev/null 2>&1
test_result $? "API Skills accessible"

# ==================================================================================
# 6. TESTS SSL ET DOMAINE PUBLIC
# ==================================================================================

echo ""
echo "🔒 Tests SSL et domaine public..."

# Test certificat SSL
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    test_result 0 "Certificat SSL présent"
else
    test_result 1 "Certificat SSL manquant"
fi

# Test du domaine public
if curl -s -k https://$DOMAIN > /dev/null 2>&1; then
    test_result 0 "Site public accessible (https://$DOMAIN)"
else
    test_result 1 "Site public non accessible (vérifiez DNS)"
fi

# ==================================================================================
# 7. TESTS DE CONFIGURATION
# ==================================================================================

echo ""
echo "⚙️ Tests de configuration..."

# Test configuration Nginx
nginx -t > /dev/null 2>&1
test_result $? "Configuration Nginx valide"

# Test fichier .env backend
[ -f "$PORTFOLIO_DIR/backend/.env" ]
test_result $? "Fichier .env backend présent"

# Test fichier .env frontend
[ -f "$PORTFOLIO_DIR/frontend/.env" ]
test_result $? "Fichier .env frontend présent"

# Test script de gestion
[ -f "/usr/local/bin/portfolio-manage" ]
test_result $? "Script de gestion disponible"

# ==================================================================================
# 8. TESTS DE SÉCURITÉ
# ==================================================================================

echo ""
echo "🛡️ Tests de sécurité..."

# Test firewall
ufw status | grep -q "Status: active"
test_result $? "Firewall activé"

# Test permissions
stat -c "%U" "$PORTFOLIO_DIR" | grep -q "$PORTFOLIO_USER"
test_result $? "Permissions portfolio correctes"

# Test SSL redirection
if curl -s -I http://$DOMAIN 2>/dev/null | grep -q "301"; then
    test_result 0 "Redirection HTTPS configurée"
else
    test_result 1 "Redirection HTTPS manquante"
fi

# ==================================================================================
# 9. TESTS DE PERFORMANCE
# ==================================================================================

echo ""
echo "⚡ Tests de performance..."

# Test temps de réponse API
api_time=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:8001/api/health)
if (( $(echo "$api_time < 2.0" | bc -l) )); then
    test_result 0 "API répond rapidement (${api_time}s)"
else
    test_result 1 "API répond lentement (${api_time}s)"
fi

# Test utilisation disque
disk_usage=$(df $PORTFOLIO_DIR | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $disk_usage -lt 80 ]; then
    test_result 0 "Utilisation disque correcte ($disk_usage%)"
else
    test_result 1 "Utilisation disque élevée ($disk_usage%)"
fi

# ==================================================================================
# 10. TESTS DES DONNÉES SPÉCIFIQUES À HOCINE
# ==================================================================================

echo ""
echo "👨‍💼 Tests des données spécifiques à Hocine..."

# Test BTS SIO
bts_sio=$(mysql -u $DB_USER -p$DB_PASSWORD -D $DB_NAME -e "SELECT COUNT(*) FROM education WHERE degree LIKE '%BTS SIO%';" 2>/dev/null | tail -1)
if [ "$bts_sio" = "1" ]; then
    test_result 0 "Formation BTS SIO présente"
else
    test_result 1 "Formation BTS SIO manquante"
fi

# Test compétences réseaux
network_skills=$(mysql -u $DB_USER -p$DB_PASSWORD -D $DB_NAME -e "SELECT COUNT(*) FROM skill_categories WHERE category='Réseaux';" 2>/dev/null | tail -1)
if [ "$network_skills" = "1" ]; then
    test_result 0 "Compétences réseaux présentes"
else
    test_result 1 "Compétences réseaux manquantes"
fi

# Test certification CISCO
cisco_cert=$(mysql -u $DB_USER -p$DB_PASSWORD -D $DB_NAME -e "SELECT COUNT(*) FROM certifications WHERE name LIKE '%CISCO%';" 2>/dev/null | tail -1)
if [ "$cisco_cert" = "1" ]; then
    test_result 0 "Certification CISCO présente"
else
    test_result 1 "Certification CISCO manquante"
fi

# Test stage sauvegarde13
stage_sauvegarde=$(mysql -u $DB_USER -p$DB_PASSWORD -D $DB_NAME -e "SELECT COUNT(*) FROM experience WHERE company LIKE '%sauvegarde13%';" 2>/dev/null | tail -1)
if [ "$stage_sauvegarde" = "1" ]; then
    test_result 0 "Stage sauvegarde13 présent"
else
    test_result 1 "Stage sauvegarde13 manquant"
fi

# ==================================================================================
# RÉSUMÉ DES TESTS
# ==================================================================================

echo ""
echo "=========================================================="
echo "📊 RÉSUMÉ DES TESTS"
echo "=========================================================="
echo ""

if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS PASSÉS !${NC}"
    echo -e "${GREEN}✅ $TESTS_PASSED/$TESTS_TOTAL tests réussis${NC}"
    echo ""
    echo "🚀 Votre portfolio Hocine IRATNI est correctement installé et configuré"
    echo "🌐 Accessible à l'adresse: https://$DOMAIN"
    echo ""
    echo "📋 Commandes utiles:"
    echo "  • portfolio-manage status  - Vérifier les services"
    echo "  • portfolio-manage logs    - Voir les logs"
    echo "  • portfolio-manage restart - Redémarrer"
    echo ""
    exit 0
else
    echo -e "${RED}❌ TESTS ÉCHOUÉS !${NC}"
    echo -e "${RED}✅ $TESTS_PASSED/$TESTS_TOTAL tests réussis${NC}"
    echo ""
    echo "🔧 Vérifiez les erreurs ci-dessus et corrigez-les"
    echo "📋 Logs utiles:"
    echo "  • Backend: /var/log/supervisor/portfolio-backend.log"
    echo "  • Frontend: /var/log/supervisor/portfolio-frontend.log"
    echo "  • Nginx: /var/log/nginx/portfolio_error.log"
    echo ""
    exit 1
fi