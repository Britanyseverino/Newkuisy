import tkinter as tk
from tkinter import messagebox, ttk, simpledialog
import re
from datetime import datetime


# --- PALETA DE COLORES ---
COLOR_FONDO = "#050505"        # Negro puro para profundidad
COLOR_TARJETA = "#121214"      # Gris grafito para los contenedores
COLOR_NARANJA = "#948d8d"
COLOR_NARANJA2 = "#ff6600"      # Naranja Kuisy oficial
COLOR_NARANJA_HOVER = "#e65c00" # Naranja un poco más oscuro
COLOR_TEXTO_TITULO = "#ffffff" # Blanco brillante
COLOR_TEXTO_CUERPO = "#b3b3b3" # Gris suave para lectura
COLOR_INPUT = "#1a1a1c"        # Fondo de inputs
COLOR_BORDE = "#2d2d30"   # Bordes sutiles
COLOR_DORADO = "#f9c405" 

class AppReservas:
    def __init__(self, root):
        self.root = root
        self.root.title("KUISY | Sistema de Reservaciones ")
        self.root.geometry("1400x800")
        self.root.configure(bg=COLOR_FONDO)
        self.root.iconbitmap('C:\\Users\\Brita\\OneDrive\\Desktop\\workpace\\Proyecto ADSI\\logo.ico')
        
        # Iniciar en la pantalla de bienvenida
        self.mostrar_bienvenida()
        
    def mostrar_bienvenida(self):
        """Pantalla de inicio con diseño minimalista y elegante"""
        self.frame_bienvenida = tk.Frame(self.root, bg=COLOR_FONDO)
        self.frame_bienvenida.place(relx=0.5, rely=0.5, anchor="center")

        # Elementos decorativos (Línea naranja superior)
        tk.Frame(self.frame_bienvenida, bg=COLOR_NARANJA2, height=2, width=100).pack(pady=10)

        # Logo y Eslogan
      # Usamos subsample para reducir el tamaño si la imagen es muy grande
        self.logo_img = tk.PhotoImage(file="C:\\Users\\Brita\\OneDrive\\Desktop\\workpace\\Proyecto ADSI\\logo.png").subsample(10, 10)

# 2. Logo y Eslogan integrados
        tk.Label(self.frame_bienvenida, text="K  U  I  S  Y", font=("Impact", 50), 
 image=self.logo_img, compound="left", padx=30, bg=COLOR_FONDO, 
        fg=COLOR_DORADO).pack(pady=(20, 0))
        
        tk.Label(self.frame_bienvenida, text="BIENVENIDO A LA ALTA COCINA", 
            font=("Helvetica", 22, "bold"), bg=COLOR_FONDO, fg=COLOR_TEXTO_TITULO).pack(pady=10)
        
        tk.Label(self.frame_bienvenida, text="Gestione sus reservas con elegancia y precisión.", 
        font=("Helvetica", 12), bg=COLOR_FONDO, fg=COLOR_TEXTO_CUERPO).pack(pady=(0, 40))

        # Botón con efecto visual
        self.btn_entrar = tk.Button(
            self.frame_bienvenida, text="COMENZAR RESERVA", 
            command=self.abrir_formulario, font=("Helvetica", 13, "bold"), 
            bg=COLOR_NARANJA2, fg="white", activebackground=COLOR_NARANJA_HOVER,
            activeforeground="white", bd=0, padx=50, pady=18, cursor="hand2"
        )
        self.btn_entrar.pack()
        
        # Efecto Hover simple
        self.btn_entrar.bind("<Enter>", lambda e: self.btn_entrar.configure(bg=COLOR_NARANJA_HOVER))
        self.btn_entrar.bind("<Leave>", lambda e: self.btn_entrar.configure(bg=COLOR_NARANJA))

    def abrir_formulario(self):
        self.frame_bienvenida.destroy()
        FormularioKuisy(self.root)

