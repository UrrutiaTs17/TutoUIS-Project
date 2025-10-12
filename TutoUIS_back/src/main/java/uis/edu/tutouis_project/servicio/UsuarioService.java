package uis.edu.tutouis_project.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import uis.edu.tutouis_project.modelo.JwtResponse;
import uis.edu.tutouis_project.modelo.LoginDto;
import uis.edu.tutouis_project.modelo.Usuario;
import uis.edu.tutouis_project.repositorio.UsuarioRepository;
import uis.edu.tutouis_project.util.JwtUtil;

@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public List<Usuario> getUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        // Encriptar la contraseña antes de guardar
        if (usuario.getContrasena() != null) {
            usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario buscarUsuario(Integer id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.orElse(null);
    }

    @Override
    public int eliminarUsuario(Integer id) {
        try {
            usuarioRepository.deleteById(id);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public ResponseEntity<?> loginConJwt(LoginDto loginDto) {
        try {
            // Buscar usuario por código
            Usuario usuario = findByCodigo(loginDto.getCodigo());
            
            if (usuario == null) {
                return ResponseEntity.status(401).body("Usuario no encontrado");
            }

            // Verificar si el usuario está activo
            if (usuario.getActivo() == null || !usuario.getActivo()) {
                return ResponseEntity.status(401).body("Usuario inactivo");
            }

            // Verificar si el usuario está bloqueado
            if (usuario.getBloqueado() != null && usuario.getBloqueado()) {
                return ResponseEntity.status(401).body("Usuario bloqueado");
            }

            // Verificar contraseña
            if (!passwordEncoder.matches(loginDto.getContrasena(), usuario.getContrasena())) {
                return ResponseEntity.status(401).body("Credenciales incorrectas");
            }

            // Generar JWT
            String token = jwtUtil.generateToken(usuario.getCodigo());
            
            // Crear respuesta con JWT
            JwtResponse jwtResponse = new JwtResponse(token, usuario.getCodigo(), usuario.getId_usuario());
            
            return ResponseEntity.ok(jwtResponse);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor");
        }
    }

    @Override
    public Usuario findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    @Override
    public Usuario findByCodigo(String codigo) {
        return usuarioRepository.findByCodigo(codigo);
    }
}
