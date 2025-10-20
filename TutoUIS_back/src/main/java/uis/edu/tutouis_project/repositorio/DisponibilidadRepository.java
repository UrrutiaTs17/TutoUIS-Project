package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Disponibilidad;
import java.util.List;
import java.sql.Date;

@Repository
public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Integer> {
    List<Disponibilidad> findByIdTutoria(Integer idTutoria);
    List<Disponibilidad> findByFecha(Date fecha);
    List<Disponibilidad> findByEstado(Integer estado);
    List<Disponibilidad> findByIdTutoriaAndEstado(Integer idTutoria, Integer estado);
}
