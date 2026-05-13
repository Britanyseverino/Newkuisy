--Creacion de base de datos

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'Kuisy')
BEGIN
 CREATE DATABASE Kuisy;
END
GO

IF OBJECT_ID('Reservas', 'u') IS NOT NULL
 DROP TABLE Reservas;
GO

Create table Reservas
(
id_reservas INT IDENTITY(1,1) PRIMARY KEY,
nombre_completo VARCHAR(100) NOT NULL,
correo_electronico VARCHAR(100) NOT NULL,
telefono VARCHAR(20) Not Null,
fecha DATE NOT NULL,
hora TIME NOT NULL,
Cantidad_personas INT NOT NULL,
tipo_mesa VARCHAR(50),
ocasion_especial VARCHAR(500),
Restriccion_alimenticia varchar(500) Not Null,
Notas_adicionales varchar(500) Not Null,
)

Select * From Reservas