package uis.edu.tutouis_project.servicio;

import uis.edu.tutouis_project.modelo.Asignatura;
import java.util.List;

public interface IAsignaturaService {
    
    /**
     * Obtiene todas las asignaturas
     */
    List<Asignatura> obtenerTodasLasAsignaturas();
    
    /**
     * Obtiene una asignatura por ID
     */
    Asignatura obtenerAsignaturaPorId(Integer id);
    
    /**
     * Obtiene asignaturas por facultad
     */
    List<Asignatura> obtenerAsignaturasPorFacultad(String facultad);
    
    /**
     * Busca asignaturas por nombre
     */
    List<Asignatura> buscarAsignaturasPorNombre(String nombre);
    
    /**
     * Crea una nueva asignatura
     */
    Asignatura crearAsignatura(Asignatura asignatura);
    
    /**
     * Actualiza una asignatura existente
     */
    Asignatura actualizarAsignatura(Integer id, Asignatura asignatura);
    
    /**
     * Elimina una asignatura
     */
    void eliminarAsignatura(Integer id);
}
