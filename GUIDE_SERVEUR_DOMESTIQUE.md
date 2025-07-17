# 🏠 Guide de test sur serveur domestique

## 🖥️ Configuration serveur Ubuntu

### 1. Préparation du serveur Ubuntu

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances nécessaires
sudo apt install -y curl wget gnupg software-properties-common

# Installation de Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de Python 3 et pip
sudo apt install -y python3 python3-pip python3-venv

# Installation de MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Installation de Nginx
sudo apt install -y nginx

# Démarrage des services
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Déploiement du projet

```bash
# Clonage du projet
git clone https://github.com/hocineira/siteweb.git /var/www/portfolio
cd /var/www/portfolio

# Configuration des permissions
sudo chown -R $USER:$USER /var/www/portfolio
chmod -R 755 /var/www/portfolio

# Installation des dépendances backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Installation des dépendances frontend
cd ../frontend
npm install
npm run build
```

### 3. Configuration Nginx

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
}
```

**Activation du site :**
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Configuration du backend

**Fichier d'environnement :**
```bash
# Création du fichier .env
cat > /var/www/portfolio/backend/.env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
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
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/portfolio/backend
ExecStart=/var/www/portfolio/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

**Activation du service :**
```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolio-backend
sudo systemctl start portfolio-backend
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

#### C. MongoDB
1. Téléchargez MongoDB Community Server depuis https://mongodb.com/
2. Installez avec les options par défaut
3. Démarrez le service MongoDB

#### D. Git
1. Téléchargez Git depuis https://git-scm.com/
2. Installez avec les options par défaut

### 2. Configuration du projet

**PowerShell en tant qu'administrateur :**
```powershell
# Clonage du projet
git clone https://github.com/hocineira/siteweb.git C:\inetpub\wwwroot\portfolio
cd C:\inetpub\wwwroot\portfolio

# Installation des dépendances backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Installation des dépendances frontend
cd ..\frontend
npm install
npm run build
```

### 3. Configuration IIS

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

### 4. Configuration du service backend

**Fichier start-backend.bat :**
```batch
@echo off
cd /d C:\inetpub\wwwroot\portfolio\backend
venv\Scripts\activate
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

**Configuration en tant que service Windows :**
```powershell
# Installation de NSSM (Non-Sucking Service Manager)
# Téléchargez depuis https://nssm.cc/

# Configuration du service
nssm install PortfolioBackend C:\inetpub\wwwroot\portfolio\backend\start-backend.bat
nssm set PortfolioBackend DisplayName "Portfolio Backend API"
nssm set PortfolioBackend Description "Backend API pour le portfolio"
nssm start PortfolioBackend
```

---

## 🔧 Scripts d'automatisation

### Script de déploiement Ubuntu
```bash
#!/bin/bash
# deploy-ubuntu.sh

set -e

echo "🚀 Déploiement du portfolio sur Ubuntu..."

# Variables
PROJECT_DIR="/var/www/portfolio"
BACKUP_DIR="/backup/portfolio"

# Création du backup
echo "📦 Création du backup..."
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).tar.gz $PROJECT_DIR

# Mise à jour du code
echo "🔄 Mise à jour du code..."
cd $PROJECT_DIR
git pull origin main

# Reconstruction du frontend
echo "🏗️ Reconstruction du frontend..."
cd frontend
npm install
npm run build

# Redémarrage des services
echo "🔄 Redémarrage des services..."
sudo systemctl restart portfolio-backend
sudo systemctl reload nginx

# Vérification
echo "✅ Vérification du déploiement..."
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Site accessible"
else
    echo "❌ Erreur d'accès au site"
    exit 1
fi

if curl -f http://localhost/api > /dev/null 2>&1; then
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

echo 🚀 Déploiement du portfolio sur Windows...

set PROJECT_DIR=C:\inetpub\wwwroot\portfolio
set BACKUP_DIR=C:\backup\portfolio

REM Création du backup
echo 📦 Création du backup...
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%
powershell Compress-Archive -Path %PROJECT_DIR% -DestinationPath %BACKUP_DIR%\backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.zip

REM Mise à jour du code
echo 🔄 Mise à jour du code...
cd /d %PROJECT_DIR%
git pull origin main

REM Reconstruction du frontend
echo 🏗️ Reconstruction du frontend...
cd frontend
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
# Autoriser les ports HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8001/tcp  # API backend
sudo ufw enable
```

### Configuration du firewall Windows
```powershell
# Autoriser les ports HTTP et HTTPS
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Port 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -Port 443 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Portfolio API" -Direction Inbound -Port 8001 -Protocol TCP -Action Allow
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

# Monitoring des ressources
htop
```

### Windows
```powershell
# Logs IIS
Get-EventLog -LogName System -Source "Microsoft-Windows-IIS-*" -Newest 50

# Logs du service backend
Get-EventLog -LogName Application -Source "PortfolioBackend" -Newest 50

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

*Ce guide vous permet de tester votre portfolio sur votre infrastructure domestique avant le déploiement en production.*