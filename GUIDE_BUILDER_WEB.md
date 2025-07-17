# 🌟 Guide du Builder Web - Portfolio Hocine IRATNI

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
│   ├── models.py        # Structure des données
│   └── server.py        # Serveur principal
└── README.md           # Documentation
```

### 🔧 Technologies utilisées
- **Frontend**: React + Tailwind CSS (Interface utilisateur)
- **Backend**: FastAPI (API Python)
- **Base de données**: MongoDB (Stockage des données)
- **Hébergement**: Compatible avec tout hébergeur supportant Node.js et Python

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

### 🔧 Configuration de base
1. **Fichier `.env` frontend** (`frontend/.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

2. **Fichier `.env` backend** (`backend/.env`)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
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
```

### 🎨 Changer les couleurs du thème

**Fichier**: `frontend/src/components/Portfolio.js`

```javascript
// Remplacez "blue-600" par votre couleur préférée
// Couleurs disponibles: red, green, blue, purple, indigo, pink, yellow, gray

// Exemple: changer de bleu à vert
from-blue-600 to-purple-600  →  from-green-600 to-teal-600
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

1. **Ajoutez vos images** dans `frontend/public/images/projects/`
2. **Modifiez les données des projets** (voir section base de données)

---

## 5. Ajout de procédures

### 📋 Structure d'une procédure

Les procédures sont gérées dans votre base de données. Voici comment les ajouter :

#### 🔧 Méthode 1: Via l'API (Recommandée)
```javascript
// Exemple d'ajout de procédure via l'API
const nouvelleProcedure = {
  title: "Installation de Node.js",
  description: "Procédure d'installation de Node.js sur Ubuntu",
  category: "Développement",
  steps: [
    {
      step_number: 1,
      title: "Mise à jour du système",
      description: "sudo apt update && sudo apt upgrade -y",
      code: "sudo apt update && sudo apt upgrade -y"
    },
    {
      step_number: 2,
      title: "Installation de Node.js",
      description: "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -",
      code: "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    }
  ],
  tags: ["nodejs", "ubuntu", "installation"]
};
```

#### 🔧 Méthode 2: Interface graphique
Créez une page d'administration simple pour ajouter des procédures via formulaire.

### 📝 Ajouter une page procédures

**Fichier**: `frontend/src/components/ProceduresPage.js`
```javascript
import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../services/api';

const ProceduresPage = () => {
  const [procedures, setProcedures] = useState([]);
  
  useEffect(() => {
    loadProcedures();
  }, []);
  
  const loadProcedures = async () => {
    try {
      const response = await portfolioApi.getProcedures();
      setProcedures(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des procédures:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Procédures</h1>
      
      <div className="grid gap-8">
        {procedures.map((procedure) => (
          <div key={procedure.id} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{procedure.title}</h2>
            <p className="text-gray-600 mb-4">{procedure.description}</p>
            
            <div className="space-y-4">
              {procedure.steps.map((step) => (
                <div key={step.step_number} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">Étape {step.step_number}: {step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  {step.code && (
                    <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProceduresPage;
```

---

## 6. Test local

### 🖥️ Lancer le projet en local

#### Terminal 1 - Backend:
```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

#### Terminal 3 - Base de données (MongoDB):
```bash
# Ubuntu
sudo systemctl start mongod

# Windows (avec MongoDB installé)
net start MongoDB
```

### 🌐 Accéder à votre site
- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:8001
- **Documentation API**: http://localhost:8001/docs

---

## 7. Hébergement avec votre domaine

### 🚀 Options d'hébergement pour votre domaine LWS

#### Option 1: Hébergement traditionnel (cPanel)
1. **Préparez votre build**:
```bash
cd frontend
npm run build
```

2. **Uploadez les fichiers**:
   - Uploadez le contenu de `frontend/build/` vers votre dossier web
   - Configurez votre backend sur un sous-domaine (ex: api.votredomaine.com)

#### Option 2: VPS/Serveur dédié
1. **Configurez votre serveur**:
```bash
# Installation des dépendances
sudo apt update
sudo apt install nodejs npm python3 python3-pip nginx mongodb

# Clonage du projet
git clone https://github.com/hocineira/siteweb.git
cd siteweb

# Installation des dépendances
cd frontend && npm install && npm run build
cd ../backend && pip install -r requirements.txt
```

2. **Configuration Nginx**:
```nginx
# /etc/nginx/sites-available/votredomaine.com
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;
    
    # Frontend
    location / {
        root /path/to/siteweb/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 🌍 Configuration DNS chez LWS

1. **Accédez à votre espace client LWS**
2. **Gérez votre nom de domaine**
3. **Configurez les enregistrements DNS**:
   - **A record**: `@` → IP de votre serveur
   - **CNAME**: `www` → `votredomaine.com`
   - **A record**: `api` → IP de votre serveur (si backend séparé)

### 🔐 Sécurisation avec SSL (HTTPS)

```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx

# Obtention du certificat SSL
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com
```

---

## 🛠️ Workflow de développement recommandé

### 1. Modification locale
```bash
# Faire vos modifications
git add .
git commit -m "Description des modifications"
git push origin main
```

### 2. Déploiement automatique
- Configurez un webhook GitHub ou utilisez GitHub Actions
- Ou déployez manuellement avec `git pull` sur votre serveur

### 3. Sauvegarde
- Sauvegardez régulièrement votre base de données
- Gardez une copie de vos fichiers de configuration

---

## 📞 Support et ressources

### 🆘 En cas de problème
1. **Vérifiez les logs**:
   - Frontend: Console du navigateur (F12)
   - Backend: Terminal où vous avez lancé le serveur

2. **Ressources utiles**:
   - [Documentation React](https://reactjs.org/)
   - [Documentation FastAPI](https://fastapi.tiangolo.com/)
   - [Documentation MongoDB](https://docs.mongodb.com/)

### 🎓 Pour approfondir
1. **HTML/CSS**: Mozilla Developer Network (MDN)
2. **JavaScript**: JavaScript.info
3. **Python**: Python.org
4. **Git**: Git-scm.com

---

## 📝 Checklist avant mise en production

- [ ] Tests effectués en local
- [ ] Backup de la base de données
- [ ] Configuration SSL activée
- [ ] DNS configuré correctement
- [ ] Monitoring configuré
- [ ] Sauvegardes automatiques configurées

---

*Ce guide est spécifiquement conçu pour votre portfolio. N'hésitez pas à l'adapter selon vos besoins spécifiques !*