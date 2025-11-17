package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Disponibilidad;
import java.util.List;

@Repository
public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Integer> {
    List<Disponibilidad> findByIdTutoria(Integer idTutoria);
    List<Disponibilidad> findByDiaSemana(String diaSemana);
    List<Disponibilidad> findByIdEstado(Integer idEstado);
    List<Disponibilidad> findByIdTutoriaAndIdEstado(Integer idTutoria, Integer idEstado);
}

