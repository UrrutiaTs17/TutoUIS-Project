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

- 🔐 **Sistema de autenticación** con roles diferenciados (Administrador, Tutor, Estudiante)
- 📅 **Calendario de disponibilidad** para tutores
- 🔍 **Búsqueda y filtrado** de tutorías por tema, tutor, facultad y modalidad
- 📝 **Reserva y cancelación** de tutorías con validaciones
- 📧 **Sistema de notificaciones** automáticas
- 📊 **Reportes estadísticos** para administradores
- ✅ **Registro de asistencia** para tutores

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
- **Spring Boot 3.5.6** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **Spring Web** - API REST
- **MySQL Connector** - Conexión a base de datos
- **Lombok** - Reducción de código boilerplate
- **Java 17** - Lenguaje de programación

### Frontend
- **Angular 20.3.0** - Framework frontend
- **Bootstrap 5.3.8** - Framework CSS
- **RxJS 7.8.0** - Programación reactiva
- **TypeScript** - Lenguaje tipado
- **Express** - Servidor para SSR

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

1. Instala y configura MySQL
2. Crea una base de datos para el proyecto:

```sql
CREATE DATABASE tutouis_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tutouis_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON tutouis_db.* TO 'tutouis_user'@'localhost';
FLUSH PRIVILEGES;
```

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

- [Resumen del Primer Sprint](Entrega%20Primer%20Sprint/Resumen_Primer_Sprint.md)
- [Diseño de Base de Datos](Entrega%20Primer%20Sprint/Diseño_base_datos_TutoUIS.drawio.png)
- [Documentación de Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Documentación de Angular](https://angular.io/docs)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

### Estructura de Roles
- **Administrador**: Gestión completa de usuarios y sistema
- **Tutor**: Publicar disponibilidad y gestionar tutorías
- **Estudiante**: Buscar y reservar tutorías

### API Endpoints (Planeados)
```
GET  /api/auth/login
POST /api/auth/logout
GET  /api/users
POST /api/users
PUT  /api/users/{id}
GET  /api/tutoring-sessions
POST /api/tutoring-sessions
PUT  /api/tutoring-sessions/{id}
DELETE /api/tutoring-sessions/{id}
GET  /api/reservations
POST /api/reservations
DELETE /api/reservations/{id}
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a la base de datos**
   - Verificar que MySQL esté ejecutándose
   - Confirmar credenciales en `application.properties`

2. **Puerto ya en uso**
   - Backend: Cambiar `server.port` en `application.properties`
   - Frontend: Usar `ng serve --port 4201`

3. **Dependencias no encontradas**
   - Backend: Ejecutar `./mvnw clean install`
   - Frontend: Ejecutar `npm install`

## 📄 Licencia

Este proyecto está desarrollado como parte del curso de Ingeniería de Sistemas de la Universidad Industrial de Santander.

---

**Universidad Industrial de Santander**  
*Facultad de Ingenierías Físico-Mecánicas*  
*Ingeniería de Sistemas*

*Docente: Carlos Adolfo Beltrán Castro*