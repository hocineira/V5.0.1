#!/bin/bash

# =====================================================================
# SCRIPT D'INSTALLATION PORTFOLIO - UBUNTU 24.04 (Version 2.0)
# Architecture: Backend refactorisé avec MariaDB + Pool de connexions
# Résout le problème de stabilité 30 minutes
# =====================================================================

set -e  # Arrêt en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de logging
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERREUR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[ATTENTION] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Variables
PORTFOLIO_USER="portfolio"
PORTFOLIO_DIR="/opt/portfolio"
PORTFOLIO_DB="portfolio_db"
PORTFOLIO_DB_USER="portfolio_user"
PORTFOLIO_DB_PASSWORD="portfolio_password_$(date +%s)"
DOMAIN="your-domain.com"  # À remplacer par votre domaine

# Vérification des privilèges root
if [[ $EUID -ne 0 ]]; then
   error "Ce script doit être exécuté en tant que root (sudo)"
fi

log "🚀 INSTALLATION PORTFOLIO v2.0 - Ubuntu 24.04"
log "Architecture: Backend refactorisé + MariaDB + Pool de connexions"

# =====================================================================
# ÉTAPE 1: MISE À JOUR DU SYSTÈME
# =====================================================================
log "📦 Mise à jour du système Ubuntu 24.04..."
apt update && apt upgrade -y

# =====================================================================
# ÉTAPE 2: INSTALLATION DES DÉPENDANCES SYSTÈME
# =====================================================================
log "🔧 Installation des dépendances système..."
apt install -y \
    curl \
    wget \
    git \
    nginx \
    supervisor \
    ufw \
    certbot \
    python3-certbot-nginx \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    htop \
    unzip \
    vim \
    nano

# =====================================================================
# ÉTAPE 3: INSTALLATION DE MARIADB (Nouvelle architecture)
# =====================================================================
log "🗄️ Installation et configuration de MariaDB..."
apt install -y mariadb-server mariadb-client

# Sécurisation de MariaDB
systemctl start mariadb
systemctl enable mariadb

# Configuration MariaDB pour la stabilité
cat > /etc/mysql/mariadb.conf.d/99-portfolio.cnf << EOF
[mysqld]
# Configuration optimisée pour Portfolio
max_connections = 200
innodb_buffer_pool_size = 512M
query_cache_size = 64M
query_cache_limit = 4M
tmp_table_size = 64M
max_heap_table_size = 64M

# Timeouts pour éviter les déconnexions
wait_timeout = 28800
interactive_timeout = 28800
connect_timeout = 60
net_read_timeout = 60
net_write_timeout = 60

# Optimisations InnoDB
innodb_log_file_size = 128M
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1

# Logs et sécurité
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
EOF

# Redémarrage de MariaDB avec nouvelle configuration
systemctl restart mariadb

