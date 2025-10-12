package uis.edu.tutouis_project.servicio;

import java.util.List;
import org.springframework.http.ResponseEntity;

import uis.edu.tutouis_project.modelo.LoginDto;
import uis.edu.tutouis_project.modelo.Usuario;

public interface IUsuarioService {
    List<Usuario> getUsuarios();
    Usuario crearUsuario(Usuario usuario);
    Usuario buscarUsuario(Integer id);
    int eliminarUsuario(Integer id);
    ResponseEntity<?> loginConJwt(LoginDto loginDto);
    Usuario findByCorreo(String correo);
}
