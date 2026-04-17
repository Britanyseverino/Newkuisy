/* ================================================
   main.js — JavaScript compartido por TODAS las páginas
   Funciones: sidebar, fecha mínima, tabs del menú, traducción
================================================= */

/* --- SISTEMA DE TRADUCCIÓN COMPLETO --- */
const translations = {
  es: {
    // Navegación
    inicio: '✦ Inicio',
    nosotros: '✦ Sobre Nosotros',
    menu: '✦ Menú',
    reservas: '✦ Reservas',
    contacto: '✦ Contacto',
    
    // Hero
    tag_hero: '✦ Lima · Andes · Latinoamérica ✦',
    title_hero: 'KUISY',
    subtitle_hero: 'kusi — quechua: alegría, dicha, ventura',
    desc_hero: 'Donde la tradición andina se viste de arte urbano.\nUn hogar sofisticado con el sabor más auténtico de América.',
    btn_menu: 'Ver el Menú',
    btn_reservar: 'Reservar Mesa',
    
    // Características
    feat1_title: 'Ingredientes Frescos',
    feat1_desc: 'Seleccionados cada mañana en mercados locales y traídos directamente del campo.',
    feat2_title: 'Arte en cada Plato',
    feat2_desc: 'Inspirados en los murales de la Comuna 13, cada presentación es una obra de arte.',
    feat3_title: 'Recetas Ancestrales',
    feat3_desc: 'Técnicas quechuas transmitidas por generaciones, llevadas a la mesa moderna.',
    feat4_title: 'Como en Casa',
    feat4_desc: 'Un ambiente que abraza: sofisticado, cálido y siempre a la moda.',
    
    // CTA
    exp_kuisy: 'la experiencia KUISY?',
    cta_desc: 'Reserva tu mesa hoy y déjate llevar por los sabores que cambiaron Santo Domingo.',
    btn_reservar_cta: 'Reservar Ahora ✦',
    
    // Footer
    footer_hours: 'Horarios',
    footer_lun_vie: 'Lun–Vie: 12pm – 11pm',
    footer_sab_dom: 'Sáb–Dom: 11am – 12am',
    footer_contact: 'Contacto',
    footer_phone: '📞 +1 (809) 374-2658',
    footer_email: '📧 info@kuisy.com',
    footer_location: '📍 Santo Domingo, RD'
  },
  en: {
    // Navigation
    inicio: '✦ Home',
    nosotros: '✦ About Us',
    menu: '✦ Menu',
    reservas: '✦ Reservations',
    contacto: '✦ Contact',
    
    // Hero
    tag_hero: '✦ Lima · Andes · Latin America ✦',
    title_hero: 'KUISY',
    subtitle_hero: 'kusi — quechua: joy, happiness, fortune',
    desc_hero: 'Where Andean tradition dresses up as urban art.\nA sophisticated home with the most authentic flavor of America.',
    btn_menu: 'View Menu',
    btn_reservar: 'Reserve Table',
    
    // Features
    feat1_title: 'Fresh Ingredients',
    feat1_desc: 'Selected every morning from local markets and brought directly from the field.',
    feat2_title: 'Art on Every Plate',
    feat2_desc: 'Inspired by the murals of Comuna 13, each presentation is a work of art.',
    feat3_title: 'Ancestral Recipes',
    feat3_desc: 'Quechua techniques passed down through generations, brought to the modern table.',
    feat4_title: 'Like Home',
    feat4_desc: 'An environment that embraces you: sophisticated, warm, and always in style.',
    
    // CTA
    exp_kuisy: 'the KUISY experience?',
    cta_desc: 'Reserve your table today and let yourself be carried away by the flavors that changed Santo Domingo.',
    btn_reservar_cta: 'Reserve Now ✦',
    
    // Footer
    footer_hours: 'Hours',
    footer_lun_vie: 'Mon–Fri: 12pm – 11pm',
    footer_sab_dom: 'Sat–Sun: 11am – 12am',
    footer_contact: 'Contact',
    footer_phone: '📞 +1 (809) 374-2658',
    footer_email: '📧 info@kuisy.com',
    footer_location: '📍 Santo Domingo, RD'
  }
};

/* ========================================================
   FUNCIONALIDAD "VER MÁS" en descripciones de platos
======================================================== */
function initReadMore() {
  const cardBodies = document.querySelectorAll('.card-body');
  const MAX_HEIGHT = 120; // píxeles, aproximadamente 3 líneas
  
  cardBodies.forEach(body => {
    const paragraph = body.querySelector('p');
    if (paragraph) {
      // Crear wrapper para la descripción
      const descWrapper = document.createElement('div');
      descWrapper.className = 'card-desc';
      
      // Mover párrafo al wrapper
      paragraph.parentNode.insertBefore(descWrapper, paragraph);
      descWrapper.appendChild(paragraph);
      
      // Crear botón "Ver más"
      const btn = document.createElement('button');
      btn.className = 'btn-read-more';
      btn.textContent = 'Ver más';
      btn.type = 'button';
      
      descWrapper.appendChild(btn);
      
      // Verificar si el texto está truncado
      setTimeout(() => {
        const isOverflowing = paragraph.scrollHeight > paragraph.offsetHeight + 2;
        if (!isOverflowing) {
          btn.classList.add('hidden');
        }
      }, 100);
      
      // Event listener para expandir/contraer
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        paragraph.classList.toggle('expanded');
        this.textContent = paragraph.classList.contains('expanded') ? 'Ver menos ▲' : 'Ver más ▼';
      });
    }
  });
}

