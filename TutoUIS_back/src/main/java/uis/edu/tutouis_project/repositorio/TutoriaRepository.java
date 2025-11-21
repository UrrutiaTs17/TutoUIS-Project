package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Tutoria;
import java.util.List;
import java.util.Optional;

@Repository
public interface TutoriaRepository extends JpaRepository<Tutoria, Integer> {
    List<Tutoria> findByIdTutor(Integer idTutor);
    List<Tutoria> findByIdAsignatura(Integer idAsignatura);
    List<Tutoria> findByEstado(Integer estado);
    
    /**
     * Obtiene todas las tutorías con JOIN FETCH optimizado
     * Carga en una sola consulta: tutoría + asignatura + tutor
     * Soluciona el problema N+1 queries
     */
    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "LEFT JOIN FETCH t.tutor tutor " +
           "LEFT JOIN FETCH tutor.carrera " +
           "ORDER BY t.fechaCreacion DESC")
    List<Tutoria> findAllWithDetails();
    
    /**
     * Obtiene una tutoría por ID con todas las relaciones precargadas
     */
    @Query("SELECT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "LEFT JOIN FETCH t.tutor tutor " +
           "LEFT JOIN FETCH tutor.carrera " +
           "WHERE t.idTutoria = :idTutoria")
    Optional<Tutoria> findByIdWithDetails(@Param("idTutoria") Integer idTutoria);
    
    /**
     * Obtiene tutorías por tutor con todas las relaciones precargadas
     */
    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "LEFT JOIN FETCH t.tutor tutor " +
           "LEFT JOIN FETCH tutor.carrera " +
           "WHERE t.idTutor = :idTutor " +
           "ORDER BY t.fechaCreacion DESC")
    List<Tutoria> findByIdTutorWithDetails(@Param("idTutor") Integer idTutor);
    
    /**
     * Obtiene tutorías por estado con todas las relaciones precargadas
     */
    @Query("SELECT DISTINCT t FROM Tutoria t " +
           "LEFT JOIN FETCH t.asignatura " +
           "LEFT JOIN FETCH t.tutor tutor " +
           "LEFT JOIN FETCH tutor.carrera " +
           "WHERE t.estado = :estado " +
           "ORDER BY t.fechaCreacion DESC")
    List<Tutoria> findByEstadoWithDetails(@Param("estado") Integer estado);
}
