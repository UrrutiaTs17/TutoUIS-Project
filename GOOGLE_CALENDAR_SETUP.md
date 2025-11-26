# Integración con Google Calendar API - Configuración

## 📋 Resumen de Cambios

Se ha integrado Google Calendar API para crear automáticamente eventos de Google Meet cuando un estudiante reserva una tutoría con modalidad "Virtual".

## 🚀 Funcionalidades Implementadas

### Backend (Java/Spring Boot)

1. **GoogleCalendarService.java** - Servicio para manejar Google Calendar API
   - Crear eventos de Google Meet automáticamente
   - Configurar fecha, hora y asistentes
   - Generar enlace de Meet
   - Enviar invitaciones por correo

2. **Entidad Reserva** - Nuevos campos:
   - `meetLink` (VARCHAR 500) - Enlace del Google Meet
   - `googleEventId` (VARCHAR 255) - ID del evento en Google Calendar
   - `modalidad` (VARCHAR 100) - Presencial o Virtual

3. **ReservaService** - Lógica actualizada:
   - Al crear una reserva con modalidad "Virtual", se crea automáticamente un evento de Google Meet
   - El enlace se guarda en la base de datos y se retorna en la respuesta

### Frontend (Angular)

1. **Selector de Modalidad** - Agregado en ambos formularios:
   - Botones para seleccionar "Presencial" o "Virtual"
   - Valor por defecto: "Presencial"
   - Validación obligatoria

2. **Interfaz Reserva** - Campo `meetLink` agregado:
   - Se puede mostrar el enlace de Meet en las reservas virtuales

## 📝 Pasos para Configurar Google Calendar API

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombre sugerido: "TutoUIS Calendar Integration"

### 2. Habilitar Google Calendar API

1. En el menú lateral, ve a **"APIs y servicios"** > **"Biblioteca"**
2. Busca **"Google Calendar API"**
3. Haz clic en **"HABILITAR"**

### 3. Configurar Pantalla de Consentimiento OAuth

1. Ve a **"APIs y servicios"** > **"Pantalla de consentimiento de OAuth"**
2. Selecciona **"Externo"** (o "Interno" si tienes Google Workspace)
3. Completa la información:
   - **Nombre de la aplicación**: TutoUIS
   - **Correo electrónico de asistencia**: tu correo
   - **Dominio de la aplicación**: http://localhost:8080
   - **Correos de desarrollador**: tu correo
4. Guarda y continúa
5. En **"Ámbitos"**, agrega:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
6. Guarda y continúa

### 4. Crear Credenciales OAuth 2.0

1. Ve a **"APIs y servicios"** > **"Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"** > **"ID de cliente de OAuth 2.0"**
3. Tipo de aplicación: **"Aplicación web"**
4. Nombre: "TutoUIS Backend"
5. **URIs de redireccionamiento autorizados**:
   - `http://localhost:8888/Callback`
   - `http://localhost:8080/oauth2/callback`
6. **Orígenes de JavaScript autorizados**:
   - `http://localhost:4200`
   - `http://localhost:8080`
7. Haz clic en **"CREAR"**
8. **IMPORTANTE**: Descarga el archivo JSON de credenciales

### 5. Actualizar credentials.json

1. Abre el archivo descargado
2. Copia su contenido
3. Reemplaza el contenido de:
   ```
   TutoUIS_back/src/main/resources/credentials.json
   ```
4. El formato debe ser similar a:
   ```json
   {
     "web": {
       "client_id": "TU_CLIENT_ID.apps.googleusercontent.com",
       "project_id": "tu-proyecto-id",
       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
       "token_uri": "https://oauth2.googleapis.com/token",
       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
       "client_secret": "TU_CLIENT_SECRET",
       "redirect_uris": [
         "http://localhost:8888/Callback"
       ]
     }
   }
   ```

### 6. Ejecutar Script SQL

Ejecuta el script SQL para agregar las nuevas columnas a la base de datos:

```sql
-- En MySQL Workbench o tu cliente SQL preferido
USE tutouis;

ALTER TABLE reserva 
ADD COLUMN meet_link VARCHAR(500) NULL;

ALTER TABLE reserva 
ADD COLUMN google_event_id VARCHAR(255) NULL;
```

O ejecuta el archivo:
```
TutoUIS_back/src/main/resources/sql/add_meet_fields.sql
```

### 7. Instalar Dependencias de Maven

Las dependencias ya están agregadas en `pom.xml`. Ejecuta:

```bash
cd TutoUIS_back
mvnw clean install
```

### 8. Primera Ejecución - Autorización OAuth

**IMPORTANTE**: La primera vez que crees una reserva virtual:

