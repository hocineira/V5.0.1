# 🚀 GUIDE D'INSTALLATION PORTFOLIO v2.0 - UBUNTU 24.04

## 📋 Vue d'ensemble

Ce guide vous permet d'installer le portfolio avec l'architecture refactorisée qui résout le problème de stabilité (arrêt après 30 minutes).

**🎯 Nouvelles fonctionnalités v2.0 :**
- ✅ Backend refactorisé avec pool de connexions MariaDB
- ✅ Monitoring et surveillance en temps réel
- ✅ Système de health checks avancé
- ✅ Gestion automatique des timeouts
- ✅ Reconnexion automatique à la base de données
- ✅ Circuit breaker et gestion d'erreurs améliorée

---

## 🔧 Prérequis

- **OS :** Ubuntu 24.04 LTS
- **RAM :** Minimum 2 GB (Recommandé 4 GB)
- **Disque :** Minimum 20 GB d'espace libre
- **Accès :** Privilèges root (sudo)
- **Réseau :** Connexion internet stable

---

## ⚡ Installation rapide

### 1. Télécharger le script d'installation

```bash
wget https://raw.githubusercontent.com/votre-repo/portfolio/main/install-portfolio-v2-ubuntu-24.04.sh
chmod +x install-portfolio-v2-ubuntu-24.04.sh
```

### 2. Exécuter l'installation

```bash
sudo ./install-portfolio-v2-ubuntu-24.04.sh
```

### 3. Suivre les instructions

Le script vous guidera à travers toutes les étapes automatiquement.

---

## 📝 Installation manuelle détaillée

### Étape 1 : Préparation du système

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances de base
sudo apt install -y curl wget git nginx supervisor ufw build-essential
```

### Étape 2 : Installation de MariaDB

```bash
# Installation de MariaDB (remplace PostgreSQL)
sudo apt install -y mariadb-server mariadb-client

# Configuration optimisée pour la stabilité
sudo nano /etc/mysql/mariadb.conf.d/99-portfolio.cnf
```

Ajoutez cette configuration :

```ini
[mysqld]
# Configuration optimisée pour Portfolio v2.0
max_connections = 200
innodb_buffer_pool_size = 512M
query_cache_size = 64M

# Timeouts pour éviter les déconnexions (IMPORTANT)
wait_timeout = 28800
interactive_timeout = 28800
connect_timeout = 60
net_read_timeout = 60
net_write_timeout = 60

# Optimisations InnoDB
innodb_log_file_size = 128M
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1
```

```bash
# Redémarrage avec nouvelle configuration
sudo systemctl restart mariadb

# Création de la base de données
sudo mysql -u root << EOF
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EOF
```

### Étape 3 : Installation Node.js et Python

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
sudo npm install -g yarn

# Python 3.11 et environnement virtuel
sudo apt install -y python3 python3-pip python3-venv python3-dev
```

### Étape 4 : Configuration du projet

```bash
# Création du répertoire
sudo mkdir -p /opt/portfolio
cd /opt/portfolio

# Clonage du code (ou copie manuelle)
git clone https://github.com/votre-repo/portfolio.git .

# Configuration backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configuration des variables d'environnement
cat > .env << EOF
DATABASE_URL="mysql+pymysql://portfolio_user:your_secure_password@localhost/portfolio_db"
POOL_SIZE=20
MAX_OVERFLOW=30
POOL_RECYCLE=3600
MONITORING_ENABLED=true
EOF

# Initialisation de la base de données
python init_db.py

# Configuration frontend
cd ../frontend
yarn install
yarn build
```

