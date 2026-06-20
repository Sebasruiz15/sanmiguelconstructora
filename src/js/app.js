// archivo: src/js/app.js

// ─────────────────────────────────────────────────
// Módulo: menú responsive
// ─────────────────────────────────────────────────
function initMenuMobile() {
    const btn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.navegacion');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        nav.classList.toggle('mostrar');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('mostrar');
        });
    });
}

// ─────────────────────────────────────────────────
// Módulo: formulario de contacto con EmailJS
// ─────────────────────────────────────────────────
function initFormulario() {
    if (typeof emailjs === 'undefined') return;

    emailjs.init('6uEJ-8KyJau11wRK6');

    const form = document.getElementById('formulario-contacto');
    if (!form) return;

    const submit = form.querySelector('input[type="submit"]');

    function mostrarAlerta(mensaje, tipo) {
        const previa = document.querySelector('.alerta-form');
        if (previa) previa.remove();

        const alerta = document.createElement('p');
        alerta.classList.add('alerta-form', `alerta-${tipo}`);
        alerta.textContent = mensaje;
        form.insertAdjacentElement('afterend', alerta);

        setTimeout(() => alerta.remove(), 5000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submit.value    = 'Enviando...';
        submit.disabled = true;

        const datos = {
            nombre:   form.nombre.value.trim(),
            email:    form.email.value.trim(),
            telefono: form.telefono.value.trim(),
            mensaje:  form.mensaje.value.trim(),
        };

        try {
            await emailjs.send('service_eriievh', 'template_89vxnto', datos);
            mostrarAlerta('✅ Mensaje enviado con éxito. Pronto te contactaremos.', 'exito');
            form.reset();
        } catch (err) {
            console.error('EmailJS error:', err);
            mostrarAlerta('❌ Hubo un error al enviar. Intentá de nuevo.', 'error');
        } finally {
            submit.value    = 'Enviar Mensaje';
            submit.disabled = false;
        }
    });
}

// ─────────────────────────────────────────────────
// Módulo: galería de imágenes con teclado
// ─────────────────────────────────────────────────
function initGaleria() {
    const imgPrincipal = document.getElementById('imagen-principal');
    if (!imgPrincipal) return;

    const thumbs   = document.querySelectorAll('.thumb');
    const btnPrev  = document.getElementById('btn-prev');
    const btnNext  = document.getElementById('btn-next');
    const contador = document.getElementById('galeria-contador');
    const imagenes = Array.from(thumbs).map(t => t.src);
    let actual     = 0;

    function cambiarImagen(indice) {
        imgPrincipal.classList.add('fadeout');
        setTimeout(() => {
            actual = (indice + imagenes.length) % imagenes.length;
            imgPrincipal.src = imagenes[actual];
            imgPrincipal.classList.remove('fadeout');
            thumbs.forEach((t, i) => t.classList.toggle('activo', i === actual));
            if (contador) contador.textContent = `${actual + 1} / ${imagenes.length}`;
        }, 300);
    }

    thumbs.forEach((t, i) => t.addEventListener('click', () => cambiarImagen(i)));
    btnPrev?.addEventListener('click', () => cambiarImagen(actual - 1));
    btnNext?.addEventListener('click', () => cambiarImagen(actual + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  cambiarImagen(actual - 1);
        if (e.key === 'ArrowRight') cambiarImagen(actual + 1);
    });
}

// ─────────────────────────────────────────────────
// Módulo: contadores animados
// ─────────────────────────────────────────────────
function initContadores() {
    const contadores = document.querySelectorAll('.stat-numero[data-target]');
    if (!contadores.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting || entry.target.dataset.animado) return;

            entry.target.dataset.animado = 'true';
            const target   = parseInt(entry.target.dataset.target, 10);
            const duracion = 1800;
            const pasos    = 60;
            let paso       = 0;

            const intervalo = setInterval(() => {
                paso++;
                const valor = Math.min(Math.round((target / pasos) * paso), target);
                entry.target.textContent = valor;
                if (paso >= pasos) {
                    entry.target.textContent = target;
                    clearInterval(intervalo);
                }
            }, duracion / pasos);
        });
    }, { threshold: 0.5 });

    contadores.forEach(c => observer.observe(c));
}

// ─────────────────────────────────────────────────
// Init único — un solo DOMContentLoaded
// ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initMenuMobile();
    initFormulario();
    initGaleria();
    initContadores();

    // AOS — solo si está cargado en la página
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            once: true,
            offset: 80,
            easing: 'ease-out-cubic'
        });
    }
});