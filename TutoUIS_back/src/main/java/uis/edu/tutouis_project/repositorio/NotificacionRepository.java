package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Notificacion;
import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    List<Notificacion> findByIdUsuario(Integer idUsuario);
    List<Notificacion> findByIdEstado(Integer idEstado);
    List<Notificacion> findByIdUsuarioAndIdEstado(Integer idUsuario, Integer idEstado);
}
