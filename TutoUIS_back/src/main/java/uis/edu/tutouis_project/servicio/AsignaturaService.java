package uis.edu.tutouis_project.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uis.edu.tutouis_project.modelo.Asignatura;
import uis.edu.tutouis_project.repositorio.AsignaturaRepository;

import java.util.List;

@Service
public class AsignaturaService implements IAsignaturaService {

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Override
    public List<Asignatura> obtenerTodasLasAsignaturas() {
        return asignaturaRepository.findAll();
    }

    @Override
    public Asignatura obtenerAsignaturaPorId(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El ID de la asignatura debe ser un número positivo");
        }
        return asignaturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignatura no encontrada con ID: " + id));
    }

    @Override
    public List<Asignatura> obtenerAsignaturasPorFacultad(String facultad) {
        if (facultad == null || facultad.trim().isEmpty()) {
            throw new IllegalArgumentException("La facultad no puede ser nula o vacía");
        }
        return asignaturaRepository.findByFacultad(facultad);
    }

    @Override
    public List<Asignatura> buscarAsignaturasPorNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de búsqueda no puede ser nulo o vacío");
        }
        return asignaturaRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Override
    public Asignatura crearAsignatura(Asignatura asignatura) {
        if (asignatura == null) {
            throw new IllegalArgumentException("La asignatura no puede ser nula");
        }
        if (asignatura.getNombre() == null || asignatura.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la asignatura es requerido");
        }
        if (asignatura.getFacultad() == null || asignatura.getFacultad().trim().isEmpty()) {
            throw new IllegalArgumentException("La facultad es requerida");
        }
        
        // Verificar que no exista ya una asignatura con ese nombre
        if (asignaturaRepository.findByNombre(asignatura.getNombre()).isPresent()) {
            throw new RuntimeException("Ya existe una asignatura con el nombre: " + asignatura.getNombre());
        }
        
        return asignaturaRepository.save(asignatura);
    }

    @Override
    public Asignatura actualizarAsignatura(Integer id, Asignatura asignatura) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El ID de la asignatura debe ser un número positivo");
        }
        if (asignatura == null) {
            throw new IllegalArgumentException("La asignatura no puede ser nula");
        }
        
        Asignatura asignaturaExistente = asignaturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignatura no encontrada con ID: " + id));
        
        if (asignatura.getNombre() != null && !asignatura.getNombre().trim().isEmpty()) {
            // Verificar que el nuevo nombre no esté en uso por otra asignatura
            asignaturaRepository.findByNombre(asignatura.getNombre()).ifPresent(a -> {
                if (!a.getIdAsignatura().equals(id)) {
                    throw new RuntimeException("Ya existe otra asignatura con el nombre: " + asignatura.getNombre());
                }
            });
            asignaturaExistente.setNombre(asignatura.getNombre());
        }
        
        if (asignatura.getFacultad() != null && !asignatura.getFacultad().trim().isEmpty()) {
            asignaturaExistente.setFacultad(asignatura.getFacultad());
        }
        
        return asignaturaRepository.save(asignaturaExistente);
    }

    @Override
    public void eliminarAsignatura(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El ID de la asignatura debe ser un número positivo");
        }
        
        if (!asignaturaRepository.existsById(id)) {
            throw new RuntimeException("Asignatura no encontrada con ID: " + id);
        }
        
        asignaturaRepository.deleteById(id);
    }
}
