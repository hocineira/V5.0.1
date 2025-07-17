# 🎉 PROCÉDURE D'INSTALLATION COMPLÈTE - PORTFOLIO HOCINE IRATNI
## Ubuntu Server 24.04.02 - Version MariaDB

---

## 📋 RÉSUMÉ DE LA MIGRATION RÉUSSIE

✅ **Récupération complète des données depuis GitHub V3**
✅ **Migration PostgreSQL → MariaDB réussie**
✅ **Création de tous les scripts d'installation Ubuntu Server 24.04.02**
✅ **Validation complète du backend (43/43 tests passés)**

---

## 🎯 DONNÉES PERSONNELLES MIGRÉES

### 👤 Informations Personnelles
- **Nom** : Hocine IRATNI
- **Titre** : Etudiant en BTS SIO-SISR
- **Spécialité** : Systèmes et Réseaux
- **Email** : hocineira@gmail.com
- **Téléphone** : +33 7 53 36 45 11
- **Localisation** : 13008 Marseille

### 🎓 Formations (3)
1. **BTS SIO Option SISR** - IFC Marseille (2024-2026)
2. **Licence portails descartes math-info-méchanique** - Aix marseille université (2022-2024)
3. **Bac général** - Lycée International Alexandre Dumas (2022)

### 🔧 Compétences (4 catégories)
- **Systèmes** : Windows Server, Active Directory, Hyper-V, Linux, PowerShell
- **Réseaux** : Router (Zyxel), Switch, Pfsense, TCP/IP, VLAN
- **Sécurité** : Firewall, VPN, Sécurité réseau, Monitoring, Backup
- **Virtualisation** : VMware, Hyper-V, Docker, Proxmox

### 💼 Expérience (1)
- **Stage Administrateur Réseaux** - sauvegarde13 Marseille (13/03/2025 - 28/05/2025)

### 🏆 Certifications (1)
- **CISCO CCNA** (en cours, 2025)

### 🚀 Projets BTS SIO (3)
1. **Infrastructure Réseau Virtuelle**
2. **Système de Monitoring Réseau**
3. **Solution de Sauvegarde Automatisée**

### 📚 Veille Technologique et Juridique (4)
1. **Mises à jour Windows et ses versions**
2. **Évolutions des technologies réseaux**
3. **RGPD et protection des données**
4. **Cadre juridique de la cybersécurité**

---

## 🚀 INSTALLATION SUR UBUNTU SERVER 24.04.02

### 🎯 Méthode 1 : Installation automatique rapide

```bash
# Sur votre serveur Ubuntu Server 24.04.02
curl -sSL https://raw.githubusercontent.com/hocineira/V3/main/deploy-portfolio.sh | sudo bash
```

### 🎯 Méthode 2 : Installation manuelle

```bash
# 1. Télécharger l'archive
wget https://github.com/hocineira/V3/archive/main.tar.gz
tar -xzf main.tar.gz
cd V3-main

# 2. Configurer le domaine
nano deploy-portfolio.sh
# Remplacer iratnihocine.fr par votre domaine

# 3. Lancer l'installation
sudo ./deploy-portfolio.sh
```

### 🎯 Méthode 3 : Installation étape par étape

```bash
# 1. Copier les scripts sur le serveur
scp -r /tmp/portfolio-deploy/* user@server:/tmp/

# 2. Se connecter au serveur
ssh user@server

# 3. Exécuter l'installation
cd /tmp
sudo ./install-ubuntu-24.04.02.sh

# 4. Valider l'installation
sudo ./validate-ubuntu-24.04.02.sh
```

---

## 📋 SCRIPTS CRÉÉS

### 🔧 Scripts d'installation
1. **`install-ubuntu-24.04.02.sh`** - Installation complète automatique
2. **`validate-ubuntu-24.04.02.sh`** - Validation post-installation
3. **`deploy-portfolio.sh`** - Déploiement rapide interactif
4. **`update-portfolio.sh`** - Mise à jour automatique
5. **`prepare-deploy.sh`** - Préparation des scripts

### 📚 Documentation
1. **`GUIDE-UBUNTU-24.04.02.md`** - Guide complet d'installation
2. **`README.md`** - Instructions de déploiement
3. **`migrate_personal_data.py`** - Script de migration des données

---

## 🎯 CARACTÉRISTIQUES DE L'INSTALLATION

