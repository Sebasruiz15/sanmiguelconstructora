// archivo: scripts/marca-agua.js
const sharp  = require('sharp');
const fs     = require('fs');
const path   = require('path');

const CARPETAS = [
    'src/img/nativo',
    'src/img/portal',
    'src/img/jardines',
    'src/img/Cattleya',
    'src/img/campestre',
    'src/img/origen',
];

// SVG de texto como marca de agua
const marcaAgua = Buffer.from(`
<svg width="600" height="60">
  <text
    x="50%" y="50%"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="Arial"
    font-size="28"
    font-weight="bold"
    fill="rgba(255,255,255,0.35)"
  >© Inmobiliaria San Miguel</text>
</svg>
`);

async function aplicarMarca(rutaEntrada) {
    const ext = path.extname(rutaEntrada).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

    try {
        const imagen = sharp(rutaEntrada);
        const meta   = await imagen.metadata();

        await imagen
            .composite([{
                input: marcaAgua,
                gravity: 'south',   // parte inferior
                blend:   'over',
            }])
            .toFile(rutaEntrada + '.tmp');

        fs.renameSync(rutaEntrada + '.tmp', rutaEntrada);
        console.log(`✅ ${path.basename(rutaEntrada)}`);
    } catch (err) {
        console.error(`❌ ${path.basename(rutaEntrada)}: ${err.message}`);
    }
}

async function main() {
    for (const carpeta of CARPETAS) {
        if (!fs.existsSync(carpeta)) continue;
        console.log(`\n📁 ${carpeta}`);
        const archivos = fs.readdirSync(carpeta)
            .filter(f => ['.jpg','.jpeg','.png'].includes(path.extname(f).toLowerCase()))
            .map(f => path.join(carpeta, f));
        for (const a of archivos) await aplicarMarca(a);
    }
    console.log('\n✅ Marcas de agua aplicadas. Corré gulp webp para regenerar.');
}

main();