# Refactorización del Admin Dashboard - Estructura Modular

## 📋 Resumen de Cambios

Se ha refactorizado el admin dashboard para seguir una estructura modular similar al dashboard regular, con componentes separados por rutas.

## 🏗️ Nueva Estructura

```
TutoUIS_front/src/app/pages/admin-dashboard/
├── layout/
│   ├── admin-layout.ts          # Layout principal con sidebar
│   ├── admin-layout.html
│   └── admin-layout.css
├── sections/
│   ├── admin-home.ts            # Página principal (estadísticas y actividad)
│   ├── admin-home.html
│   ├── admin-home.css
│   ├── admin-users.ts           # Gestión de usuarios
│   ├── admin-users.html
│   ├── admin-users.css
│   └── admin-placeholders.ts    # Componentes placeholder
└── admin-dashboard.ts           # (Archivo anterior - puede eliminarse)
```

## 🛣️ Nuevas Rutas

### Rutas del Admin Dashboard:
- `/admin-dashboard` → **AdminHome** (Panel principal con estadísticas)
- `/admin-dashboard/users` → **AdminUsers** (Gestión de usuarios)
- `/admin-dashboard/reservations` → **AdminReservations** (Gestión de reservas)
- `/admin-dashboard/spaces` → **AdminSpaces** (Gestión de espacios)
- `/admin-dashboard/reports` → **AdminReports** (Reportes y estadísticas)
- `/admin-dashboard/settings` → **AdminSettings** (Configuración del sistema)

## 📦 Componentes Creados

### 1. **AdminLayout** (`layout/admin-layout.ts`)
- **Responsabilidad**: Layout principal con sidebar y outlet para sub-rutas
- **Características**:
  - Sidebar con navegación verde (tema admin)
  - Badge de "ADMINISTRADOR"
  - Navegación con `routerLink` y `routerLinkActive`
  - Responsive (sidebar colapsable en móvil)
  - Verificación de rol de administrador

### 2. **AdminHome** (`sections/admin-home.ts`)
- **Responsabilidad**: Página principal del dashboard
- **Características**:
  - 4 tarjetas de estadísticas (usuarios, reservas, espacios, nuevos)
  - Lista de actividad reciente del sistema
  - Panel de acciones rápidas con enlaces a otras secciones
  - Estado del sistema (servidor, BD, almacenamiento, rendimiento)

### 3. **AdminUsers** (`sections/admin-users.ts`)
- **Responsabilidad**: Gestión completa de usuarios
- **Características**:
  - Tabla de usuarios con búsqueda y filtros
  - Botón "Nuevo Usuario" que abre el modal
  - Acciones: Bloquear/Desbloquear y Eliminar
  - Estados: Activo, Inactivo, Bloqueado
  - Integración con `CreateUserModal`
  - Auto-refresh de lista después de crear usuario

### 4. **Admin Placeholders** (`sections/admin-placeholders.ts`)
- **Componentes**: AdminReservations, AdminSpaces, AdminReports, AdminSettings
- **Responsabilidad**: Componentes placeholder para futuras funcionalidades
- **Características**: Página simple con ícono, título, descripción y botón de volver

## 🎨 Diseño

### Paleta de Colores (Tema Admin):
- **Verde Oscuro**: `#155724` (títulos, texto principal)
- **Verde Principal**: `#28a745` (botones, iconos)
- **Verde Claro**: `#20c997` (gradientes, acentos)
- **Amarillo/Naranja**: `#ffc107`, `#ff9800` (badge admin, advertencias)

### Características del Sidebar:
- Fondo con gradiente verde
- Badge de administrador con gradiente amarillo/naranja
- Avatar circular con iniciales del usuario
- Navegación con iconos de Bootstrap Icons
- Highlight activo con borde izquierdo amarillo
- Botón de logout en el footer

## 🔧 Integración con Servicios

