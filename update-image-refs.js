const fs = require('fs');
const path = require('path');

function updateImageReferences() {
  console.log('🔄 MISE À JOUR DES RÉFÉRENCES D\'IMAGES VERS LES VERSIONS OPTIMISÉES...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const imageReplacements = new Map();
  
  // Lister les images optimisées disponibles
  const imagesDir = path.join(__dirname, 'public', 'images', 'procedures');
  const files = fs.readdirSync(imagesDir);
  
  files.forEach(file => {
    if (file.startsWith('optimized_') && file.endsWith('.webp')) {
      const originalName = file.replace('optimized_', '').replace('.webp', '');
      // Trouver l'extension originale correspondante
      const possibleOriginals = files.filter(f => 
        f.startsWith(originalName) && 
        !f.startsWith('optimized_') && 
        f.match(/\.(jpg|jpeg|png)$/i)
      );
      
      if (possibleOriginals.length > 0) {
        imageReplacements.set(possibleOriginals[0], file);
      }
    }
  });
  
  console.log('📝 Images à remplacer:');
  imageReplacements.forEach((optimized, original) => {
    console.log(`   ${original} → ${optimized}`);
  });
  console.log('');
  
  // Fonction récursive pour parcourir les fichiers
  function processDirectory(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        imageReplacements.forEach((optimized, original) => {
          const originalPath = `/images/procedures/${original}`;
          const optimizedPath = `/images/procedures/${optimized}`;
          
          if (content.includes(originalPath)) {
            content = content.replace(new RegExp(originalPath, 'g'), optimizedPath);
            modified = true;
            console.log(`✅ Mis à jour: ${fullPath.replace(__dirname, '.')}`);
            console.log(`   ${originalPath} → ${optimizedPath}`);
          }
        });
        
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
        }
      }
    });
  }
  
  // Traiter tous les fichiers dans src
  processDirectory(srcDir);
  
  console.log('\n🎯 MISE À JOUR TERMINÉE!');
  console.log('📈 Améliorations attendues:');
  console.log('   • Réduction moyenne de taille: 75-85%');
  console.log('   • Format WebP moderne pour tous les navigateurs');
  console.log('   • Chargement plus rapide des images');
}

updateImageReferences();