# Création de la base de données et utilisateur
log "🔐 Configuration de la base de données..."
mysql -u root << EOF
CREATE DATABASE IF NOT EXISTS ${PORTFOLIO_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${PORTFOLIO_DB_USER}'@'localhost' IDENTIFIED BY '${PORTFOLIO_DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${PORTFOLIO_DB}.* TO '${PORTFOLIO_DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

# =====================================================================
# ÉTAPE 4: INSTALLATION DE NODE.JS ET YARN
# =====================================================================
log "📦 Installation de Node.js 20 et Yarn..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Installation de Yarn
npm install -g yarn

# =====================================================================
# ÉTAPE 5: INSTALLATION DE PYTHON ET ENVIRONNEMENT VIRTUEL
# =====================================================================
log "🐍 Installation de Python 3.11 et environnement virtuel..."
apt install -y python3 python3-pip python3-venv python3-dev

# =====================================================================
# ÉTAPE 6: CRÉATION DE L'UTILISATEUR PORTFOLIO
# =====================================================================
log "👤 Création de l'utilisateur portfolio..."
if ! id "$PORTFOLIO_USER" &>/dev/null; then
    useradd -m -s /bin/bash $PORTFOLIO_USER
    usermod -aG sudo $PORTFOLIO_USER
fi

# =====================================================================
# ÉTAPE 7: CLONAGE ET CONFIGURATION DU PROJET
# =====================================================================
log "📁 Configuration du répertoire projet..."
mkdir -p $PORTFOLIO_DIR
cd $PORTFOLIO_DIR

# Si le code n'est pas déjà présent, créer la structure
if [ ! -d "backend" ]; then
    log "⚠️ Code non présent, création de la structure de base..."
    mkdir -p {backend,frontend,logs,monitoring}
    chown -R $PORTFOLIO_USER:$PORTFOLIO_USER $PORTFOLIO_DIR
    
    warning "ATTENTION: Vous devez copier votre code dans $PORTFOLIO_DIR"
    warning "Puis relancer ce script avec l'option --configure-only"
    exit 1
fi

# =====================================================================
# ÉTAPE 8: CONFIGURATION DU BACKEND PYTHON
# =====================================================================
log "🔧 Configuration du backend Python..."
cd $PORTFOLIO_DIR/backend

# Création de l'environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installation des dépendances
pip install --upgrade pip
pip install -r requirements.txt

# Configuration des variables d'environnement
cat > .env << EOF
# Configuration Base de données - Backend v2.0
DATABASE_URL="mysql+pymysql://${PORTFOLIO_DB_USER}:${PORTFOLIO_DB_PASSWORD}@localhost/${PORTFOLIO_DB}"

# Configuration Pool de connexions
POOL_SIZE=20
MAX_OVERFLOW=30
POOL_RECYCLE=3600
POOL_TIMEOUT=30

# Configuration Timeouts
CONNECTION_TIMEOUT=60
READ_TIMEOUT=60
WRITE_TIMEOUT=60

# Configuration Monitoring
MONITORING_ENABLED=true
HEALTH_CHECK_INTERVAL=300
METRICS_RETENTION_HOURS=24

# Configuration Sécurité
SECRET_KEY="portfolio_secret_$(openssl rand -hex 32)"
CORS_ORIGINS="*"

# Configuration Logs
LOG_LEVEL="INFO"
LOG_FILE="/var/log/portfolio/backend.log"
EOF

# Initialisation de la base de données
log "🗄️ Initialisation de la base de données..."
python init_db.py

# =====================================================================
# ÉTAPE 9: CONFIGURATION DU FRONTEND
# =====================================================================
log "⚛️ Configuration du frontend React..."
cd $PORTFOLIO_DIR/frontend

# Installation des dépendances
yarn install

# Configuration des variables d'environnement
cat > .env << EOF
# Configuration Frontend - Portfolio v2.0
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_API_VERSION=2.0
REACT_APP_MONITORING_ENABLED=true
GENERATE_SOURCEMAP=false
EOF

# Build du frontend
log "🔨 Build du frontend..."
yarn build

# =====================================================================
# ÉTAPE 10: CONFIGURATION DE NGINX
# =====================================================================
log "🌐 Configuration de Nginx..."
cat > /etc/nginx/sites-available/portfolio << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # Logs
    access_log /var/log/nginx/portfolio.access.log;
    error_log /var/log/nginx/portfolio.error.log;
    
    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Frontend React
    location / {
        root ${PORTFOLIO_DIR}/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
        
        # Cache statique
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Backend avec monitoring
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts pour éviter les déconnexions
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Headers de performance
        proxy_set_header X-Request-Start \$msec;
    }
    
    # Monitoring endpoints (optionnel, pour admin)
    location /admin {
        proxy_pass http://localhost:8001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Restriction d'accès (optionnel)
        # allow 127.0.0.1;
        # deny all;
    }
}
EOF

# Activation du site
ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test de la configuration
nginx -t

# =====================================================================
# ÉTAPE 11: CONFIGURATION DE SUPERVISOR
# =====================================================================
log "🔄 Configuration de Supervisor..."
cat > /etc/supervisor/conf.d/portfolio-backend.conf << EOF
[program:portfolio-backend]
command=${PORTFOLIO_DIR}/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
directory=${PORTFOLIO_DIR}/backend
user=${PORTFOLIO_USER}
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-backend.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=3
environment=PATH="${PORTFOLIO_DIR}/backend/venv/bin"

[program:portfolio-monitoring]
command=${PORTFOLIO_DIR}/backend/venv/bin/python monitoring.py
directory=${PORTFOLIO_DIR}/backend
user=${PORTFOLIO_USER}
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-monitoring.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=3
environment=PATH="${PORTFOLIO_DIR}/backend/venv/bin"
EOF

# =====================================================================
# ÉTAPE 12: CONFIGURATION DU FIREWALL
# =====================================================================
log "🔥 Configuration du firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3306  # MariaDB (si accès externe nécessaire)

# =====================================================================
# ÉTAPE 13: CONFIGURATION DES LOGS
# =====================================================================
log "📝 Configuration des logs..."
mkdir -p /var/log/portfolio
chown -R $PORTFOLIO_USER:$PORTFOLIO_USER /var/log/portfolio

# Configuration de logrotate
cat > /etc/logrotate.d/portfolio << EOF
/var/log/portfolio/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        systemctl reload supervisor
    endscript
}
EOF

