#!/bin/bash

# Script de démonstration des procédures PostgreSQL
# Montre comment utiliser les nouvelles procédures et guides

SUCCESS_COLOR="\033[0;32m"
ERROR_COLOR="\033[0;31m"
INFO_COLOR="\033[0;34m"
WARNING_COLOR="\033[0;33m"
NC="\033[0m" # No Color

log() {
    echo -e "$1"
}

# Fonction pour afficher une procédure depuis la base de données
show_procedure() {
    local procedure_title="$1"
    log "${INFO_COLOR}📋 Procédure: $procedure_title${NC}"
    log "${INFO_COLOR}" + "═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════"
    
    PGPASSWORD="portfolio_password" psql -h localhost -U portfolio_user -d portfolio_db -c "
        SELECT 
            title,
            description,
            category,
            array_to_string(tags::text[], ', ') as tags
        FROM procedures 
        WHERE title ILIKE '%$procedure_title%' 
        LIMIT 1;
    " 2>/dev/null
    
    log "${INFO_COLOR}Contenu:${NC}"
    PGPASSWORD="portfolio_password" psql -h localhost -U portfolio_user -d portfolio_db -t -c "
        SELECT content FROM procedures WHERE title ILIKE '%$procedure_title%' LIMIT 1;
    " 2>/dev/null | head -20
    
    log "${WARNING_COLOR}... (contenu tronqué pour la démo)${NC}"
    log ""
}

# Fonction pour tester une API
test_api_endpoint() {
    local endpoint="$1"
    local description="$2"
    
    log "${INFO_COLOR}🔌 Test API: $description${NC}"
    log "${INFO_COLOR}URL: http://localhost:8001$endpoint${NC}"
    
    if curl -s -f "http://localhost:8001$endpoint" >/dev/null 2>&1; then
        log "${SUCCESS_COLOR}✅ $description - OK${NC}"
        # Afficher un échantillon de la réponse
        curl -s "http://localhost:8001$endpoint" | head -c 200
        log "...\n"
    else
        log "${ERROR_COLOR}❌ $description - Erreur${NC}"
    fi
}

# Début de la démonstration
log "${INFO_COLOR}🚀 Démonstration des procédures PostgreSQL - Portfolio${NC}"
log "${INFO_COLOR}$(date)${NC}"

# 1. Affichage des procédures disponibles
log "\n${INFO_COLOR}=== 1. Procédures disponibles en base de données ===${NC}"
log "${INFO_COLOR}Les procédures sont maintenant stockées dans PostgreSQL et accessibles via API${NC}"

PGPASSWORD="portfolio_password" psql -h localhost -U portfolio_user -d portfolio_db -c "
    SELECT 
        title,
        category,
        array_to_string(tags::text[], ', ') as tags,
        to_char(created_at, 'DD/MM/YYYY') as created
    FROM procedures 
    ORDER BY created_at DESC;
" 2>/dev/null

# 2. Démonstration d'une procédure
log "\n${INFO_COLOR}=== 2. Exemple de procédure ===${NC}"
show_procedure "React"

# 3. Test des API endpoints
log "\n${INFO_COLOR}=== 3. Test des endpoints API ===${NC}"
test_api_endpoint "/api/health" "Health Check"
test_api_endpoint "/api/portfolio/personal-info" "Informations personnelles"
test_api_endpoint "/api/portfolio/procedures" "Liste des procédures"
test_api_endpoint "/api/portfolio/projects" "Liste des projets"

# 4. Ajout d'une nouvelle procédure via API
log "\n${INFO_COLOR}=== 4. Ajout d'une procédure via API ===${NC}"
log "${INFO_COLOR}Ajout d'une procédure 'Test Ubuntu 24.04'...${NC}"

curl -s -X POST "http://localhost:8001/api/portfolio/procedures" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test automatique Ubuntu 24.04",
    "description": "Procédure pour tester automatiquement l'\''installation sur Ubuntu 24.04",
    "content": "# Test automatique Ubuntu 24.04\n\n## Description\nCette procédure teste automatiquement l'\''installation du portfolio sur Ubuntu 24.04.2\n\n## Prérequis\n- Ubuntu 24.04.2 LTS\n- Accès root ou sudo\n- Connexion Internet\n\n## Étapes\n\n### 1. Télécharger le script\n```bash\nwget https://raw.githubusercontent.com/hocineira/siteweb/main/test-ubuntu-24.04.sh\nchmod +x test-ubuntu-24.04.sh\n```\n\n### 2. Exécuter le test\n```bash\n./test-ubuntu-24.04.sh\n```\n\n### 3. Vérifier les résultats\nLe script teste automatiquement :\n- Installation des dépendances\n- Configuration PostgreSQL\n- Tests de connectivité\n- Validation des services\n\n## Résultats attendus\n- ✅ Ubuntu 24.04 compatible\n- ✅ PostgreSQL configuré\n- ✅ Python/FastAPI fonctionnel\n- ✅ Node.js/React compatible\n\n## Dépannage\nConsultez le fichier de log généré pour plus de détails.",
    "category": "Test",
    "tags": ["ubuntu", "test", "automatique", "24.04", "postgresql"]
  }' >/dev/null 2>&1

if [ $? -eq 0 ]; then
    log "${SUCCESS_COLOR}✅ Procédure ajoutée avec succès${NC}"
else
    log "${ERROR_COLOR}❌ Erreur lors de l'ajout de la procédure${NC}"
