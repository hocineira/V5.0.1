#!/bin/bash

# Script d'aide pour le développement du portfolio
# Utilisation: ./portfolio-helper.sh [commande]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions d'aide
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "=================================="
    echo "$1"
    echo "=================================="
    echo -e "${NC}"
}

# Fonction pour vérifier les dépendances
check_dependencies() {
    print_header "Vérification des dépendances"
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        echo "Veuillez installer Node.js depuis https://nodejs.org/"
        exit 1
    fi
    print_success "Node.js $(node --version) détecté"
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    print_success "npm $(npm --version) détecté"
    
    # Vérifier Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 n'est pas installé"
        exit 1
    fi
    print_success "Python $(python3 --version) détecté"
    
    # Vérifier pip
    if ! command -v pip3 &> /dev/null; then
        print_error "pip3 n'est pas installé"
        exit 1
    fi
    print_success "pip3 détecté"
    
    # Vérifier PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL n'est pas installé ou pas dans le PATH"
        return 1
    else
        print_success "PostgreSQL détecté"
    fi
}

# Fonction d'installation
install_dependencies() {
    print_header "Installation des dépendances"
    
    # Installation des dépendances frontend
    print_info "Installation des dépendances frontend..."
    cd "$PROJECT_DIR/frontend"
    npm install
    print_success "Dépendances frontend installées"
    
    # Installation des dépendances backend
    print_info "Installation des dépendances backend..."
    cd "$PROJECT_DIR/backend"
    pip3 install -r requirements.txt
    print_success "Dépendances backend installées"
    
    cd "$PROJECT_DIR"
    print_success "Toutes les dépendances sont installées"
}

# Fonction pour démarrer le développement
start_dev() {
    print_header "Démarrage du serveur de développement"
    
    # Créer des fichiers .env s'ils n'existent pas
    if [ ! -f "$PROJECT_DIR/frontend/.env" ]; then
        print_info "Création du fichier .env frontend..."
        cat > "$PROJECT_DIR/frontend/.env" << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF
        print_success "Fichier .env frontend créé"
    fi
    
    if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
        print_info "Création du fichier .env backend..."
        cat > "$PROJECT_DIR/backend/.env" << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
EOF
        print_success "Fichier .env backend créé"
    fi
    
    # Démarrer MongoDB (si disponible)
    if command -v mongod &> /dev/null; then
        print_info "Démarrage de MongoDB..."
        if pgrep mongod > /dev/null; then
            print_success "MongoDB est déjà en cours d'exécution"
        else
            # Démarrer MongoDB en arrière-plan
            mongod --fork --logpath /tmp/mongodb.log --dbpath /tmp/mongodb_data 2>/dev/null || true
            print_success "MongoDB démarré"
        fi
    fi
    
    print_info "Démarrage des serveurs..."
    print_warning "Ouvrez deux terminaux supplémentaires et exécutez:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "cd $PROJECT_DIR/backend && python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "cd $PROJECT_DIR/frontend && npm start"
    echo ""
    print_info "Votre site sera disponible sur http://localhost:3000"
    print_info "L'API sera disponible sur http://localhost:8001"
}

# Fonction pour construire le projet
build_project() {
    print_header "Construction du projet pour la production"
    
    # Build frontend
    print_info "Construction du frontend..."
    cd "$PROJECT_DIR/frontend"
    npm run build
    print_success "Frontend construit avec succès"
    
    cd "$PROJECT_DIR"
    print_success "Projet construit dans frontend/build/"
    print_info "Vous pouvez maintenant déployer le contenu de frontend/build/ sur votre serveur web"
}

# Fonction pour nettoyer le projet
clean_project() {
    print_header "Nettoyage du projet"
    
    # Nettoyer les node_modules
    if [ -d "$PROJECT_DIR/frontend/node_modules" ]; then
        print_info "Suppression des node_modules..."
        rm -rf "$PROJECT_DIR/frontend/node_modules"
        print_success "node_modules supprimé"
    fi
    
    # Nettoyer les fichiers de build
    if [ -d "$PROJECT_DIR/frontend/build" ]; then
        print_info "Suppression du dossier build..."
        rm -rf "$PROJECT_DIR/frontend/build"
        print_success "Dossier build supprimé"
    fi
    
    # Nettoyer les caches Python
    find "$PROJECT_DIR" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    print_success "Caches Python nettoyés"
    
    print_success "Projet nettoyé"
}

# Fonction pour créer une sauvegarde
backup_project() {
    print_header "Création d'une sauvegarde"
    
    BACKUP_DIR="$PROJECT_DIR/backups"
    BACKUP_NAME="portfolio_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    mkdir -p "$BACKUP_DIR"
    
    print_info "Création de la sauvegarde..."
    tar -czf "$BACKUP_DIR/$BACKUP_NAME" \
        --exclude="node_modules" \
        --exclude="build" \
        --exclude="__pycache__" \
        --exclude="*.log" \
        --exclude="backups" \
        "$PROJECT_DIR"
    
    print_success "Sauvegarde créée: $BACKUP_DIR/$BACKUP_NAME"
}

# Fonction pour afficher l'aide
show_help() {
    echo "Portfolio Helper - Script d'aide pour le développement"
    echo ""
    echo "Usage: ./portfolio-helper.sh [commande]"
    echo ""
    echo "Commandes disponibles:"
    echo "  check       Vérifier les dépendances système"
    echo "  install     Installer les dépendances du projet"
    echo "  start       Démarrer le serveur de développement"
    echo "  build       Construire le projet pour la production"
    echo "  clean       Nettoyer les fichiers temporaires"
    echo "  backup      Créer une sauvegarde du projet"
    echo "  help        Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  ./portfolio-helper.sh check"
    echo "  ./portfolio-helper.sh install"
    echo "  ./portfolio-helper.sh start"
}

# Script principal
main() {
    case "${1:-help}" in
        check)
            check_dependencies
            ;;
        install)
            check_dependencies
            install_dependencies
            ;;
        start)
            start_dev
            ;;
        build)
            build_project
            ;;
        clean)
            clean_project
            ;;
        backup)
            backup_project
            ;;
        help|*)
            show_help
            ;;
    esac
}

# Exécuter le script principal
main "$@"