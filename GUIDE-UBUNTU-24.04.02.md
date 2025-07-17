# Guide d'Installation - Portfolio Hocine IRATNI
## Ubuntu Server 24.04.02 - Version MariaDB

Ce guide vous permettra d'installer et configurer complètement le portfolio de Hocine IRATNI sur Ubuntu Server 24.04.02 avec MariaDB.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation automatique](#installation-automatique)
3. [Installation manuelle](#installation-manuelle)
4. [Configuration](#configuration)
5. [Validation](#validation)
6. [Maintenance](#maintenance)
7. [Dépannage](#dépannage)

## 🎯 Prérequis

### Configuration serveur minimale
- **OS**: Ubuntu Server 24.04.02 LTS
- **RAM**: 2GB minimum, 4GB recommandé
- **Disque**: 20GB minimum, 50GB recommandé
- **CPU**: 2 cores minimum
- **Réseau**: Connexion internet stable

### Domaine et DNS
- Nom de domaine pointant vers votre serveur (ex: iratnihocine.fr)
- Enregistrements DNS configurés (A et AAAA)
- Ports 80 et 443 ouverts

### Accès serveur
- Accès root ou utilisateur sudo
- Connexion SSH configurée

## 🚀 Installation automatique

### 1. Télécharger le script d'installation

```bash
wget https://raw.githubusercontent.com/hocineira/V3/main/install-ubuntu-24.04.02.sh
chmod +x install-ubuntu-24.04.02.sh
```

### 2. Configurer le domaine

Modifiez la variable DOMAIN dans le script :

```bash
nano install-ubuntu-24.04.02.sh
# Changez la ligne :
DOMAIN="iratnihocine.fr"  # Remplacez par votre domaine
```

### 3. Lancer l'installation

```bash
sudo ./install-ubuntu-24.04.02.sh
```

L'installation complète prend environ 15-20 minutes.

## 🔧 Installation manuelle

Si vous préférez une installation étape par étape :

### 1. Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installation des dépendances

```bash
sudo apt install -y curl wget git build-essential software-properties-common \
    apt-transport-https ca-certificates gnupg lsb-release \
    unzip supervisor nginx certbot python3-certbot-nginx \
    python3 python3-pip python3-venv htop nano vim
```

### 3. Installation de MariaDB

```bash
sudo apt install -y mariadb-server mariadb-client
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo mysql_secure_installation
```

### 4. Installation de Node.js et Yarn

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
sudo npm install -g yarn
```

### 5. Création de l'utilisateur portfolio

```bash
sudo useradd -m -s /bin/bash portfolio
sudo usermod -aG sudo portfolio
```

### 6. Clonage du repository

```bash
sudo -u portfolio git clone https://github.com/hocineira/V3.git /home/portfolio/portfolio
```

### 7. Configuration de la base de données

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE portfolio_db;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'portfolio_password';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 8. Configuration du backend

```bash
cd /home/portfolio/portfolio/backend
sudo -u portfolio python3 -m venv venv
sudo -u portfolio ./venv/bin/pip install -r requirements.txt

# Créer le fichier .env
echo 'DATABASE_URL="mysql+pymysql://portfolio_user:portfolio_password@localhost/portfolio_db"' | sudo -u portfolio tee .env

# Initialiser la base de données
sudo -u portfolio ./venv/bin/python init_db.py
sudo -u portfolio ./venv/bin/python update_portfolio_data.py
```

### 9. Configuration du frontend

```bash
cd /home/portfolio/portfolio/frontend
echo 'REACT_APP_BACKEND_URL=https://votre-domaine.com/api' | sudo -u portfolio tee .env
sudo -u portfolio yarn install
sudo -u portfolio yarn build
```

### 10. Configuration de Supervisor

Créez `/etc/supervisor/conf.d/portfolio-backend.conf` :

```ini
[program:portfolio-backend]
command=/home/portfolio/portfolio/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=/home/portfolio/portfolio/backend
user=portfolio
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-backend.log
environment=DATABASE_URL="mysql+pymysql://portfolio_user:portfolio_password@localhost/portfolio_db"
```

Créez `/etc/supervisor/conf.d/portfolio-frontend.conf` :

```ini
[program:portfolio-frontend]
command=serve -s build -l 3000
directory=/home/portfolio/portfolio/frontend
user=portfolio
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/supervisor/portfolio-frontend.log
```

### 11. Configuration de Nginx

Créez `/etc/nginx/sites-available/portfolio` :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;
    
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 12. Configuration SSL

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

### 13. Démarrage des services

```bash
sudo systemctl restart nginx
sudo systemctl restart supervisor
sudo supervisorctl start portfolio-backend
sudo supervisorctl start portfolio-frontend
```

## ✅ Validation

### 1. Télécharger le script de validation

```bash
wget https://raw.githubusercontent.com/hocineira/V3/main/validate-ubuntu-24.04.02.sh
chmod +x validate-ubuntu-24.04.02.sh
```

### 2. Configurer le domaine

Modifiez la variable DOMAIN :

```bash
nano validate-ubuntu-24.04.02.sh
# Changez la ligne :
DOMAIN="iratnihocine.fr"  # Remplacez par votre domaine
```

### 3. Lancer la validation

```bash
sudo ./validate-ubuntu-24.04.02.sh
```

Le script vérifie :
- ✅ Prérequis système
- ✅ Services actifs
- ✅ Base de données configurée
- ✅ Données de Hocine présentes
- ✅ Connectivité API
- ✅ SSL configuré
- ✅ Performance

## 🔧 Maintenance

### Commandes de gestion

Le script d'installation crée un utilitaire de gestion :

```bash
# Démarrer le portfolio
sudo portfolio-manage start

# Arrêter le portfolio
sudo portfolio-manage stop

# Redémarrer le portfolio
sudo portfolio-manage restart

# Vérifier le status
sudo portfolio-manage status

# Voir les logs
sudo portfolio-manage logs backend
sudo portfolio-manage logs frontend
sudo portfolio-manage logs nginx

# Mettre à jour
sudo portfolio-manage update

# Tester
sudo portfolio-manage test
```

### Maintenance régulière

#### Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

#### Vérification des logs
```bash
# Logs backend
tail -f /var/log/supervisor/portfolio-backend.log

# Logs frontend
tail -f /var/log/supervisor/portfolio-frontend.log

# Logs nginx
tail -f /var/log/nginx/portfolio_error.log
```

#### Sauvegarde de la base de données
```bash
sudo mysqldump -u portfolio_user -p portfolio_db > backup_$(date +%Y%m%d).sql
```

#### Renouvellement SSL
```bash
sudo certbot renew --dry-run
```

## 🛠️ Dépannage

### Problèmes courants

#### Service backend ne démarre pas
```bash
# Vérifier les logs
sudo portfolio-manage logs backend

# Vérifier la base de données
mysql -u portfolio_user -p portfolio_db
```

#### Frontend non accessible
```bash
# Vérifier le service
sudo supervisorctl status portfolio-frontend

# Reconstruire
cd /home/portfolio/portfolio/frontend
sudo -u portfolio yarn build
sudo supervisorctl restart portfolio-frontend
```

#### Problème SSL
```bash
# Vérifier le certificat
sudo certbot certificates

# Renouveler
sudo certbot renew
```

#### Problème de permissions
```bash
# Corriger les permissions
sudo chown -R portfolio:portfolio /home/portfolio/portfolio
```

### Logs utiles

```bash
# Journaux système
sudo journalctl -u nginx -f
sudo journalctl -u supervisor -f

# Logs applicatifs
tail -f /var/log/supervisor/portfolio-*.log
tail -f /var/log/nginx/portfolio_*.log
```

### Commandes de diagnostic

```bash
# Vérifier les services
sudo systemctl status nginx
sudo systemctl status supervisor
sudo systemctl status mariadb

# Vérifier les ports
sudo netstat -tlnp | grep -E ':80|:443|:3000|:8001'

# Vérifier les processus
ps aux | grep -E 'nginx|supervisor|node|python'

# Tester la connectivité
curl -I http://localhost:8001/api/health
curl -I http://localhost:3000
curl -I https://votre-domaine.com
```

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs avec `portfolio-manage logs`
2. Relancez la validation avec `./validate-ubuntu-24.04.02.sh`
3. Consultez la documentation technique dans le repository
4. Contactez le support technique

## 🔐 Sécurité

### Recommandations de sécurité

1. **Firewall** : Configuré automatiquement avec UFW
2. **SSL** : Certificat Let's Encrypt avec renouvellement automatique
3. **Nginx** : Headers de sécurité configurés
4. **Base de données** : Utilisateur dédié avec permissions limitées
5. **Système** : Mises à jour régulières recommandées

### Surveillance

```bash
# Vérifier les tentatives de connexion
sudo tail -f /var/log/auth.log

# Vérifier les accès web
sudo tail -f /var/log/nginx/portfolio_access.log

# Vérifier l'état SSL
sudo certbot certificates
```

---

## 🎉 Félicitations !

Votre portfolio Hocine IRATNI est maintenant installé et configuré sur Ubuntu Server 24.04.02 avec MariaDB. 

Le site est accessible à l'adresse configurée avec toutes les données personnelles, formations BTS SIO-SISR, compétences réseaux et systèmes, et expériences professionnelles.

### Fonctionnalités disponibles :
- ✅ Portfolio complet avec données personnelles
- ✅ Formations (BTS SIO, Licence, Bac)
- ✅ Compétences réseaux et systèmes
- ✅ Expérience stage sauvegarde13
- ✅ Certification CISCO CCNA
- ✅ Projets BTS SIO
- ✅ Veille technologique et juridique
- ✅ SSL/HTTPS configuré
- ✅ Sauvegarde et monitoring
- ✅ Outils de gestion intégrés