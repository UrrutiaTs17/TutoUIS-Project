package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Reserva;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    
    /**
     * Encuentra todas las reservas con JOIN FETCH para cargar las relaciones
     * Necesario para cálculos de estadísticas
     */
    @Query("SELECT DISTINCT r FROM Reserva r " +
           "LEFT JOIN FETCH r.disponibilidad d " +
           "LEFT JOIN FETCH d.tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "ORDER BY r.fechaCreacion DESC")
    List<Reserva> findAllWithDetails();
    
    /**
     * OPTIMIZADO: Query con JOINs que retorna todas las reservas como DTOs
     * Evita el problema N+1 al traer todos los datos en una sola consulta SQL
     */
    @Query("""
        SELECT new uis.edu.tutouis_project.modelo.dto.ReservaResponseDto(
            r.idReserva,
            r.idDisponibilidad,
            CAST(d.horaInicio AS LocalTime),
            CAST(d.horaFin AS LocalTime),
            d.fecha,
            d.diaSemana,
            r.idEstudiante,
            CONCAT(COALESCE(est.nombre, ''), ' ', COALESCE(est.apellido, '')),
            r.idEstado,
            er.nombre,
            r.observaciones,
            r.fechaCreacion,
            r.fechaCancelacion,
            r.razonCancelacion,
            r.horaInicio,
            r.horaFin,
            a.nombre,
            CONCAT(COALESCE(tut.nombre, ''), ' ', COALESCE(tut.apellido, '')),
            r.modalidad,
            r.meetLink,
            t.lugar
        )
        FROM Reserva r
        INNER JOIN Disponibilidad d ON r.idDisponibilidad = d.idDisponibilidad
        INNER JOIN Tutoria t ON d.idTutoria = t.idTutoria
        INNER JOIN Asignatura a ON t.idAsignatura = a.idAsignatura
        INNER JOIN Usuario tut ON t.idTutor = tut.id_usuario
        INNER JOIN Usuario est ON r.idEstudiante = est.id_usuario
        INNER JOIN EstadoReserva er ON r.idEstado = er.idEstado
        ORDER BY r.fechaCreacion DESC
    """)
    List<uis.edu.tutouis_project.modelo.dto.ReservaResponseDto> findAllReservasConDetalles();
    
    /**
     * Encuentra todas las reservas de un estudiante
     */
    List<Reserva> findByIdEstudiante(Integer idEstudiante);
    
    /**
     * DEPRECADO - Usa findReservasConDetallesPorEstudiante en su lugar
     * Encuentra todas las reservas de un estudiante con JOIN FETCH optimizado
     * Carga en una sola consulta: reserva + disponibilidad + tutoría + asignatura + tutor + estudiante + estado
     */
    @Deprecated
    @Query("SELECT DISTINCT r FROM Reserva r " +
           "LEFT JOIN FETCH r.estudiante " +
           "LEFT JOIN FETCH r.estadoReserva " +
           "WHERE r.idEstudiante = :idEstudiante " +
           "ORDER BY r.fechaCreacion DESC")
    List<Reserva> findByIdEstudianteWithDetails(@Param("idEstudiante") Integer idEstudiante);
    
    /**
     * OPTIMIZADO: Query con JOINs que retorna directamente DTOs
     * Evita el problema N+1 al traer todos los datos en una sola consulta SQL
     * Incluye: Reserva + Disponibilidad + Tutoría + Asignatura + Tutor + Estudiante + Estado + Modalidad + MeetLink + Fecha + Día
     */
    @Query("""
        SELECT new uis.edu.tutouis_project.modelo.dto.ReservaResponseDto(
            r.idReserva,
            r.idDisponibilidad,
            CAST(d.horaInicio AS LocalTime),
            CAST(d.horaFin AS LocalTime),
            d.fecha,
            d.diaSemana,
            r.idEstudiante,
            CONCAT(COALESCE(est.nombre, ''), ' ', COALESCE(est.apellido, '')),
            r.idEstado,
            er.nombre,
            r.observaciones,
            r.fechaCreacion,
            r.fechaCancelacion,
            r.razonCancelacion,
            r.horaInicio,
            r.horaFin,
            a.nombre,
            CONCAT(COALESCE(tut.nombre, ''), ' ', COALESCE(tut.apellido, '')),
            r.modalidad,
            r.meetLink,
            t.lugar
        )
        FROM Reserva r
        INNER JOIN Disponibilidad d ON r.idDisponibilidad = d.idDisponibilidad
        INNER JOIN Tutoria t ON d.idTutoria = t.idTutoria
        INNER JOIN Asignatura a ON t.idAsignatura = a.idAsignatura
        INNER JOIN Usuario tut ON t.idTutor = tut.id_usuario
        INNER JOIN Usuario est ON r.idEstudiante = est.id_usuario
        INNER JOIN EstadoReserva er ON r.idEstado = er.idEstado
        WHERE r.idEstudiante = :idEstudiante
        ORDER BY r.fechaCreacion DESC
    """)
    List<uis.edu.tutouis_project.modelo.dto.ReservaResponseDto> findReservasConDetallesPorEstudiante(
        @Param("idEstudiante") Integer idEstudiante
    );
    
    /**
     * Encuentra todas las reservas de una disponibilidad
     */
    List<Reserva> findByIdDisponibilidad(Integer idDisponibilidad);

        /**
         * OPTIMIZADO: Query que retorna reservas de una disponibilidad con todos los detalles como DTOs
         * Evita el problema N+1
         */
        @Query("""
            SELECT new uis.edu.tutouis_project.modelo.dto.ReservaResponseDto(
                r.idReserva,
                r.idDisponibilidad,
                CAST(d.horaInicio AS LocalTime),
                CAST(d.horaFin AS LocalTime),
                d.fecha,
                d.diaSemana,
                r.idEstudiante,
                CONCAT(COALESCE(est.nombre, ''), ' ', COALESCE(est.apellido, '')),
                r.idEstado,
                er.nombre,
                r.observaciones,
                r.fechaCreacion,
                r.fechaCancelacion,
                r.razonCancelacion,
                r.horaInicio,
                r.horaFin,
                a.nombre,
                CONCAT(COALESCE(tut.nombre, ''), ' ', COALESCE(tut.apellido, '')),
                r.modalidad,
                r.meetLink,
                t.lugar
            )
            FROM Reserva r
            INNER JOIN Disponibilidad d ON r.idDisponibilidad = d.idDisponibilidad
            INNER JOIN Tutoria t ON d.idTutoria = t.idTutoria
            INNER JOIN Asignatura a ON t.idAsignatura = a.idAsignatura
            INNER JOIN Usuario tut ON t.idTutor = tut.id_usuario
            INNER JOIN Usuario est ON r.idEstudiante = est.id_usuario
            INNER JOIN EstadoReserva er ON r.idEstado = er.idEstado
            WHERE r.idDisponibilidad = :idDisponibilidad
            ORDER BY r.horaInicio ASC
        """)
        List<uis.edu.tutouis_project.modelo.dto.ReservaResponseDto> findReservasConDetallesPorDisponibilidad(
            @Param("idDisponibilidad") Integer idDisponibilidad
        );

            /**
             * Obtiene las reservas del tutor para la fecha actual (hoy) filtradas por la fecha de la disponibilidad.
             * Se usa CURRENT_DATE para evaluar la fecha en la base de datos.
             */
            @Query("""
            SELECT new uis.edu.tutouis_project.modelo.dto.ReservaResponseDto(
                r.idReserva,
                r.idDisponibilidad,
                CAST(d.horaInicio AS LocalTime),
                CAST(d.horaFin AS LocalTime),
                d.fecha,
                d.diaSemana,
                r.idEstudiante,
                CONCAT(COALESCE(est.nombre, ''), ' ', COALESCE(est.apellido, '')),
                r.idEstado,
                er.nombre,
                r.observaciones,
                r.fechaCreacion,
                r.fechaCancelacion,
                r.razonCancelacion,
                r.horaInicio,
                r.horaFin,
                a.nombre,
                CONCAT(COALESCE(tut.nombre, ''), ' ', COALESCE(tut.apellido, '')),
                r.modalidad,
                r.meetLink,
                t.lugar
            )
            FROM Reserva r
            INNER JOIN Disponibilidad d ON r.idDisponibilidad = d.idDisponibilidad
            INNER JOIN Tutoria t ON d.idTutoria = t.idTutoria
            INNER JOIN Asignatura a ON t.idAsignatura = a.idAsignatura
            INNER JOIN Usuario tut ON t.idTutor = tut.id_usuario
            INNER JOIN Usuario est ON r.idEstudiante = est.id_usuario
            INNER JOIN EstadoReserva er ON r.idEstado = er.idEstado
            WHERE t.idTutor = :idTutor AND d.fecha = CURRENT_DATE
            ORDER BY r.horaInicio ASC
            """)
            List<uis.edu.tutouis_project.modelo.dto.ReservaResponseDto> findReservasDeHoyPorTutor(
                @Param("idTutor") Integer idTutor
            );
    
    /**
     * Encuentra todas las reservas con un estado específico
     */
    List<Reserva> findByIdEstado(Integer idEstado);
    
    /**
     * Encuentra las reservas de un estudiante con un estado específico
     */
    List<Reserva> findByIdEstudianteAndIdEstado(Integer idEstudiante, Integer idEstado);
    
    /**
     * Busca si existe una reserva activa de un estudiante en una disponibilidad
     */
    @Query("SELECT r FROM Reserva r WHERE r.idEstudiante = :idEstudiante " +
           "AND r.idDisponibilidad = :idDisponibilidad AND r.idEstado = 1")
    Optional<Reserva> findReservaActivaDeEstudianteEnDisponibilidad(
            @Param("idEstudiante") Integer idEstudiante,
            @Param("idDisponibilidad") Integer idDisponibilidad);
    
    /**
     * Cuenta el número de reservas activas en una disponibilidad
     */
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.idDisponibilidad = :idDisponibilidad AND r.idEstado = 1")
    long countReservasActivasPorDisponibilidad(@Param("idDisponibilidad") Integer idDisponibilidad);
    
    /**
     * Obtiene las reservas realizadas de un estudiante
     */
    @Query("SELECT r FROM Reserva r WHERE r.idEstudiante = :idEstudiante AND r.idEstado = 3")
    List<Reserva> findReservasRealizadasDeEstudiante(@Param("idEstudiante") Integer idEstudiante);
    
    /**
     * Obtiene las reservas no asistidas de un estudiante
     */
    @Query("SELECT r FROM Reserva r WHERE r.idEstudiante = :idEstudiante AND r.idEstado = 4")
    List<Reserva> findReservasNoAsistidasDeEstudiante(@Param("idEstudiante") Integer idEstudiante);
    
    // ==================== CONSULTAS OPTIMIZADAS PARA REPORTES ====================
    
    /**
     * Consulta optimizada: Cuenta total de reservas por estado
     * Retorna: [idEstado, count]
     */
    @Query("SELECT r.idEstado, COUNT(r) FROM Reserva r GROUP BY r.idEstado")
    List<Object[]> countReservasPorEstado();
    
    /**
     * Consulta optimizada: Cuenta estudiantes únicos
     */
    @Query("SELECT COUNT(DISTINCT r.idEstudiante) FROM Reserva r")
    long countEstudiantesActivos();
    
    /**
     * Consulta optimizada: Calcula tiempo promedio de tutorías
     * Retorna el promedio de minutos entre hora_inicio y hora_fin de disponibilidad
     */
    @Query(value = """
        SELECT AVG(TIMESTAMPDIFF(MINUTE, d.hora_inicio, d.hora_fin))
        FROM reserva r
        INNER JOIN disponibilidad d ON r.id_disponibilidad = d.id_disponibilidad
        WHERE d.hora_inicio IS NOT NULL AND d.hora_fin IS NOT NULL
        """, nativeQuery = true)
    Double calcularTiempoPromedioMinutos();
    
    /**
     * Consulta optimizada: Reservas por día de la semana
     * Retorna: [dayOfWeek (1=Lunes, 7=Domingo), count]
     */
    @Query(value = """
        SELECT DAYOFWEEK(d.fecha) as dia, COUNT(*) as total
        FROM reserva r
        INNER JOIN disponibilidad d ON r.id_disponibilidad = d.id_disponibilidad
        WHERE d.fecha IS NOT NULL
        GROUP BY DAYOFWEEK(d.fecha)
        ORDER BY dia
        """, nativeQuery = true)
    List<Object[]> countReservasPorDiaSemana();
    
    /**
     * Consulta optimizada: Horarios pico (bloques de 2 horas)
     * Retorna: [periodo, descripcion, count]
     */
    @Query(value = """
        SELECT 
            CONCAT(LPAD(FLOOR(HOUR(d.hora_inicio) / 2) * 2, 2, '0'), ':00 - ', 
                   LPAD((FLOOR(HOUR(d.hora_inicio) / 2) * 2) + 2, 2, '0'), ':00') as periodo,
            CASE 
                WHEN HOUR(d.hora_inicio) >= 6 AND HOUR(d.hora_inicio) < 12 THEN 'Mañana'
                WHEN HOUR(d.hora_inicio) >= 12 AND HOUR(d.hora_inicio) < 18 THEN 'Tarde'
                ELSE 'Noche'
            END as descripcion,
            COUNT(*) as total
        FROM reserva r
        INNER JOIN disponibilidad d ON r.id_disponibilidad = d.id_disponibilidad
        WHERE d.hora_inicio IS NOT NULL
        GROUP BY periodo, descripcion
        ORDER BY total DESC
        LIMIT 5
        """, nativeQuery = true)
    List<Object[]> findHorariosPico();
    
    /**
     * Consulta optimizada: Estadísticas por materia
     * Retorna: [nombreMateria, codigoMateria, total, completadas, pendientes, canceladas]
     */
    @Query(value = """
        SELECT 
            a.nombre as materia_nombre,
            CONCAT('MAT-', a.id_asignatura) as codigo,
            COUNT(*) as total,
            SUM(CASE WHEN r.id_estado = 3 THEN 1 ELSE 0 END) as completadas,
            SUM(CASE WHEN r.id_estado = 1 THEN 1 ELSE 0 END) as pendientes,
            SUM(CASE WHEN r.id_estado = 4 THEN 1 ELSE 0 END) as canceladas
        FROM reserva r
        INNER JOIN disponibilidad d ON r.id_disponibilidad = d.id_disponibilidad
        INNER JOIN tutoria t ON d.id_tutoria = t.id_tutoria
        INNER JOIN asignatura a ON t.id_asignatura = a.id_asignatura
        GROUP BY a.id_asignatura, a.nombre
        ORDER BY total DESC
        """, nativeQuery = true)
    List<Object[]> findEstadisticasPorMateria();
    
    /**
     * Consulta optimizada: Crecimiento mensual
     * Retorna: [mesActual, mesAnterior]
     */
    @Query(value = """
        SELECT 
            SUM(CASE 
                WHEN r.fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) 
                THEN 1 ELSE 0 
            END) as mes_actual,
            SUM(CASE 
                WHEN r.fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) 
                AND r.fecha_creacion < DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
                THEN 1 ELSE 0 
            END) as mes_anterior
        FROM reserva r
        WHERE r.fecha_creacion IS NOT NULL
        """, nativeQuery = true)
    Object[] calcularCrecimientoMensual();
}