# =====================================================================
# ÉTAPE 14: CRÉATION DES SCRIPTS DE GESTION
# =====================================================================
log "📜 Création des scripts de gestion..."

# Script de démarrage
cat > /usr/local/bin/portfolio-start << 'EOF'
#!/bin/bash
systemctl start mariadb
systemctl start nginx
systemctl start supervisor
supervisorctl start portfolio-backend
supervisorctl start portfolio-monitoring
echo "✅ Portfolio démarré avec succès"
EOF

# Script d'arrêt
cat > /usr/local/bin/portfolio-stop << 'EOF'
#!/bin/bash
supervisorctl stop portfolio-backend
supervisorctl stop portfolio-monitoring
systemctl stop nginx
echo "✅ Portfolio arrêté avec succès"
EOF

# Script de redémarrage
cat > /usr/local/bin/portfolio-restart << 'EOF'
#!/bin/bash
echo "🔄 Redémarrage du portfolio..."
supervisorctl restart portfolio-backend
supervisorctl restart portfolio-monitoring
systemctl reload nginx
echo "✅ Portfolio redémarré avec succès"
EOF

# Script de status
cat > /usr/local/bin/portfolio-status << 'EOF'
#!/bin/bash
echo "📊 Statut du Portfolio:"
echo "======================="
systemctl status mariadb --no-pager -l
echo ""
systemctl status nginx --no-pager -l
echo ""
supervisorctl status
echo ""
echo "🔍 Health Check:"
curl -s http://localhost:8001/api/health | jq '.' 2>/dev/null || echo "API non disponible"
EOF

# Script de logs
cat > /usr/local/bin/portfolio-logs << 'EOF'
#!/bin/bash
case "$1" in
    backend)
        tail -f /var/log/supervisor/portfolio-backend.log
        ;;
    monitoring)
        tail -f /var/log/supervisor/portfolio-monitoring.log
        ;;
    nginx)
        tail -f /var/log/nginx/portfolio.access.log
        ;;
    all)
        tail -f /var/log/supervisor/portfolio-*.log /var/log/nginx/portfolio.*.log
        ;;
    *)
        echo "Usage: $0 {backend|monitoring|nginx|all}"
        exit 1
        ;;
esac
EOF

# Rendre les scripts exécutables
chmod +x /usr/local/bin/portfolio-*

# =====================================================================
# ÉTAPE 15: DÉMARRAGE DES SERVICES
# =====================================================================
log "🚀 Démarrage des services..."

# Démarrage de MariaDB
systemctl start mariadb
systemctl enable mariadb

# Démarrage de Nginx
systemctl start nginx
systemctl enable nginx

# Démarrage de Supervisor
systemctl start supervisor
systemctl enable supervisor

