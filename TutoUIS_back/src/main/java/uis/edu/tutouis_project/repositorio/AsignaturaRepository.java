package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Asignatura;

import java.util.List;
import java.util.Optional;

@Repository
public interface AsignaturaRepository extends JpaRepository<Asignatura, Integer> {
    
    /**
     * Encuentra una asignatura por su nombre
     */
    Optional<Asignatura> findByNombre(String nombre);
    
    /**
     * Encuentra todas las asignaturas de una facultad
     */
    List<Asignatura> findByFacultad(String facultad);
    
    /**
     * Busca asignaturas por nombre (contiene)
     */
    List<Asignatura> findByNombreContainingIgnoreCase(String nombre);
}
