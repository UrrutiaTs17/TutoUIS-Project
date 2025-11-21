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
     * OPTIMIZADO: Query con JOINs que retorna todas las reservas como DTOs
     * Evita el problema N+1 al traer todos los datos en una sola consulta SQL
     */
    @Query("""
        SELECT new uis.edu.tutouis_project.modelo.dto.ReservaResponseDto(
            r.idReserva,
            r.idDisponibilidad,
            CAST(d.horaInicio AS LocalTime),
            CAST(d.horaFin AS LocalTime),
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
            CONCAT(COALESCE(tut.nombre, ''), ' ', COALESCE(tut.apellido, ''))
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
     * Incluye: Reserva + Disponibilidad + Tutoría + Asignatura + Tutor + Estudiante + Estado
     */
    @Query("""
        SELECT new uis.edu.tutouis_project.modelo.dto.ReservaResponseDto(
            r.idReserva,
            r.idDisponibilidad,
            CAST(d.horaInicio AS LocalTime),
            CAST(d.horaFin AS LocalTime),
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
            CONCAT(COALESCE(tut.nombre, ''), ' ', COALESCE(tut.apellido, ''))
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
}
