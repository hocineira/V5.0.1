# 🏠 Guide de déploiement sur serveur domestique - Portfolio PostgreSQL

## 🖥️ Configuration serveur Ubuntu Server 24.04.2

### 1. Préparation du serveur Ubuntu

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances nécessaires
sudo apt install -y curl wget gnupg software-properties-common

# Installation de Node.js 20.x (LTS 2025)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de Python 3 et pip
sudo apt install -y python3 python3-pip python3-venv

# Installation de PostgreSQL 15 (compatible Ubuntu 24.04.2)
sudo apt install -y postgresql postgresql-contrib

# Installation de Nginx
sudo apt install -y nginx

# Démarrage et activation des services
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Configuration de PostgreSQL

```bash
# Configuration de la base de données
sudo -u postgres createdb portfolio_db

# Création de l'utilisateur pour le portfolio
sudo -u postgres psql -c "CREATE USER portfolio_user WITH PASSWORD 'portfolio_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;"
sudo -u postgres psql -c "ALTER USER portfolio_user CREATEDB;"

# Attribution des permissions sur le schéma public
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON SCHEMA public TO portfolio_user;"
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO portfolio_user;"
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO portfolio_user;"
sudo -u postgres psql -d portfolio_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO portfolio_user;"

# Vérification de la connexion
sudo -u postgres psql -d portfolio_db -c "SELECT current_database(), current_user;"
```

### 3. Déploiement du projet

```bash
# Clonage du projet
git clone https://github.com/hocineira/V3.git /var/www/portfolio
cd /var/www/portfolio

# Configuration des permissions
sudo chown -R $USER:$USER /var/www/portfolio
chmod -R 755 /var/www/portfolio

# Installation des dépendances backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Initialisation de la base de données avec les données de démonstration
python init_db.py

# Installation des dépendances frontend
cd ../frontend
npm install
npm run build
```

### 4. Configuration Nginx

```bash
# Création du fichier de configuration
sudo nano /etc/nginx/sites-available/portfolio
```

**Contenu du fichier :**
```nginx
server {
    listen 80;
    server_name localhost your-local-ip;
    
    root /var/www/portfolio/frontend/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Optimisation des fichiers statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        gzip_static on;
    }
}
```

**Activation du site :**
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configuration du backend

**Fichier d'environnement :**
```bash
# Création du fichier .env
cat > /var/www/portfolio/backend/.env << EOF
DATABASE_URL=postgresql://portfolio_user:portfolio_password@localhost/portfolio_db
ENVIRONMENT=development
EOF
```

**Service systemd :**
```bash
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
WorkingDirectory=/var/www/portfolio/backend
ExecStart=/var/www/portfolio/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10
Environment="DATABASE_URL=postgresql://portfolio_user:portfolio_password@localhost/portfolio_db"

[Install]
WantedBy=multi-user.target
```

**Activation du service :**
```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolio-backend
sudo systemctl start portfolio-backend
```

### 6. Vérification du déploiement

```bash
# Vérification des services
sudo systemctl status postgresql
sudo systemctl status nginx
sudo systemctl status portfolio-backend

# Test de l'API
curl http://localhost:8001/api/health

# Test du site
curl http://localhost
```

---

## 🪟 Configuration serveur Windows Server 2022

### 1. Installation des prérequis

#### A. Node.js
1. Téléchargez Node.js 18.x depuis https://nodejs.org/
2. Installez avec les options par défaut
3. Vérifiez l'installation : `node --version`

#### B. Python
1. Téléchargez Python 3.11 depuis https://python.org/
2. Cochez "Add Python to PATH" lors de l'installation
3. Vérifiez l'installation : `python --version`

#### C. PostgreSQL
1. Téléchargez PostgreSQL 15 depuis https://postgresql.org/
2. Installez avec les options par défaut
3. Notez le mot de passe administrateur
4. Démarrez le service PostgreSQL

#### D. Git
1. Téléchargez Git depuis https://git-scm.com/
2. Installez avec les options par défaut

### 2. Configuration de PostgreSQL

**PowerShell en tant qu'administrateur :**
```powershell
# Accès à PostgreSQL
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres

# Dans psql, créer la base de données
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'portfolio_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
ALTER USER portfolio_user CREATEDB;

# Quitter psql
\q
```

### 3. Configuration du projet

