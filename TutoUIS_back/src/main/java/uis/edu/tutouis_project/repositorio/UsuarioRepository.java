package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Usuario;
import uis.edu.tutouis_project.modelo.dto.UsuarioConRolDto;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Usuario findByCorreo(String correo);
    Usuario findByCodigo(String codigo);
    
    /**
     * Consulta optimizada: Obtiene todos los usuarios con el nombre de su rol
     * Evita múltiples queries al cargar la relación en una sola consulta SQL
     */
    @Query("""
        SELECT new uis.edu.tutouis_project.modelo.dto.UsuarioConRolDto(
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.codigo,
            u.correo,
            u.telefono,
            u.id_rol,
            r.nombre,
            u.id_carrera,
            u.activo,
            u.bloqueado,
            u.fecha_creacion,
            u.fecha_ultima_modificacion
        )
        FROM Usuario u
        LEFT JOIN Rol r ON u.id_rol = r.idRol
        ORDER BY u.fecha_creacion DESC
    """)
    List<UsuarioConRolDto> findAllUsuariosConRol();
}

