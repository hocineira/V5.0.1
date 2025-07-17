#!/bin/bash

# Script de configuration automatique MariaDB pour le portfolio
# Ce script configure MariaDB pour démarrer automatiquement et être plus stable

set -e

echo "🔧 Configuration automatique de MariaDB pour le portfolio..."

# 1. Configuration MariaDB pour la stabilité
echo "📝 Configuration des paramètres MariaDB..."

# Créer le fichier de configuration personnalisé
sudo tee /etc/mysql/mariadb.conf.d/99-portfolio.cnf > /dev/null << 'EOF'
[mysqld]
# Configuration pour la stabilité et les performances
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 1
innodb_flush_method = O_DIRECT

# Configuration pour éviter les timeouts
wait_timeout = 28800
interactive_timeout = 28800
connect_timeout = 60

# Configuration pour éviter les déconnexions
skip_name_resolve = 1
max_connections = 100
max_connect_errors = 10000

# Configuration pour les requêtes longues
long_query_time = 10
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log

# Configuration pour la sécurité
bind-address = 127.0.0.1
local-infile = 0

# Configuration pour le logging
log_error = /var/log/mysql/error.log
general_log = 0

# Configuration pour les caractères UTF8
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Configuration pour éviter les crashes
max_allowed_packet = 64M
tmp_table_size = 64M
max_heap_table_size = 64M
EOF

# 2. Configuration du service pour démarrer automatiquement
echo "🚀 Configuration du démarrage automatique..."

# Créer le script de démarrage personnalisé
sudo tee /etc/systemd/system/mariadb-portfolio.service > /dev/null << 'EOF'
[Unit]
Description=MariaDB Portfolio Service
After=network.target
Wants=network.target

[Service]
Type=notify
User=mysql
Group=mysql
ExecStart=/usr/sbin/mariadbd --defaults-file=/etc/mysql/my.cnf
ExecStartPre=/usr/bin/install -m 755 -o mysql -g root -d /var/run/mysqld
ExecStartPre=/bin/sh -c "systemctl unset-environment _SYSTEMCTL_SKIP_REDIRECT"
ExecStartPre=/bin/sh -c "[ ! -e /usr/bin/galera_recovery ] || sudo -u mysql /usr/bin/galera_recovery"
ExecReload=/bin/kill -s HUP $MAINPID
KillSignal=SIGTERM
SendSIGKILL=no
Restart=always
RestartSec=10
TimeoutSec=300
PrivateTmp=false

[Install]
WantedBy=multi-user.target
EOF

# 3. Configuration de la supervision
echo "📊 Configuration de la supervision..."

# Créer le script de supervision
sudo tee /etc/cron.d/mariadb-portfolio > /dev/null << 'EOF'
# Surveillance MariaDB toutes les 5 minutes
*/5 * * * * root /usr/bin/python3 /app/monitor_mariadb.py >> /var/log/mariadb_cron.log 2>&1
EOF

# 4. Optimisation des logs
echo "📋 Configuration des logs..."

# Créer le fichier de rotation des logs
sudo tee /etc/logrotate.d/mariadb-portfolio > /dev/null << 'EOF'
/var/log/mysql/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 640 mysql adm
    postrotate
        if [ -x /usr/bin/mysqladmin ]; then
            /usr/bin/mysqladmin -u root -pportfolio_secure_password flush-logs > /dev/null 2>&1 || true
        fi
    endscript
}

/var/log/mariadb_monitor.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF

# 5. Test de la configuration
echo "🧪 Test de la configuration..."

# Redémarrer MariaDB avec la nouvelle configuration
sudo service mariadb restart

# Attendre que MariaDB démarre
sleep 5

# Tester la connexion
if mysql -u portfolio_user -pportfolio_password -e "SELECT 1 FROM personal_info LIMIT 1;" portfolio_db > /dev/null 2>&1; then
    echo "✅ MariaDB configuré et fonctionnel"
else
    echo "❌ Problème de configuration MariaDB"
    exit 1
fi

# 6. Optimisation des tables
echo "🔧 Optimisation des tables..."
mysql -u portfolio_user -pportfolio_password portfolio_db -e "
    OPTIMIZE TABLE personal_info;
    OPTIMIZE TABLE education;
    OPTIMIZE TABLE skill_categories;
    OPTIMIZE TABLE projects;
    OPTIMIZE TABLE experience;
    OPTIMIZE TABLE certifications;
    OPTIMIZE TABLE testimonials;
    OPTIMIZE TABLE contact_messages;
    OPTIMIZE TABLE procedures;
    OPTIMIZE TABLE veille_content;
"

# 7. Création d'une sauvegarde initiale
echo "💾 Création d'une sauvegarde initiale..."
mkdir -p /app/backups
mysqldump -u portfolio_user -pportfolio_password portfolio_db > /app/backups/portfolio_initial_backup.sql
echo "✅ Sauvegarde créée: /app/backups/portfolio_initial_backup.sql"

# 8. Création d'un script de sauvegarde automatique
sudo tee /app/backup_portfolio.sh > /dev/null << 'EOF'
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
EOF

chmod +x /app/backup_portfolio.sh

# Programmer la sauvegarde quotidienne
echo "0 2 * * * root /app/backup_portfolio.sh >> /var/log/backup_portfolio.log 2>&1" | sudo tee -a /etc/cron.d/mariadb-portfolio

echo "🎉 Configuration terminée avec succès!"
echo ""
echo "📝 Résumé de la configuration:"
echo "   - MariaDB optimisé pour la stabilité"
echo "   - Surveillance automatique toutes les 5 minutes"
echo "   - Sauvegarde automatique quotidienne à 2h"
echo "   - Logs rotatifs pour éviter l'accumulation"
echo "   - Configuration UTF8 pour les caractères spéciaux"
echo ""
echo "📊 Fichiers de logs:"
echo "   - Erreurs MariaDB: /var/log/mysql/error.log"
echo "   - Surveillance: /var/log/mariadb_monitor.log"
echo "   - Sauvegarde: /var/log/backup_portfolio.log"
echo ""
echo "💾 Sauvegardes:"
echo "   - Répertoire: /app/backups/"
echo "   - Script manuel: /app/backup_portfolio.sh"
echo ""
echo "🚀 MariaDB est maintenant configuré pour une utilisation stable 24/7!"