package uis.edu.tutouis_project.servicio;

import uis.edu.tutouis_project.modelo.dto.ActividadRecienteDto;
import java.util.List;

public interface IActividadService {
    /**
     * Obtiene las últimas actividades del sistema (usuarios, tutorías, reservas)
     * ordenadas por fecha de creación descendente
     * 
     * @param limite Número máximo de actividades a retornar
     * @return Lista de actividades recientes
     */
    List<ActividadRecienteDto> obtenerActividadReciente(int limite);
}
