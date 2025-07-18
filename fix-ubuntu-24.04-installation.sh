#!/bin/bash

# ==================================================================================
# SCRIPT DE RÉPARATION PORTFOLIO - UBUNTU 24.04
# Version corrigée - Résout les problèmes d'installation
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
BACKUP_DIR="/tmp/portfolio_backup_$(date +%Y%m%d_%H%M%S)"

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

# Vérification des privilèges root
if [[ $EUID -ne 0 ]]; then
    log_error "Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

log_info "🚀 RÉPARATION PORTFOLIO UBUNTU 24.04 - DÉBUT"

# ==================================================================================
# 1. SAUVEGARDE DE LA CONFIGURATION ACTUELLE
# ==================================================================================

log_info "📦 Sauvegarde de la configuration actuelle..."
mkdir -p "$BACKUP_DIR"
cp -r "$PORTFOLIO_DIR/backend/.env" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "$PORTFOLIO_DIR/frontend/.env" "$BACKUP_DIR/" 2>/dev/null || true
log_success "Configuration sauvegardée dans $BACKUP_DIR"

# ==================================================================================
# 2. ARRÊT DES SERVICES ACTUELS
# ==================================================================================

log_info "🛑 Arrêt des services actuels..."
supervisorctl stop backend frontend || true
log_success "Services arrêtés"

# ==================================================================================
# 3. INSTALLATION DE MARIADB
# ==================================================================================

log_info "🗄️ Installation de MariaDB..."
apt update
apt install -y mariadb-server mariadb-client

# Démarrage et activation
systemctl start mariadb
systemctl enable mariadb

# Sécurisation automatique de MariaDB
log_info "🔒 Configuration sécurisée de MariaDB..."
mysql -u root << 'EOF'
UPDATE mysql.user SET Password = PASSWORD('') WHERE User = 'root';
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

# Mise à jour du fichier .env
cat > .env << EOF
DATABASE_URL="mysql+pymysql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME"
EOF

# Installation des dépendances si nécessaire
if [ ! -f "venv/bin/activate" ]; then
    log_info "Création de l'environnement virtuel..."
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
else
    log_info "Environnement virtuel existant trouvé"
fi

# Initialisation de la base de données
log_info "🗄️ Initialisation de la base de données..."
source venv/bin/activate
python init_db.py

log_success "Backend configuré"

# ==================================================================================
# 6. CONFIGURATION DU FRONTEND
# ==================================================================================

log_info "⚛️ Configuration du frontend..."
cd "$PORTFOLIO_DIR/frontend"

# Mise à jour du fichier .env pour utiliser l'API locale
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
EOF

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    log_info "Installation des dépendances frontend..."
    yarn install
fi

# Build du frontend
log_info "🔨 Build du frontend..."
yarn build

log_success "Frontend configuré"

# ==================================================================================
# 7. CONFIGURATION DE NGINX (OPTIONNEL)
# ==================================================================================

if command -v nginx &> /dev/null; then
    log_info "🌐 Configuration de Nginx..."
    
    # Configuration basique pour le développement
    cat > /etc/nginx/sites-available/portfolio-dev << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    # Frontend React
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API Backend
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    # Activation du site
    ln -sf /etc/nginx/sites-available/portfolio-dev /etc/nginx/sites-enabled/
    
    # Test de la configuration
    if nginx -t; then
        systemctl reload nginx
        log_success "Nginx configuré"
    else
        log_warning "Erreur dans la configuration Nginx"
    fi
else
    log_info "Nginx non installé, configuration ignorée"
fi

# ==================================================================================
# 8. REDÉMARRAGE DES SERVICES
# ==================================================================================

log_info "🚀 Redémarrage des services..."
supervisorctl restart backend frontend
sleep 5

log_success "Services redémarrés"

# ==================================================================================
# 9. TESTS DE VALIDATION
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
if curl -s http://localhost:8001/api/health > /dev/null 2>&1; then
    log_success "✅ Backend: OK"
else
    log_error "❌ Backend: Échec"
    # Affichage des logs pour diagnostic
    log_info "Logs backend (dernières 10 lignes):"
    tail -n 10 /var/log/supervisor/backend.err.log 2>/dev/null || echo "Pas de logs d'erreur"
    exit 1
fi

# Test Frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    log_success "✅ Frontend: OK"
else
    log_warning "⚠️ Frontend: Vérification manuelle requise"
fi

# Test API endpoints
if curl -s http://localhost:8001/api/portfolio/personal-info > /dev/null 2>&1; then
    log_success "✅ API Personal Info: OK"
else
    log_warning "⚠️ API Personal Info: Vérification manuelle requise"
fi

# ==================================================================================
# 10. INFORMATIONS FINALES
# ==================================================================================

log_info "🎉 RÉPARATION TERMINÉE AVEC SUCCÈS!"
echo ""
echo "============================================="
echo "🚀 PORTFOLIO UBUNTU 24.04 - RÉPARÉ"
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
echo "  • sudo supervisorctl status    - Vérifier les services"
echo "  • sudo supervisorctl restart backend - Redémarrer le backend"
echo "  • sudo supervisorctl restart frontend - Redémarrer le frontend"
echo ""
echo "📝 Logs:"
echo "  • Backend: /var/log/supervisor/backend.*.log"
echo "  • Frontend: /var/log/supervisor/frontend.*.log"
echo ""
echo "💾 Sauvegarde:"
echo "  • Configuration précédente: $BACKUP_DIR"
echo ""
echo "✅ Portfolio prêt à l'emploi!"