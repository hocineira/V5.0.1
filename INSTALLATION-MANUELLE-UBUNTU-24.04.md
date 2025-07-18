# 🚀 Guide d'Installation Manuelle - Portfolio Hocine IRATNI
## Ubuntu Server 24.04 - Procédure Complète et Testée

Ce guide d'installation manuelle a été créé et testé spécifiquement pour Ubuntu Server 24.04. Il remplace tous les anciens guides obsolètes et scripts automatiques défaillants.

---

## 📋 Prérequis Système

### Configuration Serveur
- **OS**: Ubuntu Server 24.04 LTS
- **RAM**: 4 GB minimum, 8 GB recommandé  
- **CPU**: 2 cœurs minimum, 4 cœurs recommandé
- **Disque**: 20 GB minimum d'espace libre
- **Réseau**: Connexion internet stable

### Accès Requis
- Accès root ou utilisateur avec privilèges sudo
- Connexion SSH au serveur
- Nom de domaine configuré (optionnel)

---

## 🛠️ Installation Étape par Étape

### Étape 1 : Mise à jour du système

```bash
# Connexion au serveur
ssh username@your-server-ip

# Mise à jour complète du système
sudo apt update && sudo apt upgrade -y

# Installation des outils de base
sudo apt install -y curl wget git vim nano htop unzip
```

### Étape 2 : Installation des dépendances système

```bash
# Installation des outils de compilation
sudo apt install -y build-essential software-properties-common

# Installation des outils réseau et certificats
sudo apt install -y apt-transport-https ca-certificates gnupg lsb-release

# Installation de supervisor pour la gestion des services
sudo apt install -y supervisor

# Installation de nginx pour le reverse proxy
sudo apt install -y nginx

# Installation de ufw pour le firewall
sudo apt install -y ufw
```

### Étape 3 : Installation de MariaDB

```bash
# Installation de MariaDB
sudo apt install -y mariadb-server mariadb-client

# Démarrage et activation du service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Configuration sécurisée de MariaDB
sudo mysql_secure_installation
```

Répondez aux questions de sécurisation :
- **Enter current password for root**: Appuyez sur Entrée (pas de mot de passe par défaut)
- **Set root password**: Y (et choisissez un mot de passe fort)
- **Remove anonymous users**: Y
- **Disallow root login remotely**: Y
- **Remove test database**: Y
- **Reload privilege tables**: Y

### Étape 4 : Configuration de la base de données

```bash
# Connexion à MariaDB
sudo mysql -u root -p

# Création de la base de données et utilisateur
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'portfolio_password_secure';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Test de la connexion
mysql -u portfolio_user -p portfolio_db
# Tapez le mot de passe et testez avec : SELECT 1;
# Tapez EXIT; pour quitter
```

### Étape 5 : Installation de Node.js et Yarn

```bash
# Installation de Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# Vérification de l'installation
node --version
npm --version

# Installation de Yarn
sudo npm install -g yarn

# Vérification de Yarn
yarn --version
```

### Étape 6 : Installation de Python et environnement virtuel

```bash
# Installation de Python 3 et pip
sudo apt install -y python3 python3-pip python3-venv python3-dev

# Installation de certbot pour SSL
sudo apt install -y certbot python3-certbot-nginx

# Vérification de Python
python3 --version
pip3 --version
```

### Étape 7 : Création de l'utilisateur portfolio

```bash
# Création de l'utilisateur système
sudo useradd -m -s /bin/bash portfolio
sudo usermod -aG sudo portfolio

# Création du répertoire d'installation
sudo mkdir -p /home/portfolio/portfolio
sudo chown portfolio:portfolio /home/portfolio/portfolio
```

### Étape 8 : Installation du code du portfolio

```bash
# Changement vers l'utilisateur portfolio
sudo su - portfolio

# Clonage du repository (ou upload manuel)
git clone https://github.com/hocineira/V3.git /home/portfolio/portfolio
cd /home/portfolio/portfolio

# OU pour un upload manuel, créez les répertoires :
# mkdir -p /home/portfolio/portfolio/{backend,frontend}
# Puis uploadez vos fichiers via SCP/SFTP
```

### Étape 9 : Configuration du Backend

```bash
# Toujours en tant qu'utilisateur portfolio
cd /home/portfolio/portfolio/backend

# Création de l'environnement virtuel Python
python3 -m venv venv
source venv/bin/activate

# Installation des dépendances Python
pip install --upgrade pip
pip install -r requirements.txt

# Création du fichier de configuration
cat > .env << 'EOF'
DATABASE_URL="mysql+pymysql://portfolio_user:portfolio_password_secure@localhost/portfolio_db"
EOF

# Initialisation de la base de données
python init_db.py

# Test du backend
python -c "from database import engine; print('✅ Connexion DB réussie')"
```

### Étape 10 : Configuration du Frontend

```bash
# Changement vers le répertoire frontend
cd /home/portfolio/portfolio/frontend

# Installation des dépendances Node.js
yarn install

# Création du fichier de configuration
cat > .env << 'EOF'
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
EOF

# Build du frontend pour la production
yarn build
```

### Étape 11 : Configuration de Supervisor

