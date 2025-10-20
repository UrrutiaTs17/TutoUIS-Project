package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Tutoria;
import java.util.List;

@Repository
public interface TutoriaRepository extends JpaRepository<Tutoria, Integer> {
    List<Tutoria> findByIdTutor(Integer idTutor);
    List<Tutoria> findByIdCarrera(Integer idCarrera);
    List<Tutoria> findByEstado(Integer estado);
}
