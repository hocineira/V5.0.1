#!/bin/bash

# ==================================================================================
# PROCÉDURE D'INSTALLATION PORTFOLIO HOCINE IRATNI
# Ubuntu Server 24.04.02 - Version MariaDB
# ==================================================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
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
    else
        log_error "$1"
        exit 1
    fi
}

# Variables de configuration
PORTFOLIO_USER="portfolio"
PORTFOLIO_HOME="/home/$PORTFOLIO_USER"
PORTFOLIO_DIR="$PORTFOLIO_HOME/portfolio"
DB_NAME="portfolio_db"
DB_USER="portfolio_user"
DB_PASSWORD="portfolio_password"
DOMAIN="iratnihocine.fr"  # Remplacez par votre domaine

log_info "🚀 Démarrage de l'installation du Portfolio Hocine IRATNI sur Ubuntu Server 24.04.02"

# ==================================================================================
# 1. MISE À JOUR DU SYSTÈME
# ==================================================================================

log_info "📦 Mise à jour du système Ubuntu Server 24.04.02"
apt update && apt upgrade -y
check_command "Mise à jour du système terminée"

# ==================================================================================
# 2. INSTALLATION DES DÉPENDANCES DE BASE
# ==================================================================================

log_info "🔧 Installation des dépendances de base"
apt install -y curl wget git build-essential software-properties-common \
    apt-transport-https ca-certificates gnupg lsb-release \
    unzip supervisor nginx certbot python3-certbot-nginx \
    python3 python3-pip python3-venv htop nano vim
check_command "Dépendances de base installées"

# ==================================================================================
# 3. INSTALLATION DE MARIADB
# ==================================================================================

log_info "🗄️ Installation de MariaDB Server"
apt install -y mariadb-server mariadb-client
check_command "MariaDB installé"

# Démarrage et activation de MariaDB
systemctl start mariadb
systemctl enable mariadb
check_command "MariaDB démarré et activé"

# Sécurisation de MariaDB
log_info "🔒 Configuration sécurisée de MariaDB"
mysql_secure_installation << EOF

n
y
y
y
y
EOF

# Création de la base de données et utilisateur
log_info "🏗️ Création de la base de données portfolio"
mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
check_command "Base de données créée"

# ==================================================================================
# 4. INSTALLATION DE NODE.JS ET YARN
# ==================================================================================

log_info "📦 Installation de Node.js 20.x"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
check_command "Node.js installé"

log_info "📦 Installation de Yarn"
npm install -g yarn
check_command "Yarn installé"

# ==================================================================================
# 5. CRÉATION DE L'UTILISATEUR PORTFOLIO
# ==================================================================================

log_info "👤 Création de l'utilisateur portfolio"
if ! id "$PORTFOLIO_USER" &>/dev/null; then
    useradd -m -s /bin/bash $PORTFOLIO_USER
    usermod -aG sudo $PORTFOLIO_USER
    log_success "Utilisateur $PORTFOLIO_USER créé"
else
    log_warning "L'utilisateur $PORTFOLIO_USER existe déjà"
fi

# ==================================================================================
# 6. CLONAGE DU REPOSITORY
# ==================================================================================

log_info "📥 Clonage du repository portfolio"
sudo -u $PORTFOLIO_USER git clone https://github.com/hocineira/V3.git $PORTFOLIO_DIR
check_command "Repository cloné"

# ==================================================================================
# 7. INSTALLATION DES DÉPENDANCES PYTHON
# ==================================================================================

log_info "🐍 Installation des dépendances Python"
cd $PORTFOLIO_DIR/backend

# Création de l'environnement virtuel
sudo -u $PORTFOLIO_USER python3 -m venv venv
sudo -u $PORTFOLIO_USER $PORTFOLIO_DIR/backend/venv/bin/pip install --upgrade pip

# Installation des dépendances
sudo -u $PORTFOLIO_USER $PORTFOLIO_DIR/backend/venv/bin/pip install -r requirements.txt
check_command "Dépendances Python installées"

# ==================================================================================
# 8. CONFIGURATION DE LA BASE DE DONNÉES
# ==================================================================================

log_info "🔧 Configuration de la base de données"
cd $PORTFOLIO_DIR/backend

# Création du fichier .env
cat > .env << EOF
DATABASE_URL="mysql+pymysql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME"
EOF

# Initialisation de la base de données avec les données de Hocine
sudo -u $PORTFOLIO_USER $PORTFOLIO_DIR/backend/venv/bin/python init_db.py
check_command "Base de données initialisée"

