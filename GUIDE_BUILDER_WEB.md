# 🌟 Guide du Builder Web - Portfolio Hocine IRATNI (PostgreSQL)

## 📋 Table des matières
1. [Compréhension du projet](#1-compréhension-du-projet)
2. [Configuration initiale](#2-configuration-initiale)
3. [Modifications simples](#3-modifications-simples)
4. [Gestion des images](#4-gestion-des-images)
5. [Ajout de procédures](#5-ajout-de-procédures)
6. [Test local](#6-test-local)
7. [Hébergement avec votre domaine](#7-hébergement-avec-votre-domaine)

---

## 1. Compréhension du projet

### 🏗️ Structure de votre portfolio
```
siteweb/
├── frontend/           # Interface utilisateur (React)
│   ├── src/
│   │   ├── components/    # Composants de l'interface
│   │   ├── hooks/        # Logique de données
│   │   └── services/     # Communication avec le backend
│   └── public/           # Images et fichiers statiques
├── backend/            # Serveur API (Python FastAPI)
│   ├── routes/          # Routes de l'API
│   ├── models.py        # Structure des données (Pydantic)
│   ├── db_models.py     # Modèles de base de données (SQLAlchemy)
│   ├── database.py      # Configuration PostgreSQL
│   ├── server.py        # Serveur principal
│   └── init_db.py       # Initialisation de la base de données
└── README.md           # Documentation
```

### 🔧 Technologies utilisées
- **Frontend**: React + Tailwind CSS (Interface utilisateur)
- **Backend**: FastAPI (API Python)
- **Base de données**: PostgreSQL avec SQLAlchemy (Stockage des données)
- **ORM**: SQLAlchemy pour les requêtes de base de données
- **Hébergement**: Compatible avec tout hébergeur supportant Node.js, Python et PostgreSQL

---

## 2. Configuration initiale

### 📥 Cloner votre projet
```bash
# Cloner le repository
git clone https://github.com/hocineira/siteweb.git
cd siteweb

# Installer les dépendances frontend
cd frontend
npm install  # ou yarn install

# Installer les dépendances backend
cd ../backend
pip install -r requirements.txt
```

### 🗄️ Configuration de PostgreSQL
1. **Installation de PostgreSQL** (si pas déjà installé)
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Créer la base de données
sudo -u postgres createdb portfolio_db

# Créer l'utilisateur
sudo -u postgres psql -c "CREATE USER portfolio_user WITH PASSWORD 'portfolio_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;"
sudo -u postgres psql -c "ALTER USER portfolio_user CREATEDB;"
```

2. **Permissions sur le schéma**
```bash
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON SCHEMA public TO portfolio_user;"
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO portfolio_user;"
sudo -u postgres psql -d portfolio_db -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO portfolio_user;"
sudo -u postgres psql -d portfolio_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO portfolio_user;"
```

### 🔧 Configuration de base
1. **Fichier `.env` frontend** (`frontend/.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

2. **Fichier `.env` backend** (`backend/.env`)
```env
DATABASE_URL=postgresql://portfolio_user:portfolio_password@localhost/portfolio_db
ENVIRONMENT=development
```

3. **Initialisation de la base de données**
```bash
cd backend
python init_db.py
```

---

## 3. Modifications simples

### ✏️ Modifier le texte principal

**Fichier à modifier**: `frontend/src/components/Portfolio.js`

#### 🎯 Exemples de modifications courantes:

1. **Changer le nom et titre**
```javascript
// Ligne ~106-109
<h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
  Hocine IRATNI  {/* ← Modifiez ici */}
</h1>
<h2 className="text-3xl font-semibold mb-2">Développeur Full Stack</h2>  {/* ← Modifiez ici */}
```

2. **Changer la description**
```javascript
// Ligne ~111-113
<p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
  Votre nouvelle description ici...  {/* ← Modifiez ici */}
</p>
```

3. **Modifier les informations de contact**
```javascript
// Recherchez "personalInfo?.email" et modifiez les données correspondantes
// Les données sont maintenant stockées dans PostgreSQL
```

### 🎨 Changer les couleurs du thème

**Fichier**: `frontend/src/components/Portfolio.js`

```javascript
// Remplacez "blue-600" par votre couleur préférée
// Couleurs disponibles: red, green, blue, purple, indigo, pink, yellow, gray

// Exemple: changer de bleu à vert
from-blue-600 to-purple-600  →  from-green-600 to-teal-600
```

### 🗃️ Modifier les données directement dans PostgreSQL

**Connexion à la base de données :**
```bash
# Connexion via psql
psql -U portfolio_user -d portfolio_db -h localhost

# Ou via votre client PostgreSQL préféré (pgAdmin, DBeaver, etc.)
```

**Exemples de requêtes :**
```sql
-- Modifier les informations personnelles
UPDATE personal_info SET 
    name = 'Votre Nouveau Nom',
    title = 'Votre Nouveau Titre',
    description = 'Votre nouvelle description...'
WHERE id = (SELECT id FROM personal_info LIMIT 1);

-- Ajouter une nouvelle compétence
INSERT INTO skill_categories (category, items) VALUES (
    'Nouvelle Catégorie',
    '[{"name": "PostgreSQL", "level": 90}, {"name": "Python", "level": 85}]'
);

-- Voir toutes les procédures
SELECT title, description FROM procedures;
```

---

## 4. Gestion des images

### 📸 Ajouter votre photo de profil

1. **Ajoutez votre image** dans `frontend/public/images/`
2. **Modifiez le composant Avatar** dans `Portfolio.js`:
```javascript
// Ligne ~100-105
<Avatar className="w-32 h-32 mx-auto mb-8 border-4 border-white/20 shadow-2xl">
  <AvatarImage src="/images/votre-photo.jpg" alt="Hocine IRATNI" />
  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
    HI
  </AvatarFallback>
</Avatar>
```

### 🖼️ Ajouter des images de projets

**Important** : Les images doivent être converties en base64 pour PostgreSQL

1. **Convertir l'image en base64**
```bash
# Convertir une image en base64
base64 -w 0 votre-image.jpg > image_base64.txt

# Ou utiliser un convertisseur en ligne
```

2. **Ajouter l'image via l'API ou directement en base**
```sql
-- Exemple d'insertion d'un projet avec image
INSERT INTO projects (title, description, technologies, image, category, date, highlights) VALUES (
    'Mon Nouveau Projet',
    'Description du projet...',
    '["React", "PostgreSQL", "FastAPI"]',
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAY...',  -- Votre base64 ici
    'Web Development',
    '2024',
    '["Feature 1", "Feature 2"]'
);
```

---

## 5. Ajout de procédures

### 📋 Structure d'une procédure dans PostgreSQL

Les procédures sont maintenant stockées dans la table `procedures` avec la structure suivante :

```sql
-- Structure de la table procedures
CREATE TABLE procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    tags JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 🔧 Méthode 1: Via l'API (Recommandée)
```bash
# Créer une procédure via curl
curl -X POST "http://localhost:8001/api/portfolio/procedures" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Installation de PostgreSQL sur Ubuntu",
    "description": "Procédure complète d'installation et configuration de PostgreSQL",
    "content": "# Installation de PostgreSQL\n\n## Étape 1: Mise à jour du système\n```bash\nsudo apt update && sudo apt upgrade -y\n```\n\n## Étape 2: Installation\n```bash\nsudo apt install postgresql postgresql-contrib\n```\n\n## Étape 3: Configuration\n```bash\nsudo -u postgres createdb mon_app\n```",
    "category": "Base de données",
    "tags": ["postgresql", "ubuntu", "installation", "configuration"]
  }'
```

#### 🔧 Méthode 2: Directement en base de données
```sql
-- Insérer une nouvelle procédure
INSERT INTO procedures (title, description, content, category, tags) VALUES (
    'Installation de Node.js',
    'Procédure d''installation de Node.js sur Ubuntu 24.04',
    '# Installation de Node.js sur Ubuntu 24.04

## Prérequis
- Accès root ou sudo
- Système Ubuntu 24.04 à jour

## Étapes d''installation

### 1. Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installation via NodeSource
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. Vérification
```bash
node --version
npm --version
```

## Configuration recommandée

### Installation de yarn (optionnel)
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

### Configuration npm
```bash
npm config set prefix ~/.npm-global
echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.bashrc
source ~/.bashrc
```

## Dépannage

### Erreur de permissions
```bash
sudo chown -R $(whoami) ~/.npm
```

### Réinstallation complète
```bash
sudo apt remove nodejs npm
sudo apt autoremove
# Puis recommencer l''installation
```
',
    'Développement',
    '["nodejs", "ubuntu", "installation", "npm", "yarn"]'
);
```

#### 🔧 Méthode 3: Interface graphique (À développer)
Créez une page d'administration pour ajouter des procédures via formulaire :

**Fichier**: `frontend/src/components/ProcedureAdmin.js`
```javascript
import React, { useState } from 'react';
import { portfolioApi } from '../services/api';

const ProcedureAdmin = () => {
  const [procedure, setProcedure] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await portfolioApi.createProcedure(procedure);
      alert('Procédure créée avec succès!');
      setProcedure({ title: '', description: '', content: '', category: '', tags: [] });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setProcedure({...procedure, tags});
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle procédure</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre
          </label>
          <input
            type="text"
            value={procedure.title}
            onChange={(e) => setProcedure({...procedure, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={procedure.description}
            onChange={(e) => setProcedure({...procedure, description: e.target.value})}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenu (Markdown supporté)
          </label>
          <textarea
            value={procedure.content}
            onChange={(e) => setProcedure({...procedure, content: e.target.value})}
            rows="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select
            value={procedure.category}
            onChange={(e) => setProcedure({...procedure, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            <option value="Développement">Développement</option>
            <option value="Serveur">Serveur</option>
            <option value="Base de données">Base de données</option>
            <option value="Déploiement">Déploiement</option>
            <option value="Sécurité">Sécurité</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (séparés par des virgules)
          </label>
          <input
            type="text"
            value={procedure.tags.join(', ')}
            onChange={handleTagsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: nodejs, ubuntu, installation"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Créer la procédure
        </button>
      </form>
    </div>
  );
};

export default ProcedureAdmin;
```

---

## 6. Test local

### 🖥️ Lancer le projet en local

#### Étape 1 - Base de données :
```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# Si pas démarré
sudo systemctl start postgresql
```

#### Étape 2 - Backend :
```bash
cd backend
source venv/bin/activate  # ou créer: python3 -m venv venv
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

#### Étape 3 - Frontend :
```bash
cd frontend
npm start
# ou
yarn start
```

### 🌐 Accéder à votre site
- **Frontend** : http://localhost:3000
- **API Backend** : http://localhost:8001
- **Documentation API** : http://localhost:8001/docs
- **Base de données** : Accessible via psql ou pgAdmin

### 🔧 Commandes utiles pour le développement

```bash
# Voir les données dans PostgreSQL
psql -U portfolio_user -d portfolio_db -h localhost

# Requêtes utiles
\dt                           # Lister les tables
SELECT * FROM personal_info;  # Voir les infos personnelles
SELECT title FROM procedures; # Voir les procédures
SELECT * FROM projects;       # Voir les projets

# Sauvegarder la base de données
pg_dump -U portfolio_user -h localhost portfolio_db > backup.sql

# Restaurer la base de données
psql -U portfolio_user -d portfolio_db -h localhost < backup.sql
```

---

## 7. Hébergement avec votre domaine

### 🚀 Options d'hébergement pour votre domaine LWS

#### Option 1: Hébergement VPS (Recommandé)
**Avantages :** Support complet PostgreSQL + Python + Node.js

1. **Préparez votre serveur LWS** :
```bash
# Connexion SSH à votre VPS
ssh user@your-vps-ip

# Installation des dépendances
sudo apt update
sudo apt install postgresql postgresql-contrib nodejs npm python3 python3-pip nginx
```

2. **Déployez votre application** :
```bash
# Clonage du projet
git clone https://github.com/hocineira/siteweb.git /var/www/votredomaine.com
cd /var/www/votredomaine.com

# Configuration PostgreSQL
sudo -u postgres createdb portfolio_db
sudo -u postgres psql -c "CREATE USER portfolio_user WITH PASSWORD 'VotreMotDePasseSecurise';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;"

# Configuration backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configuration .env
cat > .env << EOF
DATABASE_URL=postgresql://portfolio_user:VotreMotDePasseSecurise@localhost/portfolio_db
ENVIRONMENT=production
EOF

# Initialisation des données
python init_db.py

# Configuration frontend
cd ../frontend
npm install
npm run build
```

3. **Configuration Nginx** :
```nginx
# /etc/nginx/sites-available/votredomaine.com
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;
    
    location / {
        root /var/www/votredomaine.com/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option 2: Hébergement web classique
**Limitation :** Uniquement pour version statique (sans backend)

1. **Créer une version statique** :
```bash
# Générer des données statiques
cd backend
python generate_static_data.py  # À créer

# Build du frontend avec données statiques
cd ../frontend
npm run build
```

2. **Upload via cPanel** :
- Uploadez le contenu de `frontend/build/` vers `public_html/`
- Créez le fichier `.htaccess` pour les redirections React

### 🌍 Configuration DNS chez LWS

1. **Accédez à votre espace client LWS**
2. **Gérez votre nom de domaine**
3. **Configurez les enregistrements DNS** :
   - **A record** : `@` → IP de votre serveur
   - **CNAME** : `www` → `votredomaine.com`
   - **A record** : `api` → IP de votre serveur (pour VPS)

### 🔐 Sécurisation avec SSL (HTTPS)

```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx

# Obtention du certificat SSL
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com

# Configuration du renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🛠️ Workflow de développement recommandé

### 1. Développement local
```bash
# Créer une branche pour vos modifications
git checkout -b nouvelle-fonctionnalite

# Faire vos modifications
# Tester localement

# Commit et push
git add .
git commit -m "Ajout de nouvelles procédures"
git push origin nouvelle-fonctionnalite
```

### 2. Déploiement
```bash
# Sur votre serveur
cd /var/www/votredomaine.com
git pull origin main

# Mise à jour du backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart portfolio-backend

# Mise à jour du frontend
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx
```

### 3. Sauvegarde
```bash
# Script de sauvegarde quotidienne
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/portfolio"

mkdir -p $BACKUP_DIR

# Sauvegarde de la base de données
pg_dump -U portfolio_user -h localhost portfolio_db > $BACKUP_DIR/db_$DATE.sql

# Sauvegarde des fichiers
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/votredomaine.com

# Nettoyage (garder 7 jours)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

---

## 📞 Support et ressources

### 🆘 En cas de problème

1. **Vérifiez les logs** :
```bash
# Logs du backend
sudo journalctl -u portfolio-backend -f

# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Console du navigateur pour le frontend
# Appuyez sur F12 → Console
```

2. **Ressources utiles** :
   - [Documentation React](https://reactjs.org/)
   - [Documentation FastAPI](https://fastapi.tiangolo.com/)
   - [Documentation PostgreSQL](https://postgresql.org/docs/)
   - [Documentation SQLAlchemy](https://docs.sqlalchemy.org/)

### 🎓 Pour approfondir
1. **SQL/PostgreSQL** : PostgreSQL Tutorial
2. **Python/FastAPI** : FastAPI.tiangolo.com
3. **SQLAlchemy** : SQLAlchemy Tutorial
4. **React** : React.dev

---

## 📝 Checklist avant mise en production

- [ ] Tests effectués en local avec PostgreSQL
- [ ] Sauvegarde de la base de données configurée
- [ ] Configuration SSL activée
- [ ] DNS configuré correctement
- [ ] Monitoring configuré
- [ ] Variables d'environnement sécurisées
- [ ] Services systemd configurés
- [ ] Nginx optimisé pour la production
- [ ] Logs configurés et surveillés

---

*Ce guide est spécifiquement conçu pour votre portfolio avec PostgreSQL. L'architecture est maintenant plus robuste et prête pour la production !*