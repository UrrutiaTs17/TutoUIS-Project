# Actualización: Dashboard de Administrador con Gestión de Usuarios

## 📋 Resumen de Cambios

Se ha actualizado el dashboard de administrador con las siguientes mejoras:

### 1. **Paleta de Colores Actualizada**
   - ✅ Cambiado de púrpura/azul a **verde** (mismo esquema del dashboard normal)
   - ✅ Sidebar: Gradiente verde (#1e7e34 → #155724)
   - ✅ Avatar: Gradiente verde (#28a745 → #20c997)
   - ✅ Welcome Banner: Gradiente verde
   - ✅ Botones y elementos de UI con tonos verdes consistentes

### 2. **Gestión de Usuarios Implementada**

#### Nuevo Servicio: `admin.service.ts`
Ubicación: `/src/app/services/admin.service.ts`

**Métodos disponibles:**
- `getAllUsers()` - Obtiene todos los usuarios
- `getUserById(id)` - Obtiene un usuario específico
- `createUser(userData)` - Crea un nuevo usuario
- `updateUser(id, userData)` - Actualiza un usuario
- `deleteUser(id)` - Elimina un usuario
- `blockUser(id)` - Bloquea un usuario
- `unblockUser(id)` - Desbloquea un usuario
- `activateUser(id)` - Activa un usuario
- `deactivateUser(id)` - Desactiva un usuario

#### Funcionalidades de la Interfaz:

**🔍 Búsqueda y Filtros:**
- Búsqueda en tiempo real por nombre, código o correo
- Filtro por rol (Todos, Administradores, Estudiantes)
- Filtro por estado (Todos, Activos, Inactivos, Bloqueados)

**📊 Tabla de Usuarios:**
- Avatar con iniciales
- Información completa: nombre, código, correo, teléfono
- Badge visual para rol (Administrador/Estudiante)
- Badge de estado (Activo/Inactivo/Bloqueado)
- Fecha de registro

**⚡ Acciones Disponibles:**
- ✏️ Editar usuario
- 🔒 Bloquear/Desbloquear usuario
- 🗑️ Eliminar usuario

**🎨 Características Visuales:**
- Diseño responsive
- Loading spinner durante carga
- Estados vacíos informativos
- Contador de resultados
- Animaciones suaves

## 🔧 Backend: Endpoints Requeridos

Para que la gestión de usuarios funcione completamente, necesitas implementar los siguientes endpoints en tu backend:

### 1. **Obtener Todos los Usuarios**
```
GET /api/usuarios
Headers: Authorization: Bearer {token}
Response: Usuario[]
```

### 2. **Obtener Usuario por ID**
```
GET /api/usuarios/{id}
Headers: Authorization: Bearer {token}
Response: Usuario
```

### 3. **Crear Usuario** (Opcional - para futuro)
```
POST /api/usuarios
Headers: Authorization: Bearer {token}
Body: {
  nombre: string,
  apellido: string,
  codigo: string,
  correo: string,
  contrasena: string,
  telefono: string,
  id_rol: number,
  id_carrera: number
}
Response: Usuario
```

### 4. **Actualizar Usuario** (Opcional - para futuro)
```
PUT /api/usuarios/{id}
Headers: Authorization: Bearer {token}
Body: Partial<Usuario>
Response: Usuario
```

### 5. **Eliminar Usuario**
```
DELETE /api/usuarios/{id}
Headers: Authorization: Bearer {token}
Response: void (204)
```

### 6. **Bloquear Usuario**
```
PATCH /api/usuarios/{id}/block
Headers: Authorization: Bearer {token}
Response: Usuario
```

### 7. **Desbloquear Usuario**
```
PATCH /api/usuarios/{id}/unblock
Headers: Authorization: Bearer {token}
Response: Usuario
```

### 8. **Activar Usuario** (Opcional)
```
PATCH /api/usuarios/{id}/activate
Headers: Authorization: Bearer {token}
Response: Usuario
```

### 9. **Desactivar Usuario** (Opcional)
```
PATCH /api/usuarios/{id}/deactivate
Headers: Authorization: Bearer {token}
Response: Usuario
```

## 🚀 Implementación del Backend (Spring Boot)

### Ejemplo de Controlador:

```java
@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "usuarios-controller", description = "Gestión de usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Obtener todos los usuarios (solo para administradores)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(usuarios);
    }

    // Bloquear usuario
    @PatchMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> blockUser(@PathVariable Integer id) {
        Usuario usuario = usuarioService.findById(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setBloqueado(true);
        usuario.setFecha_desbloqueo(null);
        Usuario updated = usuarioService.save(usuario);
        return ResponseEntity.ok(updated);
    }

    // Desbloquear usuario
    @PatchMapping("/{id}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> unblockUser(@PathVariable Integer id) {
        Usuario usuario = usuarioService.findById(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setBloqueado(false);
        usuario.setFecha_desbloqueo(Timestamp.valueOf(LocalDateTime.now()));
        Usuario updated = usuarioService.save(usuario);
        return ResponseEntity.ok(updated);
    }

    // Eliminar usuario
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Activar/Desactivar usuario
    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> activateUser(@PathVariable Integer id) {
        Usuario usuario = usuarioService.findById(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setActivo(true);
        Usuario updated = usuarioService.save(usuario);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> deactivateUser(@PathVariable Integer id) {
        Usuario usuario = usuarioService.findById(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setActivo(false);
        Usuario updated = usuarioService.save(usuario);
        return ResponseEntity.ok(updated);
    }
}
```

### Consideraciones de Seguridad:

1. **Validar que el endpoint GET /api/usuarios solo sea accesible por administradores**
2. **Agregar anotación @PreAuthorize("hasRole('ADMIN')") a todos los endpoints administrativos**
3. **Validar que un administrador no pueda eliminarse a sí mismo**
4. **Evitar retornar la contraseña en las respuestas**

## 📝 Verificación del Backend Actual

Verifica si ya tienes estos endpoints implementados:

```bash
# Desde tu backend, busca:
grep -r "getAllUsuarios\|findAll" src/main/java/
grep -r "@GetMapping.*usuarios" src/main/java/
```

Si el endpoint GET `/api/usuarios` ya existe, solo necesitas:
1. Asegurarte de que retorne todos los usuarios (no solo el perfil del usuario actual)
2. Agregar los endpoints para bloquear/desbloquear/eliminar

## 🧪 Cómo Probar

### 1. Verificar que el backend tenga el endpoint:
```bash
curl -X GET http://localhost:8080/api/usuarios \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Iniciar el frontend:
```bash
cd TutoUIS_front
ng serve
```

### 3. Pasos de prueba:
1. Inicia sesión con un usuario administrador (id_rol = 1)
2. Serás redirigido a `/admin-dashboard`
3. Haz clic en "Gestión de Usuarios" en el sidebar
4. Verifica que se cargue la lista de usuarios
5. Prueba los filtros y búsqueda
6. Prueba bloquear/desbloquear un usuario

## 📊 Datos de Prueba Recomendados

Para probar adecuadamente, asegúrate de tener en tu base de datos:
- Al menos 1 usuario con `id_rol = 1` (Administrador)
- Varios usuarios con `id_rol = 2` (Estudiantes)
- Algunos usuarios con `activo = true` y otros con `activo = false`
- Algunos usuarios con `bloqueado = true`

## 🎯 Próximos Pasos

1. ✅ **Implementar endpoints del backend** (prioridad alta)
2. 📝 Crear modal/formulario para editar usuarios
3. 📝 Crear modal/formulario para crear nuevos usuarios
4. 📊 Implementar paginación para listas grandes de usuarios
5. 📈 Agregar exportación de usuarios (CSV, Excel)
6. 🔔 Implementar notificaciones toast en lugar de alerts
7. ⚡ Agregar confirmaciones más elegantes (modals personalizados)

## 📁 Archivos Modificados/Creados

### Creados:
- `/src/app/services/admin.service.ts` - Servicio de gestión administrativa

### Modificados:
- `/src/app/pages/admin-dashboard/admin-dashboard.ts` - Lógica de gestión de usuarios
- `/src/app/pages/admin-dashboard/admin-dashboard.html` - Interfaz de gestión de usuarios
- `/src/app/pages/admin-dashboard/admin-dashboard.css` - Estilos actualizados con paleta verde

## 🎨 Personalización

Los colores principales se pueden ajustar en `admin-dashboard.css`:

```css
/* Sidebar verde */
background: linear-gradient(180deg, #1e7e34 0%, #155724 100%);

/* Avatar verde */
background: linear-gradient(135deg, #28a745, #20c997);

/* Welcome banner */
background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
```

---

**Fecha de Actualización:** 19 de Octubre, 2025
**Desarrollador:** GitHub Copilot
**Proyecto:** TutoUIS - Sistema de Reservas
