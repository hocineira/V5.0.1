# 📚 Guide complet - Modifier et héberger votre portfolio

## 🎯 Résumé de votre situation

**Votre projet** : Portfolio web complet avec React + FastAPI + MongoDB
**Votre repository** : https://github.com/hocineira/siteweb.git
**Votre niveau** : Débutant en développement web, base Python
**Vos objectifs** : Modifications visuelles, ajout de procédures et contenu
**Votre domaine** : Acheté chez LWS
**Test local** : Ubuntu Server / Windows Server 2022

---

## 📋 Liste des guides disponibles

### 1. 🏗️ [GUIDE_BUILDER_WEB.md](./GUIDE_BUILDER_WEB.md)
**Guide principal** pour comprendre et modifier votre portfolio
- Structure du projet
- Modifications de texte et couleurs
- Gestion des images
- Ajout de procédures
- Workflow de développement

### 2. 🌐 [GUIDE_HEBERGEMENT_LWS.md](./GUIDE_HEBERGEMENT_LWS.md)
**Guide spécifique LWS** pour héberger avec votre domaine
- Configuration cPanel
- Configuration VPS
- SSL/HTTPS
- Configuration DNS
- Résolution des problèmes

### 3. 🏠 [GUIDE_SERVEUR_DOMESTIQUE.md](./GUIDE_SERVEUR_DOMESTIQUE.md)
**Guide pour tester localement** sur Ubuntu/Windows Server
- Configuration Ubuntu Server
- Configuration Windows Server 2022
- Scripts d'automatisation
- Monitoring et maintenance

### 4. 🛠️ [portfolio-helper.sh](./portfolio-helper.sh)
**Script d'aide** pour automatiser les tâches courantes
- Vérification des dépendances
- Installation automatique
- Démarrage des services
- Construction du projet

### 5. 📄 [templates-contenu.js](./templates-contenu.js)
**Templates** pour ajouter facilement du contenu
- Nouveau projet
- Nouvelle compétence
- Nouvelle expérience
- Nouvelle procédure

---

## 🚀 Démarrage rapide

### Étape 1 : Cloner votre projet
```bash
git clone https://github.com/hocineira/siteweb.git
cd siteweb
```

### Étape 2 : Utiliser le script d'aide
```bash
# Rendre le script exécutable
chmod +x portfolio-helper.sh

# Vérifier les dépendances
./portfolio-helper.sh check

# Installer les dépendances
./portfolio-helper.sh install

# Démarrer le développement
./portfolio-helper.sh start
```

### Étape 3 : Première modification
1. Ouvrez `frontend/src/components/Portfolio.js`
2. Modifiez votre nom ligne ~107
3. Changez votre titre ligne ~109
4. Sauvegardez et rechargez la page

### Étape 4 : Ajouter du contenu
1. Utilisez les templates dans `templates-contenu.js`
2. Modifiez les valeurs selon vos besoins
3. Ajoutez via l'API ou directement en base

---

## 🎨 Modifications courantes

### Changer les couleurs
```javascript
// Dans Portfolio.js, remplacez :
from-blue-600 to-purple-600
// Par (exemple) :
from-green-600 to-teal-600
```

### Ajouter votre photo
1. Ajoutez votre image dans `frontend/public/images/`
2. Modifiez la ligne `<AvatarImage src=...` dans Portfolio.js

### Modifier le texte
- **Nom** : Ligne ~107 dans Portfolio.js
- **Titre** : Ligne ~109 dans Portfolio.js
- **Description** : Ligne ~111-113 dans Portfolio.js

---

## 📱 Processus de déploiement

### Pour hébergement web classique (cPanel LWS)
1. `npm run build` dans le dossier frontend
2. Uploadez le contenu de `build/` vers `public_html/`
3. Créez le fichier `.htaccess` pour les redirections

### Pour VPS LWS
1. Suivez le guide complet dans `GUIDE_HEBERGEMENT_LWS.md`
2. Configurez Nginx, SSL, et la base de données
3. Déployez le backend avec systemd

---

## 🔧 Maintenance et mise à jour

### Workflow recommandé
1. **Modification locale** → Test → Commit
2. **Push vers GitHub** → Vérification
3. **Déploiement** → Test en production
4. **Sauvegarde** → Monitoring

### Commandes utiles
```bash
# Sauvegarde
./portfolio-helper.sh backup

# Nettoyage
./portfolio-helper.sh clean

# Reconstruction
./portfolio-helper.sh build
```

---

## 🆘 En cas de problème

### Problèmes courants
1. **Site ne s'affiche pas** → Vérifiez la configuration DNS
2. **Erreur 404** → Vérifiez le fichier `.htaccess`
3. **API non accessible** → Vérifiez le service backend
4. **Images ne s'affichent pas** → Vérifiez les chemins des images

### Ressources d'aide
- **Documentation LWS** : https://aide.lws.fr/
- **Support technique** : Via votre espace client LWS
- **Logs de debug** : Consultez les guides pour chaque plateforme

---

## 📈 Évolution future

### Améliorations suggérées
1. **Interface d'administration** : Créer une interface pour modifier le contenu
2. **Système de blog** : Ajouter une section blog
3. **Multilingue** : Support français/anglais
4. **Optimisations SEO** : Métadonnées et structure

### Nouvelles fonctionnalités
1. **Formulaire de contact avancé** : Avec validation
2. **Système de commentaires** : Sur les projets
3. **Statistiques** : Visites et interactions
4. **PWA** : Application web progressive

---

## 🎓 Ressources pour apprendre

### Développement web
- **HTML/CSS** : MDN Web Docs
- **JavaScript** : JavaScript.info
- **React** : React.dev
- **Python** : Python.org

### Outils
- **Git** : Git-scm.com
- **MongoDB** : MongoDB University
- **Nginx** : Nginx.org/en/docs/

---

## 📞 Contact et support

Pour toute question sur ces guides ou aide spécifique :
1. Consultez d'abord le guide approprié
2. Vérifiez les logs d'erreur
3. Recherchez dans la documentation officielle
4. Contactez le support LWS si nécessaire

---

**Bonne chance avec votre portfolio ! 🚀**

*Ces guides sont spécifiquement conçus pour votre projet et votre niveau. Adaptez-les selon vos besoins spécifiques.*