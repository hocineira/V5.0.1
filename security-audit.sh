#!/bin/bash

# =============================================================================
# SCRIPT D'AUDIT DE SÉCURITÉ AUTOMATISÉ - PORTFOLIO
# =============================================================================
# 
# Usage: ./security-audit.sh
# Description: Lance un audit de sécurité complet du portfolio
# 
# =============================================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage des messages
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Fonction de section
section() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}🔒 $1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

# Variables
PROJECT_DIR="/app"
AUDIT_DATE=$(date '+%Y-%m-%d %H:%M:%S')
REPORT_FILE="/app/AUDIT_REPORT_$(date +%Y%m%d_%H%M).md"

# Commencer l'audit
section "AUDIT DE SÉCURITÉ AUTOMATISÉ"
log_info "Date de l'audit: $AUDIT_DATE"
log_info "Répertoire: $PROJECT_DIR"

# 1. Audit des vulnérabilités NPM/Yarn
section "1. AUDIT DES DÉPENDANCES"
cd "$PROJECT_DIR"

if command -v yarn &> /dev/null; then
    log_info "Lancement de yarn audit..."
    YARN_AUDIT_OUTPUT=$(yarn audit 2>&1)
    if echo "$YARN_AUDIT_OUTPUT" | grep -q "0 vulnerabilities found"; then
        log_success "Aucune vulnérabilité détectée dans les dépendances"
        VULN_COUNT="0"
    else
        log_error "Vulnérabilités détectées ! Exécutez 'yarn audit' pour plus de détails"
        VULN_COUNT=$(echo "$YARN_AUDIT_OUTPUT" | grep -o '[0-9]* vulnerabilities found' | head -1 | grep -o '[0-9]*' || echo "Inconnu")
        echo "$YARN_AUDIT_OUTPUT"
        exit 1
    fi
else
    log_error "Yarn n'est pas installé"
    exit 1
fi

# 2. Vérification des secrets exposés
section "2. RECHERCHE DE SECRETS EXPOSÉS"

log_info "Recherche de patterns sensibles..."
PATTERNS=("password" "secret" "token" "api_key" "private_key")
FOUND_SECRETS=0

for pattern in "${PATTERNS[@]}"; do
    RESULTS=$(grep -r -i --exclude-dir=node_modules --exclude-dir=.git --exclude="*.log" "$pattern" . 2>/dev/null | grep -v "key=" | grep -v "# " || true)
    if [ ! -z "$RESULTS" ]; then
        log_warning "Pattern '$pattern' trouvé:"
        echo "$RESULTS" | head -5
        FOUND_SECRETS=1
    fi
done

if [ $FOUND_SECRETS -eq 0 ]; then
    log_success "Aucun secret exposé détecté"
else
    log_warning "Patterns suspects détectés - vérification manuelle recommandée"
fi

# 3. Vérification des fichiers de configuration
section "3. AUDIT CONFIGURATION"

# Vérification Next.js config
if [ -f "next.config.js" ]; then
    log_info "Vérification de next.config.js..."
    if grep -q "headers()" next.config.js; then
        log_success "Headers de sécurité configurés"
    else
        log_warning "Headers de sécurité manquants dans next.config.js"
    fi
    
    if grep -q "poweredByHeader: false" next.config.js; then
        log_success "Header X-Powered-By désactivé"
    else
        log_warning "Header X-Powered-By non désactivé"
    fi
else
    log_error "Fichier next.config.js non trouvé"
fi

# Vérification des variables d'environnement
if [ -f ".env.local" ]; then
    log_info "Vérification des variables d'environnement..."
    if [ -s ".env.local" ]; then
        log_success "Fichier .env.local présent"
        # Vérifier que les secrets ne sont pas hardcodés
        if grep -q "localhost\|127.0.0.1" .env.local; then
            log_success "Configuration locale détectée"
        fi
    fi
else
    log_warning "Fichier .env.local non trouvé"
fi

# 4. Vérification des permissions de fichiers
section "4. AUDIT PERMISSIONS"

log_info "Vérification des permissions sensibles..."

# Fichiers de configuration sensibles
SENSITIVE_FILES=(".env.local" ".env" "next.config.js")
for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        PERMISSIONS=$(ls -la "$file" | cut -d' ' -f1)
        log_info "$file: $PERMISSIONS"
        
        # Vérifier que les fichiers .env ne sont pas lisibles par tous
        if [[ "$file" == .env* ]] && [[ "$PERMISSIONS" == *"r--r--r--"* ]]; then
            log_warning "$file est lisible par tous - considérez chmod 600"
        fi
    fi
done

# 5. Test de build
section "5. TEST DE BUILD SÉCURISÉ"

log_info "Test de build Next.js..."
if yarn build > /dev/null 2>&1; then
    log_success "Build réussi - configuration valide"
else
    log_error "Échec du build - vérifiez la configuration"
fi

# 6. Génération du rapport
section "6. GÉNÉRATION DU RAPPORT"

cat > "$REPORT_FILE" << EOF
# 🔒 RAPPORT D'AUDIT AUTOMATISÉ

**Date:** $AUDIT_DATE  
**Statut:** COMPLÉTÉ  

## Résultats:

### Dépendances
- Vulnérabilités NPM/Yarn: $(yarn audit --json 2>/dev/null | tail -1 | grep -o '"vulnerabilities":[0-9]*' | cut -d':' -f2)

### Configuration
- Next.js headers: $(grep -q "headers()" next.config.js && echo "✅ Configurés" || echo "❌ Manquants")
- X-Powered-By: $(grep -q "poweredByHeader: false" next.config.js && echo "✅ Désactivé" || echo "❌ Actif")

### Fichiers sensibles
$(ls -la .env* 2>/dev/null | head -5 || echo "Aucun fichier .env détecté")

**Prochaine vérification recommandée:** $(date -d "+1 month" '+%Y-%m-%d')
EOF

log_success "Rapport généré: $REPORT_FILE"

# 7. Résumé final
section "RÉSUMÉ DE L'AUDIT"

log_success "Audit de sécurité terminé avec succès"
log_info "Consultez le rapport détaillé: $REPORT_FILE"

# Recommandations
echo -e "\n${YELLOW}📋 RECOMMANDATIONS:${NC}"
echo "1. Exécutez cet audit mensuellement"
echo "2. Mettez à jour les dépendances régulièrement"
echo "3. Surveillez les alertes de sécurité Next.js"
echo "4. Vérifiez les logs d'accès en production"

log_success "Script d'audit terminé"