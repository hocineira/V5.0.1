const sharp = require('sharp');
const fs = require('fs');

async function convertFavicon() {
  try {
    // Lire le fichier JPEG source
    const jpegInput = '/app/public/favicon-temp.jpg';
    
    // Convertir en PNG (180x180) pour Apple touch icon
    await sharp(jpegInput)
      .resize(180, 180, { 
        kernel: sharp.kernel.lanczos3,
        fit: 'cover',
        position: 'center'
      })
      .png({ 
        quality: 90,
        compressionLevel: 9,
        palette: true
      })
      .toFile('/app/public/favicon.png');
    
    console.log('✅ favicon.png créé avec succès (180x180)');
    
    // Convertir en ICO nécessite plusieurs tailles
    // Créer 16x16, 32x32, 48x48 en PNG puis les combiner
    
    // Créer 16x16
    await sharp(jpegInput)
      .resize(16, 16, { 
        kernel: sharp.kernel.lanczos3,
        fit: 'cover',
        position: 'center'
      })
      .png({ 
        quality: 90,
        compressionLevel: 9,
        palette: true
      })
      .toFile('/app/public/favicon-16x16.png');
    
    // Créer 32x32
    await sharp(jpegInput)
      .resize(32, 32, { 
        kernel: sharp.kernel.lanczos3,
        fit: 'cover',
        position: 'center'
      })
      .png({ 
        quality: 90,
        compressionLevel: 9,
        palette: true
      })
      .toFile('/app/public/favicon-32x32.png');
    
    // Créer 48x48
    await sharp(jpegInput)
      .resize(48, 48, { 
        kernel: sharp.kernel.lanczos3,
        fit: 'cover',
        position: 'center'
      })
      .png({ 
        quality: 90,
        compressionLevel: 9,
        palette: true
      })
      .toFile('/app/public/favicon-48x48.png');
    
    console.log('✅ Fichiers PNG multiples créés avec succès');
    
    // Pour l'ICO, nous allons créer un fichier PNG simple de 32x32 et le renommer
    // Note: Sharp ne peut pas créer des vrais fichiers ICO, mais les navigateurs modernes
    // acceptent les fichiers PNG renommés en .ico
    await sharp(jpegInput)
      .resize(32, 32, { 
        kernel: sharp.kernel.lanczos3,
        fit: 'cover',
        position: 'center'
      })
      .png({ 
        quality: 90,
        compressionLevel: 9,
        palette: true
      })
      .toFile('/app/public/favicon.ico');
    
    console.log('✅ favicon.ico créé avec succès (32x32 PNG)');
    
    // Vérifier les tailles des fichiers
    const faviconIcoSize = fs.statSync('/app/public/favicon.ico').size;
    const faviconPngSize = fs.statSync('/app/public/favicon.png').size;
    
    console.log(`📊 Taille favicon.ico: ${Math.round(faviconIcoSize / 1024)}KB`);
    console.log(`📊 Taille favicon.png: ${Math.round(faviconPngSize / 1024)}KB`);
    
    // Vérifier les signatures de fichier
    const icoBuffer = fs.readFileSync('/app/public/favicon.ico');
    const pngBuffer = fs.readFileSync('/app/public/favicon.png');
    
    console.log(`🔍 Signature favicon.ico: ${icoBuffer.slice(0, 4).toString('hex')}`);
    console.log(`🔍 Signature favicon.png: ${pngBuffer.slice(0, 4).toString('hex')}`);
    
    console.log('✅ Conversion terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la conversion:', error);
    process.exit(1);
  }
}

convertFavicon();