#!/bin/bash

# ==================================================================================
# SCRIPT DE RÉPARATION PORTFOLIO - ENVIRONNEMENT CONTENEURISÉ
# Version adaptée pour environnement sans systemd
# ==================================================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
PORTFOLIO_DIR="/app"
DB_NAME="portfolio_db"
DB_USER="portfolio_user"
DB_PASSWORD="portfolio_password"

# Fonctions de logging
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

log_info "🚀 RÉPARATION PORTFOLIO ENVIRONNEMENT CONTENEURISÉ - DÉBUT"

# ==================================================================================
# 1. ARRÊT DES SERVICES ACTUELS
# ==================================================================================

log_info "🛑 Arrêt des services actuels..."
supervisorctl stop backend frontend || true
log_success "Services arrêtés"

# ==================================================================================
# 2. INSTALLATION DE MARIADB
# ==================================================================================

log_info "🗄️ Installation de MariaDB..."
apt update
DEBIAN_FRONTEND=noninteractive apt install -y mariadb-server mariadb-client

# Démarrage manuel de MariaDB pour environnement conteneurisé
log_info "🔧 Démarrage de MariaDB..."
service mariadb start || mysqld_safe --user=mysql --datadir=/var/lib/mysql &
sleep 5

# Vérification que MariaDB est démarré
if pgrep -x "mysqld" > /dev/null; then
    log_success "MariaDB démarré"
else
    log_error "Échec du démarrage de MariaDB"
    exit 1
fi

# ==================================================================================
# 3. CONFIGURATION ET SÉCURISATION DE MARIADB
# ==================================================================================

log_info "🔒 Configuration sécurisée de MariaDB..."
mysql -u root << 'EOF'
-- Sécurisation de base
UPDATE mysql.user SET Password = PASSWORD('') WHERE User = 'root' AND Password = '';
DELETE FROM mysql.user WHERE User = '';
DELETE FROM mysql.user WHERE User = 'root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db = 'test' OR Db = 'test_%';
FLUSH PRIVILEGES;
EOF

log_success "MariaDB sécurisé"

# ==================================================================================
# 4. CRÉATION DE LA BASE DE DONNÉES
# ==================================================================================

log_info "🏗️ Création de la base de données..."
mysql -u root << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

# Test de connexion
if mysql -u $DB_USER -p$DB_PASSWORD -e "SELECT 1;" $DB_NAME > /dev/null 2>&1; then
    log_success "Base de données créée et accessible"
else
    log_error "Échec de la création de la base de données"
    exit 1
fi

# ==================================================================================
# 5. CONFIGURATION DU BACKEND
# ==================================================================================

log_info "🔧 Configuration du backend..."
cd "$PORTFOLIO_DIR/backend"

# Sauvegarde de l'ancien .env
cp .env .env.backup 2>/dev/null || true

# Mise à jour du fichier .env
cat > .env << EOF
DATABASE_URL="mysql+pymysql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME"
EOF

# Vérification de l'environnement virtuel
if [ ! -f "venv/bin/activate" ]; then
    log_info "Création de l'environnement virtuel..."
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
else
    log_info "Environnement virtuel existant trouvé"
fi

# Installation des dépendances MariaDB si nécessaire
source venv/bin/activate
pip install pymysql cryptography

# Initialisation de la base de données
log_info "🗄️ Initialisation de la base de données..."
python init_db.py

log_success "Backend configuré"

# ==================================================================================
# 6. CONFIGURATION DU FRONTEND
# ==================================================================================

log_info "⚛️ Configuration du frontend..."
cd "$PORTFOLIO_DIR/frontend"

# Sauvegarde de l'ancien .env
cp .env .env.backup 2>/dev/null || true

# Mise à jour du fichier .env pour utiliser l'API locale
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
EOF

log_success "Frontend configuré"

# ==================================================================================
# 7. REDÉMARRAGE DES SERVICES
# ==================================================================================

log_info "🚀 Redémarrage des services..."
supervisorctl restart backend frontend
sleep 5

log_success "Services redémarrés"

# ==================================================================================
# 8. TESTS DE VALIDATION
# ==================================================================================

log_info "🧪 Tests de validation..."

# Test MariaDB
if mysql -u $DB_USER -p$DB_PASSWORD -e "SELECT 1;" $DB_NAME > /dev/null 2>&1; then
    log_success "✅ MariaDB: OK"
else
    log_error "❌ MariaDB: Échec"
    exit 1
fi

# Test Backend
sleep 3
backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/health 2>/dev/null)
if [ "$backend_status" = "200" ]; then
    log_success "✅ Backend: OK (Status: $backend_status)"
else
    log_error "❌ Backend: Échec (Status: $backend_status)"
    log_info "Logs backend (dernières 10 lignes):"
    tail -n 10 /var/log/supervisor/backend.err.log 2>/dev/null || echo "Pas de logs d'erreur"
    exit 1
fi

# Test Frontend
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
if [ "$frontend_status" = "200" ]; then
    log_success "✅ Frontend: OK (Status: $frontend_status)"
else
    log_warning "⚠️ Frontend: Status $frontend_status"
fi

# Test API endpoints
api_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/portfolio/personal-info 2>/dev/null)
if [ "$api_status" = "200" ]; then
    log_success "✅ API Personal Info: OK (Status: $api_status)"
else
    log_warning "⚠️ API Personal Info: Status $api_status"
fi

# ==================================================================================
# 9. INFORMATIONS FINALES
# ==================================================================================

log_info "🎉 RÉPARATION TERMINÉE AVEC SUCCÈS!"
echo ""
echo "============================================="
echo "🚀 PORTFOLIO ENVIRONNEMENT CONTENEURISÉ - RÉPARÉ"
echo "============================================="
echo ""
echo "📍 Informations importantes:"
echo "  • Base de données: MariaDB ($DB_NAME)"
echo "  • Utilisateur DB: $DB_USER"
echo "  • Mot de passe DB: $DB_PASSWORD"
echo ""
echo "🌐 URLs:"
echo "  • Backend API: http://localhost:8001"
echo "  • Frontend: http://localhost:3000"
echo "  • Health Check: http://localhost:8001/api/health"
echo ""
echo "🔧 Commandes utiles:"
echo "  • supervisorctl status           - Vérifier les services"
echo "  • supervisorctl restart backend  - Redémarrer le backend"
echo "  • supervisorctl restart frontend - Redémarrer le frontend"
echo ""
echo "📝 Logs:"
echo "  • Backend: /var/log/supervisor/backend.*.log"
echo "  • Frontend: /var/log/supervisor/frontend.*.log"
echo ""
echo "🔄 Tests supplémentaires:"
echo "  • curl http://localhost:8001/api/health"
echo "  • curl http://localhost:8001/api/portfolio/personal-info"
echo ""
echo "✅ Portfolio prêt à l'emploi!"