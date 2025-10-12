package uis.edu.tutouis_project.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

import uis.edu.tutouis_project.modelo.LoginDto;
import uis.edu.tutouis_project.modelo.Usuario;
import uis.edu.tutouis_project.servicio.IUsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {
    @Autowired
    private IUsuarioService usuarioService;

    @PostMapping("/login-jwt")
    public ResponseEntity<?> loginConJwt(@RequestBody LoginDto loginDto) {
        return usuarioService.loginConJwt(loginDto);
    }

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody Usuario usuario) {
        Usuario creado = usuarioService.crearUsuario(usuario);
        return ResponseEntity.ok(creado);
    }

    @GetMapping("/list")
    public List<Usuario> listarUsuarios() {
        return usuarioService.getUsuarios();
    }

    @GetMapping("/list/{id}")
    public Usuario buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarUsuario(id);
    }

    @PutMapping("/")
    public ResponseEntity<Usuario> editar(@RequestBody Usuario usuario) {
        Usuario actual = usuarioService.buscarUsuario(usuario.getId_usuario());
        if (actual != null) {
            actual.setNombre(usuario.getNombre());
            actual.setApellido(usuario.getApellido());
            actual.setCodigo(usuario.getCodigo());
            actual.setCorreo(usuario.getCorreo());
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> eliminar(@PathVariable Integer id) {
        Usuario usuario = usuarioService.buscarUsuario(id);
        if (usuario != null) {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.notFound().build();
    }

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

