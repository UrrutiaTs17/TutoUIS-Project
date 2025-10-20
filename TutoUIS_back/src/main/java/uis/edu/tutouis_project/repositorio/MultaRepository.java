package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Multa;
import java.util.List;

@Repository
public interface MultaRepository extends JpaRepository<Multa, Integer> {
    List<Multa> findByIdEstudiante(Integer idEstudiante);
    List<Multa> findByEstado(String estado);
}
