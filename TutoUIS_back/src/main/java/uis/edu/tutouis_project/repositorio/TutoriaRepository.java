package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.dto.TutoriaResponseDto;
import uis.edu.tutouis_project.modelo.Tutoria;
import java.util.List;

@Repository
public interface TutoriaRepository extends JpaRepository<Tutoria, Integer> {
    List<Tutoria> findByIdTutor(Integer idTutor);
    List<Tutoria> findByIdAsignatura(Integer idAsignatura);
    List<Tutoria> findByEstado(Integer estado);
    
    /**
     * Optimización: Query con JOINs que retorna directamente DTOs
     * Evita el problema N+1 al traer todos los datos en una sola consulta
     */
    @Query("""
        SELECT new uis.edu.tutouis_project.dto.TutoriaResponseDto(
            t.idTutoria,
            t.idTutor,
            CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellido, '')),
            t.idAsignatura,
            c.nombre,
            a.nombre,
            t.descripcion,
            t.capacidadMaxima,
            t.lugar,
            t.modalidad,
            t.lugar,
            t.estado,
            t.fechaCreacion,
            t.fechaUltimaModificacion
        )
        FROM Tutoria t
        INNER JOIN Usuario u ON t.idTutor = u.id_usuario
        INNER JOIN Carrera c ON u.id_carrera = c.idCarrera
        INNER JOIN Asignatura a ON t.idAsignatura = a.idAsignatura
        ORDER BY t.idTutoria
    """)
    List<TutoriaResponseDto> findAllTutoriasWithDetails();
    
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