# Rechargement de la configuration supervisor
supervisorctl reread
supervisorctl update
supervisorctl start portfolio-backend
supervisorctl start portfolio-monitoring

# =====================================================================
# ÉTAPE 16: CONFIGURATION SSL (OPTIONNEL)
# =====================================================================
if [ "$DOMAIN" != "your-domain.com" ]; then
    log "🔒 Configuration SSL avec Let's Encrypt..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
fi

# =====================================================================
# ÉTAPE 17: TESTS DE VALIDATION
# =====================================================================
log "🧪 Tests de validation..."

# Test MariaDB
mysql -u $PORTFOLIO_DB_USER -p$PORTFOLIO_DB_PASSWORD -e "SELECT 1" $PORTFOLIO_DB > /dev/null 2>&1
if [ $? -eq 0 ]; then
    log "✅ MariaDB: OK"
else
    error "❌ MariaDB: Échec de connexion"
fi

# Test Backend
sleep 5
backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/health)
if [ "$backend_status" = "200" ]; then
    log "✅ Backend: OK"
else
    error "❌ Backend: Échec (Status: $backend_status)"
fi

# Test Frontend
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ "$frontend_status" = "200" ]; then
    log "✅ Frontend: OK"
else
    error "❌ Frontend: Échec (Status: $frontend_status)"
fi

# =====================================================================
# ÉTAPE 18: INFORMATIONS FINALES
# =====================================================================
log "🎉 Installation terminée avec succès!"
info "============================================="
info "PORTFOLIO v2.0 - INSTALLÉ AVEC SUCCÈS"
info "============================================="
info "🌐 Site web: http://$DOMAIN (ou http://localhost si domaine non configuré)"
info "🔧 Backend API: http://localhost:8001"
info "📊 Health Check: http://localhost:8001/api/health"
info "📈 Métriques: http://localhost:8001/api/metrics"
info ""
info "🗂️ Fichiers de configuration:"
info "- Répertoire: $PORTFOLIO_DIR"
info "- Logs: /var/log/portfolio/"
info "- Configuration DB: /etc/mysql/mariadb.conf.d/99-portfolio.cnf"
info ""
info "🔐 Informations de base de données:"
info "- Database: $PORTFOLIO_DB"
info "- User: $PORTFOLIO_DB_USER"
info "- Password: $PORTFOLIO_DB_PASSWORD"
info ""
info "🛠️ Commandes utiles:"
info "- Démarrer: portfolio-start"
info "- Arrêter: portfolio-stop"
info "- Redémarrer: portfolio-restart"
info "- Status: portfolio-status"
info "- Logs: portfolio-logs [backend|monitoring|nginx|all]"
info ""
info "📝 Prochaines étapes:"
info "1. Configurer votre domaine dans /etc/nginx/sites-available/portfolio"
info "2. Exécuter: certbot --nginx -d votre-domaine.com"
info "3. Tester la stabilité: curl http://localhost:8001/api/health"
info "============================================="

# Sauvegarde des informations importantes
cat > $PORTFOLIO_DIR/INSTALLATION_INFO.txt << EOF
Portfolio v2.0 - Installation Ubuntu 24.04
==========================================
Date d'installation: $(date)
Architecture: Backend refactorisé + MariaDB + Pool de connexions

Base de données:
- Database: $PORTFOLIO_DB
- User: $PORTFOLIO_DB_USER  
- Password: $PORTFOLIO_DB_PASSWORD

Commandes utiles:
- portfolio-start
- portfolio-stop
- portfolio-restart
- portfolio-status
- portfolio-logs [backend|monitoring|nginx|all]

Health Check: http://localhost:8001/api/health
Métriques: http://localhost:8001/api/metrics
EOF

chown $PORTFOLIO_USER:$PORTFOLIO_USER $PORTFOLIO_DIR/INSTALLATION_INFO.txt

log "✅ Installation complète! Informations sauvegardées dans $PORTFOLIO_DIR/INSTALLATION_INFO.txt"