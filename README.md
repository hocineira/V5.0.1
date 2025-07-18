# 🚀 Portfolio Hocine IRATNI - Ubuntu Server 24.04

## Vue d'ensemble

Ce projet est un portfolio complet développé avec :
- **Backend** : FastAPI (Python) avec MariaDB
- **Frontend** : React avec Tailwind CSS
- **Déploiement** : Ubuntu Server 24.04

## 📋 Installation

### ⚡ Pour Ubuntu Server 24.04

**Utilisez uniquement la nouvelle procédure d'installation manuelle :**

1. **Suivez le guide complet** : [INSTALLATION-MANUELLE-UBUNTU-24.04.md](INSTALLATION-MANUELLE-UBUNTU-24.04.md)
2. **Testez l'installation** : `./test-installation-manuelle.sh`

Cette procédure a été créée et testée spécifiquement pour Ubuntu Server 24.04 et remplace tous les anciens guides obsolètes.

### 🧹 Nettoyage effectué

Les anciens guides d'installation défaillants ont été supprimés et sauvegardés. Voir [FICHIERS_OBSOLETES_SUPPRIMES.md](FICHIERS_OBSOLETES_SUPPRIMES.md) pour les détails.

## 🏗️ Architecture

```
Portfolio/
├── backend/          # API FastAPI + MariaDB
│   ├── server.py     # Serveur principal
│   ├── database.py   # Configuration base de données
│   ├── routes/       # Endpoints API
│   └── .env          # Configuration (DATABASE_URL)
├── frontend/         # Application React
│   ├── src/          # Code source React
│   ├── public/       # Fichiers statiques
│   └── build/        # Build de production
└── docs/            # Documentation
```

## 🌐 Accès

Une fois installé, le portfolio est accessible via :
- **Frontend** : `http://your-domain.com/` ou `http://localhost:3000/`
- **Backend API** : `http://your-domain.com/api/` ou `http://localhost:8001/api/`
- **Health Check** : `http://localhost:8001/api/health`

## 📊 Fonctionnalités

- ✅ Profil personnel de Hocine IRATNI
- ✅ Formations (BTS SIO-SISR, Licence, Bac)
- ✅ Compétences techniques (Réseaux, Systèmes, Sécurité)
- ✅ Expériences professionnelles
- ✅ Projets et réalisations
- ✅ Certifications (CISCO CCNA)
- ✅ Veille technologique
- ✅ Formulaire de contact
- ✅ Interface responsive

## 🔧 Maintenance

```bash
# Vérifier les services
sudo supervisorctl status

# Redémarrer les services
sudo supervisorctl restart portfolio-backend portfolio-frontend

# Consulter les logs
sudo tail -f /var/log/supervisor/portfolio-*.log

# Tester l'installation
./test-installation-manuelle.sh
```

## 📞 Support

En cas de problème :
1. Consultez [INSTALLATION-MANUELLE-UBUNTU-24.04.md](INSTALLATION-MANUELLE-UBUNTU-24.04.md)
2. Vérifiez les logs : `/var/log/supervisor/portfolio-*.log`
3. Testez avec : `./test-installation-manuelle.sh`

---

*Portfolio créé pour Hocine IRATNI - Étudiant BTS SIO-SISR*
