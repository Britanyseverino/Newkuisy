/* ================================================
   KUISY — index.js
   Funcionalidades:
   1. Sidebar (abrir/cerrar)
   2. Tabs del menú
   3. Formulario de reservas (con comentarios PHP/BD)
   4. Fecha mínima en el calendario (no fechas pasadas)
================================================= */


/* ================================================
   1. SIDEBAR — MENÚ LATERAL
================================================= */

// Seleccionamos los elementos del DOM que necesitamos
const menuToggle = document.getElementById('menuToggle');
const sidebar     = document.getElementById('sidebar');
const overlay     = document.getElementById('overlay');

/**
 * Abre el menú lateral:
 * - Agrega clase 'open' al sidebar → se desliza a la vista (CSS: left: 0)
 * - Agrega clase 'active' al overlay → aparece fondo oscuro
 * - Agrega clase 'menu-open' al body → transforma el ícono en X
 */
function openMenu() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.classList.add('menu-open');
}

/**
 * Cierra el menú lateral.
 * Se llama al hacer clic en el overlay o en cualquier link del sidebar.
 */
function closeMenu() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.classList.remove('menu-open');
}

// Escucha el clic en el botón hamburguesa
menuToggle.addEventListener('click', () => {
  // Si el menú ya está abierto, lo cierra; si está cerrado, lo abre
  sidebar.classList.contains('open') ? closeMenu() : openMenu();
});


/* ================================================
   2. TABS DEL MENÚ — cambio de categoría
================================================= */

/**
 * Muestra el contenido de la categoría seleccionada.
 * @param {string} id - El id del tab a mostrar ('lima', 'latina', 'postres')
 *
 * Lógica:
 * - Oculta todos los .tab-content quitando la clase 'active'
 * - Desactiva todos los botones .tab
 * - Activa el tab y el botón correspondiente al id recibido
 */
function showTab(id) {
  // Quitamos la clase active de todos los contenidos
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

  // Quitamos la clase active de todos los botones de tab
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));

  // Activamos el contenido del tab seleccionado
  document.getElementById(id).classList.add('active');

  // Activamos el botón correspondiente
  // Los botones llaman showTab() en el HTML: onclick="showTab('lima')"
  // Buscamos el botón cuyo onclick contiene el id seleccionado
  document.querySelectorAll('.tab').forEach(btn => {
    if (btn.getAttribute('onclick').includes(id)) {
      btn.classList.add('active');
    }
  });
}


/* ================================================
   3. FECHA MÍNIMA EN EL CAMPO DE FECHA
      Impide que el usuario seleccione fechas pasadas
================================================= */

// Al cargar la página, ponemos el mínimo del input date = hoy
window.addEventListener('DOMContentLoaded', () => {
  const inputFecha = document.getElementById('fecha');
  if (inputFecha) {
    // Obtenemos la fecha de hoy en formato YYYY-MM-DD (requerido por input type="date")
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.setAttribute('min', hoy);
  }
});


/* ================================================
   4. FORMULARIO DE RESERVAS
   
   OPCIONES PARA CONECTAR CON LA BASE DE DATOS:
   
   OPCIÓN A — Envío con PHP puro (sin JS):
     - En el HTML cambia el <form> a: <form action="reserva.php" method="POST">
     - Elimina el onsubmit y toda la función handleReserva()
     - En reserva.php recibe los datos con $_POST['campo']
   
   OPCIÓN B — Envío asíncrono con fetch() (AJAX):
     - Mantén el formulario con onsubmit="handleReserva(event)"
     - En handleReserva() usa fetch('reserva.php', { method:'POST', body: formData })
     - Muestra éxito/error sin recargar la página (lo que hace este código)
     - En reserva.php procesa e inserta en la BD y responde con JSON
   
   ESTRUCTURA SQL SUGERIDA:
   CREATE TABLE reservas (
     id          INT AUTO_INCREMENT PRIMARY KEY,
     nombre      VARCHAR(100) NOT NULL,
     email       VARCHAR(150) NOT NULL,
     telefono    VARCHAR(20),
     fecha       DATE NOT NULL,
     hora        TIME NOT NULL,
     personas    VARCHAR(5) NOT NULL,
     mesa        VARCHAR(20),
     ocasion     VARCHAR(20),
     restricciones TEXT,
     mensaje     TEXT,
     creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
================================================= */

/**
 * Maneja el envío del formulario (Opción B — AJAX)
 * @param {Event} e - El evento submit del formulario
 */
