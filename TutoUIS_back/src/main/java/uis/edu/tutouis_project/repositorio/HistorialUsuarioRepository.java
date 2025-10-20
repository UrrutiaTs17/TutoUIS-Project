package uis.edu.tutouis_project.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uis.edu.tutouis_project.modelo.HistorialUsuario;
import java.util.List;

@Repository
public interface HistorialUsuarioRepository extends JpaRepository<HistorialUsuario, Integer> {
    List<HistorialUsuario> findByIdUsuario(Integer idUsuario);
    List<HistorialUsuario> findByTipoCambio(String tipoCambio);
}
