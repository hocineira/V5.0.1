#!/bin/bash

# ==================================================================================
# SCRIPT DE MISE À JOUR AUTOMATIQUE DU PORTFOLIO
# Synchronisation avec le repository V3 de Hocine IRATNI
# Ubuntu Server 24.04.02 - Version MariaDB
# ==================================================================================

set -e

# Configuration
PORTFOLIO_USER="portfolio"
PORTFOLIO_DIR="/home/$PORTFOLIO_USER/portfolio"
BACKUP_DIR="/home/$PORTFOLIO_USER/backups"
REPO_URL="https://github.com/hocineira/V3.git"
DB_NAME="portfolio_db"
DB_USER="portfolio_user"
DB_PASSWORD="portfolio_password"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Fonction pour créer une sauvegarde
create_backup() {
    local backup_timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_path="$BACKUP_DIR/backup_$backup_timestamp"
    
    log_info "Création de la sauvegarde..."
    
    # Créer le répertoire de sauvegarde
    sudo -u $PORTFOLIO_USER mkdir -p "$backup_path"
    
    # Sauvegarder la base de données
    mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > "$backup_path/database.sql"
    
    # Sauvegarder les fichiers de configuration
    sudo -u $PORTFOLIO_USER cp -r "$PORTFOLIO_DIR/backend/.env" "$backup_path/" 2>/dev/null || true
    sudo -u $PORTFOLIO_USER cp -r "$PORTFOLIO_DIR/frontend/.env" "$backup_path/" 2>/dev/null || true
    
    log_success "Sauvegarde créée : $backup_path"
    echo "$backup_path"
}

# Fonction pour restaurer une sauvegarde
restore_backup() {
    local backup_path="$1"
    
    if [ -z "$backup_path" ] || [ ! -d "$backup_path" ]; then
        log_error "Chemin de sauvegarde invalide"
        return 1
    fi
    
    log_warning "Restauration de la sauvegarde : $backup_path"
    
    # Restaurer la base de données
    if [ -f "$backup_path/database.sql" ]; then
        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < "$backup_path/database.sql"
        log_success "Base de données restaurée"
    fi
    
    # Restaurer les fichiers de configuration
    if [ -f "$backup_path/.env" ]; then
        sudo -u $PORTFOLIO_USER cp "$backup_path/.env" "$PORTFOLIO_DIR/backend/"
        sudo -u $PORTFOLIO_USER cp "$backup_path/.env" "$PORTFOLIO_DIR/frontend/" 2>/dev/null || true
        log_success "Configuration restaurée"
    fi
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier que l'utilisateur existe
    if ! id "$PORTFOLIO_USER" &>/dev/null; then
        log_error "Utilisateur $PORTFOLIO_USER non trouvé"
        return 1
    fi
    
    # Vérifier que le répertoire existe
    if [ ! -d "$PORTFOLIO_DIR" ]; then
        log_error "Répertoire $PORTFOLIO_DIR non trouvé"
        return 1
    fi
    
    # Vérifier que git est installé
    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé"
        return 1
    fi
    
    log_success "Prérequis validés"
}

# Fonction pour mettre à jour le code
update_code() {
    log_info "Mise à jour du code depuis GitHub..."
    
    cd "$PORTFOLIO_DIR"
    
    # Vérifier les modifications locales
    if sudo -u $PORTFOLIO_USER git status --porcelain | grep -q .; then
        log_warning "Modifications locales détectées, création d'un stash..."
        sudo -u $PORTFOLIO_USER git stash push -m "Auto-stash before update $(date)"
    fi
    
    # Récupérer les dernières modifications
    sudo -u $PORTFOLIO_USER git fetch origin
    
    # Obtenir le hash du commit actuel
    local current_hash=$(sudo -u $PORTFOLIO_USER git rev-parse HEAD)
    
    # Obtenir le hash du dernier commit sur origin/main
    local latest_hash=$(sudo -u $PORTFOLIO_USER git rev-parse origin/main)
    
    if [ "$current_hash" = "$latest_hash" ]; then
        log_info "Code déjà à jour"
        return 0
    fi
    
    # Effectuer la mise à jour
    sudo -u $PORTFOLIO_USER git reset --hard origin/main
    
    log_success "Code mis à jour (${current_hash:0:7} -> ${latest_hash:0:7})"
    
    # Vérifier s'il y a des changements dans les dépendances
    if sudo -u $PORTFOLIO_USER git diff --name-only $current_hash $latest_hash | grep -q -E "(requirements\.txt|package\.json|yarn\.lock)"; then
        log_warning "Changements détectés dans les dépendances"
        return 1
    fi
    
    return 0
}

# Fonction pour mettre à jour les dépendances backend
update_backend_dependencies() {
    log_info "Mise à jour des dépendances backend..."
    
    cd "$PORTFOLIO_DIR/backend"
    
    # Vérifier si l'environnement virtuel existe
    if [ ! -d "venv" ]; then
        log_info "Création de l'environnement virtuel..."
        sudo -u $PORTFOLIO_USER python3 -m venv venv
    fi
    
    # Mettre à jour pip
    sudo -u $PORTFOLIO_USER ./venv/bin/pip install --upgrade pip
    
    # Installer les dépendances
    sudo -u $PORTFOLIO_USER ./venv/bin/pip install -r requirements.txt
    
    log_success "Dépendances backend mises à jour"
}

