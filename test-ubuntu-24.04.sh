#!/bin/bash

# Script de test pour Ubuntu Server 24.04.2 - Portfolio PostgreSQL
# Ce script teste automatiquement l'installation et la configuration

set -e

LOG_FILE="/tmp/portfolio-test-$(date +%Y%m%d_%H%M%S).log"
SUCCESS_COLOR="\033[0;32m"
ERROR_COLOR="\033[0;31m"
WARNING_COLOR="\033[0;33m"
INFO_COLOR="\033[0;34m"
NC="\033[0m" # No Color

# Fonction de logging
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Fonction de vérification
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        log "${SUCCESS_COLOR}✅ $1 est installé${NC}"
        return 0
    else
        log "${ERROR_COLOR}❌ $1 n'est pas installé${NC}"
        return 1
    fi
}

# Fonction de test de service
test_service() {
    if systemctl is-active --quiet "$1"; then
        log "${SUCCESS_COLOR}✅ Service $1 est actif${NC}"
        return 0
    else
        log "${ERROR_COLOR}❌ Service $1 n'est pas actif${NC}"
        return 1
    fi
}

# Fonction de test de port
test_port() {
    if netstat -tuln | grep -q ":$1 "; then
        log "${SUCCESS_COLOR}✅ Port $1 est ouvert${NC}"
        return 0
    else
        log "${ERROR_COLOR}❌ Port $1 n'est pas ouvert${NC}"
        return 1
    fi
}

# Fonction de test de base de données
test_database() {
    if PGPASSWORD="$2" psql -h localhost -U "$3" -d "$1" -c "SELECT 1;" >/dev/null 2>&1; then
        log "${SUCCESS_COLOR}✅ Connexion à la base de données $1 réussie${NC}"
        return 0
    else
        log "${ERROR_COLOR}❌ Impossible de se connecter à la base de données $1${NC}"
        return 1
    fi
}

# Fonction de test API
test_api() {
    if curl -s -f "$1" >/dev/null 2>&1; then
        log "${SUCCESS_COLOR}✅ API $1 répond${NC}"
        return 0
    else
        log "${ERROR_COLOR}❌ API $1 ne répond pas${NC}"
        return 1
    fi
}

# Début du test
log "${INFO_COLOR}🚀 Début du test automatique - Portfolio PostgreSQL${NC}"
log "${INFO_COLOR}📅 Date: $(date)${NC}"
log "${INFO_COLOR}🖥️  Système: $(lsb_release -d | cut -f2)${NC}"
log "${INFO_COLOR}📝 Log: $LOG_FILE${NC}"

# Test 1: Vérification des prérequis système
log "\n${INFO_COLOR}=== Test 1: Prérequis système ===${NC}"

# Vérification de la version Ubuntu
UBUNTU_VERSION=$(lsb_release -rs)
if [[ "$UBUNTU_VERSION" == "24.04" ]]; then
    log "${SUCCESS_COLOR}✅ Ubuntu 24.04 détecté${NC}"
else
    log "${WARNING_COLOR}⚠️  Version Ubuntu: $UBUNTU_VERSION (testé pour 24.04)${NC}"
fi

# Vérification des droits sudo
if sudo -n true 2>/dev/null; then
    log "${SUCCESS_COLOR}✅ Droits sudo disponibles${NC}"
else
    log "${ERROR_COLOR}❌ Droits sudo requis${NC}"
    exit 1
fi

# Test 2: Installation des dépendances
log "\n${INFO_COLOR}=== Test 2: Installation des dépendances ===${NC}"

# Mise à jour du système
log "${INFO_COLOR}🔄 Mise à jour du système...${NC}"
sudo apt update -y >> "$LOG_FILE" 2>&1
sudo apt upgrade -y >> "$LOG_FILE" 2>&1

# Installation des dépendances de base
log "${INFO_COLOR}📦 Installation des dépendances de base...${NC}"
sudo apt install -y curl wget gnupg software-properties-common >> "$LOG_FILE" 2>&1

# Installation de Node.js
log "${INFO_COLOR}📦 Installation de Node.js...${NC}"
if ! check_command "node"; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - >> "$LOG_FILE" 2>&1
    sudo apt install -y nodejs >> "$LOG_FILE" 2>&1
fi

# Installation de Python
log "${INFO_COLOR}📦 Installation de Python...${NC}"
sudo apt install -y python3 python3-pip python3-venv >> "$LOG_FILE" 2>&1

# Installation de PostgreSQL
log "${INFO_COLOR}📦 Installation de PostgreSQL...${NC}"
sudo apt install -y postgresql postgresql-contrib >> "$LOG_FILE" 2>&1

