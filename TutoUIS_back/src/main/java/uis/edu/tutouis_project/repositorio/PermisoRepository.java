package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Permiso;

@Repository
public interface PermisoRepository extends JpaRepository<Permiso, Integer> {
    Permiso findByNombre(String nombre);
}