class FormularioKuisy:
    def __init__(self, root):
        self.root = root
        self.root.title("KUISY | Panel de Reservaciones Gourmet")
        self.root.geometry("1370x750")
        self.root.configure(bg=COLOR_FONDO)
        self.root.resizable(True, True)

        # --- CONFIGURACIÓN DE ESTILOS MODERNOS (TTK) ---
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Estilo personalizado para las listas desplegables (Combobox)
        self.style.configure("TCombobox", 
                             fieldbackground=COLOR_INPUT, 
                             background=COLOR_INPUT, 
                             foreground="white",
                             bordercolor="#2d2d33",
                             darkcolor=COLOR_INPUT,
                             lightcolor=COLOR_INPUT,
                             arrowcolor=COLOR_NARANJA2)
        
        # Color al estar seleccionado o en modo lectura
        self.style.map("TCombobox", 
                       fieldbackground=[("readonly", COLOR_INPUT)],
                       background=[("readonly", COLOR_INPUT)])

        # Configuración de la fuente y colores de la lista interna del Combobox
        self.root.option_add("*TCombobox*Listbox.background", COLOR_INPUT)
        self.root.option_add("*TCombobox*Listbox.foreground", "white")
        self.root.option_add("*TCombobox*Listbox.selectBackground", COLOR_NARANJA)
        self.root.option_add("*TCombobox*Listbox.font", ("Helvetica", 12))

        self.campos = {} # Diccionario para almacenar los widgets y validarlos luego
        self.crear_interfaz()

    def crear_interfaz(self):
        # Contenedor principal centrado
        self.main_container = tk.Frame(self.root, bg=COLOR_FONDO)
        self.main_container.place(relx=0.5, rely=0.5, anchor="center", width=1200, height=680)

        # SECCIÓN DE ENCABEZADO (Logo y Título)
        header_frame = tk.Frame(self.main_container, bg=COLOR_FONDO)
        header_frame.pack(fill="x", pady=(0, 20))
        
        self.logo_img = tk.PhotoImage(file="C:\\Users\\Brita\\OneDrive\\Desktop\\workpace\\Proyecto ADSI\\logo.png").subsample(25, 25)
        
        tk.Label(header_frame, text="K  U  I  S  Y", font=("Impact", 18), 
                 image=self.logo_img, compound="left", padx=20,
                 bg=COLOR_FONDO, fg=COLOR_DORADO).pack()
        
        
        tk.Label(header_frame, text="GESTIÓN DE NUEVA RESERVA", font=("Helvetica", 32, "bold"), 
                 bg=COLOR_FONDO, fg=COLOR_TEXTO_TITULO).pack()

        # CUERPO DEL FORMULARIO
        self.form_card = tk.Frame(self.main_container, bg=COLOR_TARJETA, padx=40, pady=30)
        self.form_card.pack(fill="both", expand=True)

        # Configuración de columnas para que el diseño sea proporcional
        self.form_card.columnconfigure(0, weight=1)
        self.form_card.columnconfigure(1, weight=1)
        self.form_card.columnconfigure(2, weight=1)

        # DEFINICIÓN DE CAMPOS (Etiqueta, Clave, Columna, Fila, Tipo/Opciones)
        lista_campos = [
            ("Nombre Completo *", "nombre_completo", 0, 0, "entry"),
            ("Correo Electrónico *", "correo_electronico", 1, 0, "entry"),
            ("Teléfono (RD) *", "telefono", 2, 0, "entry"),
            ("Fecha (AAAA-MM-DD) *", "fecha", 0, 1, "entry"),
            ("Hora (Ej: 02:30 PM) *", "hora", 1, 1, "entry"),
            ("Cantidad de Personas (Máx. 30) *", "Cantidad_personas", 2, 1, "entry"),
            
            ("Tipo de Mesa", "tipo_mesa", 0, 2, ["Terraza", "Salón Principal", "Zona VIP", "Barra", "Cerca de Ventana"]),
            ("Ocasión Especial", "ocasion_especial", 1, 2, ["Ninguna", "Cumpleaños", "Aniversario", "Cena de Negocios", "Otro"]),
            
            ("Restricción Alimenticia *", "Restriccion_alimenticia", 0, 3, "text"),
            ("Notas Adicionales ", "Notas_adicionales", 1, 3, "text")
        ]

        # Bucle para generar todos los campos automáticamente
        for etiqueta, clave, col, fila, tipo in lista_campos:
            self.crear_campo_grid(etiqueta, clave, col, fila, tipo)

        # BOTÓN DE ACCIÓN PRINCIPAL
        self.btn_confirmar = tk.Button(
            self.main_container, 
            text="CONFIRMAR RESERVACIÓN", 
            command=self.procesar_datos, # Llama a la validación
            font=("Helvetica", 14, "bold"), 
            bg=COLOR_NARANJA2, 
            fg="white",
            activebackground="#cc5200",
            activeforeground="white",
            bd=0,
            pady=15,
            cursor="hand2"
        )
        self.btn_confirmar.pack(pady=(20, 0), ipadx=60)

    def crear_campo_grid(self, texto, clave, col, fila, tipo):
        """Genera cada celda del formulario con su etiqueta y entrada correspondiente"""
        f = tk.Frame(self.form_card, bg=COLOR_TARJETA, pady=10, padx=15)
        span = 1
        if tipo == "text" and col == 1: span = 2 
        f.grid(row=fila, column=col, columnspan=span, sticky="ew")

        # Etiqueta del campo (Label)
        tk.Label(f, text=texto.upper(), font=("Helvetica", 10, "bold"), 
                 bg=COLOR_TARJETA, fg=COLOR_NARANJA).pack(anchor="w", pady=(0, 5))

        # Renderizado según el tipo de campo
        if tipo == "text":
            # Cuadro de texto multilínea
            widget = tk.Text(f, height=2, bg=COLOR_INPUT, fg="white", font=("Helvetica", 12),
                             bd=0, insertbackground=COLOR_NARANJA, padx=10, pady=10)
        elif isinstance(tipo, list):
            # Lista desplegable
            widget = ttk.Combobox(f, values=tipo, state="readonly", font=("Helvetica", 13), style="TCombobox")
            widget.set("Seleccionar...") 
            if "Otro" in tipo:
                widget.bind("<<ComboboxSelected>>", lambda e, w=widget: self.verificar_otro(e, w))
        else:
            # Campo de entrada simple (Entry)
            widget = tk.Entry(f, bg=COLOR_INPUT, fg="white", font=("Helvetica", 12),
                              bd=0, insertbackground=COLOR_NARANJA, highlightthickness=1,
                              highlightbackground="#2d2d33", highlightcolor=COLOR_NARANJA)

        widget.pack(fill="x", ipady=8 if tipo != "text" else 0)
        self.campos[clave] = (widget, texto) # Guardar para validación posterior

    def verificar_otro(self, event, widget):
        """Permite al usuario escribir una opción personalizada si selecciona 'Otro'"""
        if widget.get() == "Otro":
            while True:
                respuesta = simpledialog.askstring("Personalizar", "Especifique la ocasión:", parent=self.root)
                if respuesta is None:
                    widget.set("Seleccionar...")
                    break
                respuesta = respuesta.strip()
                if respuesta:
                    actuales = list(widget['values'])
                    if respuesta not in actuales:
                        actuales.append(respuesta)
                        widget['values'] = actuales
                    widget.set(respuesta)
                    break
                else:
                    messagebox.showwarning("Campo Vacío", "Debe escribir algo o presionar Cancelar.")

    def procesar_datos(self):
        """Extrae, valida y procesa la información del formulario"""
        datos = {}
        for clave, (widget, etiqueta) in self.campos.items():
            # Obtener texto según el tipo de widget
            if isinstance(widget, (tk.Entry, ttk.Combobox)):
                valor = widget.get().strip()
            else: 
                valor = widget.get("1.0", "end-1c").strip()
            
            datos[clave] = valor

            # Validación de campos obligatorios (*)
            if "*" in etiqueta:
                if not valor or valor == "Seleccionar...":
                    messagebox.showwarning("Campos Obligatorio","Los campos con asterisco (*) son obligatorios")
                    widget.focus_set()
                    return

        # VALIDACIÓN DE EMAIL (Regex)
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', datos["correo_electronico"]):
            messagebox.showerror("Correo Inválido", "Por favor ingrese un correo electrónico válido.")
            return

        # VALIDACIÓN TELÉFONO RD
        tel_input = datos["telefono"].strip()
        solo_digitos = tel_input.replace("-", "")
        if not re.match(r'^(809|829|849)-?\d{3}-?\d{4}$', tel_input) or len(solo_digitos) != 10:
            messagebox.showerror("Teléfono Inválido", "Use un formato válido de RD (809-000-0000)")
            return

        # VALIDACIÓN DE HORARIO PM
        try:
            hora_obj = datetime.strptime(datos["hora"], '%I:%M %p').time()
            inicio_labores = datetime.strptime("12:00 PM", '%I:%M %p').time()
            fin_labores = datetime.strptime("11:00 PM", '%I:%M %p').time()
            if "AM" in datos["hora"]:
                messagebox.showerror("Horario No Disponible", "Solo aceptamos reservas en horario PM.")
                return
            if not (inicio_labores <= hora_obj <= fin_labores):
                messagebox.showerror("Restaurante Cerrado", "Horario: 12:00 PM a 11:00 PM.")
                return
        except ValueError:
            messagebox.showerror("Error de Formato", "Formato de hora sugerido: 02:30 PM")
            return
        
        # VALIDACIÓN DE FECHA
        try:
            fecha_dt = datetime.strptime(datos["fecha"], '%Y-%m-%d').date()
            if fecha_dt < datetime.now().date():
                messagebox.showerror("Fecha Inválida", "No se permiten fechas pasadas.")
                return
        except ValueError:
            messagebox.showerror("Fecha Incoherente", "Use el formato: AAAA-MM-DD")
            return
        
        # VALIDACIÓN DE CANTIDAD DE PERSONAS
        if not datos["cantidad_personas"].isdigit() or not (0 < int(datos["cantidad_personas"]) <= 30):
            messagebox.showerror("Error de Aforo", "La cantidad permitida es de 1 a 30 personas.")
            return

        #ÉXITO
        messagebox.showinfo("KUISY System", f"¡Reserva confirmada!\n\nCliente: {datos['nombre_completo']}\nFecha: {datos['fecha']}\nHora: {datos['hora']}")

if __name__ == "__main__":
    root = tk.Tk()
    try:
        from ctypes import windll
        windll.shcore.SetProcessDpiAwareness(1)
    except: pass
    
    app = AppReservas(root)
    root.mainloop()