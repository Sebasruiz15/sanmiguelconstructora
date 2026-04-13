

document.addEventListener('DOMContentLoaded', function() {

    eventListeners();
});

function eventListeners() {

    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.addEventListener('click', navegacionResponsive);
}
function navegacionResponsive() {
    const navegacion = document.querySelector('.navegacion');
    
    navegacion.classList.toggle('mostrar');
}


// archivo: src/js/contacto.js

(function () {
  // 🔑 Reemplaza estos valores con los tuyos de EmailJS
  const PUBLIC_KEY   = '6uEJ-8KyJau11wRK6';
  const SERVICE_ID   = 'service_eriievh';
  const TEMPLATE_ID  = 'template_89vxnto';

  emailjs.init(PUBLIC_KEY);

  const formulario = document.getElementById('formulario-contacto');
  const boton      = formulario.querySelector('input[type="submit"]');

  if (!formulario) return; // Solo corre en la página de contacto

  formulario.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Feedback visual mientras se envía
    boton.value    = 'Enviando...';
    boton.disabled = true;

    const templateParams = {
      nombre:   formulario.nombre.value.trim(),
      email:    formulario.email.value.trim(),
      telefono: formulario.telefono.value.trim(),
      mensaje:  formulario.mensaje.value.trim(),
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

      mostrarAlerta('✅ Mensaje enviado con éxito. Pronto te contactaremos.', 'exito');
      formulario.reset();

    } catch (error) {
      console.error('Error al enviar:', error);
      mostrarAlerta('❌ Hubo un error al enviar. Intenta de nuevo.', 'error');

    } finally {
      boton.value    = 'Enviar Mensaje';
      boton.disabled = false;
    }
  });

  /**
   * Muestra un mensaje de alerta debajo del formulario
   * @param {string} mensaje
   * @param {'exito'|'error'} tipo
   */
  function mostrarAlerta(mensaje, tipo) {
    // Evita duplicar alertas
    const existente = document.querySelector('.alerta-form');
    if (existente) existente.remove();

    const alerta = document.createElement('p');
    alerta.classList.add('alerta-form', `alerta-${tipo}`);
    alerta.textContent = mensaje;

    formulario.insertAdjacentElement('afterend', alerta);

    // Se oculta sola después de 5 segundos
    setTimeout(() => alerta.remove(), 5000);
  }
})();

// archivo: src/js/galeria.js

(function () {
  const imagenPrincipal = document.getElementById('imagen-principal');
  const thumbs          = document.querySelectorAll('.thumb');
  const btnPrev         = document.getElementById('btn-prev');
  const btnNext         = document.getElementById('btn-next');
  const contador        = document.getElementById('galeria-contador');

  // Si no hay galería en esta página, no hace nada
  if (!imagenPrincipal) return;

  const imagenes = Array.from(thumbs).map(t => t.src);
  let indiceActual = 0;

  function cambiarImagen(nuevoIndice) {
    // Fade out
    imagenPrincipal.classList.add('fadeout');

    setTimeout(() => {
      indiceActual = (nuevoIndice + imagenes.length) % imagenes.length;

      imagenPrincipal.src = imagenes[indiceActual];
      imagenPrincipal.classList.remove('fadeout');

      // Actualiza miniaturas activas
      thumbs.forEach((t, i) => {
        t.classList.toggle('activo', i === indiceActual);
      });

      // Actualiza contador
      contador.textContent = `${indiceActual + 1} / ${imagenes.length}`;
    }, 300);
  }

  // Clicks en miniaturas
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => cambiarImagen(i));
  });

  // Botones anterior / siguiente
  btnPrev.addEventListener('click', () => cambiarImagen(indiceActual - 1));
  btnNext.addEventListener('click', () => cambiarImagen(indiceActual + 1));

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  cambiarImagen(indiceActual - 1);
    if (e.key === 'ArrowRight') cambiarImagen(indiceActual + 1);
  });
})();
// archivo: gulpfile.js — agrega esto

const webp = require('gulp-webp');

function imagenWebp() {
  return src('src/img/**/*.{jpg,png}')   // toma todas las jpg y png
    .pipe(webp())                          // convierte a webp
    .pipe(dest('build/img'));              // guarda en build/img
}

// Agrégala a tu exports al final del archivo
exports.webp = imagenWebp;