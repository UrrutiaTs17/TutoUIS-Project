package uis.edu.tutouis_project.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

import uis.edu.tutouis_project.modelo.LoginDto;
import uis.edu.tutouis_project.modelo.Usuario;
import uis.edu.tutouis_project.modelo.JwtResponse;
import uis.edu.tutouis_project.repositorio.UsuarioRepository;
import uis.edu.tutouis_project.util.JwtUtil;

@Service
public class UsuarioService implements IUsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Usuario> getUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        // Encriptar contraseña si no viene encriptada
        if (usuario.getContrasena() != null && !usuario.getContrasena().startsWith("$2a$")) {
            usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario buscarUsuario(Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @Override
    public int eliminarUsuario(Integer id) {
        usuarioRepository.deleteById(id);
        return 1;
    }

    @Override
    public ResponseEntity<?> loginConJwt(LoginDto loginDto) {
        try {
            Usuario usuario = usuarioRepository.findByCorreo(loginDto.getCorreo());
            if (usuario != null && passwordEncoder.matches(loginDto.getContrasena(), usuario.getContrasena())) {
                String token = jwtUtil.generateToken(usuario.getCorreo());
                JwtResponse jwtResponse = new JwtResponse(token, usuario.getCorreo(), "Login exitoso");
                return ResponseEntity.ok(jwtResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
        }
    }

    @Override
    public Usuario findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }
}
