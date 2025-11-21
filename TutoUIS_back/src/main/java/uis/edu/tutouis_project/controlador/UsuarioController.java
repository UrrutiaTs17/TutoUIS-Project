package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import uis.edu.tutouis_project.modelo.Usuario;
import uis.edu.tutouis_project.servicio.IUsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
@Tag(name = "usuario-controller", description = "CRUD y perfil de usuarios")
public class UsuarioController {
    @Autowired
    private IUsuarioService usuarioService;

    // El endpoint de autenticación se ha movido a /auth/login

    @Operation(summary = "Registrar usuario", description = "Crea un nuevo usuario. La contraseña será encriptada antes de guardarla.")
    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody Usuario usuario) {
        Usuario creado = usuarioService.crearUsuario(usuario);
        return ResponseEntity.ok(creado);
    }

    @Operation(summary = "Listar usuarios", description = "Retorna la lista completa de usuarios con sus relaciones (Rol + Carrera) optimizado (protegido)")
    @GetMapping("/list")
    public List<uis.edu.tutouis_project.dto.UsuarioResponseDto> listarUsuarios() {
        System.out.println("🔵 UsuarioController: Iniciando listarUsuarios()");
        List<uis.edu.tutouis_project.dto.UsuarioResponseDto> usuarios = usuarioService.getUsuariosOptimizado();
        System.out.println("✅ UsuarioController: Se obtuvieron " + usuarios.size() + " usuarios");
        return usuarios;
    }

    @Operation(summary = "Obtener usuario por id", description = "Retorna un usuario dado su id (protegido)")
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        try {
            Usuario usuario = usuarioService.buscarUsuario(id);
            if (usuario != null) {
                usuario.setContrasena(null); // No retornar contraseña
                return ResponseEntity.ok(usuario);
            }
            return ResponseEntity.status(404).body("Usuario no encontrado");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @Operation(summary = "Editar usuario", description = "Edita los datos de un usuario (requiere el id en la ruta o en el body)")
    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Integer id, @RequestBody Usuario usuario) {
        try {
            Usuario actual = usuarioService.buscarUsuario(id);
            if (actual == null) {
                return ResponseEntity.status(404).body("Usuario no encontrado");
            }
            
            // Validar que el correo sea único (si se está cambiando)
            if (usuario.getCorreo() != null && !usuario.getCorreo().equals(actual.getCorreo())) {
                Usuario usuarioConCorreo = usuarioService.findByCorreo(usuario.getCorreo());
                if (usuarioConCorreo != null) {
                    return ResponseEntity.status(400).body("El correo ya está en uso por otro usuario");
                }
                actual.setCorreo(usuario.getCorreo());
            }
            
            // Actualizar solo campos permitidos
            if (usuario.getNombre() != null) {
                actual.setNombre(usuario.getNombre());
            }
            if (usuario.getApellido() != null) {
                actual.setApellido(usuario.getApellido());
            }
            if (usuario.getTelefono() != null) {
                actual.setTelefono(usuario.getTelefono());
            }
            if (usuario.getId_rol() != null) {
                actual.setId_rol(usuario.getId_rol());
            }
            if (usuario.getId_carrera() != null) {
                actual.setId_carrera(usuario.getId_carrera());
            }
            if (usuario.getActivo() != null) {
                actual.setActivo(usuario.getActivo());
            }
            if (usuario.getBloqueado() != null) {
                actual.setBloqueado(usuario.getBloqueado());
            }
            
            Usuario editado = usuarioService.actualizarUsuario(actual);
            editado.setContrasena(null);
            return ResponseEntity.ok(editado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al editar: " + e.getMessage());
        }
    }

    @Operation(summary = "Eliminar usuario", description = "Elimina el usuario indicado por id (protegido)")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            Usuario usuario = usuarioService.buscarUsuario(id);
            if (usuario == null) {
                return ResponseEntity.status(404).body("Usuario no encontrado");
            }
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok("Usuario eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al eliminar: " + e.getMessage());
        }
    }

    @Operation(summary = "Perfil", description = "Retorna los datos del usuario autenticado (sin contraseña)")
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            String codigo = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuario = usuarioService.findByCodigo(codigo);
            if (usuario != null) {
                usuario.setContrasena(null);
                return ResponseEntity.ok(usuario);
            } else {
                return ResponseEntity.status(404).body("Usuario no encontrado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @Operation(summary = "Actualizar perfil", description = "Permite que el usuario autenticado edite su propio perfil (sin cambiar el código)")
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Usuario usuarioActualizado) {
        try {
            String codigo = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuario = usuarioService.findByCodigo(codigo);
            
            if (usuario != null) {
                // Actualizar solo los campos permitidos (no el código)
                if (usuarioActualizado.getNombre() != null) {
                    usuario.setNombre(usuarioActualizado.getNombre());
                }
                if (usuarioActualizado.getApellido() != null) {
                    usuario.setApellido(usuarioActualizado.getApellido());
                }
                if (usuarioActualizado.getCorreo() != null) {
                    usuario.setCorreo(usuarioActualizado.getCorreo());
                }
                if (usuarioActualizado.getTelefono() != null) {
                    usuario.setTelefono(usuarioActualizado.getTelefono());
                }
                if (usuarioActualizado.getId_carrera() != null) {
                    usuario.setId_carrera(usuarioActualizado.getId_carrera());
                }
                
                Usuario editado = usuarioService.actualizarUsuario(usuario);
                editado.setContrasena(null);
                return ResponseEntity.ok(editado);
            } else {
                return ResponseEntity.status(404).body("Usuario no encontrado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}