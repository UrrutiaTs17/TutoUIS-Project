# Integración Frontend-Backend TutoUIS

## Configuración Completada

Se ha implementado la integración completa entre el frontend Angular y el backend Spring Boot para el sistema de autenticación.

### Cambios Realizados

#### Backend (Ya configurado)
- ✅ AuthController con endpoint `/auth/login`
- ✅ SecurityConfig con CORS habilitado
- ✅ UsuarioService con autenticación JWT
- ✅ LoginDto para recibir credenciales

#### Frontend (Nuevos cambios)
- ✅ **AuthService**: Servicio para manejar autenticación
- ✅ **Login Component**: Conectado al backend
- ✅ **AuthGuard**: Protección de rutas
- ✅ **Header Component**: Muestra usuario logueado y logout
- ✅ **HttpClient**: Configurado en app.config.ts

### Archivos Creados/Modificados

#### Nuevos archivos:
- `src/app/services/auth.service.ts` - Servicio de autenticación
- `src/app/guards/auth.guard.ts` - Guard para proteger rutas

#### Archivos modificados:
- `src/app/pages/login/login.ts` - Componente de login conectado al backend
- `src/app/pages/login/login.html` - Formulario con validación y errores
- `src/app/app.config.ts` - Configuración de HttpClient
- `src/app/app.routes.ts` - Rutas protegidas con AuthGuard
- `src/app/components/header/header.ts` - Información del usuario y logout
- `src/app/components/header/header.html` - UI actualizada con logout

## Cómo Probar

### 1. Iniciar el Backend
```bash
cd TutoUIS_back
./mvnw spring-boot:run
```
El backend estará disponible en: `http://localhost:8080`

### 2. Iniciar el Frontend
```bash
cd TutoUIS_front
npm start
```
El frontend estará disponible en: `http://localhost:4200`

### 3. Probar el Login

1. Navegar a `http://localhost:4200/login`
2. Usar credenciales válidas de la base de datos
3. El sistema debería:
   - Mostrar loading durante la autenticación
   - Redirigir al dashboard en caso de éxito
   - Mostrar mensajes de error en caso de fallo
   - Guardar el token JWT en localStorage

### 4. Verificar Funcionalidades

- ✅ Login con credenciales válidas
- ✅ Manejo de errores (credenciales incorrectas, servidor no disponible)
- ✅ Redirección automática al dashboard
- ✅ Protección de rutas (dashboard requiere autenticación)
- ✅ Header muestra usuario logueado
- ✅ Botón de logout funciona correctamente
- ✅ Token persistente en localStorage

## Estructura de la Respuesta del Backend

El endpoint `/auth/login` devuelve:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "codigo": "usuario123",
  "id_usuario": 1
}
```

## Manejo de Errores

El frontend maneja los siguientes casos de error:
- **401**: Credenciales incorrectas o usuario inactivo/bloqueado
- **0**: Servidor no disponible (backend no ejecutándose)
- **500**: Error interno del servidor
- **Validación**: Campos vacíos

## Seguridad

- ✅ Tokens JWT almacenados en localStorage
- ✅ Headers de autorización automáticos
- ✅ Rutas protegidas con AuthGuard
- ✅ CORS configurado en el backend
- ✅ Contraseñas encriptadas con BCrypt

## Próximos Pasos Sugeridos

1. Implementar refresh token para renovación automática
2. Agregar interceptor HTTP para manejo global de errores
3. Implementar roles y permisos
4. Agregar validación de formularios más robusta
5. Implementar "Recordar sesión" opcional
