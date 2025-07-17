#!/usr/bin/env python3
"""
Script de surveillance MariaDB pour le portfolio
Ce script vérifie la santé de MariaDB et redémarre si nécessaire
"""

import subprocess
import time
import logging
from datetime import datetime
from pathlib import Path
import sys
import os

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/mariadb_monitor.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def check_mariadb_status():
    """Vérifie si MariaDB est en cours d'exécution"""
    try:
        result = subprocess.run(
            ['sudo', 'service', 'mariadb', 'status'],
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        logger.error("Timeout lors de la vérification du statut MariaDB")
        return False
    except Exception as e:
        logger.error(f"Erreur lors de la vérification du statut MariaDB: {e}")
        return False

def check_database_connection():
    """Vérifie la connexion à la base de données"""
    try:
        result = subprocess.run([
            'mysql', '-u', 'portfolio_user', '-pportfolio_password', 
            '-e', 'SELECT 1 FROM personal_info LIMIT 1;', 'portfolio_db'
        ], capture_output=True, text=True, timeout=10)
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        logger.error("Timeout lors de la vérification de la connexion DB")
        return False
    except Exception as e:
        logger.error(f"Erreur lors de la vérification de la connexion DB: {e}")
        return False

def restart_mariadb():
    """Redémarre MariaDB"""
    try:
        logger.info("Redémarrage de MariaDB...")
        result = subprocess.run(
            ['sudo', 'service', 'mariadb', 'restart'],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0:
            logger.info("MariaDB redémarré avec succès")
            return True
        else:
            logger.error(f"Échec du redémarrage de MariaDB: {result.stderr}")
            return False
    except Exception as e:
        logger.error(f"Erreur lors du redémarrage de MariaDB: {e}")
        return False

def restart_backend():
    """Redémarre le backend après un problème MariaDB"""
    try:
        logger.info("Redémarrage du backend...")
        result = subprocess.run(
            ['sudo', 'supervisorctl', 'restart', 'backend'],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0:
            logger.info("Backend redémarré avec succès")
            return True
        else:
            logger.error(f"Échec du redémarrage du backend: {result.stderr}")
            return False
    except Exception as e:
        logger.error(f"Erreur lors du redémarrage du backend: {e}")
        return False

def monitor_loop():
    """Boucle principale de surveillance"""
    consecutive_failures = 0
    max_consecutive_failures = 3
    
    logger.info("Démarrage de la surveillance MariaDB...")
    
    while True:
        try:
            # Vérifier le statut du service MariaDB
            if not check_mariadb_status():
                consecutive_failures += 1
                logger.warning(f"MariaDB n'est pas en cours d'exécution (échec {consecutive_failures})")
                
                if consecutive_failures >= max_consecutive_failures:
                    logger.error("Tentative de redémarrage de MariaDB...")
                    if restart_mariadb():
                        consecutive_failures = 0
                        time.sleep(5)  # Attendre que MariaDB se stabilise
                        restart_backend()
                    else:
                        logger.critical("Impossible de redémarrer MariaDB!")
                        
            # Vérifier la connexion à la base de données
            elif not check_database_connection():
                consecutive_failures += 1
                logger.warning(f"Connexion à la base de données échouée (échec {consecutive_failures})")
                
                if consecutive_failures >= max_consecutive_failures:
                    logger.error("Tentative de redémarrage de MariaDB...")
                    if restart_mariadb():
                        consecutive_failures = 0
                        time.sleep(5)
                        restart_backend()
                    else:
                        logger.critical("Impossible de redémarrer MariaDB!")
                        
            else:
                # Tout va bien
                if consecutive_failures > 0:
                    logger.info("MariaDB fonctionne correctement")
                consecutive_failures = 0
                
        except Exception as e:
            logger.error(f"Erreur dans la boucle de surveillance: {e}")
            consecutive_failures += 1
            
        # Attendre 30 secondes avant la prochaine vérification
        time.sleep(30)

if __name__ == "__main__":
    try:
        monitor_loop()
    except KeyboardInterrupt:
        logger.info("Arrêt de la surveillance MariaDB...")
    except Exception as e:
        logger.critical(f"Erreur critique dans la surveillance MariaDB: {e}")
        sys.exit(1)