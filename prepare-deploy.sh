#!/bin/bash

# ==================================================================================
# SCRIPT DE FINALISATION - PORTFOLIO HOCINE IRATNI
# Préparation des scripts pour Ubuntu Server 24.04.02
# ==================================================================================

set -e

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

# Configuration
SCRIPTS_DIR="/app"
DEPLOY_DIR="/tmp/portfolio-deploy"

log_info "🎯 Préparation des scripts pour le déploiement Ubuntu Server 24.04.02"

# Créer le répertoire de déploiement
mkdir -p "$DEPLOY_DIR"

# Copier tous les scripts de déploiement
log_info "📋 Copie des scripts de déploiement..."

# Script principal d'installation
cp "$SCRIPTS_DIR/install-ubuntu-24.04.02.sh" "$DEPLOY_DIR/"
chmod +x "$DEPLOY_DIR/install-ubuntu-24.04.02.sh"

# Script de validation
cp "$SCRIPTS_DIR/validate-ubuntu-24.04.02.sh" "$DEPLOY_DIR/"
chmod +x "$DEPLOY_DIR/validate-ubuntu-24.04.02.sh"

# Script de mise à jour
cp "$SCRIPTS_DIR/update-portfolio.sh" "$DEPLOY_DIR/"
chmod +x "$DEPLOY_DIR/update-portfolio.sh"

# Guide d'utilisation
cp "$SCRIPTS_DIR/GUIDE-UBUNTU-24.04.02.md" "$DEPLOY_DIR/"

# Script de migration des données
cp "$SCRIPTS_DIR/migrate_personal_data.py" "$DEPLOY_DIR/"

log_success "Scripts copiés dans $DEPLOY_DIR"

# Créer un script de lancement rapide
cat > "$DEPLOY_DIR/deploy-portfolio.sh" << 'EOF'
#!/bin/bash

# ==================================================================================
# DÉPLOIEMENT RAPIDE - PORTFOLIO HOCINE IRATNI
# Ubuntu Server 24.04.02 - Version MariaDB
# ==================================================================================

set -e

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

# Fonction pour demander le domaine
ask_domain() {
    echo ""
    log_info "🌐 Configuration du domaine"
    echo "Veuillez entrer votre nom de domaine (ex: iratnihocine.fr)"
    echo "Assurez-vous que les DNS pointent vers ce serveur"
    echo ""
    read -p "Nom de domaine: " DOMAIN
    
    if [ -z "$DOMAIN" ]; then
        log_error "Nom de domaine requis"
        exit 1
    fi
    
    log_info "Domaine configuré: $DOMAIN"
}

# Fonction pour vérifier les prérequis
check_system() {
    log_info "🔍 Vérification du système..."
    
    # Vérifier Ubuntu version
    if ! lsb_release -rs | grep -q "24.04"; then
        log_error "Ubuntu 24.04 requis"
        exit 1
    fi
    
    # Vérifier les privilèges
    if [ "$EUID" -ne 0 ]; then
        log_error "Ce script doit être exécuté avec sudo"
        exit 1
    fi
    
    # Vérifier la connexion internet
    if ! ping -c 1 google.com > /dev/null 2>&1; then
        log_error "Connexion internet requise"
        exit 1
    fi
    
    log_success "Système vérifié"
}

# Fonction principale
main() {
    echo ""
    echo "==========================================="
    echo "🚀 DÉPLOIEMENT PORTFOLIO HOCINE IRATNI"
    echo "==========================================="
    echo ""
    echo "Ce script va installer complètement le"
    echo "portfolio sur Ubuntu Server 24.04.02 avec:"
    echo ""
    echo "• MariaDB"
    echo "• Nginx + SSL"
    echo "• Node.js + React"
    echo "• Python + FastAPI"
    echo "• Supervisor"
    echo "• Toutes les données personnelles"
    echo ""
    
    # Demander confirmation
    read -p "Continuer? (y/N): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warning "Installation annulée"
        exit 0
    fi
    
    # Vérifier le système
    check_system
    
    # Demander le domaine
    ask_domain
    
    # Modifier le script d'installation avec le domaine
    sed -i "s/DOMAIN=\".*\"/DOMAIN=\"$DOMAIN\"/" install-ubuntu-24.04.02.sh
    sed -i "s/DOMAIN=\".*\"/DOMAIN=\"$DOMAIN\"/" validate-ubuntu-24.04.02.sh
    
    # Lancer l'installation
    log_info "🚀 Démarrage de l'installation complète..."
    ./install-ubuntu-24.04.02.sh
    
    # Lancer la validation
    log_info "🧪 Validation de l'installation..."
    sleep 5
    ./validate-ubuntu-24.04.02.sh
    
    # Résumé final
    echo ""
    echo "========================================="
    echo "🎉 DÉPLOIEMENT TERMINÉ !"
    echo "========================================="
    echo ""
    echo "✅ Portfolio Hocine IRATNI déployé avec succès"
    echo "🌐 Site accessible: https://$DOMAIN"
    echo ""
    echo "📋 Commandes utiles:"
    echo "  portfolio-manage status   - Vérifier les services"
    echo "  portfolio-manage logs     - Voir les logs"
    echo "  portfolio-manage restart  - Redémarrer"
    echo "  ./update-portfolio.sh     - Mettre à jour"
    echo ""
    echo "📁 Fichiers importants:"
    echo "  /home/portfolio/portfolio - Code source"
    echo "  /var/log/supervisor/      - Logs services"
    echo "  /etc/nginx/sites-enabled/ - Config Nginx"
    echo ""
    echo "🛠️  En cas de problème:"
    echo "  1. Vérifiez les logs: portfolio-manage logs"
    echo "  2. Consultez le guide: GUIDE-UBUNTU-24.04.02.md"
    echo "  3. Relancez la validation: ./validate-ubuntu-24.04.02.sh"
    echo ""
    log_success "Installation terminée avec succès!"
}

