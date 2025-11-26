package uis.edu.tutouis_project.servicio.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import uis.edu.tutouis_project.modelo.dto.ActividadRecienteDto;
import uis.edu.tutouis_project.servicio.IActividadService;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
public class ActividadService implements IActividadService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<ActividadRecienteDto> obtenerActividadReciente(int limite) {
        List<ActividadRecienteDto> actividades = new ArrayList<>();
        
        // Consulta UNION optimizada que combina las 3 fuentes de actividad
        String sql = """
            (
                SELECT 
                    'USUARIO' as tipo,
                    CONCAT('Nuevo usuario registrado: ', u.nombre, ' ', u.apellido) as descripcion,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario,
                    u.fecha_creacion as fecha,
                    'bi-person-plus' as icono,
                    CASE 
                        WHEN r.nombre = 'Administrador' THEN 'danger'
                        WHEN r.nombre = 'Tutor' THEN 'info'
                        ELSE 'secondary'
                    END as badge
                FROM usuario u
                LEFT JOIN rol r ON u.id_rol = r.id_rol
                WHERE u.fecha_creacion IS NOT NULL
            )
            UNION ALL
            (
                SELECT 
                    'TUTORIA' as tipo,
                    CONCAT('Nueva tutoría creada: ', a.nombre, ' por ', CONCAT(u.nombre, ' ', u.apellido)) as descripcion,
                    CONCAT(u.nombre, ' ', u.apellido) as usuario,
                    t.fecha_creacion as fecha,
                    'bi-book' as icono,
                    'success' as badge
                FROM tutoria t
                INNER JOIN asignatura a ON t.id_asignatura = a.id_asignatura
                INNER JOIN usuario u ON t.id_tutor = u.id_usuario
                WHERE t.fecha_creacion IS NOT NULL
            )
            UNION ALL
            (
                SELECT 
                    'RESERVA' as tipo,
                    CONCAT('Nueva reserva: ', a.nombre, ' - ', CONCAT(est.nombre, ' ', est.apellido)) as descripcion,
                    CONCAT(est.nombre, ' ', est.apellido) as usuario,
                    r.fecha_creacion as fecha,
                    'bi-calendar-check' as icono,
                    CASE 
                        WHEN r.id_estado = 1 THEN 'warning'
                        WHEN r.id_estado = 3 THEN 'success'
                        WHEN r.id_estado = 4 THEN 'danger'
                        ELSE 'secondary'
                    END as badge
                FROM reserva r
                INNER JOIN disponibilidad d ON r.id_disponibilidad = d.id_disponibilidad
                INNER JOIN tutoria t ON d.id_tutoria = t.id_tutoria
                INNER JOIN asignatura a ON t.id_asignatura = a.id_asignatura
                INNER JOIN usuario est ON r.id_estudiante = est.id_usuario
                WHERE r.fecha_creacion IS NOT NULL
            )
            ORDER BY fecha DESC
            LIMIT ?
        """;
        
        List<Object[]> resultados = jdbcTemplate.query(sql, 
            (rs, rowNum) -> new Object[] {
                rs.getString("tipo"),
                rs.getString("descripcion"),
                rs.getString("usuario"),
                rs.getTimestamp("fecha"),
                rs.getString("icono"),
                rs.getString("badge")
            },
            limite
        );
        
        for (Object[] row : resultados) {
            actividades.add(new ActividadRecienteDto(
                (String) row[0],      // tipo
                (String) row[1],      // descripcion
                (String) row[2],      // usuario
                (Timestamp) row[3],   // fecha
                (String) row[4],      // icono
                (String) row[5]       // badge
            ));
        }
        
        return actividades;
    }
}