**PowerShell en tant qu'administrateur :**
```powershell
# Clonage du projet
git clone https://github.com/hocineira/V3.git C:\inetpub\wwwroot\portfolio
cd C:\inetpub\wwwroot\portfolio

# Installation des dépendances backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Configuration de l'environnement
echo "DATABASE_URL=postgresql://portfolio_user:portfolio_password@localhost/portfolio_db" > .env
echo "ENVIRONMENT=development" >> .env

# Initialisation de la base de données
python init_db.py

# Installation des dépendances frontend
cd ..\frontend
npm install
npm run build
```

### 4. Configuration IIS

#### A. Installation d'IIS
```powershell
# Installation d'IIS et URL Rewrite
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-HttpErrors, IIS-HttpRedirect, IIS-ApplicationDevelopment, IIS-NetFxExtensibility45, IIS-HealthAndDiagnostics, IIS-HttpLogging, IIS-Security, IIS-RequestFiltering, IIS-Performance, IIS-WebServerManagementTools, IIS-ManagementConsole, IIS-IIS6ManagementCompatibility, IIS-Metabase, IIS-ASPNET45
```

#### B. Configuration du site
1. Ouvrez **IIS Manager**
2. Cliquez droit sur **Sites** → **Add Website**
3. **Site name** : Portfolio
4. **Physical path** : `C:\inetpub\wwwroot\portfolio\frontend\build`
5. **Port** : 80
6. Cliquez **OK**

#### C. URL Rewrite pour React
**Fichier web.config dans le dossier build :**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="React Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

### 5. Configuration du service backend

**Fichier start-backend.bat :**
```batch
@echo off
cd /d C:\inetpub\wwwroot\portfolio\backend
venv\Scripts\activate
set DATABASE_URL=postgresql://portfolio_user:portfolio_password@localhost/portfolio_db
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

**Configuration en tant que service Windows :**
```powershell
# Installation de NSSM (Non-Sucking Service Manager)
# Téléchargez depuis https://nssm.cc/

# Configuration du service
nssm install PortfolioBackend C:\inetpub\wwwroot\portfolio\backend\start-backend.bat
nssm set PortfolioBackend DisplayName "Portfolio Backend API"
nssm set PortfolioBackend Description "Backend API pour le portfolio avec PostgreSQL"
nssm start PortfolioBackend
```

---

## 🔧 Scripts d'automatisation

### Script de déploiement Ubuntu
```bash
#!/bin/bash
# deploy-ubuntu.sh

set -e

echo "🚀 Déploiement du portfolio sur Ubuntu avec PostgreSQL..."

# Variables
PROJECT_DIR="/var/www/portfolio"
BACKUP_DIR="/backup/portfolio"
DB_NAME="portfolio_db"
DB_USER="portfolio_user"

# Création du backup
echo "📦 Création du backup..."
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Backup des fichiers
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz $PROJECT_DIR

# Backup de la base de données PostgreSQL
sudo -u postgres pg_dump $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Mise à jour du code
echo "🔄 Mise à jour du code..."
cd $PROJECT_DIR
git pull origin main

# Activation de l'environnement virtuel
source backend/venv/bin/activate

# Mise à jour des dépendances
echo "📦 Mise à jour des dépendances..."
cd backend
pip install -r requirements.txt

# Reconstruction du frontend
echo "🏗️ Reconstruction du frontend..."
cd ../frontend
npm install
npm run build

# Redémarrage des services
echo "🔄 Redémarrage des services..."
sudo systemctl restart portfolio-backend
sudo systemctl reload nginx

# Vérification
echo "✅ Vérification du déploiement..."
sleep 5

if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Site accessible"
else
    echo "❌ Erreur d'accès au site"
    exit 1
fi

if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo "✅ API accessible"
else
    echo "❌ Erreur d'accès à l'API"
    exit 1
fi

echo "🎉 Déploiement terminé avec succès!"
```

### Script de déploiement Windows
```batch
@echo off
REM deploy-windows.bat

echo 🚀 Déploiement du portfolio sur Windows avec PostgreSQL...

set PROJECT_DIR=C:\inetpub\wwwroot\portfolio
set BACKUP_DIR=C:\backup\portfolio
set DB_NAME=portfolio_db

REM Création du backup
echo 📦 Création du backup...
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%
set BACKUP_DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%

REM Backup des fichiers
powershell Compress-Archive -Path %PROJECT_DIR% -DestinationPath %BACKUP_DIR%\files_backup_%BACKUP_DATE%.zip

REM Backup de la base de données
"C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -U portfolio_user -h localhost -d %DB_NAME% > %BACKUP_DIR%\db_backup_%BACKUP_DATE%.sql

