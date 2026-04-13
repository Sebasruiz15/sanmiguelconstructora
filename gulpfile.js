// archivo: gulpfile.js

const { src, dest, watch, parallel } = require('gulp');

const sass         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const cssnano      = require('cssnano');
const postcss      = require('gulp-postcss');
const terser       = require('gulp-terser-js');
const concat       = require('gulp-concat');
const rename       = require('gulp-rename');
const webp         = require('gulp-webp');
const cache        = require('gulp-cache');
const imagemin     = require('gulp-imagemin');
const notify       = require('gulp-notify');

// ── CSS ──────────────────────────────────────────
function css() {
  return src('src/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css'))
    .pipe(notify({ message: '✅ CSS compilado', onLast: true }));
}

// ── JavaScript ───────────────────────────────────
function javascript() {
  return src('src/js/app.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.min.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'))
    .pipe(notify({ message: '✅ JS compilado', onLast: true }));
}

// ── Imágenes WebP ────────────────────────────────
function imagenWebp() {
  return src('src/img/**/*.{jpg,png}')
    .pipe(webp())
    .pipe(dest('build/img'));
}

// ── Imágenes optimizadas ─────────────────────────
function imagenes() {
  return src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3 })))
    .pipe(dest('build/img'))
    .pipe(notify({ message: '✅ Imágenes optimizadas', onLast: true }));
}

// ── Watch ────────────────────────────────────────
function watchArchivos() {
  watch('src/scss/**/*.scss', css);
  watch('src/js/**/*.js', javascript);
  watch('src/img/**/*', imagenes);
}

// ── Exports ──────────────────────────────────────
exports.css        = css;
exports.javascript = javascript;
exports.webp       = imagenWebp;
exports.imagenes   = imagenes;
exports.default    = parallel(css, javascript, imagenWebp, imagenes, watchArchivos);