package uis.edu.tutouis_project.servicio;

import uis.edu.tutouis_project.modelo.Disponibilidad;
import java.util.List;

public interface IDisponibilidadService {
    List<Disponibilidad> listarDisponibilidades();
    Disponibilidad obtenerDisponibilidadPorId(Integer id);
    List<Disponibilidad> listarPorTutoria(Integer idTutoria);
    List<Disponibilidad> listarPorDiaSemana(String diaSemana);
    List<Disponibilidad> listarPorEstado(Integer idEstado);
    List<Disponibilidad> listarPorTutoriaYEstado(Integer idTutoria, Integer idEstado);
    Disponibilidad crearDisponibilidad(Disponibilidad disponibilidad);
    Disponibilidad actualizarDisponibilidad(Integer id, Disponibilidad disponibilidad);
    void eliminarDisponibilidad(Integer id);
    Disponibilidad cancelarDisponibilidad(Integer id, String razonCancelacion);
}
