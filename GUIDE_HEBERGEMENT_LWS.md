# 🌐 Guide d'hébergement LWS pour votre Portfolio - Version PostgreSQL

## 📋 Prérequis
- Domaine acheté chez LWS
- Accès à votre espace client LWS
- Projet portfolio terminé et testé en local avec PostgreSQL
- Connaissance des identifiants de base de données

---

## 🎯 Étapes de déploiement

### 1. 📦 Préparation du projet

#### A. Construction du projet
```bash
# Dans le dossier de votre projet
cd frontend
npm run build
```

#### B. Structure finale à déployer
```
build/
├── index.html
├── static/
│   ├── css/
│   ├── js/
│   └── media/
└── favicon.ico
```

### 2. 🔧 Configuration selon votre type d'hébergement LWS

#### Option A: Hébergement Web classique (cPanel)

**Important** : L'hébergement web classique LWS ne supporte généralement pas Python/FastAPI ni PostgreSQL. Cette option est uniquement pour un site statique.

**Étapes pour version statique :**
1. **Connectez-vous à votre cPanel LWS**
2. **Accédez au gestionnaire de fichiers**
3. **Naviguez vers le dossier `public_html`**
4. **Supprimez le contenu existant**
5. **Uploadez tout le contenu du dossier `build/`**

**Structure finale sur le serveur :**
```
public_html/
├── index.html
├── static/
│   ├── css/
│   ├── js/
│   └── media/
└── favicon.ico
```

**Fichier `.htaccess` à créer dans `public_html/` :**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Compression gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache des fichiers statiques
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/x-javascript "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 year"
</IfModule>
```

#### Option B: VPS LWS (Serveur privé virtuel) - Recommandée

**Prérequis serveur :**
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install -y nginx nodejs npm python3 python3-pip postgresql postgresql-contrib

# Installation de yarn (recommandé)
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

**Configuration PostgreSQL :**
```bash
# Démarrage et activation de PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Création de la base de données
sudo -u postgres createdb portfolio_db

# Création de l'utilisateur
sudo -u postgres psql -c "CREATE USER portfolio_user WITH PASSWORD 'VotreMotDePasseSecurise123!';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;"
sudo -u postgres psql -c "ALTER USER portfolio_user CREATEDB;"

# Attribution des permissions
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON SCHEMA public TO portfolio_user;"
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO portfolio_user;"
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO portfolio_user;"
sudo -u postgres psql -d portfolio_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO portfolio_user;"
```

**Configuration Nginx :**
```nginx
# /etc/nginx/sites-available/votredomaine.com
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;
    
    root /var/www/votredomaine.com/frontend/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API Backend
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
    
    # Optimisation des fichiers statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        gzip_static on;
    }
    
    # Compression générale
    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Activation du site :**
```bash
sudo ln -s /etc/nginx/sites-available/votredomaine.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 🔐 Configuration SSL (HTTPS)

#### Pour VPS LWS :
```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx

# Obtention du certificat SSL
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com

# Configuration du renouvellement automatique
sudo certbot renew --dry-run

# Ajout du cron pour le renouvellement automatique
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo tee -a /etc/crontab
```

### 4. 🚀 Déploiement de l'application

#### Déploiement sur VPS LWS :
```bash
# Clonage du projet
git clone https://github.com/hocineira/siteweb.git /var/www/votredomaine.com
cd /var/www/votredomaine.com

# Configuration des permissions
sudo chown -R www-data:www-data /var/www/votredomaine.com
sudo chmod -R 755 /var/www/votredomaine.com

# Installation des dépendances backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configuration de l'environnement
cat > .env << EOF
DATABASE_URL=postgresql://portfolio_user:VotreMotDePasseSecurise123!@localhost/portfolio_db
ENVIRONMENT=production
EOF

# Initialisation de la base de données
python init_db.py

# Installation des dépendances frontend
cd ../frontend
yarn install
yarn build

# Configuration du service systemd
sudo nano /etc/systemd/system/portfolio-backend.service
```

**Contenu du service :**
```ini
[Unit]
Description=Portfolio Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/votredomaine.com/backend
ExecStart=/var/www/votredomaine.com/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10
Environment="DATABASE_URL=postgresql://portfolio_user:VotreMotDePasseSecurise123!@localhost/portfolio_db"
Environment="ENVIRONMENT=production"

