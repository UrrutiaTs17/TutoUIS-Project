package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Carrera;

@Repository
public interface CarreraRepository extends JpaRepository<Carrera, Integer> {
    Carrera findByNombre(String nombre);
    Carrera findByCodigo(String codigo);
}
