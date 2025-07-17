# 🌐 Guide d'hébergement LWS pour votre Portfolio

## 📋 Prérequis
- Domaine acheté chez LWS
- Accès à votre espace client LWS
- Projet portfolio terminé et testé en local

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

**Étapes :**
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

**Note importante :** Pour un site React, vous devez configurer la réécriture d'URL.

**Fichier `.htaccess` à créer dans `public_html/` :**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

#### Option B: VPS LWS (Serveur privé virtuel)

**Prérequis serveur :**
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install nginx nodejs npm python3 python3-pip mongodb
```

**Configuration Nginx :**
```nginx
# /etc/nginx/sites-available/votredomaine.com
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;
    
    root /var/www/votredomaine.com/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API Backend (si nécessaire)
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
    }
}
```

**Activation du site :**
```bash
sudo ln -s /etc/nginx/sites-available/votredomaine.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 🔐 Configuration SSL (HTTPS)

#### Pour cPanel :
1. **Accédez à "SSL/TLS" dans cPanel**
2. **Activez "Let's Encrypt SSL"**
3. **Sélectionnez votre domaine**
4. **Cliquez sur "Issue"**

#### Pour VPS :
```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx

# Obtention du certificat SSL
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com

# Vérification du renouvellement automatique
sudo certbot renew --dry-run
```

### 4. 📊 Configuration de la base de données

#### Option A: Base de données MySQL (cPanel)
Si votre portfolio utilise une base de données, vous devrez :
1. **Créer une base de données MySQL via cPanel**
2. **Adapter votre backend pour utiliser MySQL au lieu de MongoDB**
3. **Modifier les variables d'environnement**

#### Option B: MongoDB (VPS)
```bash
# Installation de MongoDB
sudo apt install mongodb

# Démarrage et activation
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Configuration de base
mongo
> use portfolio_db
> db.createUser({
    user: "portfolio_user",
    pwd: "mot_de_passe_securise",
    roles: ["readWrite"]
})
```

### 5. 🚀 Déploiement du backend (si nécessaire)

#### Pour VPS LWS :
```bash
# Clonage du projet
git clone https://github.com/hocineira/siteweb.git /var/www/votredomaine.com
cd /var/www/votredomaine.com

# Installation des dépendances
pip3 install -r backend/requirements.txt

# Configuration du service systemd
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
WorkingDirectory=/var/www/votredomaine.com/backend
ExecStart=/usr/bin/python3 -m uvicorn server:app --host 0.0.0.0 --port 8001
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

### 6. 🌍 Configuration DNS

#### Dans votre espace client LWS :
1. **Accédez à "Gestion DNS"**
2. **Configurez les enregistrements suivants :**

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| A | @ | IP_DE_VOTRE_SERVEUR | 3600 |
| CNAME | www | votredomaine.com | 3600 |
| A | api | IP_DE_VOTRE_SERVEUR | 3600 |

### 7. 📝 Variables d'environnement

#### Pour cPanel (pas de backend) :
Votre site sera entièrement statique.

#### Pour VPS (avec backend) :
```bash
# Création du fichier .env
cat > /var/www/votredomaine.com/backend/.env << EOF
MONGO_URL=mongodb://portfolio_user:mot_de_passe_securise@localhost:27017/portfolio_db
DB_NAME=portfolio_db
ENVIRONMENT=production
EOF
```

### 8. 🔍 Vérification du déploiement

#### Tests à effectuer :
1. **Accès au site** : `https://votredomaine.com`
2. **Redirection www** : `https://www.votredomaine.com`
3. **SSL actif** : Vérifier le cadenas dans le navigateur
4. **API fonctionnelle** : `https://votredomaine.com/api/` (si applicable)

### 9. 📈 Monitoring et maintenance

#### Logs importants à surveiller :
```bash
# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Logs de votre application
sudo journalctl -u portfolio-backend -f

# Logs système
sudo tail -f /var/log/syslog
```

#### Sauvegardes recommandées :
```bash
# Script de sauvegarde
#!/bin/bash
BACKUP_DIR="/backup/portfolio"
DATE=$(date +%Y%m%d_%H%M%S)

# Sauvegarde des fichiers
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/votredomaine.com

# Sauvegarde de la base de données
mongodump --db portfolio_db --out $BACKUP_DIR/db_$DATE
```

---

## 🛠️ Résolution des problèmes courants

### Problème 1: Site ne s'affiche pas
**Solutions :**
- Vérifier que le fichier `index.html` est dans le bon dossier
- Vérifier les permissions des fichiers (644 pour les fichiers, 755 pour les dossiers)
- Vérifier la configuration DNS

### Problème 2: Erreur 404 sur les pages
**Solution :** Vérifier le fichier `.htaccess` (cPanel) ou la configuration Nginx

### Problème 3: HTTPS ne fonctionne pas
**Solutions :**
- Vérifier l'installation du certificat SSL
- Forcer la redirection HTTP vers HTTPS
- Vérifier la configuration du firewall

### Problème 4: API non accessible
**Solutions :**
- Vérifier que le service backend est démarré
- Vérifier les règles de firewall
- Vérifier la configuration Nginx pour le proxy

---

## 📞 Support LWS

**En cas de problème :**
1. **Documentation LWS** : https://aide.lws.fr/
2. **Support technique LWS** : Via votre espace client
3. **Forums communautaires** : Recherchez des solutions similaires

---

## 🔄 Mise à jour du site

### Processus de mise à jour :
1. **Modification locale** de votre code
2. **Test en local**
3. **Commit et push** vers GitHub
4. **Reconstruction** : `npm run build`
5. **Upload** des nouveaux fichiers
6. **Vérification** du site en ligne

### Automatisation (pour VPS) :
```bash
# Script de déploiement automatique
#!/bin/bash
cd /var/www/votredomaine.com
git pull origin main
cd frontend
npm install
npm run build
sudo systemctl restart portfolio-backend
sudo systemctl reload nginx
```

---

*Ce guide est spécifiquement adapté pour l'hébergement LWS. Adaptez les instructions selon votre type d'hébergement spécifique.*