# Migration des données personnelles de Hocine depuis V3
sudo -u $PORTFOLIO_USER $PORTFOLIO_DIR/backend/venv/bin/python update_portfolio_data.py
check_command "Données personnelles migrées"

# ==================================================================================
# 9. INSTALLATION DES DÉPENDANCES FRONTEND
# ==================================================================================

log_info "⚛️ Installation des dépendances React"
cd $PORTFOLIO_DIR/frontend

# Configuration de l'environnement React
cat > .env << EOF
REACT_APP_BACKEND_URL=https://$DOMAIN/api
EOF

# Installation des dépendances
sudo -u $PORTFOLIO_USER yarn install
check_command "Dépendances React installées"

# Build de production
sudo -u $PORTFOLIO_USER yarn build
check_command "Build React créé"

# ==================================================================================
# 10. CONFIGURATION DE SUPERVISOR
# ==================================================================================

log_info "🔧 Configuration de Supervisor"

# Configuration du backend
cat > /etc/supervisor/conf.d/portfolio-backend.conf << EOF
[program:portfolio-backend]
command=$PORTFOLIO_DIR/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=$PORTFOLIO_DIR/backend
user=$PORTFOLIO_USER
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-backend.log
environment=DATABASE_URL="mysql+pymysql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME"
EOF

# Configuration du frontend (serve pour servir les fichiers statiques)
sudo -u $PORTFOLIO_USER npm install -g serve

cat > /etc/supervisor/conf.d/portfolio-frontend.conf << EOF
[program:portfolio-frontend]
command=serve -s build -l 3000
directory=$PORTFOLIO_DIR/frontend
user=$PORTFOLIO_USER
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-frontend.log
EOF

# Rechargement de supervisor
supervisorctl reread
supervisorctl update
supervisorctl start portfolio-backend
supervisorctl start portfolio-frontend
check_command "Services Supervisor configurés"

# ==================================================================================
# 11. CONFIGURATION DE NGINX
# ==================================================================================

log_info "🌐 Configuration de Nginx"

# Configuration du site
cat > /etc/nginx/sites-available/portfolio << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirection vers HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # Configuration SSL (sera configurée par certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Headers de sécurité
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Proxy vers le backend API
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Servir les fichiers statiques React
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Configuration pour React Router
        try_files \$uri \$uri/ @fallback;
    }
    
    location @fallback {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Logs
    access_log /var/log/nginx/portfolio_access.log;
    error_log /var/log/nginx/portfolio_error.log;
}
EOF

# Activation du site
ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test de la configuration
nginx -t
check_command "Configuration Nginx validée"

# ==================================================================================
# 12. CONFIGURATION SSL AVEC CERTBOT
# ==================================================================================

log_info "🔒 Configuration SSL avec Let's Encrypt"

# Installation du certificat SSL
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email hocineira@gmail.com
check_command "Certificat SSL installé"

# Configuration du renouvellement automatique
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
check_command "Renouvellement automatique configuré"

# ==================================================================================
# 13. DÉMARRAGE DES SERVICES
# ==================================================================================

log_info "🚀 Démarrage des services"

# Redémarrage des services
systemctl restart nginx
systemctl restart supervisor
systemctl restart mariadb

# Vérification des services
systemctl enable nginx
systemctl enable supervisor
systemctl enable mariadb

check_command "Services démarrés"

# ==================================================================================
# 14. CONFIGURATION DU FIREWALL
# ==================================================================================

log_info "🔥 Configuration du firewall"

# Configuration UFW
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3000  # React dev server (optionnel)
ufw allow 8001  # Backend API (optionnel)
ufw --force enable
check_command "Firewall configuré"

# ==================================================================================
# 15. SCRIPT DE GESTION DU PORTFOLIO
# ==================================================================================

log_info "📝 Création du script de gestion"

cat > /usr/local/bin/portfolio-manage << 'EOF'
#!/bin/bash

PORTFOLIO_DIR="/home/portfolio/portfolio"
PORTFOLIO_USER="portfolio"