1. Se abrirá automáticamente una ventana del navegador
2. Inicia sesión con tu cuenta de Google
3. Acepta los permisos solicitados
4. La aplicación guardará el token en la carpeta `tokens/`
5. Las siguientes ejecuciones usarán el token guardado (no pedirá autorización nuevamente)

**Nota**: El token se guarda localmente, por lo que solo necesitas autorizarte una vez por máquina.

### 9. Agregar Usuarios de Prueba (Si es necesario)

Si tu app está en modo "Testing":

1. Ve a **"Pantalla de consentimiento de OAuth"**
2. En la sección **"Usuarios de prueba"**, haz clic en **"+ AGREGAR USUARIOS"**
3. Agrega los correos electrónicos de los tutores y estudiantes que usarán la aplicación
4. Guarda

## 🧪 Probar la Integración

### 1. Iniciar el Backend

```bash
cd TutoUIS_back
mvnw spring-boot:run
```

### 2. Iniciar el Frontend

```bash
cd TutoUIS_front
ng serve
```

### 3. Crear una Reserva Virtual

1. Inicia sesión como estudiante
2. Ve a la sección de calendario o reservas
3. Selecciona una tutoría
4. En el formulario, selecciona **"Modalidad: Virtual"**
5. Completa el horario y observaciones
6. Haz clic en **"Crear Reserva"**

### 4. Verificar el Resultado

- **En la consola del backend**: Verás logs de la creación del evento de Google Meet
- **En Google Calendar**: El evento aparecerá en el calendario del estudiante y tutor
- **Correo electrónico**: Ambos usuarios recibirán una invitación por correo
- **Enlace de Meet**: Se guardará en la base de datos (campo `meet_link`)

## 🔧 Solución de Problemas

### Error: "The OAuth client was not found"

- Verifica que el `client_id` en `credentials.json` sea correcto
- Asegúrate de que las URIs de redireccionamiento estén configuradas en Google Cloud Console

### Error: "Redirect URI mismatch"

- Verifica que `http://localhost:8888/Callback` esté en la lista de URIs autorizadas
- Asegúrate de que el puerto 8888 no esté ocupado

### Error: "Access blocked: This app's request is invalid"

- Ve a la pantalla de consentimiento OAuth en Google Cloud Console
- Verifica que los ámbitos (scopes) estén correctamente configurados
- Agrega tu correo como "Usuario de prueba" si la app está en modo Testing

### El navegador no se abre automáticamente

- Copia manualmente la URL que aparece en la consola
- Pégala en tu navegador
- Completa la autorización

### Error: "Token has been expired or revoked"

- Elimina la carpeta `tokens/` en el directorio del proyecto
- Reinicia el backend
- Vuelve a autorizar la aplicación

## 📁 Estructura de Archivos Nuevos/Modificados

### Backend
```
TutoUIS_back/
├── pom.xml (dependencias agregadas)
├── src/main/
│   ├── java/uis/edu/tutouis_project/
│   │   ├── modelo/
│   │   │   ├── Reserva.java (campos meetLink y googleEventId)
│   │   │   └── dto/
│   │   │       ├── CreateReservaDto.java (campo modalidad)
│   │   │       └── ReservaResponseDto.java (campos modalidad y meetLink)
│   │   └── servicio/
│   │       ├── GoogleCalendarService.java (NUEVO)
│   │       └── ReservaService.java (integración con Google Meet)
│   └── resources/
│       ├── credentials.json (credenciales de Google)
│       └── sql/
│           └── add_meet_fields.sql (script SQL)
└── tokens/ (se crea automáticamente al autorizar)
```

### Frontend
```
TutoUIS_front/
└── src/app/
    ├── components/
    │   └── reservation-modal/
    │       ├── reservation-modal.html (selector de modalidad)
    │       ├── reservation-modal.ts (lógica de modalidad)
    │       └── reservation-modal.css (estilos)
    ├── pages/
    │   └── calendar/
    │       ├── calendar.html (selector de modalidad)
    │       └── calendar.ts (lógica de modalidad)
    └── services/
        └── reservation.service.ts (interface actualizada)
```

## 🎯 Próximos Pasos Sugeridos

1. **Mostrar enlace de Meet en el frontend**: Actualizar los componentes para mostrar el enlace cuando esté disponible
2. **Cancelación de eventos**: Cuando se cancela una reserva, eliminar el evento de Google Calendar
3. **Notificaciones**: Agregar notificaciones en tiempo real cuando se crea un evento
4. **Recordatorios**: Configurar recordatorios automáticos antes de la tutoría

## 📞 Soporte

Si encuentras problemas durante la configuración, revisa:
- Los logs del backend en la consola
- La documentación oficial de [Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- Los errores en el navegador (consola de desarrollador)
