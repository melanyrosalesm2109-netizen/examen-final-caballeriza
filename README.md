# Sistema de Gestión de Caballeriza

Proyecto desarrollado como examen final para administrar de manera centralizada las operaciones de una caballeriza.

El sistema permite gestionar caballos, historial médico, empleados, turnos, tareas, alimentación, suministros, inventario, alertas, reservas, calendario, usuarios y permisos.

## Integrantes

* Melany Rosales
* Josué Gómez

## Objetivo del proyecto

Desarrollar una aplicación web completa que permita mejorar la organización y el seguimiento de las actividades realizadas dentro de una caballeriza.

La solución cuenta con:

* Backend desarrollado con Spring Boot.
* API REST protegida mediante JWT.
* Frontend desarrollado con React y Vite.
* Base de datos MySQL.
* Control de acceso mediante roles.
* Documentación de la API con Swagger.
* Pruebas unitarias de backend y frontend.
* Diseño adaptable para computadoras, tabletas y teléfonos.

## Funcionalidades principales

### Gestión de caballos

* Registrar caballos.
* Consultar caballos.
* Editar información.
* Eliminar registros.
* Guardar raza, edad, sexo, peso, identificador y fotografía.

### Historial médico

* Registrar vacunas.
* Registrar tratamientos.
* Registrar alergias.
* Registrar observaciones.
* Asignar responsables.
* Consultar el historial por caballo.
* Registrar la fecha de próxima vacunación.
* Registrar la fecha de vencimiento de tratamientos.

### Alertas automáticas

El sistema genera alertas para:

* Próximas vacunaciones.
* Vacunaciones vencidas.
* Próximo vencimiento de tratamientos.
* Tratamientos vencidos.
* Insumos con stock bajo.
* Avisos generales.

Las alertas pueden marcarse como leídas o no leídas y se muestran en el panel principal y en la campana de notificaciones.

### Personal

* Registrar empleados.
* Editar empleados.
* Eliminar empleados.
* Asignar roles laborales.
* Registrar turnos.
* Asignar tareas.
* Cambiar el estado de las tareas.
* Filtrar tareas por empleado, fecha y estado.

### Alimentación

* Registrar planes de alimentación.
* Asignar planes a caballos.
* Guardar horarios, cantidades y observaciones.
* Consultar y editar planes existentes.

### Inventario y suministros

* Registrar insumos.
* Editar productos del inventario.
* Controlar cantidad actual y stock mínimo.
* Registrar suministros utilizados.
* Reducir automáticamente el inventario al registrar un suministro.
* Generar alertas cuando un insumo alcanza un nivel bajo.

### Reservas y calendario

* Registrar reservas.
* Editar reservas.
* Cancelar reservas.
* Eliminar reservas.
* Filtrar por tipo, fecha y estado.
* Controlar cupos en paseos.
* Evitar reservar más cupos de los permitidos.
* Mostrar reservas organizadas por fecha en el calendario.

Tipos de reserva:

* Veterinario.
* Monta.
* Paseo.
* Entrenamiento.

### Usuarios y seguridad

* Registro de usuarios.
* Inicio de sesión.
* Cierre de sesión.
* Autenticación mediante JWT.
* Protección de rutas.
* Activación y desactivación de cuentas.
* Cambio de roles.
* Eliminación de usuarios.
* Menú adaptado según los permisos.

El primer usuario registrado se crea como administrador. Los usuarios siguientes se registran inicialmente como clientes.

## Roles del sistema

### Administrador

Tiene acceso completo al sistema:

* Usuarios y roles.
* Empleados.
* Caballos.
* Historial médico.
* Alimentación.
* Inventario.
* Suministros.
* Alertas.
* Turnos.
* Tareas.
* Reservas.
* Calendario.

### Veterinario

Puede acceder a:

* Caballos.
* Historial médico.
* Alimentación.
* Inventario.
* Suministros.
* Alertas.
* Reservas y calendario.

### Cuidador

Puede acceder a:

* Caballos.
* Alimentación.
* Inventario.
* Suministros.
* Alertas.
* Turnos.
* Tareas.
* Reservas.
* Calendario.

### Cliente

Puede acceder principalmente a:

* Inicio.
* Reservas.
* Calendario.

## Tecnologías utilizadas

### Backend

* Java 17.
* Spring Boot 3.
* Spring Web.
* Spring Data JPA.
* Spring Security.
* JWT.
* Hibernate.
* MySQL.
* Bean Validation.
* Lombok.
* Springdoc OpenAPI.
* JUnit 5.
* Mockito.
* Maven.

### Frontend

* React.
* Vite.
* React Router.
* Axios.
* Lucide React.
* CSS responsivo.
* Vitest.
* Testing Library.
* jsdom.

## Arquitectura

El proyecto está dividido en dos aplicaciones independientes:

```text
examen-final-caballeriza/
├── backend/
│   ├── src/main/java/
│   │   └── com/caballeriza/backend/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── model/
│   │       ├── repository/
│   │       ├── security/
│   │       └── service/
│   └── src/test/java/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── test/
│   └── public/
│
└── README.md
```

El frontend consume la API REST del backend mediante Axios.

## Requisitos previos

Antes de ejecutar el proyecto se necesita:

* Java 17 o superior.
* Maven o Maven Wrapper.
* Node.js.
* npm.
* MySQL.
* Git.

## Configuración de la base de datos

Crear o permitir que Spring Boot cree la base de datos:

```sql
CREATE DATABASE caballeriza_db;
```

La aplicación utiliza por defecto:

```text
Base de datos: caballeriza_db
Servidor: localhost
```

El puerto de MySQL puede ser `3306` o `3307`, dependiendo de la instalación local.

