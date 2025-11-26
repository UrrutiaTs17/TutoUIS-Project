# TutoUIS - Sistema de Reservas de Tutorías Académicas

<div align="center">
  <img src="TutoUIS_front/public/LOGO UIS_PNG.png" alt="Logo UIS" width="200"/>
  
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
  [![Angular](https://img.shields.io/badge/Angular-20.3.0-red.svg)](https://angular.io/)
  [![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://www.oracle.com/java/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
</div>

## 📋 Descripción del Proyecto

TutoUIS es un sistema web desarrollado para la **Universidad Industrial de Santander** que permite gestionar y reservar tutorías académicas de manera eficiente. El proyecto facilita la comunicación entre estudiantes y tutores, optimizando el proceso de reserva y seguimiento de las sesiones de tutoría.

### ✨ Características Principales

#### 🔐 Autenticación y Autorización
- Sistema de login con **JWT (JSON Web Tokens)**
- Roles diferenciados: **Administrador**, **Tutor** y **Estudiante**
- Guards de rutas para protección de páginas según rol
- Interceptores HTTP para manejo automático de tokens
- Sesiones persistentes con almacenamiento local

#### 👤 Gestión de Usuarios
- **Panel de Administración** con CRUD completo de usuarios
- Búsqueda y filtrado de usuarios por nombre, código o correo
- Edición de información personal (código, correo, contraseña)
- Asignación y cambio de roles
- Visualización de usuarios con sus roles en una sola consulta optimizada

#### 📅 Sistema de Tutorías
- **Creación de tutorías** por tutores con información detallada
- Selección de asignaturas, modalidad (presencial/virtual) y ubicación
- Definición de **horarios de disponibilidad** personalizados
- **Calendario interactivo** para visualizar tutorías disponibles
- Búsqueda y filtrado por asignatura, tutor, carrera y modalidad
- **Integración con Google Calendar** para sincronización automática de eventos

#### 🎫 Sistema de Reservas
- **Reserva de tutorías** con validación de disponibilidad
- Visualización de reservas activas, completadas y canceladas
- **Cancelación de reservas** con actualización de estados
- Historial completo de reservas por estudiante
- Notificaciones de confirmación y recordatorios

#### 📊 Panel de Reportes y Estadísticas
- **Dashboard administrativo** con métricas del sistema
- Estadísticas de usuarios, tutorías y reservas
- **Actividad reciente del sistema** en tiempo real
- Reportes de asistencia y participación
- Gráficos y visualizaciones de datos
- Consultas SQL optimizadas para mejor rendimiento

#### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real de eventos importantes
- Alertas de nuevas reservas para tutores
- Recordatorios de tutorías próximas
- Confirmaciones de acciones (creación, edición, cancelación)

#### 🎨 Interfaz de Usuario
- Diseño **responsive** compatible con móviles y tablets
- Tema moderno con **Bootstrap 5** y estilos personalizados
- Modales y componentes interactivos
- Navegación intuitiva con menús contextuales
- Indicadores de estado de carga y validación de formularios

## 👥 Equipo de Desarrollo

| Desarrollador | GitHub | Código |
|---------------|--------|--------|
| **Hammer Ronaldo Muñoz Hernández** | [@HammerRo](https://github.com/HammerRo) | 2211918 |
| **Karen Dayana Mateus Gómez** | [@Kmateus8](https://github.com/Kmateus8) | 2212765 |
| **William Andrés Urrutia Torres** | [@UrrutiaTs17](https://github.com/UrrutiaTs17) | 2220058 |

## 🏗️ Arquitectura del Proyecto

```
TutoUIS-Project/
├── TutoUIS_back/          # Backend Spring Boot
│   ├── src/
│   │   ├── main/java/     # Código fuente Java
│   │   └── resources/     # Recursos y configuración
│   └── pom.xml           # Dependencias Maven
├── TutoUIS_front/        # Frontend Angular
│   ├── src/
│   │   ├── app/          # Componentes Angular
│   │   │   ├── components/ # Componentes reutilizables
│   │   │   └── pages/     # Páginas principales
│   │   └── assets/       # Recursos estáticos
│   └── package.json      # Dependencias npm
└── Entrega Primer Sprint/ # Documentación del proyecto
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Spring Boot 3.5.6** - Framework principal de aplicación
- **Spring Data JPA** - Capa de persistencia y ORM
- **Spring Security** - Autenticación y autorización
- **Spring Web** - Desarrollo de API REST
- **MySQL Connector 8.4.0** - Driver de conexión a base de datos
- **JdbcTemplate** - Ejecución de consultas SQL nativas optimizadas
- **Lombok** - Reducción de código boilerplate
- **JWT (io.jsonwebtoken)** - Autenticación basada en tokens
- **Swagger/OpenAPI 3** - Documentación de API
- **Google Calendar API** - Integración con Google Calendar
- **OAuth2** - Autenticación con Google
- **Maven** - Gestión de dependencias
- **Java 17** - Lenguaje de programación

### Frontend
- **Angular 20.3.0** - Framework SPA moderno
- **TypeScript 5.x** - Lenguaje tipado para desarrollo
- **Bootstrap 5.3.8** - Framework CSS responsive
- **Bootstrap Icons** - Iconografía del proyecto
- **RxJS 7.8.0** - Programación reactiva y observables
- **HttpClient** - Cliente HTTP de Angular
- **Router** - Navegación SPA con guards
- **Reactive Forms** - Validación y manejo de formularios
- **Standalone Components** - Arquitectura moderna de Angular
- **Express** - Servidor para SSR (Server-Side Rendering)
- **npm** - Gestión de paquetes

### Base de Datos
- **MySQL 8.0+** - Sistema de gestión de base de datos
- **Hibernate** - ORM (Object-Relational Mapping)
- **SQL Nativo** - Consultas optimizadas con JOIN y UNION ALL

### Herramientas de Desarrollo
- **Git** - Control de versiones
- **GitHub** - Repositorio remoto
- **IntelliJ IDEA / VS Code** - IDEs de desarrollo
- **Postman** - Pruebas de API
- **MySQL Workbench** - Administración de base de datos

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Java 17** o superior
- **Node.js 18** o superior
- **npm** (incluido con Node.js)
- **MySQL 8.0** o superior
- **Maven 3.6** o superior (opcional, incluye wrapper)
- **Angular CLI** (se instalará automáticamente)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/UrrutiaTs17/TutoUIS-Project.git
cd TutoUIS-Project
```

### 2. Configuración de la Base de Datos

1. Instala y configura MySQL 8.0 o superior
2. Crea una base de datos para el proyecto:

```sql
CREATE DATABASE tutouis_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tutouis_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON tutouis_db.* TO 'tutouis_user'@'localhost';
FLUSH PRIVILEGES;
3. Configura las credenciales en `TutoUIS_back/src/main/resources/application.properties`:

```properties
# Configuración de la base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/tutouis_db
spring.datasource.username=tutouis_user
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuración JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Puerto del servidor
server.port=8080

# JWT Configuration
jwt.secret=tu_clave_secreta_muy_segura_aqui
jwt.expiration=86400000

# Google Calendar API Configuration (Opcional)
# Sigue las instrucciones en GOOGLE_CALENDAR_SETUP.md
google.calendar.enabled=false
```

### 3. Configuración de Google Calendar (Opcional)

Para habilitar la integración con Google Calendar:

1. **Consulta la guía detallada**: [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md)
2. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
3. Habilita la **Google Calendar API**
4. Crea credenciales OAuth 2.0
5. Descarga el archivo `credentials.json`
6. Coloca el archivo en `TutoUIS_back/src/main/resources/credentials.json`
7. Activa la integración: `google.calendar.enabled=true`

**Características de la integración:**
- Creación automática de eventos al publicar tutorías
- Sincronización bidireccional con Google Calendar
- Notificaciones y recordatorios automáticos
- Gestión de invitados y asistentes
- Actualización de eventos al modificar tutorías

3. Configura las credenciales en `TutoUIS_back/src/main/resources/application.properties`:

```properties
# Configuración de la base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/tutouis_db
spring.datasource.username=tutouis_user
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuración JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Puerto del servidor
server.port=8080
```

### 3. Configuración del Backend

```bash
# Navegar al directorio del backend
cd TutoUIS_back

# Ejecutar con Maven Wrapper (recomendado)
./mvnw clean install
./mvnw spring-boot:run

# O con Maven instalado globalmente
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 4. Configuración del Frontend

```bash
# Navegar al directorio del frontend
cd TutoUIS_front

# Instalar dependencias
npm install

# Instalar Angular CLI globalmente (si no está instalado)
npm install -g @angular/cli

# Ejecutar el servidor de desarrollo
ng serve

# O usar npm
npm start
```

El frontend estará disponible en: `http://localhost:4200`

## 🏃‍♂️ Ejecución en Modo Desarrollo

### Opción 1: Ejecución Manual

1. **Terminal 1 - Backend:**
```bash
cd TutoUIS_back
./mvnw spring-boot:run
```

2. **Terminal 2 - Frontend:**
```bash
cd TutoUIS_front
ng serve
```

### Opción 2: Scripts de Desarrollo

Puedes crear scripts para automatizar el proceso:

**Linux/macOS (`start-dev.sh`):**
```bash
#!/bin/bash
echo "Iniciando TutoUIS en modo desarrollo..."

# Iniciar backend en background
cd TutoUIS_back
./mvnw spring-boot:run &
BACKEND_PID=$!

# Esperar un momento para que el backend inicie
sleep 10

# Iniciar frontend
cd ../TutoUIS_front
ng serve

# Cleanup cuando se termine el frontend
kill $BACKEND_PID
```

**Windows (`start-dev.bat`):**
```batch
@echo off
echo Iniciando TutoUIS en modo desarrollo...

start cmd /k "cd TutoUIS_back && mvnw spring-boot:run"
timeout /t 10
start cmd /k "cd TutoUIS_front && ng serve"
```

## 🧪 Pruebas

### Backend
```bash
cd TutoUIS_back
./mvnw test
```

### Frontend
```bash
cd TutoUIS_front
ng test
```

## 📦 Construcción para Producción

### Backend
```bash
cd TutoUIS_back
./mvnw clean package
```
El archivo JAR se generará en `target/TutoUIS_Backend-0.0.1-SNAPSHOT.jar`

### Frontend
```bash
cd TutoUIS_front
ng build --prod
```
Los archivos se generarán en `dist/TutoUIS_front/`

## 🔧 Configuración Adicional

### Variables de Entorno

Para producción, considera usar variables de entorno:

```bash
# Backend
export DB_URL=jdbc:mysql://localhost:3306/tutouis_db
export DB_USERNAME=tutouis_user
export DB_PASSWORD=your_secure_password
export SERVER_PORT=8080

# Frontend
export API_BASE_URL=http://localhost:8080/api
```

### Perfiles de Spring Boot

Puedes usar diferentes perfiles para diferentes entornos:

- `application-dev.properties` - Desarrollo
- `application-prod.properties` - Producción
- `application-test.properties` - Pruebas

## 📚 Documentación Adicional

### Guías de Configuración
- 📅 [Configuración de Google Calendar API](GOOGLE_CALENDAR_SETUP.md) - Guía completa para integrar Google Calendar
- 📊 [Resumen del Primer Sprint](Entrega%20Primer%20Sprint/Resumen_Primer_Sprint.md) - Documentación inicial del proyecto
- 🗄️ [Diseño de Base de Datos](Entrega%20Primer%20Sprint/Diseño_base_datos_TutoUIS.drawio.png) - Diagrama ER de la base de datos

### Recursos Externos
- 🍃 [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- 🅰️ [Angular Documentation](https://angular.io/docs)
- 🔐 [JWT Best Practices](https://jwt.io/introduction)
- 📅 [Google Calendar API Guide](https://developers.google.com/calendar/api/guides/overview)
- 🎨 [Bootstrap 5 Components](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

### Optimizaciones Implementadas

#### Backend
- **Consultas SQL Optimizadas**: Uso de JOIN y UNION ALL para evitar queries N+1
- **DTOs Específicos**: `UsuarioConRolDto`, `ActividadRecienteDto` para cargas eficientes
- **Índices en Base de Datos**: Optimización de búsquedas frecuentes
- **Caché de Resultados**: Reducción de consultas repetitivas
- **JdbcTemplate**: Consultas nativas para operaciones complejas

#### Frontend
- **Lazy Loading**: Carga diferida de módulos
- **OnPush Change Detection**: Optimización del renderizado
- **Standalone Components**: Reducción de dependencias
- **RxJS Operators**: Optimización de observables
- **HTTP Interceptors**: Manejo centralizado de autenticación

### Características de Seguridad

- 🔒 **Autenticación JWT**: Tokens firmados y con expiración
- 🛡️ **Bcrypt**: Hash de contraseñas con salt
- 🚫 **CORS Configuration**: Control de orígenes permitidos
- 🔑 **Route Guards**: Protección de rutas por rol
- 📝 **Validación de Datos**: Sanitización en backend y frontend
- 🔐 **HTTPS Ready**: Preparado para certificados SSL/TLS

### Métricas del Proyecto

```
Backend:
- 82+ archivos Java compilados
- 20+ endpoints REST
- 10+ entidades de base de datos
- 15+ servicios implementados

Frontend:
- 50+ componentes Angular
- 15+ servicios HTTP
- 10+ guards y interceptores
- 30+ rutas configuradas
```

## 📅 Integración con Google Calendar - Guía Detallada

### ¿Qué hace la integración?

La integración con Google Calendar permite que las tutorías creadas en TutoUIS se sincronicen automáticamente con Google Calendar, facilitando:

- ✅ **Creación automática de eventos** al publicar una tutoría
- 📧 **Notificaciones y recordatorios** automáticos de Google
- 👥 **Gestión de asistentes** (tutor y estudiantes)
- 🔄 **Sincronización bidireccional** con el calendario
- 📱 **Acceso desde cualquier dispositivo** con Google Calendar
- ⏰ **Recordatorios personalizables** (email, notificaciones push)

### Configuración Paso a Paso

#### 1. Crear Proyecto en Google Cloud Console
1. Accede a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto: "TutoUIS-Calendar"
3. Anota el ID del proyecto

#### 2. Habilitar Google Calendar API
1. Ve a **APIs y servicios > Biblioteca**
2. Busca "Google Calendar API"
3. Haz clic en **Habilitar**

#### 3. Configurar OAuth 2.0
1. Ve a **APIs y servicios > Credenciales**
2. Configura pantalla de consentimiento (Externo)
3. Crea credenciales OAuth 2.0 (Aplicación de escritorio)
4. Descarga `credentials.json`

#### 4. Configurar Backend
```bash
# Copia las credenciales
cp credentials.json TutoUIS_back/src/main/resources/

# Actualiza application.properties
google.calendar.enabled=true
```

#### 5. Primera Autorización
- Al iniciar el backend, se abrirá el navegador
- Autoriza el acceso a Google Calendar
- El token se guarda automáticamente

### Funcionalidades Implementadas

**Al crear una tutoría:**
- 📝 Evento automático en Google Calendar
- 📍 Ubicación (sala o enlace virtual)
- 👤 Tutor como organizador
- 📄 Descripción detallada

**Al reservar una tutoría:**
- 👥 Estudiante agregado como asistente
- 📧 Email de invitación automático
- 🔔 Recordatorios configurados

**Recordatorios por defecto:**
- 📧 Email: 24 horas antes
- 🔔 Notificación: 30 minutos antes

### Solución de Problemas Específicos

**Error: "API not enabled"**
- Verifica que Google Calendar API esté habilitada
- Espera 5 minutos después de habilitar

**Error: "Invalid credentials"**
- Verifica ruta de `credentials.json`
- Descarga nuevamente las credenciales

**Error: "Token expired"**
- Elimina carpeta `tokens/`
- Reinicia backend y reautoriza

Para más detalles: [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- **Backend**: Seguir estándares de Java y Spring Boot
- **Frontend**: Seguir la guía de estilos de Angular
- **Commits**: Usar conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Nombres**: CamelCase para clases, camelCase para variables/métodos
- **Documentación**: Comentar código complejo y endpoints públicos

## 🎯 Roadmap y Futuras Mejoras

### En Desarrollo
- [ ] Notificaciones push en tiempo real con WebSockets
- [ ] Chat integrado entre estudiantes y tutores
- [ ] Sistema de calificación y reseñas de tutorías
- [ ] Estadísticas avanzadas con gráficos interactivos

### Planificado
- [ ] Aplicación móvil (iOS y Android)
- [ ] Integración con Microsoft Teams para tutorías virtuales
- [ ] Sistema de gamificación para estudiantes activos
- [ ] API pública para integraciones externas
- [ ] Dashboard de analíticas con BI
- [ ] Soporte multiidioma (Español/Inglés)

## 🔄 Historial de Versiones

### v1.0.0 (Actual)
- ✅ Sistema completo de autenticación con JWT
- ✅ CRUD de usuarios con roles
- ✅ Gestión de tutorías y disponibilidad
- ✅ Sistema de reservas
- ✅ Integración con Google Calendar
- ✅ Panel administrativo con estadísticas
- ✅ Actividad reciente del sistema
- ✅ Optimizaciones de rendimiento en consultas SQL

### Sprint 3 y 4
- Reorganización de archivos del admin-dashboard
- Creación de sistema de reportes estadísticos
- Implementación de consultas optimizadas
- Mejoras en la interfaz de usuario

### Sprint 1 y 2
- Configuración inicial del proyecto
- Diseño de base de datos
- Estructura básica de backend y frontend
- Sistema de autenticación básico

## 📝 Notas de Desarrollo

### Estructura de Roles y Funcionalidades

#### 🔑 Administrador
**Acceso completo al sistema**
- Dashboard con estadísticas y métricas del sistema
- Gestión completa de usuarios (crear, editar, eliminar, cambiar roles)
- Visualización de actividad reciente del sistema
- Gestión de tutorías y reservas
- Generación de reportes estadísticos
- Configuración del sistema

#### 👨‍🏫 Tutor
**Gestión de tutorías y disponibilidad**
- Dashboard personalizado con sus tutorías
- Crear y publicar nuevas tutorías
- Definir horarios de disponibilidad
- Gestionar asignaturas que puede tutorar
- Ver y gestionar reservas de sus tutorías
- Marcar asistencia de estudiantes
- Editar o cancelar tutorías programadas
- Sincronización automática con Google Calendar

#### 🎓 Estudiante
**Búsqueda y reserva de tutorías**
- Dashboard con calendario de tutorías disponibles
- Buscar tutorías por asignatura, tutor o carrera
- Filtrar por modalidad (presencial/virtual)
- Realizar reservas de tutorías
- Ver historial de reservas (activas, completadas, canceladas)
- Cancelar reservas con anticipación
- Recibir notificaciones de confirmación
- Editar perfil personal

### 📡 Endpoints de la API REST

#### Autenticación
```
POST   /api/auth/login          - Iniciar sesión
POST   /api/auth/register       - Registrar nuevo usuario
POST   /api/auth/logout         - Cerrar sesión
GET    /api/auth/validate       - Validar token JWT
```

#### Usuarios
```
GET    /api/usuarios                    - Listar todos los usuarios
GET    /api/usuarios/con-rol            - Listar usuarios con sus roles (optimizado)
GET    /api/usuarios/{id}               - Obtener usuario por ID
GET    /api/usuarios/perfil/{correo}    - Obtener perfil por correo
POST   /api/usuarios/register           - Crear nuevo usuario
PUT    /api/usuarios/editar             - Editar usuario existente
DELETE /api/usuarios/{id}               - Eliminar usuario
```

#### Tutorías
```
GET    /api/tutorias/list               - Listar todas las tutorías
GET    /api/tutorias/disponibles        - Listar tutorías disponibles
GET    /api/tutorias/{id}               - Obtener tutoría por ID
GET    /api/tutorias/tutor/{idTutor}    - Tutorías de un tutor específico
POST   /api/tutorias/create             - Crear nueva tutoría
PUT    /api/tutorias/edit/{id}          - Editar tutoría existente
DELETE /api/tutorias/delete/{id}        - Eliminar tutoría
```

#### Reservas
```
GET    /api/reservas/list                      - Listar todas las reservas
GET    /api/reservas/estudiante/{idEstudiante} - Reservas de un estudiante
GET    /api/reservas/tutoria/{idTutoria}       - Reservas de una tutoría
GET    /api/reservas/{id}                      - Obtener reserva por ID
POST   /api/reservas/create                    - Crear nueva reserva
PUT    /api/reservas/cancelar/{id}             - Cancelar reserva
DELETE /api/reservas/delete/{id}               - Eliminar reserva
```

#### Actividad del Sistema
```
GET    /api/actividad/reciente?limite=10  - Obtener actividad reciente
```

#### Reportes Estadísticos
```
GET    /api/reportes/dashboard             - Estadísticas del dashboard
GET    /api/reportes/usuarios              - Estadísticas de usuarios
GET    /api/reportes/tutorias              - Estadísticas de tutorías
GET    /api/reportes/reservas              - Estadísticas de reservas
```

### 🗄️ Estructura de la Base de Datos

#### Tablas Principales

**usuario**
- `idUsuario` (PK)
- `nombre`, `apellido`, `codigo`, `correo`
- `contraseña` (hasheada)
- `id_rol` (FK a rol)
- `fecha_creacion`

**rol**
- `idRol` (PK)
- `nombre` (ADMIN, TUTOR, ESTUDIANTE)

**tutoria**
- `idTutoria` (PK)
- `id_tutor` (FK a usuario)
- `id_asignatura` (FK a asignatura)
- `modalidad` (PRESENCIAL, VIRTUAL)
- `ubicacion`, `descripcion`
- `fecha_inicio`, `fecha_fin`
- `id_disponibilidad` (FK a disponibilidad)
- `fecha_creacion`

**reserva**
- `idReserva` (PK)
- `id_tutoria` (FK a tutoria)
- `id_estudiante` (FK a usuario)
- `id_estado` (FK a estado_tutoria)
- `fecha_reserva`, `fecha_creacion`

**disponibilidad**
- `idDisponibilidad` (PK)
- `dia_semana`, `hora_inicio`, `hora_fin`
- `id_estado` (FK a estado_disponibilidad)

**asignatura**
- `idAsignatura` (PK)
- `nombre`, `codigo`
- `id_carrera` (FK a carrera)

**carrera**
- `idCarrera` (PK)
- `nombre`

## 🐛 Solución de Problemas

### Problemas Comunes

#### 1. Error de conexión a la base de datos
```
Error: Communications link failure
```
**Solución:**
- Verificar que MySQL esté ejecutándose: `sudo systemctl status mysql`
- Confirmar credenciales en `application.properties`
- Verificar que el puerto 3306 esté disponible
- Comprobar que la base de datos `tutouis_db` exista

#### 2. Puerto ya en uso
```
Error: Port 8080 is already in use
```
**Solución Backend:**
- Cambiar `server.port` en `application.properties`
- O detener el proceso: `lsof -ti:8080 | xargs kill -9`

**Solución Frontend:**
- Usar puerto alternativo: `ng serve --port 4201`

#### 3. Dependencias no encontradas
**Backend:**
```bash
./mvnw clean install -U
```

**Frontend:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. Error de JWT o autenticación
```
Error: Invalid token / Token expired
```
**Solución:**
- Verificar que `jwt.secret` esté configurado en `application.properties`
- Limpiar localStorage del navegador
- Volver a iniciar sesión

#### 5. Problemas con Google Calendar API
```
Error: The OAuth client was not found
```
**Solución:**
- Verificar que `credentials.json` esté en `src/main/resources/`
- Eliminar archivo `tokens/` y volver a autenticar
- Revisar que la API esté habilitada en Google Cloud Console
- Consultar [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md)

#### 6. CORS errors en el navegador
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solución:**
- Verificar configuración de CORS en Spring Boot
- Asegurarse de que el frontend esté corriendo en `http://localhost:4200`
- Revisar anotaciones `@CrossOrigin` en controllers

#### 7. Errores de compilación en Angular
```bash
# Limpiar caché de Angular
ng cache clean

# Reconstruir proyecto
ng build --configuration development
```

### Logs y Debugging

#### Backend - Ver logs de Spring Boot
```bash
# Habilitar logs SQL en application.properties
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

#### Frontend - Consola del navegador
- Presiona `F12` para abrir DevTools
- Pestaña "Console" para ver logs de JavaScript
- Pestaña "Network" para ver peticiones HTTP
- Pestaña "Application" para ver localStorage/sessionStorage

### Comandos Útiles

```bash
# Backend - Compilar sin ejecutar tests
./mvnw clean package -DskipTests

# Frontend - Modo de desarrollo con proxy
ng serve --proxy-config proxy.conf.json

# Verificar versiones
java -version
node -v
npm -v
ng version

# Ver procesos en puertos
lsof -i :8080  # Backend
lsof -i :4200  # Frontend
```

## 📄 Licencia

Este proyecto está desarrollado como parte del curso de **Programación Orientada a Objetos** de la Universidad Industrial de Santander.

---

<div align="center">

**Universidad Industrial de Santander**  
*Facultad de Ingenierías Físico-Mecánicas*  
*Ingeniería de Sistemas*

*Docente: Carlos Adolfo Beltrán Castro*

---

### 🌟 Desarrollado con 💚 por el equipo TutoUIS

[![GitHub](https://img.shields.io/badge/GitHub-TutoUIS--Project-181717?style=for-the-badge&logo=github)](https://github.com/UrrutiaTs17/TutoUIS-Project)

**2025** - Todos los derechos reservados

</div>