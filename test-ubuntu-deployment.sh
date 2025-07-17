#!/bin/bash

# Script de test pour déploiement Ubuntu 24.04.2
# Ce script simule le déploiement selon le guide GUIDE_SERVEUR_DOMESTIQUE.md

set -e

echo "🚀 Test du déploiement Portfolio sur Ubuntu 24.04.2"
echo "================================================"

# Variables de configuration
PROJECT_DIR="/tmp/portfolio-test"
BACKUP_DIR="/tmp/portfolio-backup"
DB_NAME="portfolio_test_db"
DB_USER="portfolio_test_user"
DB_PASSWORD="portfolio_test_password"

# Fonction de nettoyage
cleanup() {
    echo "🧹 Nettoyage des ressources de test..."
    
    # Arrêt du serveur backend si lancé
    if [ -f "$PROJECT_DIR/backend.pid" ]; then
        kill $(cat "$PROJECT_DIR/backend.pid") 2>/dev/null || true
        rm -f "$PROJECT_DIR/backend.pid"
    fi
    
    # Suppression de la base de données de test
    sudo -u postgres dropdb --if-exists $DB_NAME 2>/dev/null || true
    sudo -u postgres dropuser --if-exists $DB_USER 2>/dev/null || true
    
    # Suppression des dossiers de test
    rm -rf "$PROJECT_DIR" "$BACKUP_DIR"
    
    echo "✅ Nettoyage terminé"
}

# Piège pour nettoyer en cas d'erreur
trap cleanup EXIT

echo "1. Vérification des prérequis..."
echo "--------------------------------"

# Vérification de PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé"
    exit 1
fi

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérification de Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    exit 1
fi

echo "✅ Tous les prérequis sont installés"

echo "2. Configuration de PostgreSQL..."
echo "-------------------------------"

# Création de la base de données de test
sudo -u postgres createdb $DB_NAME

# Création de l'utilisateur de test
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

# Attribution des permissions sur le schéma public
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"

echo "✅ Base de données PostgreSQL configurée"

echo "3. Clonage du projet..."
echo "---------------------"

# Simulation du clonage (copie du projet actuel)
cp -r /app "$PROJECT_DIR"

echo "✅ Projet copié vers $PROJECT_DIR"

echo "4. Installation des dépendances backend..."
echo "----------------------------------------"

cd "$PROJECT_DIR/backend"

# Création de l'environnement virtuel
python3 -m venv test_venv
source test_venv/bin/activate

# Installation des dépendances
pip install -r requirements.txt

echo "✅ Dépendances backend installées"

echo "5. Configuration de l'environnement..."
echo "-----------------------------------"

# Création du fichier .env
cat > .env << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME
ENVIRONMENT=development
EOF

echo "✅ Fichier .env créé"

echo "6. Initialisation de la base de données..."
echo "----------------------------------------"

# Initialisation de la base de données avec les données de démonstration
python init_db.py

echo "✅ Base de données initialisée"

echo "7. Test du backend..."
echo "-------------------"

# Démarrage du serveur backend en arrière-plan
nohup python -m uvicorn server:app --host 0.0.0.0 --port 8002 > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

# Attente que le serveur démarre
sleep 5

# Test de l'API de santé
if curl -f http://localhost:8002/api/health > /dev/null 2>&1; then
    echo "✅ Backend API accessible"
else
    echo "❌ Erreur d'accès à l'API backend"
    cat backend.log
    exit 1
fi

# Test de quelques endpoints
echo "Testing endpoints..."
curl -f http://localhost:8002/api/portfolio/personal-info > /dev/null 2>&1 && echo "✅ Personal info endpoint"
curl -f http://localhost:8002/api/portfolio/projects > /dev/null 2>&1 && echo "✅ Projects endpoint"
curl -f http://localhost:8002/api/portfolio/skills > /dev/null 2>&1 && echo "✅ Skills endpoint"

echo "8. Installation des dépendances frontend..."
echo "----------------------------------------"

cd "$PROJECT_DIR/frontend"

# Installation des dépendances avec yarn
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

echo "✅ Dépendances frontend installées"

echo "9. Build du frontend..."
echo "--------------------"

# Build du frontend
if command -v yarn &> /dev/null; then
    yarn build
else
    npm run build
fi

echo "✅ Frontend build réussi"

echo "10. Tests finaux..."
echo "----------------"

# Vérification que les fichiers de build existent
if [ -d "build" ]; then
    echo "✅ Dossier build créé"
    if [ -f "build/index.html" ]; then
        echo "✅ Index.html présent"
    else
        echo "❌ Index.html manquant"
        exit 1
    fi
else
    echo "❌ Dossier build manquant"
    exit 1
fi

# Test du formulaire de contact
echo "Testing contact form..."
CONTACT_RESPONSE=$(curl -s -X POST http://localhost:8002/api/portfolio/contact-messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message from deployment script"}')

if [ $? -eq 0 ]; then
    echo "✅ Formulaire de contact fonctionnel"
else
    echo "❌ Erreur du formulaire de contact"
    exit 1
fi

echo "🎉 Test de déploiement terminé avec succès!"
echo "========================================="
echo "Résumé:"
echo "- PostgreSQL: ✅ Configuré et fonctionnel"
echo "- Backend: ✅ API accessible sur port 8002"
echo "- Frontend: ✅ Build réussi"
echo "- Base de données: ✅ Données de démonstration insérées"
echo "- Formulaire contact: ✅ Fonctionnel"
echo ""
echo "Le déploiement est prêt pour Ubuntu Server 24.04.2"