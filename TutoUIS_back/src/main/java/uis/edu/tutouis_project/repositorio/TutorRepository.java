package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.Tutor;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, Integer> {
}
