package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import uis.edu.tutouis_project.dto.UsuarioResponseDto;
import uis.edu.tutouis_project.modelo.Usuario;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Usuario findByCorreo(String correo);
    Usuario findByCodigo(String codigo);
    
    /**
     * OPTIMIZADO: Query con JOINs que retorna todos los usuarios como DTOs
     * Evita el problema N+1 al traer todos los datos en una sola consulta SQL
     * Incluye: Usuario + Rol + Carrera (LEFT JOIN porque carrera puede ser null)
     */
    @Query("""
        SELECT new uis.edu.tutouis_project.dto.UsuarioResponseDto(
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.codigo,
            u.correo,
            u.telefono,
            u.id_rol,
            r.nombre,
            u.id_carrera,
            c.nombre,
            u.activo,
            u.bloqueado,
            u.fecha_creacion,
            u.fecha_ultima_modificacion,
            u.fecha_desbloqueo
        )
        FROM Usuario u
        INNER JOIN Rol r ON u.id_rol = r.idRol
        LEFT JOIN Carrera c ON u.id_carrera = c.idCarrera
        ORDER BY u.id_usuario
    """)
    List<UsuarioResponseDto> findAllUsuariosWithDetails();
}

