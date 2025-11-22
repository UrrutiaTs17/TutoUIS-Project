package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Tutoria;
import java.util.List;

@Repository
public interface TutoriaRepository extends JpaRepository<Tutoria, Integer> {
    List<Tutoria> findByIdTutor(Integer idTutor);
    List<Tutoria> findByIdAsignatura(Integer idAsignatura);
    List<Tutoria> findByIdEstadoTutoria(Integer idEstadoTutoria);
    
    /**
     * Query optimizada que incluye el estado de tutoría
     * Retorna directamente DTOs con información completa incluyendo el estado del ciclo de vida
     */
    @Query("""
        SELECT t
        FROM Tutoria t
        LEFT JOIN FETCH t.tutor
        LEFT JOIN FETCH t.asignatura
        LEFT JOIN FETCH t.estadoTutoria
        ORDER BY t.idTutoria
    """)
    List<Tutoria> findAllTutoriasWithDetails();
    
    /**
     * Query optimizada para actualización de estados
     * Carga tutorías con sus disponibilidades en una sola query (JOIN FETCH)
     * Evita el problema N+1 al cargar las relaciones necesarias de una vez
     */
    @Query("""
        SELECT DISTINCT t
        FROM Tutoria t
        LEFT JOIN FETCH t.disponibilidades
        WHERE t.idEstadoTutoria != 5
        ORDER BY t.idTutoria
    """)
    List<Tutoria> findAllTutoriasWithDisponibilidadesForEstadoUpdate();
    
    /**
     * Cuenta las reservas asociadas a una disponibilidad
     */
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.idDisponibilidad = :idDisponibilidad")
    long countReservasByDisponibilidad(@org.springframework.data.repository.query.Param("idDisponibilidad") Integer idDisponibilidad);
    
    /**
     * Elimina todas las reservas asociadas a una disponibilidad
     */
    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM Reserva r WHERE r.idDisponibilidad = :idDisponibilidad")
    void deleteReservasByDisponibilidad(@org.springframework.data.repository.query.Param("idDisponibilidad") Integer idDisponibilidad);
}
