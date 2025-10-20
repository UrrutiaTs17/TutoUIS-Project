package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.RolPermiso;
import java.util.List;

@Repository
public interface RolPermisoRepository extends JpaRepository<RolPermiso, Integer> {
    List<RolPermiso> findByIdRol(Integer idRol);
    List<RolPermiso> findByIdPermiso(Integer idPermiso);
}
