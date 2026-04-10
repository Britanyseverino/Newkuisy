/* ================================================
   main.js — JavaScript compartido por TODAS las páginas
   Funciones: sidebar, fecha mínima, tabs del menú
================================================= */

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
