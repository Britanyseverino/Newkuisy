import tkinter as tk
from tkinter import messagebox
# --- Paleta de Colores Kuisy Premium ---
COLOR_FONDO = "#0a0a0a"       # Negro profundo
COLOR_TARJETA = "#16161a"     # Gris azulado muy oscuro
COLOR_NARANJA = "#ff6600"     # Naranja vibrante
COLOR_TEXTO_TITULO = "#ffffff"
COLOR_TEXTO_LABEL = "#888888" # Gris para etiquetas
COLOR_INPUT = "#1f1f23"       # Fondo de los campos

class FormularioKuisy:
    def __init__(self, root):
        self.root = root
        self.root.title("KUISY | Panel de Reservaciones Gourmet")
        
        # Establecemos el tamaño exacto solicitado
        self.root.geometry("1370x750")
        self.root.configure(bg=COLOR_FONDO)
        self.root.resizable(True, True)

        self.campos = {}
        self.crear_interfaz()

    def crear_interfaz(self):
        # --- LADO IZQUIERDO (Decorativo / Título) ---
        # Creamos un contenedor centrado para que no se pegue a los bordes
        self.main_container = tk.Frame(self.root, bg=COLOR_FONDO)
        self.main_container.place(relx=0.5, rely=0.5, anchor="center", width=1200, height=650)

        # Header del Formulario
        header_frame = tk.Frame(self.main_container, bg=COLOR_FONDO)
        header_frame.pack(fill="x", pady=(0, 30))
        
        tk.Label(header_frame, text="K  U  I  S  Y", font=("Impact", 15), 
                 bg=COLOR_FONDO, fg=COLOR_NARANJA).pack()
        tk.Label(header_frame, text="GESTIÓN DE NUEVA RESERVA", font=("Helvetica", 28, "bold"), 
                 bg=COLOR_FONDO, fg=COLOR_TEXTO_TITULO).pack()

        # --- CUERPO DEL FORMULARIO (Diseño en Columnas) ---
        self.form_card = tk.Frame(self.main_container, bg=COLOR_TARJETA, padx=40, pady=40)
        self.form_card.pack(fill="both", expand=True)

        # Configuramos las columnas del grid (3 columnas para aprovechar el ancho)
        self.form_card.columnconfigure(0, weight=1)
        self.form_card.columnconfigure(1, weight=1)
        self.form_card.columnconfigure(2, weight=1)

        # Lista de campos (Etiqueta, Clave, Columna, Fila, es_largo)
        # Basado exactamente en tu estructura SQL
        lista_campos = [
            ("Nombre Completo" " *", "nombre_completo", 0, 0, False),
            ("Correo Electrónico" " *", "correo_electronico", 1, 0, False),
            ("Teléfono" " *", "telefono", 2, 0, False),
            
            ("Fecha (AAAA-MM-DD)" " *", "fecha", 0, 1, False),
            ("Hora (HH:MM)" " *", "hora", 1, 1, False),
            ("Cantidad de Personas" " *", "cantidad_personas", 2, 1, False),
            
            ("Tipo de Mesa" , "tipo_mesa", 0, 2, False),
            ("Ocasión Especial", "ocasion_especial", 1, 2, False),
            
            # Los campos de texto largo ocupan más espacio abajo
            ("Restricción Alimenticia" " *", "restriccion_alimenticia", 0, 3, True),
            ("Notas Adicionales" " *", "notas_adicionales", 1, 3, True)
        ]

        for etiqueta, clave, col, fila, largo in lista_campos:
            self.crear_campo_grid(etiqueta, clave, col, fila, largo)

        # --- BOTÓN DE ACCIÓN ---
        self.btn_confirmar = tk.Button(
            self.main_container, 
            text="CONFIRMAR RESERVACIÓN", 
            command=self.procesar_datos,
            font=("Helvetica", 12, "bold"),
            bg=COLOR_NARANJA, 
            fg="white",
            activebackground="#cc5200",
            activeforeground="white",
            bd=0,
            pady=70,
            cursor="hand2"
        )
        self.btn_confirmar.pack(pady=(10, 0), ipadx=60)

    def crear_campo_grid(self, texto, clave, col, fila, es_largo):
        # Frame contenedor del campo
        f = tk.Frame(self.form_card, bg=COLOR_TARJETA, pady=15, padx=15)
        
        # Si es largo (TextArea), hacemos que ocupe dos columnas si queremos, 
        # o simplemente ajustamos su posición.
        span = 1
        if es_largo and col == 1: span = 2 # El último campo ocupa el resto
            
        f.grid(row=fila, column=col, columnspan=span, sticky="ew")

        # Label estilizado
        tk.Label(f, text=texto.upper(), font=("Helvetica", 8, "bold"), 
                 bg=COLOR_TARJETA, fg=COLOR_TEXTO_LABEL).pack(anchor="w", pady=(0, 8))

        # Widget de entrada (Entry o Text)
        if es_largo:
            input_field = tk.Text(f, height=3, bg=COLOR_INPUT, fg="white", font=("Helvetica", 11),
                                  bd=0, insertbackground=COLOR_NARANJA, padx=10, pady=10)
        else:
            input_field = tk.Entry(f, bg=COLOR_INPUT, fg="white", font=("Helvetica", 12),
                                   bd=0, insertbackground=COLOR_NARANJA, highlightthickness=1,
                                   highlightbackground="#2d2d33", highlightcolor=COLOR_NARANJA)

        input_field.pack(fill="x", ipady=8 if not es_largo else 0)
        self.campos[clave] = input_field

    def procesar_datos(self):
        datos = {}
        for k, v in self.campos.items():
            if isinstance(v, tk.Entry):
                datos[k] = v.get()
            else:
                datos[k] = v.get("1.0", "end-1c")
        
        if not datos["nombre_completo"] or not datos["correo_electronico"] or not datos["telefono"] or not datos["hora"] or not datos["cantidad_personas"] or not datos["restriccion_alimenticia"] or not datos["restriccion_alimenticia"] or not datos["notas_adicionales"]:
            messagebox.showwarning("Faltan Datos", "los campos que tienen asterisco son obligatorios.")
        else:
            messagebox.showinfo("Sistema Kuisy", f"Reserva guardada:\n{datos['nombre_completo']}")

if __name__ == "__main__":
    root = tk.Tk()
    # Forzar alta definición de fuentes en Windows
    try:
        from ctypes import windll
        windll.shcore.SetProcessDpiAwareness(1)
    except:
        pass
    app = FormularioKuisy(root)
    root.mainloop()