/* Obtiene el idioma guardado o muestra el alert */
function initLanguage() {
  let lang = localStorage.getItem('website-lang');
  if (!lang) {
    showLanguageAlert();
  } else {
    setLanguage(lang);
  }
}

/* Muestra un alert para seleccionar idioma */
function showLanguageAlert() {
  const result = confirm('¿Deseas traducir la página al inglés?\n\nDo you want to translate the page to English?\n\n[OK = English | Cancel = Español]');
  setLanguage(result ? 'en' : 'es');
}

/* Establece el idioma y traduce toda la página */
function setLanguage(lang) {
  localStorage.setItem('website-lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Traduce todos los elementos con data-translate
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  
  // Actualiza los enlaces del sidebar
  const linkInicio = document.querySelector('.sidebar a[href="index.html"]');
  const linkNosotros = document.querySelector('.sidebar a[href="nosotros.html"]');
  const linkMenu = document.querySelector('.sidebar a[href="menu.html"]');
  const linkReservas = document.querySelector('.sidebar a[href="reservas.html"]');
  const linkContacto = document.querySelector('.sidebar a[href="#footer"]');
  
  if (linkInicio) linkInicio.textContent = translations[lang].inicio;
  if (linkNosotros) linkNosotros.textContent = translations[lang].nosotros;
  if (linkMenu) linkMenu.textContent = translations[lang].menu;
  if (linkReservas) linkReservas.textContent = translations[lang].reservas;
  if (linkContacto) linkContacto.textContent = translations[lang].contacto;
  
  // Cierra el modal si está abierto
  closeLanguageModal();
}

/* Cierra el modal de idioma (si existe) */
function closeLanguageModal() {
  const modal = document.getElementById('languageModal');
  if (modal) modal.classList.remove('show');
}

/* Alerta que avisa los fines de la pagina */
alert('Esta página está hecha con fines estudiantiles');

/* --- Abre el sidebar y muestra el overlay --- */
function openMenu() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('active');
  document.body.classList.add('menu-open');
}

/* --- Cierra el sidebar (se llama desde links y overlay) --- */
function closeMenu() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
  document.body.classList.remove('menu-open');
}

/* --- Alterna abrir/cerrar al hacer clic en la hamburguesa --- */
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.contains('open') ? closeMenu() : openMenu();
});

/* --- Marca el link activo según la página actual --- */
/* Compara el href de cada link con la URL actual */
document.querySelectorAll('.sidebar a').forEach(link => {
  if (link.href === window.location.href) link.classList.add('active');
});

/* --- Evita fechas pasadas en el formulario de reservas --- */
/* Solo corre si existe el campo #fecha en la página actual */
const inputFecha = document.getElementById('fecha');
if (inputFecha) {
  inputFecha.min = new Date().toISOString().split('T')[0]; /* formato YYYY-MM-DD */
}

/* ================================================
   TABS DEL MENÚ (solo en menu.html)
   Muestra el tab seleccionado y oculta los demás
================================================= */
function showTab(id) {
  /* Oculta todos los contenidos de tab */
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  /* Desactiva todos los botones de tab */
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  /* Activa el contenido y botón seleccionado */
  document.getElementById(id)?.classList.add('active');
  document.querySelector(`[data-tab="${id}"]`)?.classList.add('active');
}

/* ================================================
   FORMULARIO DE RESERVAS (solo en reservas.html)

   PARA CONECTAR CON PHP:
   1. Cambia onsubmit por: <form action="reserva.php" method="POST">
   2. En reserva.php usa $_POST['nombre'], $_POST['fecha'], etc.
   3. Responde con json_encode(['ok'=>true]) para el fetch()
   4. Inserta en MySQL con PDO (ver comentario en reservas.html)
================================================= */
function handleReserva(e) {
  e.preventDefault(); /* evita recargar la página */

  const form = e.target;
  const nombre = form.nombre.value.trim();
  const email  = form.email.value.trim();

  /* Validación básica: campos obligatorios no vacíos */
  if (!nombre || !email || !form.fecha.value || !form.hora.value || !form.personas.value) {
    mostrarMsg('Completa todos los campos obligatorios (*)', 'error');
    return;
  }

  /* Validación de formato de email */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarMsg('Ingresa un correo válido', 'error');
    return;
  }

  /* --- BLOQUE fetch() para envío AJAX a PHP ---
     Descomenta esto y borra el setTimeout de abajo
     cuando tengas tu reserva.php listo:

  fetch('reserva.php', { method:'POST', body: new FormData(form) })
    .then(r => r.json())
    .then(data => {
      if (data.ok) { mostrarMsg('¡Reserva confirmada!', 'success'); form.reset(); }
      else mostrarMsg(data.msg, 'error');
    })
    .catch(() => mostrarMsg('Error de conexión', 'error'));
  return;
  */

  /* Simulación mientras no tienes el PHP listo */
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Procesando...';
  setTimeout(() => {
    mostrarMsg(`✦ ¡Reserva recibida, ${nombre}! Te escribiremos a ${email}.`, 'success');
    form.reset();
    btn.disabled = false; btn.textContent = 'Confirmar Reserva ✦';
  }, 1400);
}

/* Muestra el mensaje de éxito o error bajo el formulario */
function mostrarMsg(texto, tipo) {
  const box = document.getElementById('reservaMsg');
  if (!box) return;
  box.textContent = texto;
  box.className = `reserva-msg ${tipo}`;
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* --- INICIALIZAR EL IDIOMA Y FUNCIONALIDAD "VER MÁS" CUANDO CARGA LA PÁGINA --- */
document.addEventListener('DOMContentLoaded', function() {
  initLanguage();
  initReadMore();
});