fi

# 5. Vérification de l'ajout
log "\n${INFO_COLOR}=== 5. Vérification de l'ajout ===${NC}"
PROCEDURES_COUNT=$(PGPASSWORD="portfolio_password" psql -h localhost -U portfolio_user -d portfolio_db -t -c "SELECT COUNT(*) FROM procedures;" 2>/dev/null)
log "${SUCCESS_COLOR}✅ Nombre total de procédures: $PROCEDURES_COUNT${NC}"

# 6. Test des guides de déploiement
log "\n${INFO_COLOR}=== 6. Guides de déploiement disponibles ===${NC}"
log "${INFO_COLOR}Les guides suivants ont été mis à jour pour PostgreSQL:${NC}"

if [ -f "/app/GUIDE_SERVEUR_DOMESTIQUE.md" ]; then
    log "${SUCCESS_COLOR}✅ GUIDE_SERVEUR_DOMESTIQUE.md - Ubuntu 24.04.2${NC}"
    log "   - Configuration PostgreSQL"
    log "   - Scripts d'automatisation"
    log "   - Service systemd"
fi

if [ -f "/app/GUIDE_HEBERGEMENT_LWS.md" ]; then
    log "${SUCCESS_COLOR}✅ GUIDE_HEBERGEMENT_LWS.md - VPS LWS${NC}"
    log "   - Configuration PostgreSQL"
    log "   - SSL/HTTPS"
    log "   - Monitoring"
fi

if [ -f "/app/GUIDE_BUILDER_WEB.md" ]; then
    log "${SUCCESS_COLOR}✅ GUIDE_BUILDER_WEB.md - Builder Web${NC}"
    log "   - Gestion PostgreSQL"
    log "   - Ajout de procédures"
    log "   - Workflow de développement"
fi

# 7. Exemple d'utilisation pratique
log "\n${INFO_COLOR}=== 7. Exemple d'utilisation pratique ===${NC}"
log "${INFO_COLOR}Voici comment utiliser les nouvelles procédures:${NC}"

log "${SUCCESS_COLOR}1. Consulter les procédures via API:${NC}"
log "   curl http://localhost:8001/api/portfolio/procedures"

log "${SUCCESS_COLOR}2. Rechercher une procédure:${NC}"
log "   curl http://localhost:8001/api/portfolio/procedures | grep -i 'ubuntu'"

log "${SUCCESS_COLOR}3. Accéder directement à la base de données:${NC}"
log "   psql -U portfolio_user -d portfolio_db -h localhost"

log "${SUCCESS_COLOR}4. Déployer sur Ubuntu 24.04:${NC}"
log "   1. Télécharger le script de test"
log "   2. Exécuter: ./test-ubuntu-24.04.sh"
log "   3. Suivre le guide GUIDE_SERVEUR_DOMESTIQUE.md"

# 8. Avantages de la migration
log "\n${INFO_COLOR}=== 8. Avantages de la migration PostgreSQL ===${NC}"
log "${SUCCESS_COLOR}✅ Compatibilité Ubuntu 24.04.2${NC}"
log "${SUCCESS_COLOR}✅ Performances améliorées${NC}"
log "${SUCCESS_COLOR}✅ Requêtes SQL avancées${NC}"
log "${SUCCESS_COLOR}✅ Intégrité des données${NC}"
log "${SUCCESS_COLOR}✅ Sauvegardes simplifiées${NC}"
log "${SUCCESS_COLOR}✅ Monitoring intégré${NC}"
log "${SUCCESS_COLOR}✅ Outils d'administration (pgAdmin)${NC}"

# 9. Commandes utiles
log "\n${INFO_COLOR}=== 9. Commandes utiles ===${NC}"
log "${INFO_COLOR}Commandes PostgreSQL:${NC}"
log "  psql -U portfolio_user -d portfolio_db -h localhost"
log "  SELECT * FROM procedures WHERE category = 'Développement';"
log "  pg_dump -U portfolio_user -h localhost portfolio_db > backup.sql"

log "${INFO_COLOR}Commandes API:${NC}"
log "  curl http://localhost:8001/api/portfolio/procedures"
log "  curl -X POST http://localhost:8001/api/portfolio/procedures -d '{...}'"

log "${INFO_COLOR}Commandes serveur:${NC}"
log "  sudo systemctl status postgresql"
log "  sudo journalctl -u portfolio-backend -f"

# 10. Conclusion
log "\n${INFO_COLOR}=== 10. Conclusion ===${NC}"
log "${SUCCESS_COLOR}🎉 Migration PostgreSQL terminée avec succès !${NC}"
log "${INFO_COLOR}Le portfolio est maintenant prêt pour:${NC}"
log "  - Déploiement sur Ubuntu 24.04.2"
log "  - Hébergement sur VPS LWS"
log "  - Gestion avancée des procédures"
log "  - Monitoring et sauvegardes"

log "\n${INFO_COLOR}📋 Prochaines étapes recommandées:${NC}"
log "1. Tester le déploiement avec le script test-ubuntu-24.04.sh"
log "2. Configurer votre domaine selon GUIDE_HEBERGEMENT_LWS.md"
log "3. Ajouter vos propres procédures via l'API"
log "4. Mettre en place une sauvegarde automatique"

log "\n${SUCCESS_COLOR}🚀 Votre portfolio est maintenant moderne et robuste !${NC}"