### Étape 5 : Configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Configuration Nginx optimisée :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    # Frontend React
    location / {
        root /opt/portfolio/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API Backend avec timeouts optimisés
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts pour éviter les déconnexions
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

```bash
# Activation du site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Étape 6 : Configuration Supervisor

```bash
sudo nano /etc/supervisor/conf.d/portfolio.conf
```

```ini
[program:portfolio-backend]
command=/opt/portfolio/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
directory=/opt/portfolio/backend
user=portfolio
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-backend.log

[program:portfolio-monitoring]
command=/opt/portfolio/backend/venv/bin/python monitoring.py
directory=/opt/portfolio/backend
user=portfolio
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-monitoring.log
```

```bash
# Démarrage des services
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start portfolio-backend
sudo supervisorctl start portfolio-monitoring
```

---

## 🧪 Tests de validation

### Test 1 : Santé de la base de données

```bash
# Test de connexion MariaDB
mysql -u portfolio_user -p -e "SELECT 1" portfolio_db
```

### Test 2 : Health check de l'API

```bash
# Test du health check (nouveau endpoint v2.0)
curl -s http://localhost:8001/api/health | jq '.'
```

Réponse attendue :
```json
{
  "status": "healthy",
  "database": {
    "status": "healthy",
    "response_time": "0.015s",
    "pool_size": 20,
    "checked_in": 19,
    "checked_out": 1
  },
  "connection_pool": {
    "pool_size": 20,
    "checked_in": 19,
    "checked_out": 1,
    "overflow": 0
  },
  "timestamp": 1704067200
}
```

### Test 3 : Métriques de performance

```bash
# Test des métriques (nouveau endpoint v2.0)
curl -s http://localhost:8001/api/metrics | jq '.'
```

### Test 4 : Test de stabilité

```bash
# Test de stabilité (10 requêtes consécutives)
for i in {1..10}; do
  echo "Test $i:"
  curl -s http://localhost:8001/api/health | jq '.database.response_time'
  sleep 1
done
```

### Test 5 : Test de charge

```bash
# Test de charge (50 requêtes simultanées)
for i in {1..50}; do
  curl -s http://localhost:8001/api/portfolio/personal-info &
done
wait
```

---

## 📊 Monitoring et surveillance

### Nouveaux endpoints de monitoring v2.0

```bash
# Health check complet
curl http://localhost:8001/api/health

# Métriques de performance
curl http://localhost:8001/api/metrics

# Nettoyage des connexions (admin)
curl -X POST http://localhost:8001/api/admin/cleanup-connections
```

### Surveillance des logs

```bash
# Logs backend
tail -f /var/log/supervisor/portfolio-backend.log

# Logs monitoring
tail -f /var/log/supervisor/portfolio-monitoring.log

# Logs Nginx
tail -f /var/log/nginx/access.log
```

---

## 🔧 Commandes utiles

### Gestion des services

```bash
# Démarrer tous les services
sudo systemctl start mariadb nginx supervisor
sudo supervisorctl start portfolio-backend portfolio-monitoring

# Arrêter tous les services
sudo supervisorctl stop portfolio-backend portfolio-monitoring
sudo systemctl stop nginx

# Redémarrer le backend
sudo supervisorctl restart portfolio-backend

# Status des services
sudo supervisorctl status
```

### Gestion de la base de données

```bash
# Connexion à MariaDB
mysql -u portfolio_user -p portfolio_db

# Sauvegarde de la base de données
mysqldump -u portfolio_user -p portfolio_db > backup.sql

# Restauration de la base de données
mysql -u portfolio_user -p portfolio_db < backup.sql
```

---

## 🚨 Résolution des problèmes

### Problème : Backend ne démarre pas

```bash
# Vérifier les logs
sudo tail -f /var/log/supervisor/portfolio-backend.log

# Vérifier la configuration
cd /opt/portfolio/backend
source venv/bin/activate
python -c "from database import check_database_health; print(check_database_health())"
```

### Problème : Connexion à la base de données

```bash
# Tester la connexion
mysql -u portfolio_user -p portfolio_db -e "SELECT 1"

# Vérifier les permissions
sudo mysql -u root -e "SHOW GRANTS FOR 'portfolio_user'@'localhost'"
```

### Problème : Timeout après 30 minutes

```bash
# Vérifier la configuration MariaDB
sudo mysql -u root -e "SHOW VARIABLES LIKE '%timeout%'"

# Vérifier les métriques de pool
curl http://localhost:8001/api/metrics | jq '.connection_pool'
```

---

## 🔒 Sécurité

### SSL/TLS avec Let's Encrypt

```bash
# Installation de Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtention du certificat
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall

```bash
# Configuration UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status
```

---

## 📈 Optimisations de performance

### Configuration MariaDB pour production

```sql
-- Configuration optimisée pour serveur avec 4GB RAM
SET GLOBAL innodb_buffer_pool_size = 2147483648;  -- 2GB
SET GLOBAL query_cache_size = 134217728;          -- 128MB
SET GLOBAL tmp_table_size = 134217728;            -- 128MB
SET GLOBAL max_heap_table_size = 134217728;       -- 128MB
```

### Configuration Nginx pour production

```nginx
# Dans /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

# Compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Cache
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 🎯 Différences avec l'ancienne version

| Fonctionnalité | v1.0 (Ancienne) | v2.0 (Nouvelle) |
|---|---|---|
| Base de données | PostgreSQL | MariaDB |
| Pool de connexions | ❌ Non | ✅ Oui (20 connexions) |
| Monitoring | ❌ Basique | ✅ Avancé |
| Health checks | ❌ Basique | ✅ Complet |
| Gestion des timeouts | ❌ Non | ✅ Oui |
| Reconnexion auto | ❌ Non | ✅ Oui |
| Circuit breaker | ❌ Non | ✅ Oui |
| Métriques | ❌ Non | ✅ Oui |
| Stabilité 30 min | ❌ Problème | ✅ Résolu |

---

## 📞 Support

En cas de problème, vérifiez :

1. **Logs** : `/var/log/supervisor/portfolio-*.log`
2. **Health check** : `http://localhost:8001/api/health`
3. **Status services** : `sudo supervisorctl status`
4. **Configuration MariaDB** : `/etc/mysql/mariadb.conf.d/99-portfolio.cnf`

---

## 🎉 Conclusion

Cette nouvelle version v2.0 résout définitivement le problème de stabilité de 30 minutes grâce à :

- **Pool de connexions MariaDB** avec reconnexion automatique
- **Monitoring en temps réel** des connexions
- **Gestion avancée des timeouts**
- **System de health checks** complet
- **Architecture robuste** pour la production

Le portfolio est maintenant stable, performant et prêt pour un déploiement en production sur Ubuntu 24.04 ! 🚀