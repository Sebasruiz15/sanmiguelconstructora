// archivo: scripts/comprimir.js
// Comprime y redimensiona todas las imágenes a máximo 1920px y 80% calidad
// Uso: node scripts/comprimir.js

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const CARPETAS = [
    'src/img/portal',
    'src/img/nativo',
    'src/img/jardines',
    'src/img/Cattleya',
];

const OPCIONES = {
    maxWidth:  1920,
    calidad:   80,
};

async function comprimirImagen(rutaEntrada) {
    const ext    = path.extname(rutaEntrada).toLowerCase();
    const salida = rutaEntrada; // sobreescribe el original

    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

    try {
        const imagen = sharp(rutaEntrada);
        const meta   = await imagen.metadata();

        console.log(`⚙️  ${path.basename(rutaEntrada)} — ${(fs.statSync(rutaEntrada).size / 1024 / 1024).toFixed(1)}MB`);

        await imagen
            .resize({
                width:  OPCIONES.maxWidth,
                height: OPCIONES.maxWidth,
                fit:    'inside',         // respeta la proporción
                withoutEnlargement: true, // no agranda si ya es más pequeña
            })
            .jpeg({ quality: OPCIONES.calidad, progressive: true })
            .toFile(salida + '.tmp');

        // Reemplazamos el original con el comprimido
        fs.renameSync(salida + '.tmp', salida);

        const nuevoPeso = (fs.statSync(salida).size / 1024 / 1024).toFixed(1);
        console.log(`   ✅ → ${nuevoPeso}MB`);

    } catch (err) {
        console.error(`   ❌ Error en ${path.basename(rutaEntrada)}:`, err.message);
    }
}

async function procesarCarpeta(carpeta) {
    if (!fs.existsSync(carpeta)) {
        console.log(`⚠️  Carpeta no encontrada: ${carpeta}`);
        return;
    }

    const archivos = fs.readdirSync(carpeta)
        .filter(f => ['.jpg', '.jpeg', '.png'].includes(path.extname(f).toLowerCase()))
        .map(f => path.join(carpeta, f));

    console.log(`\n📁 ${carpeta} — ${archivos.length} imágenes`);

    for (const archivo of archivos) {
        await comprimirImagen(archivo);
    }
}

async function main() {
    console.log('🚀 Iniciando compresión...\n');
    for (const carpeta of CARPETAS) {
        await procesarCarpeta(carpeta);
    }
    console.log('\n✅ Compresión completada. Ahora corré: gulp webp && gulp imagenes');
}

main();