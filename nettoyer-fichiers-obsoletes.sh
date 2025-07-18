#!/bin/bash

# ==================================================================================
# SCRIPT DE NETTOYAGE - GUIDES ET SCRIPTS OBSOLÈTES
# Supprime les anciens guides d'installation qui ne fonctionnent pas
# ==================================================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Créer un répertoire de sauvegarde
BACKUP_DIR="/tmp/portfolio_obsolete_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

log_info "🧹 NETTOYAGE DES FICHIERS OBSOLÈTES - PORTFOLIO UBUNTU 24.04"
log_info "Sauvegarde dans : $BACKUP_DIR"

# Liste des fichiers obsolètes à supprimer
OBSOLETE_FILES=(
    "install-ubuntu-24.04.02.sh"
    "install-ubuntu-24.04.02-fixed.sh"
    "install-portfolio-v2-ubuntu-24.04.sh"
    "fix-ubuntu-24.04-installation.sh"
    "GUIDE-INSTALLATION-PORTFOLIO-V2-UBUNTU-24.04.md"
    "GUIDE-INSTALLATION-UBUNTU-24.04-CORRIGE.md"
    "GUIDE-UBUNTU-24.04.02.md"
    "GUIDE_BUILDER_WEB.md"
    "GUIDE_HEBERGEMENT_LWS.md"
    "GUIDE_SERVEUR_DOMESTIQUE.md"
    "README_GUIDES.md"
    "test-installation-ubuntu-24.04.sh"
    "test-ubuntu-24.04.sh"
    "test-ubuntu-24.04-installation.py"
    "test-ubuntu-24.02.sh"
    "test-ubuntu-deployment.sh"
    "validate-ubuntu-24.04.02.sh"
    "validate-ubuntu-24.04-complete.sh"
    "validate-ubuntu-24.02.sh"
    "validate-portfolio-v2-ubuntu-24.04.sh"
    "validate-final-ubuntu-24.04.sh"
    "validate-current-config.sh"
    "RAPPORT-ANALYSE-UBUNTU-24.04.02.md"
    "RESUME-FINAL-UBUNTU-24.04.02.md"
    "RESUME-REFONTE-PORTFOLIO-V2.md"
    "RECAPITULATIF-CORRECTIONS.md"
    "ubuntu-24.04-analysis-report.json"
    "mariadb_test.py"
    "mariadb_migration_test.py"
    "mariadb_comprehensive_test.py"
    "portfolio_data_test.py"
    "quick_validation_test.py"
    "backend_test.py"
    "migrate_personal_data.py"
    "monitor_mariadb.py"
    "fix-containerized-environment.sh"
    "configure_mariadb.sh"
    "demo-procedures.sh"
    "update-portfolio.sh"
    "portfolio-helper.sh"
    "prepare-deploy.sh"
    "backup_portfolio.sh"
    "templates-contenu.js"
)

log_info "📦 Sauvegarde des fichiers obsolètes..."

# Compteurs
MOVED_COUNT=0
MISSING_COUNT=0

for file in "${OBSOLETE_FILES[@]}"; do
    if [ -f "/app/$file" ]; then
        mv "/app/$file" "$BACKUP_DIR/"
        log_success "✅ Sauvegardé : $file"
        MOVED_COUNT=$((MOVED_COUNT + 1))
    else
        log_warning "⚠️ Fichier non trouvé : $file"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    fi
done

log_info "🗄️ Nettoyage du répertoire backups..."
if [ -d "/app/backups" ]; then
    mv "/app/backups" "$BACKUP_DIR/"
    log_success "✅ Répertoire backups sauvegardé"
    MOVED_COUNT=$((MOVED_COUNT + 1))
fi

log_info "📋 Création du fichier de référence..."
cat > "/app/FICHIERS_OBSOLETES_SUPPRIMES.md" << EOF
# 🗑️ Fichiers Obsolètes Supprimés

## Date de nettoyage
$(date '+%Y-%m-%d %H:%M:%S')

## Raison
Remplacement par la nouvelle procédure d'installation manuelle testée et validée :
- **INSTALLATION-MANUELLE-UBUNTU-24.04.md** : Guide d'installation complet
- **test-installation-manuelle.sh** : Script de validation

## Sauvegarde
Les fichiers supprimés ont été sauvegardés dans :
\`$BACKUP_DIR\`

## Fichiers supprimés ($MOVED_COUNT fichiers)
EOF

for file in "${OBSOLETE_FILES[@]}"; do
    if [ -f "$BACKUP_DIR/$file" ]; then
        echo "- $file" >> "/app/FICHIERS_OBSOLETES_SUPPRIMES.md"
    fi
done

cat >> "/app/FICHIERS_OBSOLETES_SUPPRIMES.md" << EOF

## Fichiers conservés
- **INSTALLATION-MANUELLE-UBUNTU-24.04.md** : Nouvelle procédure d'installation
- **test-installation-manuelle.sh** : Script de test de l'installation
- **test_result.md** : Historique des tests
- **validate-deployment.sh** : Script de validation de déploiement
- **SECURITY_REPORT.md** : Rapport de sécurité
- **README.md** : Documentation principale

## Recommandations
1. Utilisez uniquement **INSTALLATION-MANUELLE-UBUNTU-24.04.md** pour les nouvelles installations
2. Testez avec **test-installation-manuelle.sh** après installation
3. Les anciens guides contenaient des erreurs et des configurations obsolètes
4. Cette nouvelle procédure a été testée et validée sur Ubuntu Server 24.04

## Support
En cas de problème avec la nouvelle procédure, consultez :
- Le fichier de logs : \`/var/log/supervisor/portfolio-*.log\`
- Le guide de dépannage dans **INSTALLATION-MANUELLE-UBUNTU-24.04.md**
EOF

log_info "📊 RÉSUMÉ DU NETTOYAGE"
echo ""
echo "=================================================="
echo "🧹 NETTOYAGE TERMINÉ"
echo "=================================================="
echo ""
echo "📊 Statistiques :"
echo "  • Fichiers sauvegardés : $MOVED_COUNT"
echo "  • Fichiers non trouvés : $MISSING_COUNT"
echo "  • Total traités       : $((MOVED_COUNT + MISSING_COUNT))"
echo ""
echo "📁 Sauvegarde :"
echo "  • Répertoire : $BACKUP_DIR"
echo "  • Taille     : $(du -sh $BACKUP_DIR | cut -f1)"
echo ""
echo "📋 Fichiers actuels :"
echo "  • Guide principal : INSTALLATION-MANUELLE-UBUNTU-24.04.md"
echo "  • Script de test  : test-installation-manuelle.sh"
echo "  • Documentation   : FICHIERS_OBSOLETES_SUPPRIMES.md"
echo ""
log_success "✅ Nettoyage terminé ! Utilisez uniquement la nouvelle procédure."