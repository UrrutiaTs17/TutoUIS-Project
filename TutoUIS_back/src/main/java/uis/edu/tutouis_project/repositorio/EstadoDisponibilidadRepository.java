package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.EstadoDisponibilidad;

@Repository
public interface EstadoDisponibilidadRepository extends JpaRepository<EstadoDisponibilidad, Integer> {
    EstadoDisponibilidad findByNombre(String nombre);
}