[Install]
WantedBy=multi-user.target
```

**Activation du service :**
```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolio-backend
sudo systemctl start portfolio-backend
```

### 5. 🌍 Configuration DNS

#### Dans votre espace client LWS :
1. **Accédez à "Gestion DNS"**
2. **Configurez les enregistrements suivants :**

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| A | @ | IP_DE_VOTRE_VPS_LWS | 3600 |
| CNAME | www | votredomaine.com | 3600 |
| A | api | IP_DE_VOTRE_VPS_LWS | 3600 |

### 6. 📊 Monitoring et maintenance

#### Configuration des logs
```bash
# Rotation des logs
sudo nano /etc/logrotate.d/portfolio
```

**Contenu du fichier :**
```
/var/log/nginx/votredomaine.com.access.log
/var/log/nginx/votredomaine.com.error.log {
    daily
    rotate 52
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

#### Script de monitoring
```bash
#!/bin/bash
# monitoring-portfolio.sh

# Vérification des services
services=("nginx" "postgresql" "portfolio-backend")

for service in "${services[@]}"; do
    if systemctl is-active --quiet $service; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running"
        sudo systemctl restart $service
    fi
done

# Vérification de l'espace disque
df -h | grep -E "(/$|/var)" | awk '$5 > 80 {print "⚠️  Disk space warning: " $5 " used on " $6}'

# Vérification des logs d'erreur
error_count=$(grep -c "ERROR" /var/log/nginx/votredomaine.com.error.log 2>/dev/null || echo 0)
if [ $error_count -gt 0 ]; then
    echo "⚠️  $error_count errors found in nginx logs"
fi
```

### 7. 🔄 Mise à jour automatique

#### Script de déploiement automatique
```bash
#!/bin/bash
# deploy-update.sh

set -e

DOMAIN="votredomaine.com"
PROJECT_DIR="/var/www/$DOMAIN"
BACKUP_DIR="/backup/portfolio"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 Déploiement automatique du portfolio..."

# Création du backup
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $PROJECT_DIR
sudo -u postgres pg_dump portfolio_db > $BACKUP_DIR/db_backup_$DATE.sql

# Mise à jour du code
cd $PROJECT_DIR
git pull origin main

# Mise à jour du backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Mise à jour du frontend
cd ../frontend
yarn install
yarn build

# Redémarrage des services
sudo systemctl restart portfolio-backend
sudo systemctl reload nginx

# Vérification
sleep 5
if curl -f https://$DOMAIN/api/health > /dev/null 2>&1; then
    echo "✅ Déploiement réussi!"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi
```

### 8. 🔍 Vérification du déploiement

#### Tests à effectuer :
1. **Accès au site** : `https://votredomaine.com`
2. **Redirection www** : `https://www.votredomaine.com`
3. **SSL actif** : Vérifier le cadenas dans le navigateur
4. **API fonctionnelle** : `https://votredomaine.com/api/health`
5. **Données présentes** : `https://votredomaine.com/api/portfolio/personal-info`

#### Commandes de vérification :
```bash
# Vérification des services
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status portfolio-backend

# Test de l'API
curl -X GET https://votredomaine.com/api/health
curl -X GET https://votredomaine.com/api/portfolio/personal-info

# Vérification des logs
sudo tail -f /var/log/nginx/votredomaine.com.access.log
sudo journalctl -u portfolio-backend -f
```

### 9. 🛠️ Résolution des problèmes courants

#### Problème 1: API non accessible
**Solutions :**
```bash
# Vérifier le service backend
sudo systemctl status portfolio-backend
sudo journalctl -u portfolio-backend -f

# Vérifier la configuration Nginx
sudo nginx -t
sudo systemctl reload nginx
```

#### Problème 2: Erreur de base de données
**Solutions :**
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Tester la connexion
cd /var/www/votredomaine.com/backend
source venv/bin/activate
python -c "from database import engine; print('Database OK')"
```

#### Problème 3: Certificat SSL expiré
**Solutions :**
```bash
# Vérifier l'expiration
sudo certbot certificates

# Renouveler manuellement
sudo certbot renew

# Forcer le renouvellement
sudo certbot renew --force-renewal
```

### 10. 📈 Optimisations avancées

#### Configuration PostgreSQL pour production
```bash
sudo nano /etc/postgresql/15/main/postgresql.conf
```

**Optimisations recommandées :**
```ini
# Optimisations pour VPS
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.7
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
max_connections = 100
```

#### Configuration Nginx avancée
```nginx
# Ajouts dans le block server
client_max_body_size 10M;
client_body_timeout 60s;
client_header_timeout 60s;
keepalive_timeout 65;
send_timeout 60s;

# Sécurité
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 📞 Support LWS

**En cas de problème :**
1. **Documentation LWS** : https://aide.lws.fr/
2. **Support technique LWS** : Via votre espace client (section support)
3. **Forums communautaires** : Recherchez des solutions similaires
4. **Logs à consulter** : Toujours vérifier les logs avant de contacter le support

**Informations utiles pour le support :**
- Type d'hébergement LWS (VPS, serveur dédié)
- Version de l'OS (Ubuntu 22.04 ou 24.04)
- Logs d'erreur spécifiques
- Configuration utilisée

---

## 🔄 Maintenance préventive

### Tâches hebdomadaires
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Vérification des sauvegardes
ls -la /backup/portfolio/

# Nettoyage des logs
sudo journalctl --vacuum-time=7d
```

### Tâches mensuelles
```bash
# Analyse des performances
sudo apt install htop iotop
htop

# Optimisation PostgreSQL
sudo -u postgres vacuumdb --analyze --verbose portfolio_db

# Vérification de l'espace disque
df -h
du -sh /var/www/votredomaine.com/
```

---

*Ce guide a été spécialement adapté pour PostgreSQL et testé sur les configurations LWS VPS avec Ubuntu 22.04/24.04. Pour l'hébergement web classique, seule la version statique est possible.*