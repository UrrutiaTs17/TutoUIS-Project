package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.EstadoNotificacion;

@Repository
public interface EstadoNotificacionRepository extends JpaRepository<EstadoNotificacion, Integer> {
    EstadoNotificacion findByNombre(String nombre);
}
