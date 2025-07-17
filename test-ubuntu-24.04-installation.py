#!/usr/bin/env python3
"""
Test script pour analyser la procédure d'installation Ubuntu 24.04
Portfolio Hocine IRATNI - Analyse des bugs potentiels
"""

import os
import sys
import subprocess
import json
import re
from pathlib import Path

class Ubuntu2404InstallationTester:
    def __init__(self):
        self.issues = []
        self.warnings = []
        self.suggestions = []
        
    def log_issue(self, severity, category, message, fix_suggestion=None):
        """Log un problème identifié"""
        issue = {
            'severity': severity,  # 'critical', 'high', 'medium', 'low'
            'category': category,
            'message': message,
            'fix_suggestion': fix_suggestion
        }
        
        if severity in ['critical', 'high']:
            self.issues.append(issue)
        else:
            self.warnings.append(issue)
            
        if fix_suggestion:
            self.suggestions.append(fix_suggestion)
    
    def test_installation_script_issues(self):
        """Analyse le script d'installation pour les problèmes potentiels"""
        print("🔍 Analyse du script d'installation Ubuntu 24.04.02...")
        
        script_path = "/app/install-ubuntu-24.04.02.sh"
        
        if not os.path.exists(script_path):
            self.log_issue('critical', 'missing_file', 
                         "Script d'installation introuvable",
                         "Vérifier que le fichier install-ubuntu-24.04.02.sh existe")
            return
        
        with open(script_path, 'r') as f:
            script_content = f.read()
        
        # Test 1: Problème mysql_secure_installation
        if 'mysql_secure_installation << EOF' in script_content:
            self.log_issue('high', 'database_setup', 
                         "mysql_secure_installation avec heredoc peut échouer",
                         "Remplacer par une configuration manuelle avec expect ou mysql direct")
        
        # Test 2: Problème création base de données
        if 'mysql -u root -p << EOF' in script_content:
            self.log_issue('critical', 'database_setup', 
                         "mysql -u root -p va demander un mot de passe interactif",
                         "Utiliser mysql -u root (sans -p) ou configurer le mot de passe")
        
        # Test 3: Domaine hardcodé
        if 'DOMAIN="iratnihocine.fr"' in script_content:
            self.log_issue('medium', 'configuration', 
                         "Domaine hardcodé dans le script",
                         "Rendre le domaine configurable via paramètre ou input utilisateur")
        
        # Test 4: Certificat SSL automatique
        if 'certbot --nginx -d $DOMAIN' in script_content:
            self.log_issue('high', 'ssl_config', 
                         "Génération automatique SSL sans vérification DNS",
                         "Vérifier que le domaine pointe vers le serveur avant certbot")
        
        # Test 5: Email hardcodé
        if 'hocineira@gmail.com' in script_content:
            self.log_issue('medium', 'configuration', 
                         "Email hardcodé pour certificat SSL",
                         "Rendre l'email configurable pour les certificats SSL")
        
        # Test 6: Dépendances sans vérification
        if 'apt install -y' in script_content:
            self.log_issue('medium', 'dependencies', 
                         "Installation packages sans vérification de disponibilité",
                         "Vérifier la disponibilité des packages avant installation")
        
        # Test 7: Pas de vérification des prérequis
        if 'lsb_release -rs' not in script_content:
            self.log_issue('medium', 'validation', 
                         "Pas de vérification de la version Ubuntu",
                         "Vérifier que le système est bien Ubuntu 24.04 avant installation")
        
        print("✅ Analyse du script d'installation terminée")
    
    def test_validation_script_issues(self):
        """Analyse le script de validation pour les problèmes potentiels"""
        print("🔍 Analyse du script de validation...")
        
        script_path = "/app/validate-ubuntu-24.04.02.sh"
        
        if not os.path.exists(script_path):
            self.log_issue('high', 'missing_file', 
                         "Script de validation introuvable",
                         "Créer le script de validation manquant")
            return
        
        with open(script_path, 'r') as f:
            script_content = f.read()
        
        # Test 1: Mot de passe MariaDB en dur
        if 'mysql -u $DB_USER -p$DB_PASSWORD' in script_content:
            self.log_issue('low', 'security', 
                         "Mot de passe MariaDB visible dans les processus",
                         "Utiliser un fichier de configuration MySQL ou variable d'environnement")
        
        # Test 2: Test SSL sans vérification réseau
        if 'curl -s -k https://$DOMAIN' in script_content:
            self.log_issue('medium', 'network_test', 
                         "Test HTTPS sans vérification DNS préalable",
                         "Vérifier la résolution DNS avant le test HTTPS")
        
        # Test 3: Domaine hardcodé
        if 'DOMAIN="iratnihocine.fr"' in script_content:
            self.log_issue('medium', 'configuration', 
                         "Domaine hardcodé dans le script de validation",
                         "Paramétrer le domaine à tester")
        
        print("✅ Analyse du script de validation terminée")
    
    def test_guide_consistency(self):
        """Vérifie la cohérence du guide d'installation"""
        print("🔍 Analyse du guide d'installation...")
        
        guide_path = "/app/GUIDE-UBUNTU-24.04.02.md"
        
        if not os.path.exists(guide_path):
            self.log_issue('medium', 'documentation', 
                         "Guide d'installation manquant",
                         "Créer la documentation complète d'installation")
            return
        
        with open(guide_path, 'r') as f:
            guide_content = f.read()
        
        # Test 1: Vérification des commandes
        if 'sudo mysql_secure_installation' in guide_content:
            self.log_issue('medium', 'documentation', 
                         "Guide mentionne mysql_secure_installation qui peut poser problème",
                         "Documenter les alternatives pour la sécurisation MariaDB")
        
        # Test 2: Vérification des URLs
        if 'github.com/hocineira/V3' in guide_content:
            self.log_issue('low', 'documentation', 
                         "URL GitHub spécifique dans le guide",
                         "Vérifier que l'URL GitHub est accessible et à jour")
        
        print("✅ Analyse du guide terminée")
    
    def test_prerequisites_check(self):
        """Teste les prérequis système pour Ubuntu 24.04"""
        print("🔍 Vérification des prérequis système...")
        
        # Test 1: Version Ubuntu
        try:
            result = subprocess.run(['lsb_release', '-rs'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                version = result.stdout.strip()
                if version != "24.04":
                    self.log_issue('medium', 'system_check', 
                                 f"Version Ubuntu: {version} (attendu: 24.04)",
                                 "Tester sur Ubuntu 24.04 LTS")
            else:
                self.log_issue('low', 'system_check', 
                             "Impossible de déterminer la version Ubuntu",
                             "Vérifier que lsb_release est installé")
        except FileNotFoundError:
            self.log_issue('low', 'system_check', 
                         "lsb_release non disponible",
                         "Installer lsb-release: sudo apt install lsb-release")
        
        # Test 2: Espace disque
        try:
            result = subprocess.run(['df', '-h', '/'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')
                if len(lines) > 1:
                    # Parse la ligne du système de fichiers racine
                    parts = lines[1].split()
                    if len(parts) >= 4:
                        available = parts[3]
                        # Conversion approximative (G = GB, M = MB)
                        if 'G' in available:
                            available_gb = float(available.replace('G', ''))
                            if available_gb < 20:
                                self.log_issue('high', 'system_check', 
                                             f"Espace disque insuffisant: {available} (minimum: 20GB)",
                                             "Libérer de l'espace disque ou utiliser un disque plus grand")
        except Exception as e:
            self.log_issue('low', 'system_check', 
                         f"Erreur vérification espace disque: {str(e)}",
                         "Vérifier manuellement l'espace disque disponible")
        
        # Test 3: Réseau
        try:
            result = subprocess.run(['ping', '-c', '1', 'google.com'], 
                                  capture_output=True, text=True)
            if result.returncode != 0:
                self.log_issue('medium', 'network_check', 
                             "Pas de connexion internet",
                             "Vérifier la configuration réseau")
        except Exception:
            self.log_issue('low', 'network_check', 
                         "Impossible de tester la connexion réseau",
                         "Vérifier manuellement la connexion internet")
        
        print("✅ Vérification des prérequis terminée")
    
    def test_dependencies_availability(self):
        """Teste la disponibilité des dépendances"""
        print("🔍 Vérification des dépendances...")
        
        # Dépendances critiques
        critical_deps = [
            'curl', 'wget', 'git', 'python3', 'python3-pip', 'python3-venv',
            'nginx', 'supervisor', 'certbot'
        ]
        
        # Dépendances à installer
        packages_to_install = [
            'mariadb-server', 'mariadb-client', 'nodejs', 'npm'
        ]
        
        # Test des dépendances déjà installées
        for dep in critical_deps:
            try:
                result = subprocess.run(['which', dep], 
                                      capture_output=True, text=True)
                if result.returncode != 0:
                    self.log_issue('high', 'dependencies', 
                                 f"Dépendance manquante: {dep}",
                                 f"Installer avec: sudo apt install {dep}")
            except Exception:
                self.log_issue('medium', 'dependencies', 
                             f"Impossible de vérifier {dep}",
                             "Vérifier manuellement la disponibilité")
        
        # Test de disponibilité des packages
        for package in packages_to_install:
            try:
                result = subprocess.run(['apt', 'show', package], 
                                      capture_output=True, text=True)
                if result.returncode != 0:
                    self.log_issue('high', 'dependencies', 
                                 f"Package non disponible: {package}",
                                 f"Vérifier les sources APT ou utiliser une alternative")
            except Exception:
                self.log_issue('low', 'dependencies', 
                             f"Impossible de vérifier le package {package}",
                             "Vérifier les sources APT")
        
        print("✅ Vérification des dépendances terminée")
    
    def test_port_availability(self):
        """Teste la disponibilité des ports requis"""
        print("🔍 Vérification des ports...")
        
        required_ports = [80, 443, 3000, 8001, 3306]
        
        for port in required_ports:
            try:
                result = subprocess.run(['ss', '-tlnp'], 
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    if f":{port}" in result.stdout:
                        self.log_issue('medium', 'port_conflict', 
                                     f"Port {port} déjà utilisé",
                                     f"Arrêter le service utilisant le port {port} ou modifier la configuration")
            except Exception:
                self.log_issue('low', 'port_check', 
                             f"Impossible de vérifier le port {port}",
                             "Vérifier manuellement les ports utilisés")
        
        print("✅ Vérification des ports terminée")
    
    def generate_fixed_installation_script(self):
        """Génère une version corrigée du script d'installation"""
        print("🔧 Génération du script d'installation corrigé...")
        
        fixed_script = """#!/bin/bash

# ==================================================================================
# PROCÉDURE D'INSTALLATION PORTFOLIO HOCINE IRATNI - VERSION CORRIGÉE
# Ubuntu Server 24.04.02 - Version MariaDB
# ==================================================================================

set -e

# Couleurs pour les messages
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

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

# Variables de configuration - À MODIFIER SELON VOS BESOINS
PORTFOLIO_USER="portfolio"
PORTFOLIO_HOME="/home/$PORTFOLIO_USER"
PORTFOLIO_DIR="$PORTFOLIO_HOME/portfolio"
DB_NAME="portfolio_db"
DB_USER="portfolio_user"
DB_PASSWORD="portfolio_password"
DOMAIN=""  # À CONFIGURER
SSL_EMAIL=""  # À CONFIGURER

# Vérification des prérequis
log_info "🔍 Vérification des prérequis..."

# Vérification Ubuntu 24.04
ubuntu_version=$(lsb_release -rs 2>/dev/null || echo "unknown")
if [[ "$ubuntu_version" != "24.04" ]]; then
    log_error "Ubuntu 24.04 requis. Version détectée: $ubuntu_version"
    exit 1
fi

# Vérification domaine
if [[ -z "$DOMAIN" ]]; then
    log_error "Veuillez configurer la variable DOMAIN dans le script"
    exit 1
fi

# Vérification email
if [[ -z "$SSL_EMAIL" ]]; then
    log_error "Veuillez configurer la variable SSL_EMAIL dans le script"
    exit 1
fi

# Vérification utilisateur root
if [[ $EUID -ne 0 ]]; then
    log_error "Ce script doit être exécuté en tant que root"
    exit 1
fi

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
apt install -y curl wget git build-essential software-properties-common \\
    apt-transport-https ca-certificates gnupg lsb-release \\
    unzip supervisor nginx certbot python3-certbot-nginx \\
    python3 python3-pip python3-venv htop nano vim expect
check_command "Dépendances de base installées"

# ==================================================================================
# 3. INSTALLATION DE MARIADB - VERSION CORRIGÉE
# ==================================================================================

log_info "🗄️ Installation de MariaDB Server"
apt install -y mariadb-server mariadb-client
check_command "MariaDB installé"

# Démarrage et activation de MariaDB
systemctl start mariadb
systemctl enable mariadb
check_command "MariaDB démarré et activé"

# Sécurisation de MariaDB - VERSION CORRIGÉE
log_info "🔒 Configuration sécurisée de MariaDB"

# Création d'un script expect pour automatiser mysql_secure_installation
cat > /tmp/mysql_secure.exp << 'EOF'
#!/usr/bin/expect -f
spawn mysql_secure_installation
expect "Enter current password for root (enter for none):"
send "\\r"
expect "Set root password?"
send "n\\r"
expect "Remove anonymous users?"
send "y\\r"
expect "Disallow root login remotely?"
send "y\\r"
expect "Remove test database and access to it?"
send "y\\r"
expect "Reload privilege tables now?"
send "y\\r"
expect eof
EOF

chmod +x /tmp/mysql_secure.exp
/tmp/mysql_secure.exp
rm /tmp/mysql_secure.exp
check_command "MariaDB sécurisé"

# Création de la base de données et utilisateur - VERSION CORRIGÉE
log_info "🏗️ Création de la base de données portfolio"
mysql -u root << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
check_command "Base de données créée"

# Test de connexion
mysql -u $DB_USER -p$DB_PASSWORD -e "SELECT 1;" $DB_NAME > /dev/null 2>&1
check_command "Connexion base de données testée"

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
if [ -d "$PORTFOLIO_DIR" ]; then
    log_warning "Le répertoire $PORTFOLIO_DIR existe déjà"
    sudo -u $PORTFOLIO_USER git -C $PORTFOLIO_DIR pull || true
else
    sudo -u $PORTFOLIO_USER git clone https://github.com/hocineira/V3.git $PORTFOLIO_DIR
fi
check_command "Repository synchronisé"

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

# Permissions correctes
chown $PORTFOLIO_USER:$PORTFOLIO_USER .env
chmod 600 .env

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

# Permissions correctes
chown $PORTFOLIO_USER:$PORTFOLIO_USER .env
chmod 600 .env

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
    return 301 https://\\$server_name\\$request_uri;
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
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Servir les fichiers statiques React
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
        
        # Configuration pour React Router
        try_files \\$uri \\$uri/ @fallback;
    }
    
    location @fallback {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
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
# 12. CONFIGURATION SSL AVEC CERTBOT - VERSION CORRIGÉE
# ==================================================================================

log_info "🔒 Configuration SSL avec Let's Encrypt"

# Vérification DNS avant certbot
log_info "🔍 Vérification de la résolution DNS..."
if ! nslookup $DOMAIN > /dev/null 2>&1; then
    log_warning "Le domaine $DOMAIN ne résout pas correctement"
    log_warning "Configurez votre DNS avant de continuer"
    read -p "Continuer sans SSL ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Configuration DNS requise"
        exit 1
    fi
    SKIP_SSL=true
fi

if [[ "$SKIP_SSL" != "true" ]]; then
    # Installation du certificat SSL
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $SSL_EMAIL
    check_command "Certificat SSL installé"
    
    # Configuration du renouvellement automatique
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
    check_command "Renouvellement automatique configuré"
else
    log_warning "SSL ignoré - configuration manuelle requise"
fi

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
ufw --force enable
check_command "Firewall configuré"

# ==================================================================================
# 15. TESTS DE VALIDATION
# ==================================================================================

log_info "🧪 Tests de validation"

# Test de la base de données
mysql -u $DB_USER -p$DB_PASSWORD -e "SELECT 'Database OK' as status;" $DB_NAME
check_command "Base de données testée"

# Test des services
sleep 10
curl -s http://localhost:8001/api/health && log_success "Backend accessible"
curl -s http://localhost:3000 > /dev/null && log_success "Frontend accessible"

# Test du domaine public (si SSL configuré)
if [[ "$SKIP_SSL" != "true" ]]; then
    if curl -s https://$DOMAIN > /dev/null; then
        log_success "Site public accessible"
    else
        log_warning "Site public non accessible (vérifiez la configuration DNS)"
    fi
fi

# ==================================================================================
# 16. RÉSUMÉ DE L'INSTALLATION
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
if [[ "$SKIP_SSL" != "true" ]]; then
    echo "🚀 Votre portfolio est maintenant accessible à l'adresse: https://$DOMAIN"
else
    echo "⚠️ Configurez SSL manuellement pour sécuriser votre site"
fi
"""
        
        with open('/app/install-ubuntu-24.04.02-fixed.sh', 'w') as f:
            f.write(fixed_script)
        
        os.chmod('/app/install-ubuntu-24.04.02-fixed.sh', 0o755)
        
        print("✅ Script d'installation corrigé généré: install-ubuntu-24.04.02-fixed.sh")
        
        self.suggestions.append("Utiliser le script corrigé install-ubuntu-24.04.02-fixed.sh")
    
    def generate_report(self):
        """Génère un rapport complet des problèmes identifiés"""
        print("\n" + "="*60)
        print("📊 RAPPORT D'ANALYSE - INSTALLATION UBUNTU 24.04.02")
        print("="*60)
        
        print(f"\n🔍 PROBLÈMES IDENTIFIÉS: {len(self.issues)}")
        print(f"⚠️ AVERTISSEMENTS: {len(self.warnings)}")
        print(f"💡 SUGGESTIONS: {len(self.suggestions)}")
        
        # Problèmes critiques et élevés
        if self.issues:
            print("\n🚨 PROBLÈMES CRITIQUES ET ÉLEVÉS:")
            for i, issue in enumerate(self.issues, 1):
                print(f"\n{i}. [{issue['severity'].upper()}] {issue['category']}")
                print(f"   Problème: {issue['message']}")
                if issue['fix_suggestion']:
                    print(f"   Solution: {issue['fix_suggestion']}")
        
        # Avertissements
        if self.warnings:
            print("\n⚠️ AVERTISSEMENTS:")
            for i, warning in enumerate(self.warnings, 1):
                print(f"\n{i}. [{warning['severity'].upper()}] {warning['category']}")
                print(f"   Problème: {warning['message']}")
                if warning['fix_suggestion']:
                    print(f"   Solution: {warning['fix_suggestion']}")
        
        # Suggestions principales
        if self.suggestions:
            print("\n💡 RECOMMANDATIONS PRINCIPALES:")
            for i, suggestion in enumerate(set(self.suggestions), 1):
                print(f"{i}. {suggestion}")
        
        print("\n" + "="*60)
        print("✅ ANALYSE TERMINÉE")
        print("="*60)
        
        # Sauvegarde du rapport
        report_data = {
            'issues': self.issues,
            'warnings': self.warnings,
            'suggestions': list(set(self.suggestions)),
            'summary': {
                'total_issues': len(self.issues),
                'total_warnings': len(self.warnings),
                'total_suggestions': len(self.suggestions)
            }
        }
        
        with open('/app/ubuntu-24.04-analysis-report.json', 'w') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Rapport détaillé sauvegardé: /app/ubuntu-24.04-analysis-report.json")
        
        return report_data
    
    def run_full_analysis(self):
        """Lance l'analyse complète"""
        print("🚀 DÉMARRAGE DE L'ANALYSE UBUNTU 24.04.02")
        print("="*60)
        
        # Tests des scripts
        self.test_installation_script_issues()
        self.test_validation_script_issues()
        self.test_guide_consistency()
        
        # Tests système
        self.test_prerequisites_check()
        self.test_dependencies_availability()
        self.test_port_availability()
        
        # Génération des corrections
        self.generate_fixed_installation_script()
        
        # Rapport final
        return self.generate_report()

def main():
    """Fonction principale"""
    tester = Ubuntu2404InstallationTester()
    report = tester.run_full_analysis()
    
    # Code de sortie basé sur les problèmes critiques
    critical_issues = [issue for issue in report['issues'] 
                      if issue['severity'] == 'critical']
    
    if critical_issues:
        print(f"\n❌ {len(critical_issues)} problème(s) critique(s) identifié(s)")
        sys.exit(1)
    else:
        print("\n✅ Aucun problème critique détecté")
        sys.exit(0)

if __name__ == "__main__":
    main()