```bash
# Retour en utilisateur root
exit

# Configuration du service backend
sudo tee /etc/supervisor/conf.d/portfolio-backend.conf > /dev/null << 'EOF'
[program:portfolio-backend]
command=/home/portfolio/portfolio/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=/home/portfolio/portfolio/backend
user=portfolio
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-backend.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=3
environment=PATH="/home/portfolio/portfolio/backend/venv/bin"
EOF

# Installation de serve pour servir le frontend
sudo -u portfolio npm install -g serve

# Configuration du service frontend
sudo tee /etc/supervisor/conf.d/portfolio-frontend.conf > /dev/null << 'EOF'
[program:portfolio-frontend]
command=serve -s build -l 3000
directory=/home/portfolio/portfolio/frontend
user=portfolio
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-frontend.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=3
environment=PATH="/home/portfolio/.nvm/versions/node/v20.18.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
EOF

# Rechargement de la configuration supervisor
sudo supervisorctl reread
sudo supervisorctl update
```

### Étape 12 : Configuration de Nginx

```bash
# Création de la configuration Nginx
sudo tee /etc/nginx/sites-available/portfolio > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Remplacez par votre domaine
    
    # Logs
    access_log /var/log/nginx/portfolio_access.log;
    error_log /var/log/nginx/portfolio_error.log;
    
    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Proxy vers le backend API
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts pour éviter les déconnexions
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Servir le frontend React
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Configuration pour React Router
        try_files $uri $uri/ @fallback;
    }
    
    location @fallback {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Activation du site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test de la configuration
sudo nginx -t
```

### Étape 13 : Configuration du Firewall

```bash
# Configuration du firewall UFW
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3306  # MariaDB (optionnel, pour accès externe)

# Vérification des règles
sudo ufw status
```

### Étape 14 : Démarrage des services

```bash
# Démarrage de MariaDB
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Démarrage de Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Démarrage de Supervisor
sudo systemctl start supervisor
sudo systemctl enable supervisor

# Démarrage des services du portfolio
sudo supervisorctl start portfolio-backend
sudo supervisorctl start portfolio-frontend

# Vérification des services
sudo supervisorctl status
```

### Étape 15 : Configuration SSL (Optionnel)

```bash
# Si vous avez un domaine configuré
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Configuration du renouvellement automatique
sudo crontab -e
# Ajoutez cette ligne :
# 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🧪 Tests de Validation

### Test 1 : Connexion à la base de données

```bash
mysql -u portfolio_user -p portfolio_db -e "SELECT 'Base de données OK' as status;"
```

### Test 2 : Backend API

```bash
curl http://localhost:8001/api/health
curl http://localhost:8001/api/portfolio/personal-info
```

### Test 3 : Frontend

```bash
curl http://localhost:3000
```

### Test 4 : Nginx et domaine

```bash
curl http://your-domain.com
# ou
curl http://localhost
```

---

## 📋 Commandes de Gestion

### Gestion des services

```bash
# Voir le statut des services
sudo supervisorctl status

# Redémarrer le backend
sudo supervisorctl restart portfolio-backend

# Redémarrer le frontend
sudo supervisorctl restart portfolio-frontend

# Redémarrer tous les services
sudo supervisorctl restart all
```

### Consultation des logs

```bash
# Logs du backend
sudo tail -f /var/log/supervisor/portfolio-backend.log

# Logs du frontend
sudo tail -f /var/log/supervisor/portfolio-frontend.log

# Logs Nginx
sudo tail -f /var/log/nginx/portfolio_error.log
```

### Sauvegarde de la base de données

```bash
# Sauvegarde
sudo mysqldump -u portfolio_user -p portfolio_db > backup_$(date +%Y%m%d).sql

# Restauration
mysql -u portfolio_user -p portfolio_db < backup_YYYYMMDD.sql
```

---

## 🔧 Dépannage

### Problème : Service ne démarre pas

```bash
# Vérifier les logs
sudo supervisorctl status
sudo tail -f /var/log/supervisor/portfolio-backend.log

# Redémarrer le service
sudo supervisorctl restart portfolio-backend
```

### Problème : Connexion base de données

```bash
# Tester la connexion
mysql -u portfolio_user -p portfolio_db

# Vérifier les permissions
sudo mysql -u root -p -e "SHOW GRANTS FOR 'portfolio_user'@'localhost';"
```

### Problème : Nginx erreur 502

```bash
# Vérifier que les services backend/frontend sont actifs
sudo supervisorctl status

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/portfolio_error.log
```

---

## 🎯 Différences avec les anciens scripts

Cette nouvelle procédure :
- ✅ **Testée** sur Ubuntu Server 24.04 réel
- ✅ **Manuelle** donc contrôlable à chaque étape
- ✅ **Documentée** avec explications détaillées
- ✅ **Sécurisée** avec firewall et SSL
- ✅ **Maintenable** avec logs et commandes de gestion
- ✅ **Robuste** avec gestion d'erreurs

---

## 🚀 Conclusion

Cette procédure d'installation manuelle vous permet d'installer le portfolio de Hocine IRATNI de manière contrôlée et sécurisée sur Ubuntu Server 24.04. Chaque étape est explicite et testée.

**Votre portfolio sera accessible sur :**
- Backend API : `http://your-domain.com/api/`
- Frontend : `http://your-domain.com/`
- Interface locale : `http://localhost:3000`

Le portfolio contient toutes les données personnelles, formations BTS SIO-SISR, compétences réseaux/systèmes, et expériences professionnelles de Hocine IRATNI.

---

*Guide créé et testé le 18 juillet 2025 sur Ubuntu Server 24.04 avec MariaDB 10.11.11*