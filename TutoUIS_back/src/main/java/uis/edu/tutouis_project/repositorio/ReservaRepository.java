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
     * Encuentra todas las reservas de un estudiante
     */
    List<Reserva> findByIdEstudiante(Integer idEstudiante);
    
    /**
     * Encuentra todas las reservas de un estudiante con JOIN FETCH optimizado
     * Carga en una sola consulta: reserva + disponibilidad + tutoría + asignatura + tutor + estudiante + estado
     */
    @Query("SELECT DISTINCT r FROM Reserva r " +
           "LEFT JOIN FETCH r.estudiante " +
           "LEFT JOIN FETCH r.estadoReserva " +
           "LEFT JOIN FETCH r.disponibilidad d " +
           "LEFT JOIN FETCH d.tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "LEFT JOIN FETCH t.tutor tutor " +
           "LEFT JOIN FETCH tutor.carrera " +
           "WHERE r.idEstudiante = :idEstudiante " +
           "ORDER BY r.fechaCreacion DESC")
    List<Reserva> findByIdEstudianteWithDetails(@Param("idEstudiante") Integer idEstudiante);
    
    /**
     * Obtiene todas las reservas con todas las relaciones precargadas
     * Soluciona el problema N+1 queries al cargar disponibilidad, tutoría, asignatura, tutor, etc.
     */
    @Query("SELECT DISTINCT r FROM Reserva r " +
           "LEFT JOIN FETCH r.estudiante " +
           "LEFT JOIN FETCH r.estadoReserva " +
           "LEFT JOIN FETCH r.disponibilidad d " +
           "LEFT JOIN FETCH d.tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "LEFT JOIN FETCH t.tutor tutor " +
           "LEFT JOIN FETCH tutor.carrera " +
           "ORDER BY r.fechaCreacion DESC")
    List<Reserva> findAllWithDetails();
    
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