case "$1" in
    start)
        echo "🚀 Démarrage du portfolio..."
        supervisorctl start portfolio-backend
        supervisorctl start portfolio-frontend
        systemctl start nginx
        echo "✅ Portfolio démarré"
        ;;
    stop)
        echo "🛑 Arrêt du portfolio..."
        supervisorctl stop portfolio-backend
        supervisorctl stop portfolio-frontend
        echo "✅ Portfolio arrêté"
        ;;
    restart)
        echo "🔄 Redémarrage du portfolio..."
        supervisorctl restart portfolio-backend
        supervisorctl restart portfolio-frontend
        systemctl restart nginx
        echo "✅ Portfolio redémarré"
        ;;
    status)
        echo "📊 Status du portfolio:"
        supervisorctl status portfolio-backend
        supervisorctl status portfolio-frontend
        systemctl status nginx --no-pager -l
        ;;
    logs)
        echo "📋 Logs du portfolio:"
        if [ "$2" = "backend" ]; then
            tail -f /var/log/supervisor/portfolio-backend.log
        elif [ "$2" = "frontend" ]; then
            tail -f /var/log/supervisor/portfolio-frontend.log
        elif [ "$2" = "nginx" ]; then
            tail -f /var/log/nginx/portfolio_error.log
        else
            echo "Usage: portfolio-manage logs [backend|frontend|nginx]"
        fi
        ;;
    update)
        echo "🔄 Mise à jour du portfolio..."
        cd $PORTFOLIO_DIR
        sudo -u $PORTFOLIO_USER git pull
        cd $PORTFOLIO_DIR/backend
        sudo -u $PORTFOLIO_USER ./venv/bin/pip install -r requirements.txt
        cd $PORTFOLIO_DIR/frontend
        sudo -u $PORTFOLIO_USER yarn install
        sudo -u $PORTFOLIO_USER yarn build
        supervisorctl restart portfolio-backend
        supervisorctl restart portfolio-frontend
        echo "✅ Portfolio mis à jour"
        ;;
    test)
        echo "🧪 Test du portfolio..."
        curl -s http://localhost:8001/api/health && echo "✅ Backend OK"
        curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend OK"
        curl -s https://$DOMAIN > /dev/null && echo "✅ Site public OK"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|update|test}"
        exit 1
        ;;
esac
EOF

chmod +x /usr/local/bin/portfolio-manage
check_command "Script de gestion créé"

# ==================================================================================
# 16. TESTS DE VALIDATION
# ==================================================================================

log_info "🧪 Tests de validation"

# Test de la base de données
mysql -u $DB_USER -p$DB_PASSWORD -e "SELECT 'Database OK' as status;" $DB_NAME
check_command "Base de données testée"

# Test des services
sleep 10
curl -s http://localhost:8001/api/health && log_success "Backend accessible"
curl -s http://localhost:3000 > /dev/null && log_success "Frontend accessible"

# Test du domaine public (si configuré)
if curl -s https://$DOMAIN > /dev/null; then
    log_success "Site public accessible"
else
    log_warning "Site public non accessible (vérifiez la configuration DNS)"
fi

# ==================================================================================
# 17. RÉSUMÉ DE L'INSTALLATION
# ==================================================================================

log_info "📋 Résumé de l'installation terminée"
echo ""
echo "=================================="
echo "🎉 INSTALLATION TERMINÉE !"
echo "=================================="
echo ""
echo "Portfolio de Hocine IRATNI installé avec succès sur Ubuntu Server 24.04.02"
echo ""
echo "📍 Informations importantes:"
echo "  • Utilisateur: $PORTFOLIO_USER"
echo "  • Répertoire: $PORTFOLIO_DIR"
echo "  • Base de données: MariaDB ($DB_NAME)"
echo "  • Domain: https://$DOMAIN"
echo ""
echo "🔧 Gestion du portfolio:"
echo "  • portfolio-manage start    - Démarrer"
echo "  • portfolio-manage stop     - Arrêter"
echo "  • portfolio-manage restart  - Redémarrer"
echo "  • portfolio-manage status   - Vérifier le status"
echo "  • portfolio-manage logs     - Voir les logs"
echo "  • portfolio-manage update   - Mettre à jour"
echo "  • portfolio-manage test     - Tester"
echo ""
echo "🌐 URLs:"
echo "  • Site public: https://$DOMAIN"
echo "  • Backend API: https://$DOMAIN/api"
echo "  • Frontend local: http://localhost:3000"
echo "  • Backend local: http://localhost:8001"
echo ""
echo "📁 Logs importants:"
echo "  • Backend: /var/log/supervisor/portfolio-backend.log"
echo "  • Frontend: /var/log/supervisor/portfolio-frontend.log"
echo "  • Nginx: /var/log/nginx/portfolio_error.log"
echo ""
echo "✅ Installation terminée avec succès!"
echo "🚀 Votre portfolio est maintenant accessible à l'adresse: https://$DOMAIN"