# Fonction pour mettre à jour les dépendances frontend
update_frontend_dependencies() {
    log_info "Mise à jour des dépendances frontend..."
    
    cd "$PORTFOLIO_DIR/frontend"
    
    # Installer les dépendances
    sudo -u $PORTFOLIO_USER yarn install
    
    # Construire le projet
    sudo -u $PORTFOLIO_USER yarn build
    
    log_success "Dépendances frontend mises à jour"
}

# Fonction pour mettre à jour les données
update_data() {
    log_info "Mise à jour des données personnelles..."
    
    cd "$PORTFOLIO_DIR/backend"
    
    # Exécuter le script de mise à jour des données
    if [ -f "update_portfolio_data.py" ]; then
        sudo -u $PORTFOLIO_USER ./venv/bin/python update_portfolio_data.py
        log_success "Données personnelles mises à jour"
    else
        log_warning "Script de mise à jour des données non trouvé"
    fi
}

# Fonction pour redémarrer les services
restart_services() {
    log_info "Redémarrage des services..."
    
    # Redémarrer les services supervisés
    supervisorctl restart portfolio-backend
    supervisorctl restart portfolio-frontend
    
    # Vérifier que les services sont actifs
    sleep 5
    
    if supervisorctl status portfolio-backend | grep -q RUNNING; then
        log_success "Service backend redémarré"
    else
        log_error "Échec du redémarrage du backend"
        return 1
    fi
    
    if supervisorctl status portfolio-frontend | grep -q RUNNING; then
        log_success "Service frontend redémarré"
    else
        log_error "Échec du redémarrage du frontend"
        return 1
    fi
    
    # Redémarrer nginx
    systemctl restart nginx
    log_success "Nginx redémarré"
}

# Fonction pour tester l'application
test_application() {
    log_info "Test de l'application..."
    
    # Attendre que les services soient prêts
    sleep 10
    
    # Tester le backend
    if curl -s http://localhost:8001/api/health > /dev/null; then
        log_success "Backend opérationnel"
    else
        log_error "Backend non accessible"
        return 1
    fi
    
    # Tester le frontend
    if curl -s http://localhost:3000 > /dev/null; then
        log_success "Frontend opérationnel"
    else
        log_error "Frontend non accessible"
        return 1
    fi
    
    # Tester l'API des données personnelles
    if curl -s http://localhost:8001/api/portfolio/personal-info | grep -q "Hocine IRATNI"; then
        log_success "Données personnelles accessibles"
    else
        log_error "Données personnelles non accessibles"
        return 1
    fi
    
    log_success "Application testée avec succès"
}

# Fonction pour nettoyer les anciennes sauvegardes
cleanup_backups() {
    log_info "Nettoyage des anciennes sauvegardes..."
    
    # Garder seulement les 5 dernières sauvegardes
    if [ -d "$BACKUP_DIR" ]; then
        sudo -u $PORTFOLIO_USER find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup_*" | sort -r | tail -n +6 | xargs -r rm -rf
        log_success "Anciennes sauvegardes nettoyées"
    fi
}

# Fonction principale
main() {
    log_info "🚀 Démarrage de la mise à jour du portfolio Hocine IRATNI"
    
    # Vérifier les prérequis
    check_prerequisites
    
    # Créer une sauvegarde
    backup_path=$(create_backup)
    
    # Mettre à jour le code
    if update_code; then
        dependencies_changed=$?
    else
        dependencies_changed=1
    fi
    
    # Mettre à jour les dépendances si nécessaire
    if [ $dependencies_changed -eq 1 ]; then
        update_backend_dependencies
        update_frontend_dependencies
    fi
    
    # Mettre à jour les données
    update_data
    
    # Redémarrer les services
    if restart_services; then
        log_success "Services redémarrés avec succès"
    else
        log_error "Échec du redémarrage des services"
        log_warning "Restauration de la sauvegarde..."
        restore_backup "$backup_path"
        restart_services
        log_error "Mise à jour annulée, système restauré"
        exit 1
    fi
    
    # Tester l'application
    if test_application; then
        log_success "Application testée avec succès"
    else
        log_error "Tests d'application échoués"
        log_warning "Restauration de la sauvegarde..."
        restore_backup "$backup_path"
        restart_services
        log_error "Mise à jour annulée, système restauré"
        exit 1
    fi
    
    # Nettoyer les anciennes sauvegardes
    cleanup_backups
    
    log_success "✅ Mise à jour terminée avec succès!"
    log_info "📊 Portfolio Hocine IRATNI mis à jour et opérationnel"
}

# Fonction d'aide
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Afficher cette aide"
    echo "  -b, --backup   Créer seulement une sauvegarde"
    echo "  -c, --code     Mettre à jour seulement le code"
    echo "  -d, --data     Mettre à jour seulement les données"
    echo "  -t, --test     Tester seulement l'application"
    echo "  -r, --restore  Restaurer une sauvegarde"
    echo ""
    echo "Exemples:"
    echo "  $0                    # Mise à jour complète"
    echo "  $0 --backup          # Créer une sauvegarde"
    echo "  $0 --code            # Mettre à jour le code uniquement"
    echo "  $0 --test            # Tester l'application"
    echo "  $0 --restore /path   # Restaurer une sauvegarde"
}

# Gestion des arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -b|--backup)
        create_backup
        exit 0
        ;;
    -c|--code)
        check_prerequisites
        update_code
        exit 0
        ;;
    -d|--data)
        check_prerequisites
        update_data
        exit 0
        ;;
    -t|--test)
        test_application
        exit 0
        ;;
    -r|--restore)
        if [ -z "$2" ]; then
            log_error "Chemin de sauvegarde requis"
            exit 1
        fi
        restore_backup "$2"
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "Option inconnue: $1"
        show_help
        exit 1
        ;;
esac