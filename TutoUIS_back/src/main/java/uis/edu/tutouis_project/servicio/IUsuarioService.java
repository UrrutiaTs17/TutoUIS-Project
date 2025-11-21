package uis.edu.tutouis_project.servicio;

import java.util.List;
import org.springframework.http.ResponseEntity;

import uis.edu.tutouis_project.dto.UsuarioResponseDto;
import uis.edu.tutouis_project.modelo.LoginDto;
import uis.edu.tutouis_project.modelo.Usuario;

public interface IUsuarioService {
    List<Usuario> getUsuarios();
    List<UsuarioResponseDto> getUsuariosOptimizado();
    Usuario crearUsuario(Usuario usuario);
    Usuario actualizarUsuario(Usuario usuario);
    Usuario buscarUsuario(Integer id);
    int eliminarUsuario(Integer id);
    ResponseEntity<?> loginConJwt(LoginDto loginDto);
    Usuario findByCorreo(String correo);
    Usuario findByCodigo(String codigo);
}

