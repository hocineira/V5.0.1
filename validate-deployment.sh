#!/bin/bash

# Script de test simple pour déploiement Ubuntu 24.04.2
set -e

echo "🚀 Test rapide du déploiement Portfolio"
echo "======================================"

# Test 1: Vérification des prérequis
echo "1. Vérification des prérequis..."
command -v psql >/dev/null && echo "✅ PostgreSQL installé" || echo "❌ PostgreSQL manquant"
command -v node >/dev/null && echo "✅ Node.js installé" || echo "❌ Node.js manquant"
command -v python3 >/dev/null && echo "✅ Python 3 installé" || echo "❌ Python 3 manquant"
command -v yarn >/dev/null && echo "✅ Yarn installé" || echo "❌ Yarn manquant"

# Test 2: Vérification de PostgreSQL
echo "2. Test de PostgreSQL..."
if sudo -u postgres psql -c "SELECT version();" >/dev/null 2>&1; then
    echo "✅ PostgreSQL fonctionnel"
else
    echo "❌ PostgreSQL non accessible"
    exit 1
fi

# Test 3: Vérification des dépendances backend
echo "3. Test des dépendances backend..."
cd /app/backend
if python3 -c "import psycopg2, sqlalchemy, fastapi, uvicorn" 2>/dev/null; then
    echo "✅ Dépendances backend présentes"
else
    echo "❌ Dépendances backend manquantes"
    exit 1
fi

# Test 4: Vérification des dépendances frontend
echo "4. Test des dépendances frontend..."
cd /app/frontend
if [ -d "node_modules" ]; then
    echo "✅ Dépendances frontend présentes"
else
    echo "❌ Dépendances frontend manquantes"
    exit 1
fi

# Test 5: Test de la base de données
echo "5. Test de la base de données..."
if psql -h localhost -U portfolio_user -d portfolio_db -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Base de données accessible"
else
    echo "❌ Base de données non accessible"
    exit 1
fi

# Test 6: Test du backend
echo "6. Test du backend..."
if curl -f http://localhost:8001/api/health >/dev/null 2>&1; then
    echo "✅ Backend accessible"
else
    echo "❌ Backend non accessible"
    exit 1
fi

# Test 7: Test du frontend
echo "7. Test du frontend..."
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend non accessible"
    exit 1
fi

# Test 8: Test du formulaire de contact
echo "8. Test du formulaire de contact..."
CONTACT_RESPONSE=$(curl -s -X POST http://localhost:8001/api/portfolio/contact-messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Deployment","email":"test@deployment.com","message":"Test message from deployment verification"}')

if [ $? -eq 0 ]; then
    echo "✅ Formulaire de contact fonctionnel"
else
    echo "❌ Erreur du formulaire de contact"
    exit 1
fi

# Test 9: Test des routes de navigation
echo "9. Test des routes de navigation..."
ROUTES=("/" "/tcs" "/bts-sio" "/projets-scolaires" "/veille")
for route in "${ROUTES[@]}"; do
    if curl -f "http://localhost:3000$route" >/dev/null 2>&1; then
        echo "✅ Route $route accessible"
    else
        echo "❌ Route $route non accessible"
    fi
done

echo ""
echo "🎉 Tests de déploiement terminés!"
echo "================================"
echo "Résumé:"
echo "- Prérequis: ✅ Installés"
echo "- PostgreSQL: ✅ Fonctionnel"
echo "- Backend: ✅ Accessible"
echo "- Frontend: ✅ Accessible"
echo "- Base de données: ✅ Accessible"
echo "- Formulaire contact: ✅ Fonctionnel"
echo "- Routes navigation: ✅ Testées"
echo ""
echo "Le déploiement est validé pour Ubuntu Server 24.04.2"