package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Disponibilidad;
import java.util.List;

@Repository
public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Integer> {
    List<Disponibilidad> findByIdTutoria(Integer idTutoria);
    List<Disponibilidad> findByDiaSemana(String diaSemana);
    List<Disponibilidad> findByIdEstado(Integer idEstado);
    List<Disponibilidad> findByIdTutoriaAndIdEstado(Integer idTutoria, Integer idEstado);
    
    /**
     * Obtiene todas las disponibilidades con JOIN FETCH optimizado
     * Carga en una sola consulta: disponibilidad + estado + tutoría + asignatura + tutor + carrera
     * Soluciona el problema N+1 queries
     */
    @Query("SELECT DISTINCT d FROM Disponibilidad d " +
           "LEFT JOIN FETCH d.estadoDisponibilidad " +
           "LEFT JOIN FETCH d.tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "LEFT JOIN FETCH t.tutor tutor " +
           "LEFT JOIN FETCH tutor.carrera " +
           "ORDER BY d.fecha DESC, d.horaInicio ASC")
    List<Disponibilidad> findAllWithDetails();
    
    /**
     * Obtiene disponibilidades por estado con todas las relaciones precargadas
     */
    @Query("SELECT DISTINCT d FROM Disponibilidad d " +
           "LEFT JOIN FETCH d.estadoDisponibilidad " +
           "LEFT JOIN FETCH d.tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "LEFT JOIN FETCH t.tutor tutor " +
           "LEFT JOIN FETCH tutor.carrera " +
           "WHERE d.idEstado = :idEstado " +
           "ORDER BY d.fecha DESC, d.horaInicio ASC")
    List<Disponibilidad> findByIdEstadoWithDetails(@Param("idEstado") Integer idEstado);
    
    /**
     * Obtiene disponibilidades por tutoría con todas las relaciones precargadas
     */
    @Query("SELECT DISTINCT d FROM Disponibilidad d " +
           "LEFT JOIN FETCH d.estadoDisponibilidad " +
           "LEFT JOIN FETCH d.tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "LEFT JOIN FETCH t.tutor tutor " +
           "LEFT JOIN FETCH tutor.carrera " +
           "WHERE d.idTutoria = :idTutoria " +
           "ORDER BY d.fecha DESC, d.horaInicio ASC")
    List<Disponibilidad> findByIdTutoriaWithDetails(@Param("idTutoria") Integer idTutoria);
    
    /**
     * Busca disponibilidades de un tutor específico que se solapen con un rango de fecha/hora dado
     * Útil para validar conflictos de horario al crear nuevas disponibilidades
     */
    @Query("SELECT d FROM Disponibilidad d " +
           "JOIN d.tutoria t " +
           "WHERE t.idTutor = :idTutor " +
           "AND d.fecha = :fecha " +
           "AND d.idEstado = 1 " +  // Solo disponibilidades activas
           "AND (" +
           "  (d.horaInicio < :horaFin AND d.horaFin > :horaInicio) " +  // Hay solapamiento
           ")")
    List<Disponibilidad> findConflictosHorario(
        @Param("idTutor") Integer idTutor,
        @Param("fecha") java.sql.Date fecha,
        @Param("horaInicio") java.sql.Time horaInicio,
        @Param("horaFin") java.sql.Time horaFin
    );
}

