#!/bin/bash
# Script de sauvegarde automatique
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/app/backups"
mkdir -p $BACKUP_DIR

# Sauvegarde
mysqldump -u portfolio_user -pportfolio_password portfolio_db > $BACKUP_DIR/portfolio_backup_$DATE.sql

# Garder seulement les 7 dernières sauvegardes
find $BACKUP_DIR -name "portfolio_backup_*.sql" -mtime +7 -delete

echo "✅ Sauvegarde créée: $BACKUP_DIR/portfolio_backup_$DATE.sql"
