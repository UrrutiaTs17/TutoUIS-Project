package uis.edu.tutouis_project.servicio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uis.edu.tutouis_project.modelo.Disponibilidad;
import uis.edu.tutouis_project.repositorio.DisponibilidadRepository;
import uis.edu.tutouis_project.repositorio.TutoriaRepository;

import java.util.List;

@Service
public class DisponibilidadService implements IDisponibilidadService {

    @Autowired
    private DisponibilidadRepository disponibilidadRepository;

    @Autowired
    private TutoriaRepository tutoriaRepository;

    @Override
    public List<Disponibilidad> listarDisponibilidades() {
        return disponibilidadRepository.findAll();
    }

    @Override
    public Disponibilidad obtenerDisponibilidadPorId(Integer id) {
        return disponibilidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada con id: " + id));
    }

    @Override
    public List<Disponibilidad> listarPorTutoria(Integer idTutoria) {
        return disponibilidadRepository.findByIdTutoria(idTutoria);
    }

    @Override
    public List<Disponibilidad> listarPorDiaSemana(String diaSemana) {
        return disponibilidadRepository.findByDiaSemana(diaSemana);
    }

    @Override
    public List<Disponibilidad> listarPorEstado(Integer idEstado) {
        return disponibilidadRepository.findByIdEstado(idEstado);
    }

    @Override
    public List<Disponibilidad> listarPorTutoriaYEstado(Integer idTutoria, Integer idEstado) {
        return disponibilidadRepository.findByIdTutoriaAndIdEstado(idTutoria, idEstado);
    }

    @Override
    @Transactional
    public Disponibilidad crearDisponibilidad(Disponibilidad disponibilidad) {
        // Validar que la tutoría existe
        if (!tutoriaRepository.existsById(disponibilidad.getIdTutoria())) {
            throw new RuntimeException("La tutoría con id " + disponibilidad.getIdTutoria() + " no existe");
        }

        // Validar día de la semana
        String[] diasValidos = {"Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"};
        boolean diaValido = false;
        for (String dia : diasValidos) {
            if (dia.equalsIgnoreCase(disponibilidad.getDiaSemana())) {
                disponibilidad.setDiaSemana(dia); // Normalizar capitalización
                diaValido = true;
                break;
            }
        }
        if (!diaValido) {
            throw new RuntimeException("Día de la semana no válido: " + disponibilidad.getDiaSemana());
        }

        // Validar horarios
        if (disponibilidad.getHoraInicio() == null || disponibilidad.getHoraFin() == null) {
            throw new RuntimeException("Las horas de inicio y fin son obligatorias");
        }
        if (disponibilidad.getHoraInicio().after(disponibilidad.getHoraFin())) {
            throw new RuntimeException("La hora de inicio no puede ser posterior a la hora de fin");
        }

        // Validar aforos
        if (disponibilidad.getAforoMaximo() == null || disponibilidad.getAforoMaximo() < 1) {
            throw new RuntimeException("El aforo máximo debe ser al menos 1");
        }

        // Inicializar valores por defecto si no están definidos
        if (disponibilidad.getAforoDisponible() == null) {
            disponibilidad.setAforoDisponible(disponibilidad.getAforoMaximo());
        }
        if (disponibilidad.getIdEstado() == null) {
            disponibilidad.setIdEstado(1); // Activa por defecto
        }

        return disponibilidadRepository.save(disponibilidad);
    }

    @Override
    @Transactional
    public Disponibilidad actualizarDisponibilidad(Integer id, Disponibilidad disponibilidad) {
        Disponibilidad existente = obtenerDisponibilidadPorId(id);

        // Actualizar campos permitidos
        if (disponibilidad.getDiaSemana() != null) {
            existente.setDiaSemana(disponibilidad.getDiaSemana());
        }
        if (disponibilidad.getHoraInicio() != null) {
            existente.setHoraInicio(disponibilidad.getHoraInicio());
        }
        if (disponibilidad.getHoraFin() != null) {
            existente.setHoraFin(disponibilidad.getHoraFin());
        }
        if (disponibilidad.getAforoMaximo() != null) {
            existente.setAforoMaximo(disponibilidad.getAforoMaximo());
        }
        if (disponibilidad.getAforoDisponible() != null) {
            existente.setAforoDisponible(disponibilidad.getAforoDisponible());
        }
        if (disponibilidad.getIdEstado() != null) {
            existente.setIdEstado(disponibilidad.getIdEstado());
        }
        if (disponibilidad.getRazonCancelacion() != null) {
            existente.setRazonCancelacion(disponibilidad.getRazonCancelacion());
        }

        return disponibilidadRepository.save(existente);
    }

    @Override
    @Transactional
    public void eliminarDisponibilidad(Integer id) {
        if (!disponibilidadRepository.existsById(id)) {
            throw new RuntimeException("Disponibilidad no encontrada con id: " + id);
        }
        disponibilidadRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Disponibilidad cancelarDisponibilidad(Integer id, String razonCancelacion) {
        Disponibilidad disponibilidad = obtenerDisponibilidadPorId(id);
        disponibilidad.setIdEstado(3); // Estado "Cancelada"
        disponibilidad.setRazonCancelacion(razonCancelacion);
        return disponibilidadRepository.save(disponibilidad);
    }
}