REM Mise à jour du code
echo 🔄 Mise à jour du code...
cd /d %PROJECT_DIR%
git pull origin main

REM Mise à jour des dépendances backend
echo 📦 Mise à jour des dépendances backend...
cd backend
venv\Scripts\activate
pip install -r requirements.txt

REM Reconstruction du frontend
echo 🏗️ Reconstruction du frontend...
cd ..\frontend
npm install
npm run build

REM Redémarrage des services
echo 🔄 Redémarrage des services...
net stop PortfolioBackend
net start PortfolioBackend
iisreset

echo 🎉 Déploiement terminé avec succès!
pause
```

---

## 🌍 Accès depuis le réseau local

### Configuration du firewall Ubuntu
```bash
# Autoriser les ports HTTP, HTTPS et PostgreSQL
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8001/tcp  # API backend
sudo ufw allow 5432/tcp  # PostgreSQL (si accès externe nécessaire)
sudo ufw enable
```

### Configuration du firewall Windows
```powershell
# Autoriser les ports HTTP, HTTPS et PostgreSQL
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Port 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -Port 443 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Portfolio API" -Direction Inbound -Port 8001 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -Port 5432 -Protocol TCP -Action Allow
```

### Accès depuis d'autres machines
- **Adresse locale** : `http://192.168.1.XXX` (remplacez par l'IP de votre serveur)
- **Nom d'hôte** : `http://nom-du-serveur.local`

---

## 🔍 Surveillance et logs

### Ubuntu
```bash
# Logs du serveur web
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs du backend
sudo journalctl -u portfolio-backend -f

# Logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Monitoring des ressources
htop
```

### Windows
```powershell
# Logs IIS
Get-EventLog -LogName System -Source "Microsoft-Windows-IIS-*" -Newest 50

# Logs du service backend
Get-EventLog -LogName Application -Source "PortfolioBackend" -Newest 50

# Logs PostgreSQL
Get-EventLog -LogName Application -Source "PostgreSQL" -Newest 50

# Monitoring des ressources
Get-Counter "\Processor(_Total)\% Processor Time"
```

---

## 🚀 Optimisations de performance

### Configuration Nginx (Ubuntu)
```nginx
# Ajout dans le fichier de configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    gzip_static on;
}

# Activation de la compression
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### Configuration PostgreSQL
```bash
# Optimisation PostgreSQL pour le portfolio
sudo nano /etc/postgresql/15/main/postgresql.conf
```

**Paramètres recommandés :**
```ini
# Optimisations pour petit serveur
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.7
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

### Configuration IIS (Windows)
```xml
<!-- Dans web.config -->
<system.webServer>
    <staticContent>
        <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" />
    </staticContent>
    <urlCompression doStaticCompression="true" doDynamicCompression="true" />
</system.webServer>
```

---

## 🛠️ Maintenance et sauvegardes

### Sauvegarde automatique Ubuntu
```bash
#!/bin/bash
# backup-portfolio.sh

BACKUP_DIR="/backup/portfolio"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/var/www/portfolio"

mkdir -p $BACKUP_DIR

# Backup des fichiers
tar -czf $BACKUP_DIR/files_$DATE.tar.gz $PROJECT_DIR

# Backup de la base de données
sudo -u postgres pg_dump portfolio_db > $BACKUP_DIR/db_$DATE.sql

# Nettoyage des anciennes sauvegardes (garder 7 jours)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Sauvegarde terminée: $DATE"
```

### Crontab pour sauvegarde quotidienne
```bash
# Éditer le crontab
crontab -e

# Ajouter la ligne suivante pour sauvegarde quotidienne à 2h du matin
0 2 * * * /path/to/backup-portfolio.sh
```

---

## 🔧 Dépannage

### Problèmes courants avec PostgreSQL

1. **Erreur de connexion à la base de données**
```bash
# Vérifier le statut de PostgreSQL
sudo systemctl status postgresql

# Vérifier les logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

2. **Permissions insuffisantes**
```bash
# Réattribuer les permissions
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON SCHEMA public TO portfolio_user;"
```

3. **Service backend ne démarre pas**
```bash
# Vérifier les logs
sudo journalctl -u portfolio-backend -f

# Vérifier la configuration
source /var/www/portfolio/backend/venv/bin/activate
cd /var/www/portfolio/backend
python -c "from database import engine; print('Database connection: OK')"
```

---

*Ce guide a été mis à jour pour utiliser PostgreSQL au lieu de MongoDB et est optimisé pour Ubuntu Server 24.04.2 et Windows Server 2022.*