### 🔧 Stack technique
- **OS** : Ubuntu Server 24.04.02 LTS
- **Base de données** : MariaDB 10.11
- **Backend** : Python 3.11 + FastAPI + Uvicorn
- **Frontend** : React 18 + Tailwind CSS
- **Proxy** : Nginx avec SSL/TLS (Let's Encrypt)
- **Services** : Supervisor pour la gestion des processus

### 🔒 Sécurité
- **SSL** : Certificat Let's Encrypt avec renouvellement automatique
- **Firewall** : UFW configuré automatiquement
- **Headers** : Headers de sécurité Nginx
- **Database** : Utilisateur dédié avec permissions limitées

### 🛠️ Outils de gestion
- **`portfolio-manage`** - Outil de gestion des services
- **Supervision** - Monitoring automatique des services
- **Logs** - Centralisation des logs
- **Backups** - Sauvegarde automatique avant mise à jour

---

## 🌐 RÉSULTAT FINAL

Une fois l'installation terminée, vous aurez :

✅ **Site web complet** accessible à votre domaine
✅ **Portfolio professionnel** avec toutes vos données BTS SIO-SISR
✅ **Backend API** robuste avec MariaDB
✅ **Frontend React** responsive et moderne
✅ **SSL/HTTPS** configuré automatiquement
✅ **Monitoring** et supervision des services
✅ **Outils de maintenance** intégrés

### 🔗 URLs disponibles
- **Site principal** : https://votre-domaine.com
- **API Backend** : https://votre-domaine.com/api
- **Documentation** : https://votre-domaine.com/api/docs

### 📊 Données disponibles
- **Informations personnelles** : /api/portfolio/personal-info
- **Formations** : /api/portfolio/education
- **Compétences** : /api/portfolio/skills
- **Projets** : /api/portfolio/projects
- **Expériences** : /api/portfolio/experience
- **Certifications** : /api/portfolio/certifications
- **Veille** : /api/portfolio/veille

---

## 🛠️ MAINTENANCE ET GESTION

### 📋 Commandes utiles
```bash
# Gestion des services
portfolio-manage start     # Démarrer
portfolio-manage stop      # Arrêter
portfolio-manage restart   # Redémarrer
portfolio-manage status    # Vérifier le statut
portfolio-manage logs      # Voir les logs
portfolio-manage test      # Tester l'application

# Mise à jour
./update-portfolio.sh      # Mise à jour automatique
./update-portfolio.sh --code    # Code uniquement
./update-portfolio.sh --data    # Données uniquement
./update-portfolio.sh --backup  # Créer sauvegarde

# Validation
./validate-ubuntu-24.04.02.sh  # Valider l'installation
```

### 📁 Fichiers importants
- **Code source** : `/home/portfolio/portfolio/`
- **Logs backend** : `/var/log/supervisor/portfolio-backend.log`
- **Logs frontend** : `/var/log/supervisor/portfolio-frontend.log`
- **Logs Nginx** : `/var/log/nginx/portfolio_error.log`
- **Configuration** : `/etc/nginx/sites-enabled/portfolio`
- **Base de données** : `portfolio_db` (MariaDB)

---

## 🎉 CONCLUSION

Votre **Portfolio Hocine IRATNI** est maintenant prêt pour le déploiement sur Ubuntu Server 24.04.02 ! 

### ✅ Ce qui a été accompli :
1. **Récupération complète** de toutes vos données depuis GitHub V3
2. **Migration réussie** vers MariaDB avec validation complète
3. **Création d'une suite complète** de scripts d'installation
4. **Adaptation spécifique** à votre profil BTS SIO-SISR
5. **Documentation exhaustive** pour l'installation et la maintenance

### 🚀 Prochaines étapes :
1. Déployer sur votre serveur Ubuntu Server 24.04.02
2. Configurer votre nom de domaine
3. Lancer le script d'installation
4. Valider l'installation
5. Profiter de votre portfolio professionnel !

### 📞 Support :
- **Guide complet** : `GUIDE-UBUNTU-24.04.02.md`
- **Scripts de diagnostic** : `validate-ubuntu-24.04.02.sh`
- **Outils de dépannage** : `portfolio-manage`

**Votre portfolio est maintenant prêt à être déployé avec toutes vos données personnelles, formations BTS SIO, compétences réseaux et expériences professionnelles ! 🎯**