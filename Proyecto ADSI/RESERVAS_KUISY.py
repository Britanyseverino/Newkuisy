import tkinter as tk
from tkinter import messagebox
 
 #Configuracion de ventana  
ventana = tk.Tk ()
ventana.title("Kuisy")
ventana.geometry("700x650")
ventana.iconbitmap('img/logo2.ico')

#Funcion para el letrero final y validación
def validar():
    Nombre = Nombre.get()
    Teléfono = Teléfono.get()
    
    if Nombre.strip() == "" or  Teléfono.strip() == "":
        messagebox.showwarning("Error", "No puedes dejar esto vacío")
        
    else:
        messagebox.showwarning("Gracias por llenar este formulario", f"tu respuesta ah sido guardada correctamente")


#Esto es para el titulo grande y el texto (Salida)
letrero= tk.Label (ventana, text="Reservas Kuisy",font=("Arial", 30)) 
letrero.pack(pady=30)

#Esta es la salida y entrada de "nombre"
letrero= tk.Label (ventana, text="Nombre completo",font=("Arial", 17)) 
letrero.pack(pady=30)

Nombre = tk.Entry(ventana)
Nombre.pack(pady=30)


#Esta es la entrada y salida de "Teléfono"
letrero1= tk.Label (ventana, text="Teléfono",font=("Arial", 17)) 
letrero1.pack(pady=30)

Teléfono = tk.Entry(ventana)
Teléfono.pack(pady=30)
    
#Button
boton = tk.Button(ventana, text="Confirmar reserva", command=validar)
boton.pack(pady=5)

















ventana.mainloop()