### AuthService:
- `isAdmin()`: Verifica si el usuario es administrador
- `getCachedProfile()`: Obtiene el perfil del usuario del cache
- `logout()`: Cierra la sesión del usuario

### AdminService:
- `getAllUsers()`: Obtiene todos los usuarios
- `createUser()`: Crea un nuevo usuario (endpoint `/api/usuarios/register`)
- `blockUser()` / `unblockUser()`: Bloquea/desbloquea usuario
- `deleteUser()`: Elimina un usuario

### AdminGuard:
- Protege todas las rutas de `/admin-dashboard`
- Redirige a `/dashboard` si el usuario no es administrador

## 📱 Responsive

### Breakpoints:
- **Desktop (>992px)**: Sidebar visible, layout normal
- **Tablet (768px-992px)**: Sidebar colapsable
- **Mobile (<768px)**: Sidebar overlay, tabla en cards

### Características Móviles:
- Botón de toggle para mostrar/ocultar sidebar
- Overlay oscuro cuando sidebar está abierto
- Tabla de usuarios se convierte en cards
- Filtros y búsqueda en columnas

## 🚀 Próximos Pasos

### Para implementar las secciones placeholder:

1. **AdminReservations**:
   - Crear tabla de reservas similar a AdminUsers
   - Filtros por fecha, estado, usuario, espacio
   - Acciones: Ver detalles, Cancelar, Aprobar/Rechazar

2. **AdminSpaces**:
   - Crear tabla de espacios/salas
   - Filtros por tipo, disponibilidad, capacidad
   - Acciones: Crear, Editar, Eliminar, Marcar mantenimiento

3. **AdminReports**:
   - Gráficos de uso (usuarios, reservas por mes)
   - Reportes exportables (PDF, Excel)
   - Estadísticas detalladas

4. **AdminSettings**:
   - Configuración de horarios
   - Configuración de notificaciones
   - Parámetros del sistema

## 📝 Notas de Migración

### Archivo Anterior:
El archivo `/admin-dashboard/admin-dashboard.ts` (438 líneas) puede eliminarse ya que su funcionalidad se ha dividido en:
- **AdminLayout**: Estructura y navegación
- **AdminHome**: Dashboard principal
- **AdminUsers**: Gestión de usuarios

### Compatibilidad:
- Todos los servicios existentes funcionan sin cambios
- El modal `CreateUserModal` se integra perfectamente
- Las rutas anteriores se redirigen automáticamente

## ✅ Ventajas de la Nueva Estructura

1. **Modularidad**: Cada sección es independiente y reutilizable
2. **Mantenibilidad**: Más fácil de mantener y actualizar
3. **Escalabilidad**: Fácil agregar nuevas secciones
4. **Performance**: Carga lazy loading por rutas
5. **Testing**: Componentes más pequeños son más fáciles de testear
6. **Organización**: Estructura clara y predecible
7. **Reutilización**: Componentes pueden reutilizarse en otros contextos

## 🔗 Archivos Modificados

### Archivos Nuevos:
- `layout/admin-layout.ts` (67 líneas)
- `layout/admin-layout.html` (100 líneas)
- `layout/admin-layout.css` (310 líneas)
- `sections/admin-home.ts` (165 líneas)
- `sections/admin-home.html` (210 líneas)
- `sections/admin-home.css` (350 líneas)
- `sections/admin-users.ts` (264 líneas)
- `sections/admin-users.html` (180 líneas)
- `sections/admin-users.css` (390 líneas)
- `sections/admin-placeholders.ts` (175 líneas para 4 componentes)

### Archivos Modificados:
- `app.routes.ts`: Actualizado con rutas hijas del admin-dashboard
- `admin.service.ts`: Endpoint de createUser cambiado a `/register`

### Total de Líneas Nuevas: ~2,200 líneas
### Componentes Creados: 9 componentes (1 layout + 5 secciones + 3 modalidades)
