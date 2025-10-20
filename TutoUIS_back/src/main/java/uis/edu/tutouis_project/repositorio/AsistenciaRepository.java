package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Asistencia;
import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {
    List<Asistencia> findByIdReserva(Integer idReserva);
    List<Asistencia> findByIdTutor(Integer idTutor);
    List<Asistencia> findByIdEstado(Integer idEstado);
}
