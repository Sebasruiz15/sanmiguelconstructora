// archivo: gulpfile.js
const { src, dest, watch, parallel, series } = require('gulp');

const sass         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const cssnano      = require('cssnano');
const postcss      = require('gulp-postcss');
const terser       = require('gulp-terser');
const concat       = require('gulp-concat');
const webp         = require('gulp-webp');
const imagemin     = require('gulp-imagemin');
const notify       = require('gulp-notify');

const esProd = process.env.NODE_ENV === 'production';

// ── CSS ──────────────────────────────────────────
function css() {
    const plugins = [cssnano()];
    let pipe = src('src/scss/app.scss');
    if (!esProd) pipe = pipe.pipe(sourcemaps.init());

    pipe = pipe
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(postcss(plugins));

    if (!esProd) pipe = pipe.pipe(sourcemaps.write('.'));

    return pipe
        .pipe(dest('build/css'))
        .pipe(notify({ message: '✅ CSS listo', onLast: true }));
}

// ── JavaScript ────────────────────────────────────
function javascript() {
    let pipe = src(['src/js/app.js']);
    if (!esProd) pipe = pipe.pipe(sourcemaps.init());

    pipe = pipe
        .pipe(concat('bundle.min.js'))
        .pipe(terser());

    if (!esProd) pipe = pipe.pipe(sourcemaps.write('.'));

    return pipe
        .pipe(dest('build/js'))
        .pipe(notify({ message: '✅ JS listo', onLast: true }));
}

// ── Imágenes WebP (excluye portal) ───────────────
function imagenWebp() {
    return src([
        'src/img/**/*.{jpg,png}',
        '!src/img/portal/**/*'
    ])
        .pipe(webp())
        .pipe(dest('build/img'));
}

// ── Imágenes optimizadas (excluye portal) ─────────
function imagenes() {
    return src([
        'src/img/**/*.{jpg,png,svg}',
        '!src/img/portal/**/*'
    ], { allowEmpty: true })
        .pipe(imagemin({ optimizationLevel: 3 }))
        .on('error', function(err) {
            console.warn('⚠️ Error optimizando:', err.message);
            this.emit('end');
        })
        .pipe(dest('build/img'))
        .pipe(notify({ message: '✅ Imágenes optimizadas', onLast: true }));
}

// ── Portal: copia directa sin optimizar ───────────
// Las imágenes de portal pesan 30-36MB — mozjpeg no las puede procesar
function imagenesPortal() {
    return src('src/img/portal/**/*.{jpg,png,svg}', { allowEmpty: true })
        .pipe(dest('build/img/portal'));
}

// ── Portal: solo WebP ─────────────────────────────
function webpPortal() {
    return src('src/img/portal/**/*.{jpg,png}', { allowEmpty: true })
        .pipe(webp())
        .pipe(dest('build/img/portal'));
}

// ── Watch ─────────────────────────────────────────
function watchArchivos() {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    watch('src/img/**/*', parallel(imagenes, imagenWebp));
}

// ── Exports ───────────────────────────────────────
exports.default    = parallel(css, javascript, imagenWebp, imagenes, watchArchivos);
exports.build      = series(
    parallel(css, javascript),
    parallel(imagenes, imagenWebp, imagenesPortal, webpPortal)
);
exports.css        = css;
exports.js         = javascript;
exports.webp       = imagenWebp;
exports.imagenes   = imagenes;
exports.portal     = imagenesPortal;
exports.webpPortal = webpPortal;