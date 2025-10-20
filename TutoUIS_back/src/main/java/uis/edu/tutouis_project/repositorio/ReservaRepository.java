package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Reserva;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    List<Reserva> findByIdEstudiante(Integer idEstudiante);
    List<Reserva> findByIdDisponibilidad(Integer idDisponibilidad);
    List<Reserva> findByIdEstado(Integer idEstado);
    List<Reserva> findByIdEstudianteAndIdEstado(Integer idEstudiante, Integer idEstado);
}
