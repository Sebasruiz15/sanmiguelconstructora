// archivo: gulpfile.js
const { src, dest, watch, parallel, series } = require('gulp');

const sass         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const cssnano      = require('cssnano');
const postcss      = require('gulp-postcss');
const terser       = require('gulp-terser');        // ✅ cambia aquí
const concat       = require('gulp-concat');
const webp         = require('gulp-webp');
const imagemin     = require('gulp-imagemin');
const notify       = require('gulp-notify');

const esProd = process.env.NODE_ENV === 'production';

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

function javascript() {
    let pipe = src([
        'src/js/app.js'
    ]);

    if (!esProd) pipe = pipe.pipe(sourcemaps.init());

    pipe = pipe
        .pipe(concat('bundle.min.js'))
        .pipe(terser());                            // ✅ cambia aquí

    if (!esProd) pipe = pipe.pipe(sourcemaps.write('.'));

    return pipe
        .pipe(dest('build/js'))
        .pipe(notify({ message: '✅ JS listo', onLast: true }));
}

function imagenWebp() {
    return src('src/img/**/*.{jpg,png}')
        .pipe(webp())
        .pipe(dest('build/img'));
}

function imagenes() {
    return src('src/img/**/*.{jpg,png,svg}')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'))
        .pipe(notify({ message: '✅ Imágenes optimizadas', onLast: true }));
}

function watchArchivos() {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    watch('src/img/**/*', parallel(imagenes, imagenWebp));
}

exports.default = parallel(css, javascript, imagenWebp, imagenes, watchArchivos);
exports.build   = series(parallel(css, javascript), parallel(imagenes, imagenWebp));
exports.css      = css;
exports.js       = javascript;
exports.webp     = imagenWebp;
exports.imagenes = imagenes;