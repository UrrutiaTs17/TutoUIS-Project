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

    @Operation(summary = "Listar usuarios", description = "Retorna la lista completa de usuarios (protegido)")
    @GetMapping("/list")
    public List<Usuario> listarUsuarios() {
        return usuarioService.getUsuarios();
    }

    @Operation(summary = "Obtener usuario por id", description = "Retorna un usuario dado su id")
    @GetMapping("/list/{id}")
    public Usuario buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarUsuario(id);
    }

    @Operation(summary = "Editar usuario", description = "Edita los datos de un usuario (enviar objeto Usuario con id existente)")
    @PutMapping("/")
    public ResponseEntity<Usuario> editar(@RequestBody Usuario usuario) {
        Usuario actual = usuarioService.buscarUsuario(usuario.getId_usuario());
        if (actual != null) {
            actual.setNombre(usuario.getNombre());
            actual.setApellido(usuario.getApellido());
            actual.setCodigo(usuario.getCodigo());
            actual.setContrasena(usuario.getContrasena());
            actual.setTelefono(usuario.getTelefono());
            actual.setId_rol(usuario.getId_rol());
            actual.setId_carrera(usuario.getId_carrera());
            actual.setActivo(usuario.getActivo());
            actual.setBloqueado(usuario.getBloqueado());
            Usuario editado = usuarioService.crearUsuario(actual);
            return ResponseEntity.ok(editado);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Eliminar usuario", description = "Elimina el usuario indicado por id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> eliminar(@PathVariable Integer id) {
        Usuario usuario = usuarioService.buscarUsuario(id);
        if (usuario != null) {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Perfil", description = "Retorna los datos del usuario autenticado (sin contraseña)")
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        String codigo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioService.findByCodigo(codigo);
        if (usuario != null) {
            usuario.setContrasena(null);
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }
    }
}