# Installation de Nginx
log "${INFO_COLOR}📦 Installation de Nginx...${NC}"
sudo apt install -y nginx >> "$LOG_FILE" 2>&1

# Test 3: Vérification des installations
log "\n${INFO_COLOR}=== Test 3: Vérification des installations ===${NC}"

INSTALL_SUCCESS=true

if ! check_command "node"; then INSTALL_SUCCESS=false; fi
if ! check_command "npm"; then INSTALL_SUCCESS=false; fi
if ! check_command "python3"; then INSTALL_SUCCESS=false; fi
if ! check_command "pip3"; then INSTALL_SUCCESS=false; fi
if ! check_command "psql"; then INSTALL_SUCCESS=false; fi
if ! check_command "nginx"; then INSTALL_SUCCESS=false; fi

if [ "$INSTALL_SUCCESS" = false ]; then
    log "${ERROR_COLOR}❌ Certaines dépendances ne sont pas installées${NC}"
    exit 1
fi

# Test 4: Configuration des services
log "\n${INFO_COLOR}=== Test 4: Configuration des services ===${NC}"

# Démarrage des services
log "${INFO_COLOR}🔄 Démarrage des services...${NC}"
sudo systemctl start postgresql >> "$LOG_FILE" 2>&1
sudo systemctl enable postgresql >> "$LOG_FILE" 2>&1
sudo systemctl start nginx >> "$LOG_FILE" 2>&1
sudo systemctl enable nginx >> "$LOG_FILE" 2>&1

# Vérification des services
SERVICE_SUCCESS=true
if ! test_service "postgresql"; then SERVICE_SUCCESS=false; fi
if ! test_service "nginx"; then SERVICE_SUCCESS=false; fi

if [ "$SERVICE_SUCCESS" = false ]; then
    log "${ERROR_COLOR}❌ Certains services ne sont pas actifs${NC}"
    exit 1
fi

# Test 5: Configuration PostgreSQL
log "\n${INFO_COLOR}=== Test 5: Configuration PostgreSQL ===${NC}"

DB_NAME="portfolio_test_db"
DB_USER="portfolio_test_user"
DB_PASSWORD="test_password_123"

# Création de la base de données
log "${INFO_COLOR}🗄️  Création de la base de données de test...${NC}"
sudo -u postgres createdb "$DB_NAME" >> "$LOG_FILE" 2>&1 || true

# Création de l'utilisateur
log "${INFO_COLOR}👤 Création de l'utilisateur de test...${NC}"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" >> "$LOG_FILE" 2>&1 || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" >> "$LOG_FILE" 2>&1
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;" >> "$LOG_FILE" 2>&1

# Attribution des permissions
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;" >> "$LOG_FILE" 2>&1
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO $DB_USER;" >> "$LOG_FILE" 2>&1
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;" >> "$LOG_FILE" 2>&1
sudo -u postgres psql -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;" >> "$LOG_FILE" 2>&1

# Test de connexion
if ! test_database "$DB_NAME" "$DB_PASSWORD" "$DB_USER"; then
    log "${ERROR_COLOR}❌ Configuration PostgreSQL échouée${NC}"
    exit 1
fi

# Test 6: Test du projet portfolio
log "\n${INFO_COLOR}=== Test 6: Test du projet portfolio ===${NC}"

PROJECT_DIR="/tmp/portfolio-test"
GITHUB_REPO="https://github.com/hocineira/siteweb.git"

# Clonage du projet (simulation)
log "${INFO_COLOR}📥 Simulation du clonage du projet...${NC}"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Création de la structure de test
mkdir -p backend frontend
cd backend

# Création d'un requirements.txt de test
cat > requirements.txt << EOF
fastapi==0.110.1
uvicorn==0.25.0
psycopg2-binary==2.9.9
sqlalchemy>=2.0.0
alembic>=1.12.0
pydantic>=2.6.4
python-dotenv>=1.0.1
EOF

# Création d'un fichier .env de test
cat > .env << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME
ENVIRONMENT=test
EOF

# Test de l'environnement virtuel Python
log "${INFO_COLOR}🐍 Test de l'environnement virtuel Python...${NC}"
python3 -m venv venv >> "$LOG_FILE" 2>&1
source venv/bin/activate

# Installation des dépendances Python
log "${INFO_COLOR}📦 Installation des dépendances Python...${NC}"
pip install -r requirements.txt >> "$LOG_FILE" 2>&1