## Variables de entorno

El backend utiliza variables de entorno para evitar guardar información sensible en el repositorio.

Variables necesarias:

```properties
DB_USER=root
DB_PASSWORD=contraseña_mysql
JWT_SECRET=clave_secreta_segura_para_firmar_tokens
JWT_EXPIRATION_MS=86400000
```

Ejemplo de configuración en `application.properties`:

```properties
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:}

app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}
```

No se deben subir contraseñas reales ni secretos JWT al repositorio.

## Ejecutar el backend

Entrar a la carpeta:

```bash
cd backend
```

En Windows:

```bash
mvnw.cmd spring-boot:run
```

También puede ejecutarse con Maven instalado:

```bash
mvn spring-boot:run
```

El backend estará disponible en:

```text
http://localhost:8080
```

## Ejecutar el frontend

Entrar a la carpeta:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el proyecto:

```bash
npm run dev
```

El frontend estará disponible normalmente en:

```text
http://localhost:5173
```

## Documentación de la API

Con el backend en ejecución, Swagger puede abrirse en:

```text
http://localhost:8080/swagger-ui/index.html
```

La documentación OpenAPI en formato JSON está disponible en:

```text
http://localhost:8080/v3/api-docs
```

Swagger permite consultar los controladores, endpoints, parámetros, modelos y respuestas de la API.

## Endpoints principales

### Autenticación

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Caballos

```text
GET    /api/horses
POST   /api/horses
PUT    /api/horses/{id}
DELETE /api/horses/{id}
```

### Historial médico

```text
GET    /api/medical-history
GET    /api/medical-history/horse/{horseId}
POST   /api/medical-history
PUT    /api/medical-history/{id}
DELETE /api/medical-history/{id}
```

### Alertas

```text
GET    /api/alerts
GET    /api/alerts/unread
POST   /api/alerts
POST   /api/alerts/generate-low-stock
POST   /api/alerts/generate-medical
PUT    /api/alerts/{id}/read
PUT    /api/alerts/{id}/unread
DELETE /api/alerts/{id}
```

### Reservas

```text
GET    /api/reservations
GET    /api/reservations/filter
POST   /api/reservations
PUT    /api/reservations/{id}
PUT    /api/reservations/{id}/cancel
PUT    /api/reservations/{id}/reserve-slot
DELETE /api/reservations/{id}
```

### Usuarios

```text
GET    /api/users
PUT    /api/users/{id}/role
PUT    /api/users/{id}/active
DELETE /api/users/{id}
```

Los demás endpoints pueden consultarse desde Swagger.

## Pruebas del backend

El proyecto incluye pruebas unitarias para la lógica crítica:

* Registro de usuarios.
* Validación de correos duplicados.
* Control de cupos de reservas.
* Cancelación de reservas.
* Generación de alertas por stock bajo.
* Prevención de alertas duplicadas.
* Generación de alertas médicas.

Ejecutar desde la carpeta `backend`:

```bash
mvnw.cmd test
```

Resultado esperado:

```text
Tests run: 10
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

## Pruebas del frontend

El frontend incluye una prueba básica para comprobar que la pantalla de inicio de sesión muestre correctamente:

* Campo de correo.
* Campo de contraseña.
* Botón para iniciar sesión.
* Enlace de registro.

Ejecutar desde la carpeta `frontend`:

```bash
npm test
```

Resultado esperado:

```text
Test Files 1 passed
Tests 1 passed
```

## Diseño responsivo

La interfaz se adapta a diferentes tamaños de pantalla mediante CSS y consultas de medios.

En dispositivos pequeños:

* El menú lateral se oculta.
* Se utiliza un botón para abrir y cerrar la navegación.
* Los formularios cambian a una sola columna.
* Las tablas permiten desplazamiento horizontal.
* Los botones y tarjetas se ajustan al ancho disponible.

La vista móvil puede comprobarse desde Chrome:

```text
F12 → Ctrl + Shift + M
```

## Posible migración a React Native

El proyecto fue diseñado con una separación clara entre frontend y backend.

El backend expone una API REST protegida con JWT. Por esta razón, una futura aplicación móvil desarrollada con React Native podría consumir los mismos endpoints utilizados actualmente por React.

Para una migración futura:

1. Se mantendría el backend Spring Boot.
2. Se conservarían la base de datos y la lógica de negocio.
3. Se reutilizarían los endpoints de autenticación, caballos, inventario, reservas y alertas.
4. React Native reemplazaría los componentes HTML por componentes móviles.
5. Axios podría seguir utilizándose para consumir la API.
6. El token JWT podría almacenarse con una herramienta segura como SecureStore.
7. La navegación web sería reemplazada por React Navigation.

Por lo tanto, no sería necesario desarrollar nuevamente la lógica del servidor; solamente se construiría una nueva interfaz móvil.

## Seguridad

El sistema utiliza:

* Contraseñas cifradas con BCrypt.
* Autenticación mediante JWT.
* Sesiones sin estado.
* Rutas protegidas.
* Permisos según rol.
* Validaciones en formularios y backend.
* Restricción de operaciones administrativas.
* Variables de entorno para datos sensibles.

## Estado del proyecto

El prototipo incluye las funcionalidades principales solicitadas:

* Gestión de caballos.
* Historial médico.
* Alertas automáticas.
* Gestión de empleados.
* Turnos y tareas.
* Alimentación.
* Inventario y suministros.
* Reservas.
* Calendario.
* Usuarios y roles.
* Autenticación.
* Dashboard.
* Swagger.
* Pruebas unitarias.
* Diseño responsivo.

## Autores

Proyecto desarrollado por:

* Melany Rosales
* Josué Gómez