# Afficher l'aide
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Afficher cette aide"
    echo "  -d, --domain   Spécifier le domaine directement"
    echo ""
    echo "Exemple:"
    echo "  $0 --domain iratnihocine.fr"
}

# Gestion des arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -d|--domain)
        if [ -z "$2" ]; then
            log_error "Domaine requis"
            exit 1
        fi
        DOMAIN="$2"
        check_system
        sed -i "s/DOMAIN=\".*\"/DOMAIN=\"$DOMAIN\"/" install-ubuntu-24.04.02.sh
        sed -i "s/DOMAIN=\".*\"/DOMAIN=\"$DOMAIN\"/" validate-ubuntu-24.04.02.sh
        ./install-ubuntu-24.04.02.sh
        ./validate-ubuntu-24.04.02.sh
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
EOF

chmod +x "$DEPLOY_DIR/deploy-portfolio.sh"

# Créer un README pour le déploiement
cat > "$DEPLOY_DIR/README.md" << 'EOF'
# Déploiement Portfolio Hocine IRATNI - Ubuntu Server 24.04.02

## 🚀 Installation rapide

```bash
# 1. Télécharger les scripts
wget -O portfolio-deploy.tar.gz https://github.com/hocineira/V3/archive/main.tar.gz
tar -xzf portfolio-deploy.tar.gz
cd V3-main

# 2. Lancer l'installation
sudo ./deploy-portfolio.sh
```

## 📋 Fichiers inclus

- `deploy-portfolio.sh` - Script de déploiement rapide
- `install-ubuntu-24.04.02.sh` - Installation complète
- `validate-ubuntu-24.04.02.sh` - Validation post-installation
- `update-portfolio.sh` - Mise à jour automatique
- `GUIDE-UBUNTU-24.04.02.md` - Guide complet
- `migrate_personal_data.py` - Migration des données

## 🔧 Configuration requise

- Ubuntu Server 24.04.02 LTS
- 2GB RAM minimum
- 20GB disque minimum
- Nom de domaine configuré
- Accès root/sudo

## 📞 Support

Consultez le guide complet dans `GUIDE-UBUNTU-24.04.02.md`
EOF

# Créer un script d'installation en one-line
cat > "$DEPLOY_DIR/install-one-line.sh" << 'EOF'
#!/bin/bash
# Installation en une ligne
curl -sSL https://raw.githubusercontent.com/hocineira/V3/main/deploy-portfolio.sh | sudo bash
EOF

chmod +x "$DEPLOY_DIR/install-one-line.sh"

# Créer un archive de déploiement
cd "$DEPLOY_DIR"
tar -czf "portfolio-hocine-iratni-ubuntu-24.04.02.tar.gz" ./*

log_success "📦 Archive créée: $DEPLOY_DIR/portfolio-hocine-iratni-ubuntu-24.04.02.tar.gz"

# Afficher les instructions finales
echo ""
echo "========================================="
echo "🎯 SCRIPTS PRÊTS POUR LE DÉPLOIEMENT"
echo "========================================="
echo ""
echo "📁 Répertoire: $DEPLOY_DIR"
echo ""
echo "📋 Fichiers disponibles:"
echo "  ✅ deploy-portfolio.sh         - Déploiement rapide"
echo "  ✅ install-ubuntu-24.04.02.sh  - Installation complète"
echo "  ✅ validate-ubuntu-24.04.02.sh - Validation"
echo "  ✅ update-portfolio.sh         - Mise à jour"
echo "  ✅ GUIDE-UBUNTU-24.04.02.md    - Guide complet"
echo "  ✅ migrate_personal_data.py    - Migration données"
echo ""
echo "🚀 Pour déployer sur Ubuntu Server 24.04.02:"
echo ""
echo "1. Copier les fichiers sur le serveur:"
echo "   scp -r $DEPLOY_DIR/* user@server:/tmp/"
echo ""
echo "2. Sur le serveur, exécuter:"
echo "   cd /tmp"
echo "   sudo ./deploy-portfolio.sh"
echo ""
echo "3. Ou installation en une ligne:"
echo "   curl -sSL https://raw.githubusercontent.com/hocineira/V3/main/deploy-portfolio.sh | sudo bash"
echo ""
echo "📦 Archive complète:"
echo "   $DEPLOY_DIR/portfolio-hocine-iratni-ubuntu-24.04.02.tar.gz"
echo ""
echo "✅ Tous les scripts sont prêts pour le déploiement!"
echo "🌐 Le portfolio sera accessible avec toutes les données de Hocine IRATNI"
echo "🎓 Formations BTS SIO-SISR incluses"
echo "🔧 Compétences réseaux et systèmes configurées"
echo "🏆 Certifications et expériences migrées"
echo ""
log_success "Préparation terminée avec succès!"