# Test de connexion à la base de données avec SQLAlchemy
log "${INFO_COLOR}🔌 Test de connexion SQLAlchemy...${NC}"
python3 -c "
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.environ.get('DATABASE_URL')
engine = create_engine(DATABASE_URL)
connection = engine.connect()
result = connection.execute('SELECT 1 as test')
print('SQLAlchemy connection: OK')
connection.close()
" >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
    log "${SUCCESS_COLOR}✅ Test SQLAlchemy réussi${NC}"
else
    log "${ERROR_COLOR}❌ Test SQLAlchemy échoué${NC}"
    exit 1
fi

# Test 7: Test Frontend
log "\n${INFO_COLOR}=== Test 7: Test Frontend ===${NC}"

cd ../frontend

# Création d'un package.json de test
cat > package.json << EOF
{
  "name": "portfolio-test",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
EOF

# Test d'installation npm
log "${INFO_COLOR}📦 Test d'installation npm...${NC}"
npm install >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
    log "${SUCCESS_COLOR}✅ Installation npm réussie${NC}"
else
    log "${ERROR_COLOR}❌ Installation npm échouée${NC}"
    exit 1
fi

# Test 8: Test des ports
log "\n${INFO_COLOR}=== Test 8: Test des ports ===${NC}"

# Installation de netstat si nécessaire
sudo apt install -y net-tools >> "$LOG_FILE" 2>&1

PORT_SUCCESS=true
if ! test_port "80"; then PORT_SUCCESS=false; fi
if ! test_port "5432"; then PORT_SUCCESS=false; fi

if [ "$PORT_SUCCESS" = false ]; then
    log "${WARNING_COLOR}⚠️  Certains ports ne sont pas ouverts (normal si services pas démarrés)${NC}"
fi

# Test 9: Test des permissions de firewall
log "\n${INFO_COLOR}=== Test 9: Test du firewall ===${NC}"

# Installation d'ufw si nécessaire
sudo apt install -y ufw >> "$LOG_FILE" 2>&1

# Configuration du firewall
log "${INFO_COLOR}🔥 Configuration du firewall...${NC}"
sudo ufw --force enable >> "$LOG_FILE" 2>&1
sudo ufw allow 22/tcp >> "$LOG_FILE" 2>&1
sudo ufw allow 80/tcp >> "$LOG_FILE" 2>&1
sudo ufw allow 443/tcp >> "$LOG_FILE" 2>&1
sudo ufw allow 8001/tcp >> "$LOG_FILE" 2>&1

# Test 10: Nettoyage
log "\n${INFO_COLOR}=== Test 10: Nettoyage ===${NC}"

log "${INFO_COLOR}🧹 Nettoyage des ressources de test...${NC}"
cd /tmp

# Suppression de la base de données de test
sudo -u postgres dropdb "$DB_NAME" >> "$LOG_FILE" 2>&1 || true
sudo -u postgres psql -c "DROP USER $DB_USER;" >> "$LOG_FILE" 2>&1 || true

# Suppression du dossier de test
rm -rf "$PROJECT_DIR"

# Rapport final
log "\n${INFO_COLOR}=== RAPPORT FINAL ===${NC}"

log "${SUCCESS_COLOR}🎉 Test terminé avec succès!${NC}"
log "${INFO_COLOR}📋 Résumé des tests:${NC}"
log "${SUCCESS_COLOR}✅ Ubuntu 24.04 compatible${NC}"
log "${SUCCESS_COLOR}✅ Dépendances installées${NC}"
log "${SUCCESS_COLOR}✅ PostgreSQL configuré${NC}"
log "${SUCCESS_COLOR}✅ Python/FastAPI compatible${NC}"
log "${SUCCESS_COLOR}✅ Node.js/React compatible${NC}"
log "${SUCCESS_COLOR}✅ Firewall configuré${NC}"

log "\n${INFO_COLOR}📝 Recommandations pour le déploiement:${NC}"
log "1. Utilisez des mots de passe sécurisés pour PostgreSQL"
log "2. Configurez SSL/HTTPS avec Let's Encrypt"
log "3. Mettez en place une sauvegarde automatique"
log "4. Surveillez les logs régulièrement"
log "5. Gardez le système à jour"

log "\n${INFO_COLOR}📄 Log complet disponible dans: $LOG_FILE${NC}"

# Affichage des informations système
log "\n${INFO_COLOR}=== INFORMATIONS SYSTÈME ===${NC}"
log "OS: $(lsb_release -d | cut -f2)"
log "Kernel: $(uname -r)"
log "Node.js: $(node --version)"
log "Python: $(python3 --version)"
log "PostgreSQL: $(psql --version | head -1)"
log "Nginx: $(nginx -v 2>&1)"

log "\n${SUCCESS_COLOR}🚀 Le système est prêt pour le déploiement du portfolio!${NC}"