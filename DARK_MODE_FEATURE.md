# Documentation - Fonctionnalité Mode Sombre 🌙

## Status : TEMPORAIREMENT DÉSACTIVÉE ⏸️

La fonctionnalité de mode sombre est complètement implémentée et fonctionnelle, mais temporairement désactivée pour les tests et le déploiement.

## Comment réactiver le mode sombre

### 1. Via la variable d'environnement (RECOMMANDÉ)

Dans le fichier `.env.local`, changer la valeur :

```bash
# Actuellement désactivé
NEXT_PUBLIC_ENABLE_DARK_MODE=false

# Pour réactiver, changer en :
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

### 2. Redémarrer l'application

Après avoir modifié la variable d'environnement :

```bash
yarn build
sudo supervisorctl restart frontend
```

## Fonctionnalités implémentées

✅ **Bouton de basculement** : Icône soleil/lune en haut à droite  
✅ **Persistance** : Préférence sauvegardée dans localStorage  
✅ **Transitions fluides** : Animations de 0.5s sur tous les éléments  
✅ **CSS optimisé** : Variables CSS pour tous les thèmes  
✅ **Badges corrigés** : Parfaite lisibilité en mode sombre  
✅ **Responsive** : Fonctionne sur tous les écrans  
✅ **Accessibilité** : Support clavier et aria-labels  

## Fichiers modifiés

### Composants principales
- `/src/contexts/ThemeContext.js` - Context React pour la gestion du thème
- `/src/components/ThemeToggle.js` - Bouton de basculement
- `/src/app/globals.css` - Styles CSS pour les deux modes

### Fichiers de configuration
- `/.env.local` - Variable d'environnement pour activer/désactiver
- `/DARK_MODE_FEATURE.md` - Cette documentation

## CSS - Classes importantes

```css
/* Variables pour le mode sombre */
.dark {
  --background: 15 23 42;
  --text-primary: 248 250 252;
  /* ... autres variables ... */
}

/* Corrections des badges */
.dark .bg-red-100 { background-color: rgb(185 28 28 / 0.2) !important; }
.dark .text-red-800 { color: rgb(252 165 165) !important; }
/* ... autres badges ... */
```

## Test de la fonctionnalité

Quand réactivé, le mode sombre :
1. Affiche un bouton en haut à droite
2. Bascule entre soleil (clair) et lune (sombre)
3. Sauvegarde la préférence utilisateur
4. Applique des couleurs sombres cohérentes
5. Maintient une lisibilité parfaite

## Notes techniques

- **Framework** : Next.js 15 avec Tailwind CSS
- **State management** : React Context
- **Persistance** : localStorage
- **Performance** : CSS variables pour transitions optimisées
- **Compatibilité** : Tous les navigateurs modernes

---

**Pour toute question ou réactivation, consultez cette documentation.**

🎨 *La fonctionnalité est prête à être réactivée à tout moment !*