function handleReserva(e) {
  // Previene el comportamiento por defecto (recargar la página)
  e.preventDefault();

  const form   = document.getElementById('reservaForm');
  const msgBox = document.getElementById('reservaMsg');

  // ---- Validación básica en el cliente ----
  const nombre  = form.nombre.value.trim();
  const email   = form.email.value.trim();
  const fecha   = form.fecha.value;
  const hora    = form.hora.value;
  const personas = form.personas.value;

  if (!nombre || !email || !fecha || !hora || !personas) {
    showMsg('Por favor completa todos los campos obligatorios (*).', 'error');
    return;
  }

  // Validación de formato de email con expresión regular
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMsg('Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }

  // ---- Recolectamos todos los datos del formulario ----
  // FormData serializa automáticamente todos los campos, incluyendo checkboxes
  const formData = new FormData(form);

  /*
  ================================================
  AQUÍ VA LA LLAMADA A PHP CON fetch() (Opción B):
  
  Descomenta el bloque fetch de abajo y borra el
  bloque de simulación que está debajo de él.
  ================================================
  
  fetch('reserva.php', {
    method: 'POST',
    body: formData         // FormData envía los datos como multipart/form-data
  })
  .then(res => res.json()) // reserva.php debe responder: echo json_encode(['ok'=>true,'msg'=>'...']);
  .then(data => {
    if (data.ok) {
      showMsg('✦ Reserva confirmada. ¡Te esperamos! Recibirás un correo de confirmación.', 'success');
      form.reset();        // limpia el formulario tras el éxito
    } else {
      showMsg(data.msg || 'Ocurrió un error. Intenta nuevamente.', 'error');
    }
  })
  .catch(() => {
    showMsg('Error de conexión. Por favor llámanos al +1 (809) 374-2658.', 'error');
  });
  
  ================================================
  PLANTILLA reserva.php:
  ================================================
  
  <?php
  header('Content-Type: application/json');
  
  // 1. Recibe los datos del formulario
  $nombre   = htmlspecialchars($_POST['nombre'] ?? '');
  $email    = htmlspecialchars($_POST['email'] ?? '');
  $telefono = htmlspecialchars($_POST['telefono'] ?? '');
  $fecha    = $_POST['fecha'] ?? '';
  $hora     = $_POST['hora'] ?? '';
  $personas = $_POST['personas'] ?? '';
  $mesa     = $_POST['mesa'] ?? 'cualquiera';
  $ocasion  = $_POST['ocasion'] ?? 'ninguna';
  $restricciones = implode(', ', $_POST['restricciones'] ?? []);
  $mensaje  = htmlspecialchars($_POST['mensaje'] ?? '');
  
  // 2. Conecta a la base de datos con PDO
  try {
    $pdo = new PDO('mysql:host=localhost;dbname=kuisy_db;charset=utf8', 'usuario', 'contraseña');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 3. Inserta la reserva
    $sql = "INSERT INTO reservas
            (nombre, email, telefono, fecha, hora, personas, mesa, ocasion, restricciones, mensaje)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nombre, $email, $telefono, $fecha, $hora, $personas, $mesa, $ocasion, $restricciones, $mensaje]);
    
    // 4. Responde con éxito
    echo json_encode(['ok' => true, 'msg' => 'Reserva registrada correctamente.']);
    
  } catch (PDOException $e) {
    // 5. Responde con error (no expongas $e->getMessage() en producción)
    echo json_encode(['ok' => false, 'msg' => 'Error al guardar la reserva.']);
  }
  ?>
  
  ================================================
  */

  // ---- SIMULACIÓN (borrar cuando conectes el PHP) ----
  // Simula un pequeño delay de red y muestra éxito
  const btnSubmit = form.querySelector('button[type="submit"]');
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Procesando...';

  setTimeout(() => {
    showMsg(
      `✦ ¡Reserva recibida, ${nombre}! Te contactaremos a ${email} para confirmar tu mesa. ¡Hasta pronto!`,
      'success'
    );
    form.reset();
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Confirmar Reserva ✦';
  }, 1400);
}

/**
 * Muestra el mensaje de respuesta del formulario.
 * @param {string} texto  - El mensaje a mostrar
 * @param {string} tipo   - 'success' | 'error'
 */
function showMsg(texto, tipo) {
  const msgBox = document.getElementById('reservaMsg');
  msgBox.textContent = texto;
  msgBox.className   = `reserva-msg ${tipo}`;  // aplica clase CSS de color
  msgBox.classList.remove('hidden');

  // Hace scroll suave hasta el mensaje para que el usuario lo vea
  msgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


/* ================================================
   5. EFECTO: el botón hamburguesa cambia de color
      según si está sobre el hero oscuro o una sección clara
================================================= */
window.addEventListener('scroll', () => {
  const toggle = document.getElementById('menuToggle');
  const heroAltura = window.innerHeight;

  // Si el scroll está dentro del hero → ícono blanco
  // Si pasó el hero → ícono oscuro (sobre fondo claro)
  if (window.scrollY < heroAltura * 0.8) {
    toggle.style.setProperty('--btn-color', '#ffffff');
  } else {
    toggle.style.setProperty('--btn-color', '#0F0E0D');
  }
});
